import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react"
import { Text } from "react-native";
//import Chat from "../screens/chat/Chat";
import Contactos from "../screens/chat/Contactos";
import Photo from '../screens/chat/Photo'
import Chats from '../screens/chat/Chats'
import Contacts from "../screens/chat/Contacts";
import Chat from '../screens/chat/Chat'
import ChatHeader from '../components/ChatHeader'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import Context from "../context/Context";

const Stack = createStackNavigator();
const TabChat = createMaterialTopTabNavigator();

export default function ChatStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#4cb4eb",
                },
                headerTintColor: "white",
                headerBackTitle: "Back",
                headerTitleStyle:{fontSize: 20}
            }}
        >
            <Stack.Screen
                name="chathome"
                component={Home}
                options={{title: "CHAT"}}
                />
            <Stack.Screen
                name="contacts"
                options={{ title: "Select Contacts" }}
                component={Contacts}
                />
            <Stack.Screen 
                name="chat" 
                component={Chat} 
                options={{headerTitle: (props) => <ChatHeader {...props} />}}/>
        </Stack.Navigator>
        
    )
}
function Home() {
    const {
      theme: { colors },
    } = useContext(Context);
    return (
      <TabChat.Navigator
        screenOptions={({ route }) => {
          return {
            tabBarLabel: () => {
              if (route.name === "photo") {
                return <Ionicons name="camera" size={20} color={colors.white} />;
              } else {
                return (
                  <Text style={{ color: colors.white }}>
                    {route.name.toLocaleUpperCase()}
                  </Text>
                );
              }
            },
            tabBarShowIcon: true,
            tabBarLabelStyle: {
              color: colors.white,
            },
            tabBarIndicatorStyle: {
              backgroundColor: colors.white,
            },
            tabBarStyle: {
              backgroundColor: colors.foreground,
            },
          };
        }}
        initialRouteName="chats"
      >
        <TabChat.Screen name="photo" component={Photo} />
        <TabChat.Screen name="chats" component={Chats} />
      </TabChat.Navigator>
    );
  }