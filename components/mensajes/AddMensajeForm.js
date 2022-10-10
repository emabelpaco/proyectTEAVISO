import React, {useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions, FlatList, Text, TouchableOpacity } from "react-native";
import { Button, Input, Icon, Image, Overlay } from "react-native-elements";
import { map, size, isEmpty } from 'lodash';
import { addDocumentWithoutId, getCurrentUser, uploadImage } from "../../utils/actions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OptionsMenu from "react-native-option-menu";
import uuid from 'random-uuid-v4';

const widthScreen = Dimensions.get("window").width
const MoreIcon = require("../../assets/optionsV.png");

export default function AddMensajeForm({toasRef, setLoading, navigation}) {

    const [formData, setFormData] = useState(defaultFormValue())
    const [errorName, setErrorName] = useState(null)
    const [imagesSelected, setImagesSelected] = useState(null)
    const [inputBusqueda, setInputBusqueda] = useState(null)
    const [respuestasSelected, setRespuestasSelected] = useState(null)
    const [busquedaRes, setBusquedaRes] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    const addMensaje = async () => {
        if(!validForm()) {
            return
        }
        setLoading(true)
        const responseUploadImages = await UploadImages()
        const mensaje = {
            name: formData.name,
            images: responseUploadImages,
            createAdd: new Date(),
            createBy: getCurrentUser().uid
        }
        const responseAddDocument = await addDocumentWithoutId("frases", mensaje)
        setLoading(false)

        if (!responseAddDocument.statusResponse) {
            toasRef.current.show("Error al crear la frase, intente más tarde", 3000)
            return
        }
        
        navigation.navigate("mensaje")
    }

    const onBusqueda = (e) => {
        setInputBusqueda(e.nativeEvent.text);
    }

    const crearMensaje = () => {
        if(!validForm()) {
            return
        }
        
        setImagesSelected([
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/3415", text: "¿"},
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/11351", text: "que"},
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/5441", text: "quieres"},
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/28205", text: "almorzar"},
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/3415", text: "¿"},
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/11351", text: "que"}
        ])
    }

    const UploadImages = async () => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "frases", uuid())
                if(response.statusResponse) {
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if(isEmpty(formData.name)){
            setErrorName("Debe ingresar un mensaje.")
            isValid = false
        }
        return isValid
    }

    const clearErrors = () => {
        setErrorName(null)
    }
    const editPost = () => {
        console.log("Editar")
        setErrorName(null)
    }
    const deletePost = () => {
        console.log("Guardar")
        setErrorName(null)
    }
    const addPost = () => {
        setIsVisible(!isVisible)
        setBusquedaRes(null);
    }

    const buscarPictograma = () => {
        setBusquedaRes([
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/25486", text: "tallarines"}
        ])
    }

    const confirmarRespuesta = () => {
        setInputBusqueda(null)
        setIsVisible(false)
        setBusquedaRes(null);
        setRespuestasSelected([
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/25486", text: "Tallarines"},
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/2573", text: "Sopa"},
            {image: "http://hypatia.fdi.ucm.es/conversor/Pictos/2419", text: "Hamburguesa"}
        ])  
    }

    const cancelarRespuesta = () => {
        setInputBusqueda(null)
        setBusquedaRes(null);
        setIsVisible(false);
    }

    return (
        <ScrollView style={styles.viewContainer}>
            { imagesSelected ? (
                <View>
                    <OptionsMenu
                        button={MoreIcon}
                        buttonStyle={{ width: 70, height: 26, marginTop: 15, resizeMode: "contain", margin: 7.5}}
                        destructiveIndex={1}
                        options={["Editar", "Guardar", "Agregar respuesta", "Cancelar"]}
                        actions={[editPost, deletePost, addPost]}
                    />
                    <UploadImagePicto
                        imagesSelected={imagesSelected}
                        setImagesSelected={setImagesSelected}
                    />
                    { respuestasSelected ? (
                        <View>
                            <View>
                            <Text style={styles.textOpciones}>Opciones</Text>
                            <TouchableOpacity
                                onPress={() => addPost()}
                                style={{
                                    position: "absolute",
                                    right: 20,
                                    margin:-10,
                                    bottom: 20,
                                    borderRadius: 60,
                                    width: 45,
                                    height: 45,
                                    backgroundColor: "#4cb4eb",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="plus"
                                    size={30}
                                    color="white"
                                    style={{ transform: [{ scaleX: -1 }] }}
                                />
                            </TouchableOpacity>
                            </View>
                            <UploadRespuestasImagePicto
                                respuestasSelected={respuestasSelected}
                                setRespuestasSelected={setRespuestasSelected}
                            />
                        </View>
                    ) : (
                        <View></View>
                    )}
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
                                <Image
                                source={{uri: busquedaRes[0].image}}
                                style={{
                                    width: 120,
                                    height: 160,
                                    borderWidth: 2,
                                    borderColor: "black",
                                    resizeMode: "contain",
                                    margin: 20,
                                }}
                                />
                            ):(<Text></Text>)
                        }
                        <Input
                            placeholder="Busqueda de una imagen"
                            onChange={(e) => onBusqueda(e)}
                        />
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
                                    onPress={cancelarRespuesta}
                                    buttonStyle={styles.btnAddMensaje}
                                    />
                                </View>
                            ):(
                                <Button
                                title="Buscar"
                                onPress={buscarPictograma}
                                buttonStyle={styles.btnAddMensaje}
                                />
                            )
                        }
                        
                    </Overlay>
                </View>  
            ) : (
                <View>
                    <FormAdd
                    formData={formData}
                    setFormData={setFormData}
                    errorName={errorName}
                    />
                    <Button
                    title="Crear Mensaje"
                    onPress={crearMensaje}
                    buttonStyle={styles.btnAddMensaje}
                    />
                </View>
                
            )}
        </ScrollView>
    )
}

