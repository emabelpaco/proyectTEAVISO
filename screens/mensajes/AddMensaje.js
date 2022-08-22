import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AddMensajeForm from "../../components/mensajes/AddMensajeForm";
import Toast from "react-native-easy-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Loading from "../../components/Loading";

export default function AddMensaje({ navigation }) {
    const toastRef = useRef()
    const [loading, setLoading] = useState(false)

    return (
        <KeyboardAwareScrollView>
            <AddMensajeForm
                toastRef={toastRef}
                setLoading={setLoading}
                navigation={navigation}
            />
            <Loading
                isVisible={loading}
                text="Creando mensaje..."
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({})