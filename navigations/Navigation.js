import React, { useState, useEffect, useContext, useCallback } from "react"
import { Text, LogBox } from "react-native";
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatStack from './ChatStack';
import AccountStack from './AccountStack';
import { Icon } from 'react-native-elements';
import MensajeStack from './MensajeStack';
import FavoritoStack from './FavoritoStack';
import SignIn from '../screens/account/LoginExample'
import Register from "../screens/account/Register";
//import SignIn from '../screens/account/Login'
import Context from "../context/Context";
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/firebase'
import 'firebase/auth';
import Onboarding from "../screens/onboarding/Onboarding";
import * as app from "../config";

LogBox.ignoreLogs([
    "Setting a timer",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
  ]);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TabChat = createMaterialTopTabNavigator();

export default function  Navigation (){
    const [currUser, setCurrUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const {
        theme: { colors },
    } = useContext(Context);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setLoading(false);
          if (user) { 
            setCurrUser(user);
          } else {
            setCurrUser(false);
          }
        });
        return () => unsubscribe();
    }, []);
    
    if (loading) {
        return <Text>Loading...</Text>;
    }
    
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "mensaje":
                iconName = "view-grid-outline"
                break;
            case "chatSeccion":
                iconName = "chat-plus-outline"
                break;
            case "cuenta":
                iconName = "home-outline"
                break;
            case "secciones":
                iconName = "heart-outline"
                break;
        }
        return (
            <Icon
                type="material-community"
                name={iconName}
                size={27}
                color={color}
            />
        )
    }

    return (
      <NavigationContainer>
        {!currUser && !app.primeraVez? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
                name="signIn" 
                component={SignIn} 
                />
          <Stack.Screen
                name="register"
                component={Register}
                options={{title: "Registrar Usuario"}}
                />
          <Stack.Screen
                name="onboarding"
                component={Onboarding}
                />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
            initialRouteName='cuenta'
            tabBarOptions={{
                inactiveTintColor: "#866e74",
                activeTintColor: "#4cb4eb"
            }}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({color}) => screenOptions(route, color)
            })}
        >
            <Tab.Screen
                name="mensaje"
                component={MensajeStack}
                options={{title: "Categorías"}}
            />
            <Tab.Screen
                name="chatSeccion"
                component={ChatStack}
                options={{title: "Chat"}}
            />
            <Tab.Screen
                name="secciones"
                component={FavoritoStack}
                options={{title: "Mis Pictogramas"}}
            />
            <Tab.Screen
                name="cuenta"
                component={AccountStack}
                options={{title: "Cuenta"}}
            />
        </Tab.Navigator>
         )}
      </NavigationContainer>
    )
}