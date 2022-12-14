import React, {useState, useEffect, useCallback} from "react";
import { StyleSheet } from "react-native";
import { getCurrentUser, isUserLogged } from '../../utils/actions'
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import firebase from 'firebase/compat/app'
import Loading from "../../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import Login from "./Login";

export default function Account() {
    const [login, setLogin] = useState(null)

    // firebase.auth().onAuthStateChanged((user) => {
    //     user !== null ? (setLogin(false)) : setLogin(true)
    // })

    useFocusEffect(
        useCallback(() => {
            const user = getCurrentUser()
            user ? setLogin(true) : setLogin(false)
        }, [])
    )

    if (login == null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return login ? <UserLogged/> : <UserGuest/>
    //return login ? <UserLogged/> : <Login/>
}

const styles = StyleSheet.create({})