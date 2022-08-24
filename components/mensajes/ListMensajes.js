import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { formatPhone } from '../../utils/helpers'

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
    const { id, images, name, address, description, phone, callingCode } = mensaje.item
    const imageRestaurant = images[0]

    // const goRestaurtant = () => {
    //     navigation.navigate("restaurant", { id, name })
    // } 

    return (
        // <TouchableOpacity onPress={goRestaurtant}>
            <TouchableOpacity>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imageRestaurant }}
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantTitle}>{name}</Text>
                    <Text style={styles.restaurantInformation}>{address}</Text>
                    {/* <Text style={styles.restaurantInformation}>{formatPhone(callingCode, phone)}</Text> */}
                    <Text style={styles.restaurantDescription}>
                        {
                            size(description) > 0
                                ? `${description.substr(0, 60)}...`
                                : description
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
        width: 90,
        height: 90
    },
    restaurantTitle: {
        fontWeight: "bold",
        fontSize: 25
    },
    restaurantInformation: {
        paddingTop: 2,
        color: "grey",
        fontSize: 20
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: "75%"
    }
})