import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'

export default function ListMensajes({ mensajes, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data={mensajes}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(mensaje) => (
                    <Mensaje mensaje={mensaje} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Mensaje({ mensaje, navigation, handleLoadMore }) {
    const imagenCategoria = mensaje.item.imageCategoria
    const primeraFrase = mensaje.item.mensajes[0].nameMensaje
    const segundaFrase = mensaje.item.mensajes[1].nameMensaje

    const goFrases = () => {
        var param = mensaje.item
        navigation.navigate("frases", { param })  // con parametros el id y el nombre de categoria
    } 

    return (
        <TouchableOpacity onPress={goFrases}>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imagenCategoria }}
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantTitle}>{mensaje.item.nameCategoria}</Text>
                    <Text style={styles.restaurantInformation}>
                        {
                            size(primeraFrase) > 20
                                ? `${primeraFrase.substr(0, 20)}...`
                                : primeraFrase
                        }
                    </Text>
                    <Text style={styles.restaurantDescription}>
                        {
                            size(segundaFrase) > 20
                                ? `${segundaFrase.substr(0, 20)}...`
                                : segundaFrase
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewRestaurant: {
        flexDirection: "row",
        margin: 10
    },
    viewRestaurantImage: {
        marginRight: 15
    },
    imageRestaurant: {
        width: 150,
        height: 150,
        borderWidth: 4,
        borderColor: "#d9d9d9"
    },
    restaurantTitle: {
        fontWeight: "bold",
        fontSize: 27,
    },
    restaurantInformation: {
        paddingTop: 2,
        color: "grey",
        fontSize: 20
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: "90%"
    }
})