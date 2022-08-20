import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import { closeSesion, getCurrentUser } from "../../utils/actions";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import InfoUser from "./InfoUser";

export default function UserLogged() {
    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        setUser(getCurrentUser())
    }, [])

    return (
        <View style={styles.container}>
            {
                user && <InfoUser user={user}/>
            }
            <Text>Account options</Text>
            <Button
                title="Cerra Sesión"
                buttonStyle={styles.btnCloseSesion}
                titleStyle={styles.btnCloseSesionText}
                onPress={() => {
                    closeSesion()
                    navigation.navigate("mensaje")
                }}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text={loadingText}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: "100%",
        backgroundColor: "#f9f9f9"
    },
    btnCloseSesion: {
        marginTop: 30,
        borderRadius: 5,
        backgroundColor:"#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#57d5ae",
        borderBottomWidth: 1,
        borderBottomColor: "#57d5ae",
        paddingVertical: 10
    },
    btnCloseSesionText: {
        color: "#57d5ae"
    }
})