// @refresh reset
import { useRoute } from "@react-navigation/native";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../utils/firebase";
import GlobalContext from "../../context/Context";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import {
  Actions,
  Bubble,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";
import { pickImage, uploadImage } from "../../utilsContext";
import ImageView from "react-native-image-viewing";
import { Icon, Button, Input, Overlay, Avatar } from "react-native-elements";
import Loading from '../../components/Loading'
import Voice from '@react-native-voice/voice';
import axios from 'axios'
import { map } from 'lodash'

const randomId = nanoid();

export default function Chat() {
  const [started, setStarted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [busquedaRes, setBusquedaRes] = useState(null)
  const [inputBusqueda, setInputBusqueda] = useState(null)
  const [loading, setLoading] = useState(false)
  const [roomHash, setRoomHash] = useState("");
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSeletedImageView] = useState("");
  const {
    theme: { colors },
  } = useContext(GlobalContext);
  const { currentUser } = auth;
  const route = useRoute();
  const room = route.params.room;
  const selectedImage = route.params.image;
  const userB = route.params.user;

  const senderUser = currentUser.photoURL
    ? {
        name: currentUser.displayName,
        _id: currentUser.uid,
        avatar: currentUser.photoURL,
      }
    : { name: currentUser.displayName, _id: currentUser.uid };

  const roomId = room ? room.id : randomId;

  const roomRef = doc(db, "rooms", roomId);
  const roomMessagesRef = collection(db, "rooms", roomId, "messages");

  useEffect(() => {
    (async () => {
      if (!room) {
        const currUserData = {
          displayName: currentUser.displayName,
          email: currentUser.email,
        };
        if (currentUser.photoURL) {
          currUserData.photoURL = currentUser.photoURL;
        }
        const userBData = {
          displayName: userB.contactName || userB.displayName || "",
          email: userB.email,
        };
        if (userB.photoURL) {
          userBData.photoURL = userB.photoURL;
        }
        const roomData = {
          participants: [currUserData, userBData],
          participantsArray: [currentUser.email, userB.email],
        };
        try {
          await setDoc(roomRef, roomData);
        } catch (error) {
          console.log(error);
        }
      }
      const emailHash = `${currentUser.email}:${userB.email}`;
      setRoomHash(emailHash);
      if (selectedImage && selectedImage.uri) {
        await sendImage(selectedImage.uri, emailHash);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(roomMessagesRef, (querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      appendMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  useEffect (() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
        Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  const onBusqueda = (e) => {
    setInputBusqueda(e.nativeEvent.text);
  }

  async function confirmarRespuesta() {
    setInputBusqueda(null)
    setIsVisible(false)
    for (const element of busquedaRes) {
      await handlePictogramaPicker(element.image)
    }
    setBusquedaRes(null);
  }

  const cancelarRespuesta = () => {
    setInputBusqueda(null)
    setBusquedaRes(null);
    setIsVisible(false);
  }

  const buscarPictograma = () => {
    setLoading(true)
    // validar input busqueda que no sean mas de dos palabras
    fetchApiBuscarPalabraPicto()
  }

  const fetchApiBuscarPalabraPicto = async () => {
    try {
        const res = await axios.get('http://192.168.0.116:3000/api/users/searchFrasePictograma', {params: {mensaje: inputBusqueda}})
        setearPictogramaRespuesta(res.data)
    } catch (error){
        console.log(error)
    }
  }

  const setearPictogramaRespuesta = (data) => {
    const urlImage = "http://hypatia.fdi.ucm.es/conversor/Pictos/"
    const arrayData = data.data
    var dataPicto = []
    var numImage;
    var textImage;
    arrayData.forEach(element => {
        var arrayImages = element.split('[').pop().split(']')[0];
        var bodyImage = {}
        numImage = arrayImages.substring(0,4);
        textImage = element.substring(element.indexOf(']') + 2);
        bodyImage.image = urlImage + numImage;
        bodyImage.text = textImage;
        dataPicto.push(bodyImage)
    });
    if (busquedaRes == null) {
        setBusquedaRes(dataPicto)
    }  
    setLoading(false)
  }

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  async function onSend(messages = []) {
    const writes = messages.map((m) => addDoc(roomMessagesRef, m));
    const lastMessage = messages[messages.length - 1];
    writes.push(updateDoc(roomRef, { lastMessage }));
    await Promise.all(writes);
  }

  async function sendImage(uri, roomPath) {
    const { url, fileName } = await uploadImage(
      uri,
      `images/rooms/${roomPath || roomHash}`
    );
    const message = {
      _id: fileName,
      text: "",
      createdAt: new Date(),
      user: senderUser,
      image: url,
    };
    const lastMessage = { ...message, text: "Image" };
    await Promise.all([
      addDoc(roomMessagesRef, message),
      updateDoc(roomRef, { lastMessage }),
    ]);
  }

  async function handlePhotoPicker() {
    const result = await pickImage();
    if (!result.cancelled) {
      await sendImage(result.uri);
    }
  }

  async function handlePictogramaPicker(image) {
    await sendImage(image);
  }

  async function handlePictogramaMessage() {
    setIsVisible(true)
  }

  const addPost = () => {
    setIsVisible(!isVisible)
    setBusquedaRes(null);
  }

  const onSpeechResults = (result) => {
    console.log("result ", result)
    if (result != undefined) {
      setInputBusqueda(result.value[0])
    }
  }

  const onSpeechError = (error) => {
    console.log("Hubo un error: ", error)
  }

  const startSpeechToText = async () => {
    await Voice.start("es-AR");
    setStarted(true)
  }

  const stopSpeechToText = async () => {
    await Voice.stop();
    setStarted(false)
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../assets/chatbg.png")}
      style={{ flex: 1 }}
    >
      <Loading isVisible={loading} text="Cargando..."/>
      <GiftedChat
        onSend={onSend}
        messages={messages}
        user={senderUser}
        renderAvatar={null}
        renderActions={(props) => (
          <Actions
            {...props}
            containerStyle={{
              position: "absolute",
              right: 50,
              bottom: 5,
              zIndex: 9999,
            }}
            onPressActionButton={handlePhotoPicker}
            icon={() => (
              <Ionicons name="camera" size={30} color={colors.iconGray} />
            )}
          />
        )}
        renderAccessory={(props) => {
          const { text, messageIdGenerator, user, onSend } = props;
          return (
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: colors.primary,
                borderWidth: 1,
                //width:90,
                marginLeft:350,
                //alignItems: "left",
                justifyContent: "center",
                marginBottom: 5,
              }}
              onPress={handlePictogramaMessage}
            >
              <Icon type="material-community" name="image-multiple" size={22} color={colors.white} />
            </TouchableOpacity>
          );
        }}
        timeTextStyle={{ right: { color: colors.iconGray } }}
        renderSend={(props) => {
          const { text, messageIdGenerator, user, onSend } = props;
          return (
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
              onPress={() => {
                if (text && onSend) {
                  onSend(
                    {
                      text: text.trim(),
                      user,
                      _id: messageIdGenerator(),
                    },
                    true
                  );
                }
              }}
            >
              <Ionicons name="send" size={20} color={colors.white} />
            </TouchableOpacity>
          );
        }}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 2,
              borderRadius: 20,
              paddingTop: 5,
            }}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{ right: { color: colors.text } }}
            wrapperStyle={{
              left: {
                backgroundColor: colors.white,
              },
              right: {
                backgroundColor: colors.tertiary,
              },
            }}
          />
        )}
        renderMessageImage={(props) => {
          return (
            <View style={{ borderRadius: 15, padding: 2 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setSeletedImageView(props.currentMessage.image);
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{
                    width: 200,
                    height: 200,
                    padding: 6,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: props.currentMessage.image }}
                />
                {selectedImageView ? (
                  <ImageView
                    imageIndex={0}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    images={[{ uri: selectedImageView }]}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <Overlay
          isVisible={isVisible}
          onBackdropPress={addPost}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="black"
          overlayStyle={styles.overlay}
          width="auto"
          height="auto"
      >
        {
          busquedaRes ? (
            <ScrollView
                horizontal
                style={styles.viewImage}
            >
            {
                map(busquedaRes, (imageMensaje, index) => (
                    <View>
                        <Avatar
                        key={index}
                        style={{width: 100, height: 90, borderWidth: 1,
                            borderColor: "black", marginLeft:6}}
                        source={{uri: imageMensaje.image}}
                    />
                    <Text style={styles.descripcion}>{imageMensaje.text}</Text>
                    </View> 
                ))
            }
            </ScrollView>
          ):(<Text></Text>)
        }
        <Input
            placeholder="Escriba el mensaje"
            defaultValue={inputBusqueda}
            onChange={(e) => onBusqueda(e)}
        />
        {!started ? 
          <Icon
              type="material-community"
              name="microphone"
              color="#4cb4eb"
              reverse
              containerStyle={styles.btnContainer}
              onPress={startSpeechToText}
          />
          : undefined 
        } 
        {started ? 
          <Icon
              type="material-community"
              name="stop"
              color="#ed6379"
              reverse
              containerStyle={styles.btnContainer}
              onPress={stopSpeechToText}
          /> 
          : undefined 
        }
        {
        busquedaRes ? (
          <View style={styles.alternativeLayoutButtonContainer}>
            <Button
              title="Aceptar"
              onPress={confirmarRespuesta}
              buttonStyle={styles.btnAddMensaje}
            />
            <Button
              title="Cancelar"
              type="outline"
              onPress={cancelarRespuesta}
              buttonStyle={styles.btnCancelarMensaje}
            />
            </View>
          ):(
            <View style={styles.alternativeLayoutButtonContainer}>
              <Button
                title="Buscar"
                onPress={buscarPictograma}
                buttonStyle={styles.btnAddMensaje}
              />
              <Button
                title="Cancelar"
                type="outline"
                onPress={cancelarRespuesta}
                buttonStyle={styles.btnCancelarMensaje}
              />
            </View>
          )
        }
      </Overlay>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  viewImage: {
    flexDirection: "row",
    marginTop: 20,
  },
  btnAddMensaje: {
      margin: 20,
      backgroundColor: "#4cb4eb"
  },
  btnCancelarMensaje: {
    margin: 20,
  },
  overlay: {
      alignItems: "center",
      justifyContent: "center",
      height: 400,
      width: 300,
  },
  alternativeLayoutButtonContainer: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  descripcion: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 20,
    alignSelf:"center"
  },
  btnContainer: {
    //position: "absolute",
    //bottom: 30,
    //right: 30,
    shadowColor: "black",
    shadowOffset: {
        width: 2,
        height: 2
    },
    shadowOpacity: 0.5
  }
})