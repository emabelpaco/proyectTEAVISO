import React from "react";
import { StyleSheet, Image, ScrollView, View, Text } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function Login() {

    return (
        <ScrollView>
            <Image
                source={require("../../assets/logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <View style={styles.container}>
                <Text>Login</Text>
                <Text>Registro</Text>
                <CreateAccount/>
            </View>
            <Divider style={styles.divider}/>
        </ScrollView>
    )
}

function CreateAccount(props) {
    const navigation = useNavigation()
    return (
        <Text 
            style={styles.register}
            onPress={() => navigation.navigate("register")}
            >
            ¿Aún no tienes una Cuenta? 
            <Text style={styles.btnRegister}> Regístrate </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 150,
        width: "100%",
        marginBottom: 20,
    },
    container: {
        marginHorizontal: 40
    },
    divider: {
        backgroundColor: "#57d5ae",
        margin: 40
    },
    register: {
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },
    btnRegister: {
        color: "#57d5ae",
        fontWeight: "bold"
    }
})