import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AddFavoritoForm from "../../components/favoritos/AddFavoritoForm";
import Toast from "react-native-easy-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Loading from "../../components/Loading";

export default function AddFavoritos({ navigation }) {
    const toastRef = useRef()
    const [loading, setLoading] = useState(false)
    return (
        <View style={styles.viewBody}>
            <KeyboardAwareScrollView>
                <AddFavoritoForm
                    toastRef={toastRef}
                    setLoading={setLoading}
                    navigation={navigation}
                />
                <Loading
                    isVisible={loading}
                    text="Creando pictograma..."
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
    },
})