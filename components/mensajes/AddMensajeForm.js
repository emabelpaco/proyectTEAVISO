import React, {useState } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Button, Input, Icon, Avatar, Image } from "react-native-elements";
import CountryPicker from 'react-native-country-picker-modal';
import { map, size, filter, isEmpty } from 'lodash';
import { loadImageFromGalery } from "../../utils/helpers";

const widthScreen = Dimensions.get("window").width

export default function AddMensajeForm({toasRef, setLoading, navigation}) {

    const [formData, setFormData] = useState(defaultFormValue())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])


    const addMensaje = () => {
        if(!validForm()) {
            return
        }
        
        console.log("add mensajeeeeee")
    }

    const validForm = () => {
        console.log(formData)
        clearErrors()
        let isValid = true

        if(isEmpty(formData.name)){
            setErrorName("Debe ingresar el nombre del mensaje.")
            isValid = false
        }
        if(isEmpty(formData.address)){
            setErrorAddress("Debe ingresar la direccion.")
            isValid = false
        }
        // seguir validando email, phone, description

        return isValid
    }

    const clearErrors = () => {
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorPhone(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageMensaje
                imageMensaje={imagesSelected[0]}
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
            <UploadImage
                toasRef={toasRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Mensaje"
                onPress={addMensaje}
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
                    : require("../../assets/icon.png")
                }
            />
        </View>
    )
}

function UploadImage(toasRef, imagesSelected, setImagesSelected) {
    const imageSelect = async() => {
        const response = await loadImageFromGalery([4, 3])
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
            <Input
                placeholder="Dirección"
                defaultValue={formData.formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={formData.errorAddress}
            />
            <Input
                keyboardType="email-address"
                placeholder="Email"
                defaultValue={formData.formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={formData.errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        formData.setFormData({
                            ...formData.formData, 
                            "country": country.cca2, 
                            "callingCode": country.callingCode[0]
                        })
                        setCallingCode(country.callingCode[0])
                        setCountry(country.cca2)
                    }}
                />
                <Input
                    placeholder="Whatsaap numero"
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={formData.errorPhone}
                />
            </View>
            <Input
                placeholder="Descripcion"
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={formData.errorDescription}
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
        backgroundColor: "#57d5ae"
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
        marginBottom: 20
    }
})