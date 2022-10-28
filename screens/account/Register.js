import React from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RegisterForm from "../../components/account/RegisterForm";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

export default function Register() {
    return (
        <React.Fragment>
            <StatusBar style="auto" />
            <View
                style={{
                backgroundColor: "#bfe4f9",
                flex: 1,
                paddingTop: Constants.statusBarHeight + 20,
                padding: 20,
                }}
            >
                <Image
                    source={require("../../assets/logo.png")}
                    resizeMode="contain"
                    style={styles.image}
                />
                <Text style={{ fontSize: 22, color: "#4cb4eb", marginTop: 10, textAlign: "center" }}>
                    Registrar Usuario
                </Text>
                <KeyboardAwareScrollView>
                    <RegisterForm/>
                </KeyboardAwareScrollView>
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 75,
        width: "100%",
        marginBottom: 10,
        marginTop:20
    }
})