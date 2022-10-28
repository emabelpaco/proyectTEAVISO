import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import { closeSesion, getCurrentUser } from "../../utils/actions";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import InfoUser from "./InfoUser";
import AccountOptions from "../../components/account/AccountOptions";

export default function UserLogged() {
    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [user, setUser] = useState(null)
    const [relodUser, setRelodUser] = useState(false)

    useEffect(() => {
        setUser(getCurrentUser())
        setRelodUser(false)
    }, [relodUser])

    return (
        <View style={styles.container}>
            {
                user && (
                    <View>
                        <InfoUser 
                            user={user} 
                            setLoading={setLoading} 
                            setLoadingText={setLoadingText}
                            />
                        <AccountOptions
                            user={user}
                            toastRef={toastRef}
                            setRelodUser={setRelodUser}
                        />
                    </View>
                )
                    
            }
            <Button
                title="Cerrar Sesión"
                buttonStyle={styles.btnCloseSesion}
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
        backgroundColor: "#d6eefb"
    },
    btnCloseSesion: {
        marginTop: 30,
        borderRadius: 5,
        backgroundColor:"#4cb4eb",
        borderTopWidth: 1,
        borderTopColor: "#4cb4eb",
        borderBottomWidth: 1,
        borderBottomColor: "#4cb4eb",
        paddingVertical: 10
    },
    btnCloseSesionText: {
        color: "#4cb4eb"
    }
})