import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Onboarding from "react-native-onboarding-swiper";
import { signIn } from "../../utils/firebase";
import { loginWithEmailAndPassword } from "../../utils/actions"; 
import * as app from "../../config";

const backgroundColor = isLight => (isLight ? 'blue' : 'lightblue');
const color = isLight => backgroundColor(!isLight);

const skip = () => (
    <Button
        title='Salir'
        //color='#00000'
        //onPress={() => navigation.navigate("register")}
    />
)

const next = ({ isLight, ...props }) => (
    <Button
        title='Siguiente'
        //color='#00000'
        buttonStyle={{
            backgroundColor: backgroundColor(isLight),
          }}
          containerViewStyle={{
            marginVertical: 10,
            width: 70,
            backgroundColor: backgroundColor(isLight),
          }}
          textStyle={{ color: color(isLight) }}
          {...props}
    />
)

export default function OnboardingScreen(props) {
    console.log("ooonn", props);
    const navigation = useNavigation()
    
    async function handlePress () {
        app.primeraVez = false;
        if (!app.primeraVez) {

        }
    }
    return (
        <Onboarding
            //SkipButtonComponent={skip}
            //NextButtonComponent={next}
            //DoneButtonComponent={Done}
            onSkip={() => handlePress()}
            onDone={() => handlePress()}
            skipLabel="Salir"
            nextLabel="Siguiente"
            don
            titleStyles={{ color: 'black', fontSize: 35 }}
            pages={[
                {
                    backgroundColor: '#a6e4d0',
                    image: <Image source={require('../../assets/logo.png')} />,
                    title: 'Mensajes Personalizados',
                    subtitle: 'Done with React Native Onboarding Swiper',
                },
                {
                    backgroundColor: '#a6e4d0',
                    image: <Image source={require('../../assets/logo.png')} />,
                    title: 'Organización por categorías',
                    subtitle: 'Done with React Native Onboarding Swiper',
                },
                {
                    backgroundColor: '#a6e4d0',
                    image: <Image source={require('../../assets/logo.png')} />,
                    title: 'Chat entre usuarios',
                    subtitle: 'Done with React Native Onboarding Swiper',
                    subTitleStyles:{ color: 'red' }
                },
              ]}
        />
    )
}

const styles = StyleSheet.create({})