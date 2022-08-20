import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { updateProfile, uploadImage } from "../../utils/actions";
import { loadImageFromGalery } from "../../utils/helpers";

export default function InfoUser({user, setLoading, setLoadingText}) {
    const [photoUrl, setPhotoUrl] = useState(user.photoURL)
    const changePhoto = async() => {
        const result = await loadImageFromGalery([1,1])
        if (!result.status) {
            return 
        }
        //console.log("load image ", result)
        setLoadingText("Actualizando imagen...")
        setLoading(true)
        //console.log("user id", user)
        const resultUploadImage = await uploadImage(result.image, "avatars", user.uid)
        //console.log("result upload ", resultUploadImage)
        //console.log("result user ", user.id)
        if(!resultUploadImage.statusResponse){
            setLoading(false)
            Alert.alert("Ha ocurrido un error al amacenar la foto de perfil.")
            return 
        }
        const resultUpdateProfile = await updateProfile({photoUrl: resultUploadImage.url})
        setLoading(false)
        if(resultUpdateProfile.statusResponse) {
            console.log("set photo url", resultUploadImage.url)
            setPhotoUrl(resultUploadImage.url)
        } else {
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }
    return ( 
        <View style={styles.container}>
            <Avatar 
                rounded={true}
                size="large"
                onPress={changePhoto}
                source={
                    photoUrl
                    ? {uri: photoUrl}
                    : require("../../assets/avatar-default.jpeg")
                }
            />
            <View style={styles.infoUser}>
                <Text style={styles.displayName}>
                    {
                        user.displayName ? user.displayName : "Anónimo"
                    }
                </Text>
                <Text>{user.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection:"row",
        backgroundColor: "#f9f9f9",
        paddingVertical: 30
    },
    infoUser: {
        marginLeft: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
})