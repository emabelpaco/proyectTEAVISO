import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { formatPhone } from '../../utils/helpers'

export default function ListFavoritos({ favoritos, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data={favoritos}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(favorito) => (
                    <Favorito favorito={favorito} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Favorito({ favorito, navigation, handleLoadMore }) {
    const { id, images, name, address, description, phone, callingCode } = favorito.item
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
        width: 120,
        height: 120,
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
        width: "75%"
    }
})