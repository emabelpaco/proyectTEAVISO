import React, { useState, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { Dimensions, StyleSheet, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { Avatar, Input, Button } from 'react-native-elements'
import Loading from '../../components/Loading'
import { isEmpty, map } from 'lodash'

const widthScreen = Dimensions.get("window").width

export default function Expandir( mensaje ) {
    console.log("estamos en MENSAJE .JS ", mensaje.route.params.mensaje.item)
    
    const [imagenesFrase, setImagenesFrase] = useState(null)
    const [nameMensaje, setNameMensaje] = useState(null)
    const [respuestasFrase, setRespuestasFrase] = useState(null)
    const [mostrarRes, setMostrarRes] = useState(false)

    //navigation.setOptions({ title: "Mensajes Guardados" })
    

    useEffect(() => {
        setImagenesFrase(mensaje.route.params.mensaje.item.imagenes)
        setNameMensaje(mensaje.route.params.mensaje.item.nameMensaje)
    }, [])

    if (!imagenesFrase) {
        return <Loading isVisible={false} text="Cargando..."/>
    }
    if (mensaje.route.params.mensaje.item.nameMensaje === "¿Que comemos hoy?") {
        if(!mostrarRes) {
            setMostrarRes(true)
        setRespuestasFrase([
            {
                _id: "63475912a4a4ff723ff21e56", 
                image: "http://hypatia.fdi.ucm.es/conversor/Pictos/2527", 
                text: "Pizza"
            }, 
            {
                _id: "63475912a4a4ff723ff21e57", 
                image: "http://hypatia.fdi.ucm.es/conversor/Pictos/2419", 
                text: "Hamburguesa"
            }, 
            {
                _id: "63475912a4a4ff723ff21e58", 
                image: "http://hypatia.fdi.ucm.es/conversor/Pictos/8652",
                text: "Pasta"
            }, 
            {   
                _id: "63475912a4a4ff723ff21e59", 
                image: "http://hypatia.fdi.ucm.es/conversor/Pictos/3383", 
                text: "Sandwich"
            }
        ])
        }
        
    }

    return (
        <View style={styles.viewBody}>
            <ScrollView
                nestedScrollEnabled={true}
            >
                <Frase mensaje={imagenesFrase} navigation={nameMensaje}/>
                { mostrarRes ? 
                    <View>
                        <Text style={styles.textOpciones}>Opciones</Text>
                        <Frase mensaje={respuestasFrase} navigation={""}/>
                    </View>
                : <Text></Text> }
            </ScrollView>
        </View>
    )
}

function Frase({ mensaje, navigation }) {
    const imagenesArray = mensaje
    const nameFrase = navigation

    return (
        <View>
            <Text style={styles.titulo}>{nameFrase}</Text>
            <ScrollView
                horizontal
                style={styles.viewImage}
                nestedScrollEnabled={true}
            >
            {
                map(imagenesArray, (imageMensaje, index) => (
                    <View>
                        <Avatar
                        key={index}
                        style={{width: 150, height: 135, borderWidth: 1,
                            borderColor: "black", marginLeft:12}}
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
        height: 200
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 15,
        marginTop: 20
    },
    descripcion: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 8,
        alignSelf:"center"
    },
    textOpciones: {
        color:"#4cb4eb",
        fontWeight: 'bold',
        fontSize: 30,
        lineHeight: 70,
        marginLeft:15,
        marginBottom:-60
        //alignSelf: "center"
    },
})