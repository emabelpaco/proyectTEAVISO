import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddMensaje from "../screens/mensajes/AddMensaje";
import Mensajes from "../screens/mensajes/Mensajes";
import Mensaje from "../screens/mensajes/Mensaje"

const Stack = createStackNavigator();

export default function MensajeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#1684D4", //"#32a4e3", "#66c1f2", "#48a6be"
                },
                headerTintColor: "white",
                headerBackTitle: "Back",
                headerTitleStyle:{fontSize: 20}
            }}
        >
            <Stack.Screen
                name="mensaje"
                component={Mensajes}
                options={{title: "CATEGORÍAS"}}
                />
            <Stack.Screen
                name="addmensaje"
                component={AddMensaje}
                options={{title: "CREAR MENSAJE"}}
                />
            <Stack.Screen
                name="frases"
                component={Mensaje}
                options={{title: "MENSAJES GUARDADOS"}}
                />
        </Stack.Navigator>
        
    )
}
