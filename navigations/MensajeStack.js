import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddMensaje from "../screens/mensajes/AddMensaje";
import Mensaje from "../screens/mensajes/Mensajes";

const Stack = createStackNavigator();

export default function MensajeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="mensaje"
                component={Mensaje}
                options={{title: "Mensajes"}}
                />
            <Stack.Screen
                name="addmensaje"
                component={AddMensaje}
                options={{title: "Crear Mensaje"}}
                />
        </Stack.Navigator>
        
    )
}
