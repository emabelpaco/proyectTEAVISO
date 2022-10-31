import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AddMensajeForm from "../../components/mensajes/AddMensajeForm";
import Toast from "react-native-easy-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Loading from "../../components/Loading";

export default function AddMensaje({ route , mensajes}) {
    //console.log("ADDMensaje estoy aquiu: ", route.params.mensajes[0].mensajes[0].imagenes)
    //console.log("ADDMensaje estoy aquiu: ", route.params.mensajes[0].mensajes[0].respuestas)
    const toastRef = useRef()
    const [loading, setLoading] = useState(false)

    return (
        <View style={styles.viewBody}>
            <KeyboardAwareScrollView>
                <AddMensajeForm
                    toastRef={toastRef}
                    setLoading={setLoading}
                    navigation={route}
                />
                <Loading
                    isVisible={loading}
                    text="Creando mensaje..."
                />
                <Toast ref={toastRef} position="center" opacity={0.9}/>
            </KeyboardAwareScrollView>
        </View>
        
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#d6eefb"
    }
})