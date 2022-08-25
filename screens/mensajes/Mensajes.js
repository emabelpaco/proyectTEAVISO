import React, { useState, useEffect, useCallback }from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import Loading from "../../components/Loading";
import ListMensajes from "../../components/mensajes/ListMensajes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import { size } from 'lodash'
import { getMensajes } from '../../utils/actions'

export default function Mensaje() {
    const [user, setUser] = useState(null)
    const [startMensaje, setStartMensaje] = useState(null)
    const [mensajes, setMensajes] = useState([])
    const [loading, setLoading] = useState(false)

    const limitMensajes = 7
    console.log("MENSAJES ", mensajes)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(userInfo) : setUser(false)
        })
    }, [])

    // useFocusEffect(
    //     useCallback(async() => {
    //         setLoading(true)
    //         const response = await getMensajes(limitMensajes)
    //         if(response.statusResponse) {
    //             setStartMensaje(response.startMensaje)
    //             setMensajes(response.mensajes)
    //         }
    //         setLoading(false)
    //     }, [])
    // )
    useFocusEffect(
        useCallback(() => {
            async function getData(){
                setLoading(true)
                const response = await getMensajes(limitMensajes)
                if(response.statusResponse) {
                    setStartMensaje(response.startMensaje)
                    setMensajes(response.mensajes)
                }
                setLoading(false)
            }
            getData()
            
        }, [])
    )

    const handleLoadMore = async() => {
        if (!startMensaje) {
            return
        }

        setLoading(true)
        // const response = await getMoreRestaurants(limitRestaurants, startRestaurant)
        // if (response.statusResponse) {
        //     setStartRestaurant(response.startRestaurant)
        //     setRestaurants([...restaurants, ...response.restaurants])
        // }
        setLoading(false)
    }

    if(user == null) {
        return <Loading isVisible={true} text={"Cargando..."}/>
    }
    const navigation = useNavigation()
    return (
        <View style={styles.viewBody}>
            {
                size(mensajes) > 0 ? (
                    <ListMensajes
                        mensajes={mensajes}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}></Text>
                    </View>
                )
            }
            {
                user && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#4cb4eb"
                        reverse
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate("addmensaje")}
                    />
                )
                
            }
            <Loading isVisible={loading} text="Cargando mensajes..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 0.5
    },
    notFoundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "bold"
    }
})