function ImageMensaje({imageMensaje}) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{width: widthScreen, height: 200}}
                source={
                    imageMensaje 
                    ? {uri: imageMensaje}
                    : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImagePicto(imagesSelected, setImagesSelected) {
    console.log("imagenessss: ", imagesSelected)
    const widths = Dimensions.get("window").width
    const heightScreen = Dimensions.get("window").height
    const isLandscape = widths > heightScreen;
    console.log("hei: ", heightScreen)
    console.log("widths: ", widths)
    console.log("isLandscape: ", isLandscape)

    return (
        <ScrollView
            style={styles.viewImage}
        >
            {
        size(imagesSelected.imagesSelected) == 0 && (
            <ImageMensaje
                imageMensaje={imagesSelected[0]}
            />
        ) 
    }
    {
        <View>
            <FlatList
                data={imagesSelected.imagesSelected}
                style={{width:"100%"}}
                key={"3"}
                numColumns={3}
                renderItem={({ item }) => (
                    <View>
                        <Image
                            source={{uri: item.image}}
                            style={{
                                width: 120,
                                height: 160,
                                borderWidth: 2,
                                borderColor: "black",
                                resizeMode: "contain",
                                margin: 6,
                            }}
                            keyExtractor={(item) => item.id}
                        />
                        <Text style={styles.textInfo}>{item.text}</Text>
                    </View>
                )}
            />
            {/* <Button
                title="Agregar Respuesta"
                onPress={agregarRespuesta}
                buttonStyle={styles.btnAddMensaje}
            /> */}
        </View>
}
        </ScrollView>
    )
}

function UploadRespuestasImagePicto(respuestasSelected, setRespuestasSelected) {
    const [isVisibleRes, setIsVisibleRes] = useState(false)
    const [resImage, setResImage] = useState(false)
    const pressRespuesta = (data) => {
        setIsVisibleRes(true)
        setResImage(data) 
    }
    const toggleOverlay = () => {
        setIsVisibleRes(!isVisibleRes);
      };
    return (
        <ScrollView
            style={styles.viewImage}
        >
            <View>
            <FlatList
                data={respuestasSelected.respuestasSelected}
                style={{width:"100%"}}
                key={"3"}
                numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => pressRespuesta(item)}>
                        <View>
                        <Image
                            source={{uri: item.image}}
                            style={{
                                width: 120,
                                height: 160,
                                borderWidth: 2,
                                borderColor: "black",
                                resizeMode: "contain",
                                margin: 6,
                            }}
                            keyExtractor={(item) => item.id}
                        />
                        <Text style={styles.textInfo}>{item.text}</Text>
                    </View>
                    </TouchableOpacity> 
                )}
            />
            { resImage ? (
                <Overlay
                isVisible={isVisibleRes}
                onBackdropPress={toggleOverlay}
                >
                    <Image
                    source={{uri: resImage.image}}
                    style={{
                        width: 120,
                        height: 160,
                        borderWidth: 2,
                        borderColor: "black",
                        resizeMode: "contain",
                        margin: 20,
                    }}
                    />
                    <Text style={styles.textInfo}>{resImage.text}</Text>
                </Overlay>
            ) : 
                (<Text></Text>)
            }
        </View>
        </ScrollView>
    )
}

function FormAdd(formData, setFormData, errorName, errorDescription, errorEmail, errorAddress, errorPhone) {
    const [country, setCountry] = useState("AR")
    const [callingCode, setCallingCode] = useState("59")
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        formData.setFormData({...formData.formData, [type]: e.nativeEvent.text})
    }

    return (
        <View styles={styles.viewForm}>
            <Input
                style={{marginTop:200}}
                placeholder="Escribí el mensaje"
                defaultValue={formData.formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={formData.errorName}
            />
        </View>
    )
}

const defaultFormValue = () => {
    return {
        name: ""
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%"
    },
    viewForm: {
        marginHorizontal: 10
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    inputPhone: {
        width: "80%"
    },
    btnAddMensaje: {
        margin: 20,
        backgroundColor: "#4cb4eb"
    },
    viewImage: {
        // flexDirection: "row",
        // marginHorizontal: 20,
        // marginTop: 30,
        // width: 400, 
        // height: 120
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 80,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        right: 70,
        marginRight: 10,
        marginLeft: 5
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    textInfo: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: "center"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'right',
        marginTop: 40,
    },
    boldFont: {
        fontFamily: 'Nunito-Bold',
    },
    containerIcon: {
        // alignItems: "center",
        // justifyContent: "center",
        // marginRight: 80,
        // height: 70,
        // width: 70,
        // backgroundColor: "#e3e3e3"
    },
    textOpciones: {
        color:"#4cb4eb",
        fontWeight: 'bold',
        fontSize: 30,
        lineHeight: 70,
        marginLeft:15
        //alignSelf: "center"
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
      }
})