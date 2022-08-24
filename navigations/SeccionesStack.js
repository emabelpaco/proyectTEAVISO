import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Secciones from "../screens/Secciones";

const Stack = createStackNavigator();

export default function SeccioneStack() {
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
                name="secciones"
                component={Secciones}
                options={{title: "Favoritos"}}
                />
        </Stack.Navigator>
        
    )
}
