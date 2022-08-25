import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddMensaje from "../screens/mensajes/AddMensaje";
import Mensaje from "../screens/mensajes/Mensajes";

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
                component={Mensaje}
                options={{title: "CATEGORÍAS"}}
                />
            <Stack.Screen
                name="addmensaje"
                component={AddMensaje}
                options={{title: "CREAR MENSAJE"}}
                />
        </Stack.Navigator>
        
    )
}
