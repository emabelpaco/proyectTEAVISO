import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore' 

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