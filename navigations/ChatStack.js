import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Chat from "../screens/Chat";
import AddMensaje from "../screens/mensajes/AddMensaje";
import Mensaje from "../screens/mensajes/Mensajes";

const Stack = createStackNavigator();

export default function ChatStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#4cb4eb",
                },
                headerTintColor: "white",
                headerBackTitle: "Back",
            }}
        >
            <Stack.Screen
                name="chat"
                component={Chat}
                options={{title: "Chat"}}
                />
        </Stack.Navigator>
        
    )
}
