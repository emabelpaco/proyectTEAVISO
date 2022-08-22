import { style } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import React, {useState} from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import CountryPicker from 'react-native-country-picker-modal'

export default function AddMensajeForm({toasRef, setLoading, navigation}) {

    const [formData, setFormData] = useState(defaultFormValue())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)


    const addMensaje = () => {
        console.log(formData)
        console.log("add mensajeeeeee")
    }

    return (
        <View style={styles.viewContainer}>
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
                title="Crear Mensaje"
                onPress={addMensaje}
                buttonStyle={styles.btnAddMensaje}
            />
        </View>
    )
}

function FormAdd(formData, setFormData, errorName, errorDescription, errorEmail, errorAddress, errorPhone) {
    const [country, setCountry] = useState("AR")
    const [callingCode, setCallingCode] = useState("59")
    const [phone, setPhone] = useState("")
    console.log("1 form data: ", formData)

    const onChange = (e, type) => {
        formData.formData[type] = e.nativeEvent.text
        //setFormData({...formData.formData, [type]: e.nativeEvent.text})
    }

    return (
        <View styles={styles.viewForm}>
            <Input
                placeholder="Nombre del mensaje"
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder="Dirección"
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
            />
            <Input
                keyboardType="email-address"
                placeholder="Email"
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
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
                        setFormData({
                            ...formData, 
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
                    defaultValue={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                />
            </View>
            <Input
                placeholder="Descripcion"
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={errorDescription}
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
    }
})