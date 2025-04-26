// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAe3K9U2okirjQsIL00jvho10fsq5_Etjw",
    authDomain: "interprep-934b0.firebaseapp.com",
    projectId: "interprep-934b0",
    storageBucket: "interprep-934b0.firebasestorage.app",
    messagingSenderId: "194071243293",
    appId: "1:194071243293:web:dfa1347819aaec5dd0b4f4",
    measurementId: "G-SZWTX9P9EP"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export const db = getFirestore(app);