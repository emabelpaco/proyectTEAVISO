import React, { useState, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { Avatar, Input, Button } from 'react-native-elements'
import { isEmpty, map } from 'lodash'
import Loading from '../../components/Loading'
import { 
    addDocumentWithoutId, 
    getCurrentUser, 
    getDocumentById, 
    getIsFavorite, 
    deleteFavorite, 
    sendPushNotification, 
    setNotificationMessage, 
    getUsersFavorite
} from '../../utils/actions'
import Modal from '../../components/Modal'

const widthScreen = Dimensions.get("window").width

export default function Mensaje({ navigation, route }) {
    console.log("estamos en MENSAJE .JS ", route.params.param)
    
    const [imagenesFrase, setImagenesFrase] = useState(null)
    const [categoria, setCategoria] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)

    navigation.setOptions({ title: "Mensajes Guardados" })

    useEffect(() => {
        setImagenesFrase(route.params.param.mensajes)
    }, [])

    if (!imagenesFrase) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}>
            <FlatList
                data={imagenesFrase}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                //onEndReached={handleLoadMore}
                renderItem={(mensaje) => (
                    <Frase mensaje={mensaje} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Frase({ mensaje, navigation }) {
    const imagenesFrase = mensaje.item.imagenes
    const nameFrase = mensaje.item.nameMensaje

    const expandirFrase = () => {
        console.log("ver el mensaje completo: ", mensaje.item)
       // var param = mensaje.item
        //navigation.navigate("frases", { param })  // con parametros el id y el nombre de categoria
        //navigation.navigate("frases")
    } 

    return (
        <View>
            <TouchableOpacity onPress={expandirFrase}>
                <Text style={styles.titulo}>{nameFrase}</Text>
            </TouchableOpacity>
            
            <ScrollView
                horizontal
                style={styles.viewImage}
            >
            {
                map(imagenesFrase, (imageMensaje, index) => (
                    <View>
                        <Avatar
                        key={index}
                        style={{width: 100, height: 90, borderWidth: 1,
                            borderColor: "black", marginLeft:6}}
                        source={{uri: imageMensaje.image}}
                    />
                    <Text style={styles.descripcion}>{imageMensaje.text}</Text>
                    </View> 
                ))
            }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#d6eefb"
    },
    viewImage: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 20,
        width: 400, 
        height: 160
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
        marginTop: 20
    },
    descripcion: {
        fontSize: 15,
        fontWeight: "bold",
        marginTop: 20,
        alignSelf:"center"
    },
})