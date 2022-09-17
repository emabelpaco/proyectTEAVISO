import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore' 
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC9dUZ47KI8EvhQhwxCWWURgsp-2DVG8DY",
    authDomain: "proyectteaviso.firebaseapp.com",
    projectId: "proyectteaviso",
    storageBucket: "proyectteaviso.appspot.com",
    messagingSenderId: "369162298253",
    appId: "1:369162298253:web:e3648e56ea7bc368c493c4",
    measurementId: "G-PTE1SMRBXQ"
};
  
  // Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const db = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
});

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}