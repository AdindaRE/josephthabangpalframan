// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD3uXI8C-3-fmwryTvpB61s8o8ngM6wfNk",
    authDomain: "josephthabangpalframan-80d05.firebaseapp.com",
    projectId: "josephthabangpalframan-80d05",
    storageBucket: "josephthabangpalframan-80d05.appspot.com",
    messagingSenderId: "322604399985",
    appId: "1:322604399985:web:dbfa673a90b2f164094ad0",
    measurementId: "G-ZH530D6GFC"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };