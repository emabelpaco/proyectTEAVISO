import React, { useState, useEffect, useCallback }from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import Loading from "../../components/Loading";
import ListMensajes from "../../components/mensajes/ListMensajes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import { size } from 'lodash'
import axios from 'axios'
import { getMensajes } from '../../utils/actions'

export default function Mensaje() {
    const [user, setUser] = useState(null)
    const [startMensaje, setStartMensaje] = useState(null)
    const [mensajes, setMensajes] = useState([])
    const [loading, setLoading] = useState(false)
    const [conjCategorias, setConjCategorias] = useState([])

    const limitMensajes = 7

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(userInfo) : setUser(false)
            fetchApiGetCategorias(userInfo)
        })
    }, [])

    const fetchApiGetCategorias = async (userInfo) => {
        console.log("fetch api categorias")
        try {
            const res = await axios.get('http://192.168.0.116:3000/api/users/getCategoriasByEmail', {params: {email: userInfo.email}})
            console.log("CATEGORIASSSS::: ", res.data.data.docs[0])
            console.log("CATEGORIASSSS::: ", res.data.data.docs[0].categorias[0].mensajes)
            console.log("CATEGORIASSSS::: ", res.data.data.docs[0].categorias[0].mensajes[0].imagenes)
            setMensajes(res.data.data.docs[0].categorias)
            //setConjuntoCategorias(mensajes)
            const data = res.data.data.docs[0].categorias
            var arrayCateg = []
            data.forEach(element => {
                var body = {}
                body.key = element.idCategoria
                body.value = element.nameCategoria
                arrayCateg.push(body)
            });
            setConjCategorias(arrayCateg)
            //console.log("DDDDDD ", conjCategorias)
        
        } catch (error){
            console.log(error)
        }
    }

    // const setConjuntoCategorias = async (d) => {
    //     console.log("DDDDDD ", d)
    //     const data = d
    //     var arrayCateg = []
    //     data.forEach(element => {
    //         var body = {}
    //         body.id = element.idCategoria
    //         body.categoria = element.nameCategoria
    //         arrayCateg.push(body)
    //     });
    //     setConjCategorias(arrayCateg)
    // }

    // useFocusEffect(
    //     useCallback(() => {
    //         async function getData(){
    //             setLoading(true)
    //             const response = await getMensajes(limitMensajes)
    //             if(response.statusResponse) {
    //                 console.log("respuesta de getMensaje ", response.startMensaje)
    //                 console.log("respuesta de getMensaje ", response.mensajes)
    //                 setStartMensaje(response.startMensaje)
    //                 setMensajes(response.mensajes)
    //             }
    //             setLoading(false)
    //         }
    //         getData()
            
    //     }, [])
    // )

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
                        <Text style={styles.notFoundText}>Aquí se pueden visualizar sus mensajes guardados en diferentes categorías</Text>
                    </View>
                )
            }
            {
                user && (
                    <Icon
                        type="material-community"
                        name="pencil"
                        color="#4cb4eb"
                        reverse
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate("addmensaje", { conjCategorias, mensajes })}
                    />
                )
                
            }
            <Loading isVisible={loading} text="Cargando categorías..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#d6eefb"
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
        textAlign: "center",
        color:"#a4a4a4"
    }
})