import React, { useState, useCallback, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { ListItem, Avatar, Icon, Input, Button } from 'react-native-elements'
import { isEmpty, map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/compat/app'
import Toast from 'react-native-easy-toast'

import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import { 
    addDocumentWithoutId, 
    getCurrentUser, 
    getDocumentById, 
    getIsFavorite, 
    deleteFavorite, 
    sendPushNotification, 
    setNotificationMessage, 
    getUsersFavorite
} from '../../utils/actions'
import Modal from '../../components/Modal'

const widthScreen = Dimensions.get("window").width

export default function Mensaje({ navigation, route }) {
    const { id, name } = route.params
    const toastRef = useRef()
    
    const [categoria, setCategoria] = useState(null)
    const [segundoMensaje, setSegundoMensaje] = useState(null)
    const [tercerMensaje, setTercerMensaje] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [modalNotification, setModalNotification] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)
    })

    navigation.setOptions({ title: name })

    useFocusEffect(
        useCallback(() => {
            (async() => {
                console.log("ID", id)
                const response = await getDocumentById("frases", "pIWuJZ5ug1ww7j9vZwxB")
                if (response.statusResponse) {
                    //setCategoria(response.document)
                    console.log("CATEGORIAS OBTENIDAS: ", categoria)
                    setCategoria(
                        [
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2F80ef43a3-ddde-4cd7-bed4-c86ef4be289d?alt=media&token=3aa88f00-b609-4caf-a969-6d4a6bf8ad91",
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2Fb63a2d44-d27a-4cec-a6ab-589019d8a336?alt=media&token=01ec5144-cab2-4885-bf21-d47eb71d2da9",
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2Fc78c62d0-94b4-47a6-b578-91753c918479?alt=media&token=0e9f0dcd-b8d0-4890-8625-a713f5df46bb",
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2F64242dcb-af9c-4a22-929b-b3751a5890c3?alt=media&token=39284291-2ea5-464b-a5d9-4811d3b770d5"
                        ]
                    )
                    setSegundoMensaje(
                        [
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2F80ef43a3-ddde-4cd7-bed4-c86ef4be289d?alt=media&token=3aa88f00-b609-4caf-a969-6d4a6bf8ad91",
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2Fb07617fa-3e02-4b6b-8378-f2234d8b7dd0?alt=media&token=49e21cc3-32b5-4e9c-b525-41136ccb1f09",
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2F0edf0884-7ee4-4af5-9355-eba584c4895e?alt=media&token=313988cc-0c7d-45a4-b0fd-f89ef5955abf"
                        ]
                    )
                    setTercerMensaje(
                        [
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2F80ef43a3-ddde-4cd7-bed4-c86ef4be289d?alt=media&token=3aa88f00-b609-4caf-a969-6d4a6bf8ad91",
                            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2F57144fc2-ebaf-45b5-9986-ee0e903336de?alt=media&token=fed9de4d-7be5-46f8-8ce4-c980178d2473"
                        ]
                    )

                } else {
                    setCategoria({})
                    Alert.alert("Ocurrió un problema cargando los mensajes, intente más tarde.")
                }
            })()
        }, [])
    )

    if (!categoria) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <Text style={styles.titulo}>Hola Como estas ?</Text>
            <UploadImage
                toasRef={categoria}
            />
            <Text style={styles.titulo}>Hola, todo bien</Text>
            <UploadImage
                toasRef={segundoMensaje}
            />
            <Text style={styles.titulo}>Hola, Buen día</Text>
            <UploadImage
                toasRef={tercerMensaje}
            />
        </ScrollView>
    )
}

function SendMessage ({ modalNotification, setModalNotification, setLoading, restaurant }) {
    const [title, setTitle] = useState(null)
    const [errorTitle, setErrorTitle] = useState(null)
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const sendNotification = async() => {
        if (!validForm()) {
            return
        }

        setLoading(true)
        const userName = getCurrentUser().displayName ? getCurrentUser().displayName : "Anónimo"
        const theMessage = `${message}, del restaurante: ${restaurant.name}`

        const usersFavorite = await getUsersFavorite(restaurant.id)
        if (!usersFavorite.statusResponse) {
            setLoading(false)
            Alert.alert("Error al obtener los usuarios que aman el restaurante.")
            return
        }

        await Promise.all (
            map(usersFavorite.users, async(user) => {
                const messageNotification = setNotificationMessage(
                    user.token,
                    `${userName}, dijo: ${title}`,
                    theMessage,
                    { data: theMessage}
                )
        
                await sendPushNotification(messageNotification)
            })
        )

        setLoading(false)
        setTitle(null)
        setMessage(null)
        setModalNotification(false)
    }

    const validForm = () => {
        let isValid = true;

        if (isEmpty(title)) {
            setErrorTitle("Debes ingresar un título a tu mensaje.")
            isValid = false
        }

        if (isEmpty(message)) {
            setErrorMessage("Debes ingresar un mensaje.")
            isValid = false
        }

        return isValid
    }

    return (
        <Modal
            isVisible={modalNotification}
            setVisible={setModalNotification}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.textModal}>
                    Envíaale un mensaje a los amantes de {restaurant.name}
                </Text>
                <Input
                    placeholder="Título del mensaje..."
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    errorMessage={errorTitle}
                />
                <Input
                    placeholder="Mensaje..."
                    multiline
                    inputStyle={styles.textArea}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    errorMessage={errorMessage}
                />
                <Button
                    title="Enviar Mensaje"
                    buttonStyle={styles.btnSend}
                    containerStyle={styles.btnSendContainer}
                    onPress={sendNotification}
                />
            </View>
        </Modal>
    )
}

function UploadImage(toasRef) {
    console.log("entre a la funcion con : ", toasRef)
    // const imageSelect = async() => {
    //     const response = await loadImageFromGalery([4, 4])
       
    //     toasRef.setImagesSelected([...toasRef.imagesSelected, response.image])
    // }

    return (
        <ScrollView
            horizontal
            style={styles.viewImage}
        >
            {
                map(toasRef.toasRef, (imageMensaje, index) => (
                    <Avatar
                        key={index}
                        style={{width: 90, height: 80}}
                        source={{uri: imageMensaje}}
                    />
                ))
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15,
    },
    viewRestaurantContainer: {
        flexDirection: "row"
    },
    descriptionRestaurant: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    nameRestaurant: {
        fontWeight: "bold"
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#a376c7",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    },
    textArea: {
        height: 50,
        paddingHorizontal: 10
    },
    btnSend: {
        backgroundColor: "#442848"
    },
    btnSendContainer: {
        width: "95%"
    },
    textModal: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold"
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    viewImage: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 20,
        // height: "100%",
        // height: 50
    width: 400, height: 120
    },
    miniatureStyle: {
        
        //width: 100,
        //right: 100,
        //marginRight: 10,
        //marginLeft: 5
    },
    viewContainer: {
        height: "100%"
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
        marginTop: 20
    }
})