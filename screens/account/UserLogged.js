import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function UserLogged() {
    return (
        <View>
            <Text>UserGuest</Text>
            <Loading isVisible={true} text="Cargando..."/>
        </View>
    )
}

const styles = StyleSheet.create({})