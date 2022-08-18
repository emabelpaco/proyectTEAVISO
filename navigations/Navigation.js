import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Mensaje from '../screens/Mensajes';
import Secciones from '../screens/Secciones';
import Chat from '../screens/Chat';
import Account from '../screens/Account';
import AccountStack from './AccountStack';

const Tab = createBottomTabNavigator();

export default function  Navigation (){
  
    return (
      <NavigationContainer>
        <Tab.Navigator>
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
                component={Account}
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
