import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Chat from "../screens/Chat";

const Stack = createStackNavigator();

export default function ChatStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#1684D4",
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
