import React from "react";
import { StyleSheet, ScrollView, Image, Text } from "react-native";
import { Button } from "react-native-elements";
//import { ScrollView } from "react-native-gesture-handler";
import Loading from "../../components/Loading";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {

    const navigation = useNavigation()

    return (
        <ScrollView
            centerContent
            style={styles.viewBody}
        >
            <Image
                source={require("../../assets/logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.text}>Consulta tu perfil en TEAVISO</Text>
            <Text style={styles.descripcion}>
            Una vez logueado a la aplicación podrá utilizar las distintas funcionalidades que brinda la herramienta. 
            </Text>
            <Button
                buttonStyle={styles.button}
                title="Ver tu perfil"
                onPress={() => navigation.navigate("login")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody : {
        marginHorizontal: 30
    },
    image : {
        height: 150,
        width: "100%",
        marginBottom: 50,
        marginTop:80
    },
    text: {
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center"
    },
    descripcion: {
        textAlign: "justify",
        marginBottom: 20,
        color: "#48a6be"
    },
    button: {
        backgroundColor: "#4cb4eb",

    }
})