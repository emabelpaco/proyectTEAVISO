import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import { closeSesion } from "../../utils/actions";

export default function UserLogged() {
    const navigation = useNavigation()

    return (
        <View>
            <Text>User Logged</Text>
            <Button
                title="Cerra Sesión"
                onPress={() => {
                    closeSesion()
                    navigation.navigate("mensaje")
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({})