// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdGVoZNRZn0UkMiux2GJJpSN7bCFwu6Os",
  authDomain: "agritech-c2663.firebaseapp.com",
  projectId: "agritech-c2663",
  storageBucket: "agritech-c2663.appspot.com",
  messagingSenderId: "210715474160",
  appId: "1:210715474160:web:aa831852255ac2ea8c2a35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app)
const fireStorage = getStorage(app);
export {fireDB,auth,fireStorage } 