import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Mensaje from '../screens/Mensajes';
import Secciones from '../screens/Secciones';
import Chat from '../screens/Chat';
import Account from '../screens/account/Account'; 
import AccountStack from './AccountStack';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator();

export default function  Navigation (){
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "mensaje":
                iconName = "message-outline"
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
                size={22}
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
                activeTintColor: "#57d5ae"
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({color}) => screenOptions(route, color)
            })}
        >
            <Tab.Screen
                name="mensaje"
                component={Mensaje}
                options={{title: "Mensajes"}}
            />
            <Tab.Screen
                name="chat"
                component={Chat}
                options={{title: "Chat"}}
            />
            <Tab.Screen
                name="cuenta"
                component={AccountStack}
                options={{title: "Cuenta"}}
            />
            <Tab.Screen
                name="secciones"
                component={Secciones}
                options={{title: "Favoritos"}}
            />
        </Tab.Navigator>
      </NavigationContainer>
    )

}
