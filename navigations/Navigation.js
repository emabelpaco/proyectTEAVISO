import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Secciones from '../screens/Secciones';
import Chat from '../screens/Chat';
import AccountStack from './AccountStack';
import { Icon } from 'react-native-elements';
import MensajeStack from './MensajeStack';

const Tab = createBottomTabNavigator();

export default function  Navigation (){
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "mensaje":
                iconName = "view-grid-outline"
                break;
            case "chat":
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
        <Tab.Navigator
            initialRouteName='mensaje'
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
                name="chat"
                component={Chat}
                options={{title: "Chat"}}
            />
            <Tab.Screen
                name="secciones"
                component={Secciones}
                options={{title: "Favoritos"}}
            />
            <Tab.Screen
                name="cuenta"
                component={AccountStack}
                options={{title: "Cuenta"}}
            />
        </Tab.Navigator>
      </NavigationContainer>
    )

}
