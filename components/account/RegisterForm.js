import { size } from "lodash";
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon, Input } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { validateEmail, loadImageFromGalery } from "../../utils/helpers";
import { registerUser } from "../../utils/actions"; 
import { auth, db } from "../../utils/firebase";
import { uploadImage } from "../../utilsContext";
import Loading from "../Loading";

export default function RegisterForm() {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorNombre, setErrorNombre] = useState("")
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);

    const navigation = useNavigation()

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    const doRegisterUser = async () => {
        if(!validateData()){
            return;
        }
        setLoading(true)
        const result = await registerUser(formData.email, formData.password)
        setLoading(false)

        if (!result.statusResponse) {
            setErrorEmail(result.error)
            return
        }
        handlePress();
    }

    async function handlePress() {
        const user = auth.currentUser;
        let photoURL;
        if (selectedImage) {
          const { url } = await uploadImage(
            selectedImage,
            `images/${user.uid}`,
            "profilePicture"
          );
          photoURL = url;
        }
        const userData = {
          displayName: formData.nombre,
          email: user.email,
        };
        if (photoURL) {
          userData.photoURL = photoURL;
        }
    
        await Promise.all([
          updateProfile(user, userData),
          setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid }),
        ]);
        navigation.navigate("bienvenida");
    }

    const validateData = () => {
        setErrorNombre("")
        setErrorEmail("")
        setErrorConfirm("")
        setErrorPassword("")
        let isValid = true

        if(!validateEmail(formData.email)) {
            setErrorEmail("Debes de ingresar un mail válido")
            isValid = false
        }

        if(size(formData.password) < 6) {
            setErrorPassword("Debes ingresar una password de al menos 6 carácteres.")
            isValid = false
        }

        if(size(formData.confirm) < 6) {
            setErrorConfirm("Debes ingresar una confirmación de al menos 6 carácteres.")
            isValid = false
        }

        if(formData.password !== formData.confirm) {
            setErrorPassword("La contraseña y la confirmación no son iguales")
            setErrorConfirm("La contraseña y la confirmación no son iguales")
            isValid = false
        }

        return isValid
    }

    async function handleProfilePicture() {
        const result = await loadImageFromGalery([1,1])
        console.log("result: ", result)
        if (!result.status) {
            console.log("result: ", result)
        }
        setSelectedImage(result.image);
      }

    return (
        <View style={styles.form}>
            <TouchableOpacity
                onPress={handleProfilePicture}
                style={{
                    borderRadius: 120,
                    width: 80,
                height: 80,
                backgroundColor: "#ece5dd",
                alignItems: "center",
                justifyContent: "center",
                }}
            >
            {!selectedImage ? (
                <MaterialCommunityIcons
                    name="camera-plus"
                    color="#717171"
                    size={45}
                />
            ) : (
                <Image
                    source={{ uri: selectedImage }}
                    style={{ width: "100%", height: "100%", borderRadius: 120 }}
                />
            )}
            </TouchableOpacity>
            <Input
                containerStyle={styles.input}
                placeholder="Ingrese su nombre"
                onChange={(e) => onChange(e, "nombre")}
                errorMessage={errorNombre}
                defaultValue={formData.nombre}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingrese su mail..."
                onChange={(e) => onChange(e, "email")}
                keyboardType="email-address"
                errorMessage={errorEmail}
                defaultValue={formData.email}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingrese una contraseña..."
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
            <Input
                containerStyle={styles.input}
                placeholder="Confirmar contraseña..."
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e) => onChange(e, "confirm")}
                errorMessage={errorConfirm}
                defaultValue={formData.confirm}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setShowPassword(!showPassword) }
                    />}
            />
            <Button
                title="Registrar"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={() => doRegisterUser()}
            />
            <Loading
                isVisible={loading}
                text="Creando Cuenta"
            />
        </View>
    )
}

const defaultFormValues = () => {
    return { email : '', password :'', confirm : '' }
}

const styles = StyleSheet.create({
    form: {
        marginTop: 30,
        alignItems:"center"
    },
    input: {
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
    }
})