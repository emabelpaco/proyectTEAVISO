import React, {useState } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Button, Input, Icon, Avatar, Image } from "react-native-elements";
import CountryPicker from 'react-native-country-picker-modal';
import { map, size, filter, isEmpty } from 'lodash';
import { loadImageFromGalery } from "../../utils/helpers";
import { addDocumentWithoutId, getCurrentUser, uploadImage } from "../../utils/actions";
import uuid from 'random-uuid-v4'

const widthScreen = Dimensions.get("window").width

export default function AddFavoritoForm({toastRef, setLoading, navigation}) {
    const [formData, setFormData] = useState(defaultFormValue())
    const [errorName, setErrorName] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])


    const addFavorito = async () => {
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
        const responseAddDocument = await addDocumentWithoutId("favoritos", mensaje)
        setLoading(false)

        if (!responseAddDocument.statusResponse) {
            toastRef.current.show("Error al crear el pictograma, intente más tarde", 3000)
            return
        }
        
        navigation.navigate("favoritos")
    }

    const UploadImages = async () => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "favoritos", uuid())
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
            setErrorName("Debe ingresar el nombre al pictograma.")
            isValid = false
        }

        return isValid
    }

    const clearErrors = () => {
        // setErrorAddress(null)
        // setErrorDescription(null)
        // setErrorEmail(null)
        // setErrorPhone(null)
    }

    return (
        <View style={styles.viewBody}>
            <ScrollView style={styles.viewContainer}>
                <ImagePicto
                    imageMensaje={imagesSelected[0]}
                />
                <FormAdd
                    formData={formData}
                    setFormData={setFormData}
                    errorName={errorName}
                />
                <UploadImage
                    toastRef={toastRef}
                    imagesSelected={imagesSelected}
                    setImagesSelected={setImagesSelected}
                />
                <Button
                    title="Crear Pictograma"
                    onPress={addFavorito}
                    buttonStyle={styles.btnAddFavorito}
                />
            </ScrollView>
        </View>
    )
}

function ImagePicto({imageMensaje}) {

    // const removeImage = (image) => {
    //     Alert.alert(
    //         "Eliminar Imagen",
    //         "¿Estas seguro de eliminar la imagen?",
    //         [
    //             {
    //                 text: "No",
    //                 style: "cancel",
    //             },
    //             {
    //                 text: "Sí",
    //                 onPress: () => {
    //                     toastRef.setImagesSelected(
    //                         filter(toastRef.imagesSelected, (imageUrl) => imageUrl !== image)
    //                     )
    //                 }
    //             }
    //         ],
    //         {
    //             cancelable: true
    //         }
    //     )
    // }

    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{width: 300, height: 300}}
                // onPress={() => removeImage(imageMensaje)}
                source={
                    imageMensaje 
                    ? {uri: imageMensaje}
                    : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage(toastRef, imagesSelected, setImagesSelected) {
    const imageSelect = async() => {
        const response = await loadImageFromGalery([4, 4])
        if(!response.status) {
            toastRef.current.show("No has seleccionado ninguna imagen", 3000)
            return
        }
        
        toastRef.setImagesSelected([...toastRef.imagesSelected, response.image])
    }

    return (
        <ScrollView
            horizontal
            style={styles.viewImage}
        >
            {
                size(toastRef.imagesSelected) < 2 && (
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    />
                ) 
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
                placeholder="Nombre del pictograma"
                defaultValue={formData.formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={formData.errorName}
            />
        </View>
    )
}

const defaultFormValue = () => {
    return {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        country: "AR",
        callingCode: "59"
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#d6eefb"
    },
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
    btnAddFavorito: {
        margin: 20,
        backgroundColor: "#4cb4eb"
    },
    viewImage: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
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
        marginBottom: 120,
        marginTop:20
    }
})