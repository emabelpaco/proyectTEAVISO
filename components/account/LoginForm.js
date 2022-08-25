import { isEmpty, size } from "lodash";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon, Input } from "react-native-elements";
import { validateEmail } from "../../utils/helpers";
import { loginWithEmailAndPassword } from "../../utils/actions"; 
import Loading from "../Loading";
export default function LoginForm() {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    const doLogin = async () => {
        if(!validateData()){
            return;
        }
        setLoading(true)
        const result = await loginWithEmailAndPassword(formData.email, formData.password)
        setLoading(false)

        if (!result.statusResponse) {
            setErrorEmail(result.error)
            setErrorPassword(result.error)
            return
        }
        navigation.navigate("cuenta")
    }

    const validateData = () => {
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if(!validateEmail(formData.email)) {
            setErrorEmail("Debes de ingresar un mail válido")
            isValid = false
        }

        if(isEmpty(formData.password)){
            setErrorPassword("Debes ingresar tu contraseña")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.container}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu mail..."
                onChange={(e) => onChange(e, "email")}
                keyboardType="email-address"
                errorMessage={errorEmail}
                defaultValue={formData.email}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña..."
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errorPassword}
                defaultValue={formData.password}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setShowPassword(!showPassword) }
                    />}
            />
            <Button
                title="Iniciar Sesión"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={() => doLogin()}
            />
            <Button
                title="Iniciar Sesión con Google"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnGoogle}
                onPress={() => console.log("Iniciar con google")}
                icon={
                    <Icon
                        name="google"
                        type="material-community"
                        marginRight={10}
                        size={20}
                        color="#fff"
                    />
                }
            />
            <Button
                title="Iniciar Sesión con Facebook"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnFacebook}
                onPress={() => console.log("Iniciar con facebook")}
                icon={
                    <Icon
                        name="facebook"
                        type="material-community"
                        marginRight={10}
                        size={20}
                        color="#fff"
                    />
                }
            />
            <Loading
                isVisible={loading}
                text="Iniciando Sesión..."
            />
        </View>
    )
}

const defaultFormValues = () => {
    return { email : '', password :''}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },input: {
        width: "100%"
    },
    btnContainer: {
        marginTop: 30,
        width: "95%",
        alignSelf: "center"
    },
    btn: {
        backgroundColor: "#4cb4eb"
    },
    icon: {
        color: "#c1c1c1"
    },
    btnGoogle: {
        backgroundColor: "#EA4335"
    },
    btnFacebook: {
        //backgroundColor: "#EA4335"
    }
})