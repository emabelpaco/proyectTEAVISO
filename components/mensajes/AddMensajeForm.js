import React, {useState } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Button, Input, Icon, Avatar, Image } from "react-native-elements";
import CountryPicker from 'react-native-country-picker-modal';
import { map, size, filter, isEmpty } from 'lodash';
import { loadImageFromGalery } from "../../utils/helpers";
import { addDocumentWithoutId, getCurrentUser, uploadImage } from "../../utils/actions";
import uuid from 'random-uuid-v4'

const widthScreen = Dimensions.get("window").width

export default function AddMensajeForm({toasRef, setLoading, navigation}) {

    const [formData, setFormData] = useState(defaultFormValue())
    const [errorName, setErrorName] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])


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

    const crearMensaje = () => {
        if(!validForm()) {
            return
        }
        setImagesSelected([
            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2Fd4501b61-c4a4-453d-85dd-04d0c39cfe0a?alt=media&token=255bd2d7-e1a5-4dec-a7ea-56b2d0098e21",
            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2F1736dff7-b7b0-45af-ba18-fd7dae9a3a36?alt=media&token=f288d739-7505-448a-b6c6-4a6bac4f1de8",
            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2Fe8b62fbc-3885-4472-baf4-4e19cf7978de?alt=media&token=acffc05c-015a-4222-a15c-60ba45a63ddc",
            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2Fb444777b-f9d3-46f8-8307-97036cb0490e?alt=media&token=9bf5daef-6ed3-48e7-bc7e-6c7e4be80163",
            "https://firebasestorage.googleapis.com/v0/b/proyectteaviso.appspot.com/o/frases%2F58d77112-219a-4832-b914-47bfb9569dba?alt=media&token=782343d7-38d2-490e-ab3f-038854b37cd4"   
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
        // seguir validando email, phone, description

        return isValid
    }

    const clearErrors = () => {
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <UploadImagePicto
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
            />
            {/* <UploadImage
                toasRef={toasRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            /> */}
            <Button
                title="Crear Mensaje"
                onPress={crearMensaje}
                buttonStyle={styles.btnAddMensaje}
            />
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
    return (
        <ScrollView
            horizontal
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
         map(imagesSelected.imagesSelected, (imageMensaje, index) => (
            <Avatar
                key={index}
                style={{width: 150, height: 150}}
                source={{uri: imageMensaje}}
            />
        ))
    }
        </ScrollView>
    )
}

function UploadImage(toasRef, imagesSelected, setImagesSelected) {
    const imageSelect = async() => {
        const response = await loadImageFromGalery([4, 4])
        if(!response.status) {
            toasRef.current.show("No has seleccionado ninguna imagen", 3000)
            return
        }
        
        toasRef.setImagesSelected([...toasRef.imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro de eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Sí",
                    onPress: () => {
                        toasRef.setImagesSelected(
                            filter(toasRef.imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            {
                cancelable: true
            }
        )
    }

    return (
        <ScrollView
            horizontal
            style={styles.viewImage}
        >
            {
                size(toasRef.imagesSelected) < 10 && (
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    />
                ) 
            }
            {
                map(toasRef.imagesSelected, (imageMensaje, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{uri: imageMensaje}}
                        onPress={() => removeImage(imageMensaje)}
                    />
                ))
            }
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
                placeholder="Nombre del mensaje"
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
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30,
        width: 400, 
        height: 120
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
    }
})