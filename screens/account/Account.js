import React, {useState, useEffect} from "react";
import { StyleSheet } from "react-native";
import { getCurrentUser, isUserLogged} from '../../utils/actions'
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import firebase from 'firebase/compat/app'
import Loading from "../../components/Loading";

export default function Account() {
    const [login, setLogin] = useState(null)

    // firebase.auth().onAuthStateChanged((user) => {
    //     user !== null ? (setLogin(false)) : setLogin(true)
    // })
    useEffect(() => {
        setLogin(isUserLogged)
    }, [])
    
    if (login == null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return login ? <UserLogged/> : <UserGuest/>
}

const styles = StyleSheet.create({})