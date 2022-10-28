import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddFavoritos from "../screens/favoritos/AddFavoritos";
import Favoritos from "../screens/favoritos/Favoritos";
import AddMensaje from "../screens/mensajes/AddMensaje";
import Mensaje from "../screens/mensajes/Mensajes";

const Stack = createStackNavigator();

export default function FavoritoStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#4cb4eb", //"#32a4e3", "#66c1f2", "#48a6be"
                },
                headerTintColor: "white",
                headerBackTitle: "Back",
                headerTitleStyle:{fontSize: 20}
            }}
        >
            <Stack.Screen
                name="favoritos"
                component={Favoritos}
                options={{title: "MIS PICTOGRAMAS"}}
                />
            <Stack.Screen
                name="addfavorito"
                component={AddFavoritos}
                options={{title: "CREAR PICTOGRAMA"}}
                />
        </Stack.Navigator>
        
    )
}
