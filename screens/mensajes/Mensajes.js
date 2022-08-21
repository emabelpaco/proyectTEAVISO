import React, { useState, useEffect }from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import Loading from "../../components/Loading";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";

export default function Mensaje() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(userInfo) : setUser(false)
        })
    }, [])

    if(user == null) {
        return <Loading isVisible={true} text={"Cargando..."}/>
    }
    const navigation = useNavigation()
    return (
        <View style={styles.viewBody}>
            <Text>Mensaje..</Text>
            {
                user && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#57d5ae"
                        reverse
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate("addmensaje")}
                    />
                )
                
            }
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 0.5
    }
})