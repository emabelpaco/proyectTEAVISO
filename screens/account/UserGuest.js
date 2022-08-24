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
            in SceneView (created by BottomTabView)
            in RCTView (created by View)
            in View (created by Screen)
            in RCTView (created by View)
            in View (created by Background)
            in Background (created by Screen)
            in Screen (created by BottomTabView)
            in RNSScreen (created by AnimatedComponent)
            in AnimatedComponent
            in AnimatedComponentWrapper (created by Screen)
            in MaybeFreeze (created by Screen)
            in Screen (created by MaybeScreen)
            in MaybeScreen (created by BottomTabView)
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
        height: 300,
        width: "100%",
        marginBottom: 10,
        //marginTop:100
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
        color: "#f18fa7"
    },
    button: {
        backgroundColor: "#4cb4eb",

    }
})