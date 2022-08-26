import React, {useState } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Button, Input, Icon, Avatar, Image } from "react-native-elements";
import CountryPicker from 'react-native-country-picker-modal';
import { map, size, filter, isEmpty } from 'lodash';
import { loadImageFromGalery } from "../../utils/helpers";
import { addDocumentWithoutId, getCurrentUser, uploadImage } from "../../utils/actions";
import uuid from 'random-uuid-v4'
import Api from '../../utils/api'

const widthScreen = Dimensions.get("window").width

export default function AddMensajeForm({toasRef, setLoading, navigation}) {

    const [formData, setFormData] = useState(defaultFormValue())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])

    // GUARDAR MENSAJE
    // const addMensaje = async () => {
    //     if(!validForm()) {
    //         return
    //     }
    //     setLoading(true)
    //     const responseUploadImages = await UploadImages()
    //     const mensaje = {
    //         name: formData.name,
    //         address: formData.address,
    //         email: formData.email,
    //         description: formData.description,
    //         callingCode: formData.callingCode,
    //         phone: formData.phone,
    //         images: responseUploadImages,
    //         createAdd: new Date(),
    //         createBy: getCurrentUser().uid
    //     }
    //     const responseAddDocument = await addDocumentWithoutId("mensajes", mensaje)
    //     setLoading(false)

    //     if (!responseAddDocument.statusResponse) {
    //         toasRef.current.show("Error al crear el mensaje, intente más tarde", 3000)
    //         return
    //     }
        
    //     navigation.navigate("mensaje")
    // }

    // SUBIR IMAGENES A FIREBASE - VA CON EL DE ARRIBA
    // const UploadImages = async () => {
    //     const imagesUrl = []
    //     await Promise.all(
    //         map(imagesSelected, async(image) => {
    //             const response = await uploadImage(image, "mensajes", uuid())
    //             if(response.statusResponse) {
    //                 imagesUrl.push(response.url)
    //             }
    //         })
    //     )
    //     return imagesUrl
    // }

    const buscarMensaje = async () => {
        if(!validForm()) {
            return
        }   
        console.log("mensajeeeeee: ", formData.name)
        setLoading(true)
        //const responseSearchMessage = await SearchMessagePicto(formData.name)
        setLoading(false)
        const responseSearchMessage = await Api.searchMessagePicto(formData.name);
        console.log("OK: ", responseSearchMessage)
    }
  
    const resultadoConsulta = (res, error) => {
        console.log("ERROR: ", error)
        console.log("RES: ", res)
      if (error != null) {
        Alert.alert(
          "ERROR",
          "Ocurrio un error inesperado",
          [
            { text: "ACEPTAR" }
          ],
          { cancelable: false }
        )
      }
    //    else {
    //     AsyncStorage.setItem('alreadyLaunched', 'true');
    //     AsyncStorage.setItem('ultimoBackup', user.ultimoBackup);
    //     AsyncStorage.setItem('usuario', user.email);
    //     this.props.navigation.navigate('Dashboard');
    //   }
    //   this.setState({ isLoading: false });
    //   this.buttonAnimated.setValue(0);
    //   this.growAnimated.setValue(0);
      // console.log(AsyncStorage);
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
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorPhone(null)
        setErrorName(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageMensaje
                imageMensaje={imagesSelected}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
            />
            <Button
                title="Listo"
                onPress={buscarMensaje}
                buttonStyle={styles.btnAddMensaje}
            />
        </ScrollView>
    )
}

function ImageMensaje({imageMensaje}) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{width: 100, height: 100}}
                source={
                    imageMensaje[0] 
                    ? {uri: imageMensaje} //// CAMBIAR POR CARROUSEL DE PICTOGRAMAS
                    : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

// function UploadImage(toasRef, imagesSelected, setImagesSelected) {
//     const imageSelect = async() => {
//         const response = await loadImageFromGalery([4, 4])
//         if(!response.status) {
//             toasRef.current.show("No has seleccionado ninguna imagen", 3000)
//             return
//         }
        
//         toasRef.setImagesSelected([...toasRef.imagesSelected, response.image])
//     }

//     const removeImage = (image) => {
//         Alert.alert(
//             "Eliminar Imagen",
//             "¿Estas seguro de eliminar la imagen?",
//             [
//                 {
//                     text: "No",
//                     style: "cancel",
//                 },
//                 {
//                     text: "Sí",
//                     onPress: () => {
//                         toasRef.setImagesSelected(
//                             filter(toasRef.imagesSelected, (imageUrl) => imageUrl !== image)
//                         )
//                     }
//                 }
//             ],
//             {
//                 cancelable: true
//             }
//         )
//     }

//     return (
//         <ScrollView
//             horizontal
//             style={styles.viewImage}
//         >
//             {
//                 size(toasRef.imagesSelected) < 10 && (
//                     <Icon
//                         type="material-community"
//                         name="camera"
//                         color="#7a7a7a"
//                         containerStyle={styles.containerIcon}
//                         onPress={imageSelect}
//                     />
//                 ) 
//             }
//             {
//                 map(toasRef.imagesSelected, (imageMensaje, index) => (
//                     <Avatar
//                         key={index}
//                         style={styles.miniatureStyle}
//                         source={{uri: imageMensaje}}
//                         onPress={() => removeImage(imageMensaje)}
//                     />
//                 ))
//             }
//         </ScrollView>
//     )
// }

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
                placeholder="Ingresar mensaje"
                defaultValue={formData.formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={formData.errorName}
            />
            {/* <Input
                placeholder="Categoría"
                defaultValue={formData.formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={formData.errorAddress}
            /> */}
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
        marginTop:10
    }
})