import { React, useState } from "react";
import { StyleSheet, View, Image, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Onboarding from "react-native-onboarding-swiper";
import { registerUser } from "../../utils/actions"; 
import { auth, db } from "../../utils/firebase";
import { uploadImage } from "../../utilsContext";
import Loading from "../../components/Loading";

export default function OnboardingScreen(props) {
    const [loading, setLoading] = useState(false)
    
    async function salirPress () {
        doRegisterUser()
    }

    const doRegisterUser = async () => {
        setLoading(true)
        const result = await registerUser(props.route.params.formData.email, props.route.params.formData.password)
        setLoading(false)
    
        if (!result.statusResponse) {
            console.log("Error al crear cuenta: ",result.error)
            return
        }
        handlePress();
    }
    
    async function handlePress() {
        const user = auth.currentUser;
        let photoURL;
        if (props.route.params.formData.imagenPerfil) {
          const { url } = await uploadImage(
            props.route.params.formData.imagenPerfil,
            `images/${user.uid}`,
            "profilePicture"
          );
          photoURL = url;
        }
        const userData = {
          displayName: props.route.params.formData.nombre,
          email: user.email,
        };
        if (photoURL) {
          userData.photoURL = photoURL;
        }
    
        await Promise.all([
          updateProfile(user, userData),
          setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid }),
        ]);
    }

    return (
        <View style={styles.viewBody}>
        <Onboarding
            onSkip={() => salirPress()}
            onDone={() => salirPress()}
            skipLabel="Salir"
            nextLabel="Siguiente"
            titleStyles={{ color: '#4cb4eb', fontSize: 40 }}
            pages={[
                {
                    backgroundColor: '#bfe4f9',
                    image: <Image source={require('../../assets/Onboarding1.png')} />,
                    title: 'Mensajes Personalizados',
                    titleStyles:{ color: '#4cb4eb', fontWeight: 'bold' },
                    subtitle: 'Desde aquí podrás generar tus mensajes personalizados y podrás utilizarlos en cualquier momento.',
                    subTitleStyles:{ color: '#4cb4eb'}
                },
                {
                    backgroundColor: '#bfe4f9',
                    image: <Image source={require('../../assets/Onboarding2.png')} />,
                    title: 'Organización por categorías',
                    titleStyles:{ color: '#4cb4eb', fontWeight: 'bold' },
                    subtitle: 'Podrás crear categorías donde podrás guardar los mensajes que quieras volver a utilizar.',
                    subTitleStyles:{ color: '#4cb4eb' }
                },
                {
                    backgroundColor: '#bfe4f9',
                    image: <Image source={require('../../assets/Onboarding3.png')} />,
                    title: 'Chat entre usuarios',
                    titleStyles:{ color: '#4cb4eb', fontWeight: 'bold' },
                    subtitle: 'Podrás interactuar con otros usuarios mediante un chat en donde podrás utilizar los mensajes creados.',
                    subTitleStyles:{ color: '#4cb4eb'}
                },
              ]}
        />
        <Loading
                isVisible={loading}
                text="Cargando"
        />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        height: "100%"
    },
})