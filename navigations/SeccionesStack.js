import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Secciones from "../screens/Secciones";

const Stack = createStackNavigator();

export default function SeccioneStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#1684D4",
                },
                headerTintColor: "white",
                headerBackTitle: "Back",
                headerTitleStyle:{fontSize: 20}
            }}
        >
            <Stack.Screen
                name="secciones"
                component={Secciones}
                options={{title: "TUS PICTOGRAMAS"}}
                />
        </Stack.Navigator>
        
    )
}
