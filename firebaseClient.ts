import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAcLj4WQrgjAW2cGhwBg705_ErQUD0QUUY",
    authDomain: "book-app-f302f.firebaseapp.com",
    projectId: "book-app-f302f",
    storageBucket: "book-app-f302f.appspot.com",
    messagingSenderId: "296802698514",
    appId: "1:296802698514:web:148bcf847bfe116d49dfcb",
    measurementId: "G-76PX6D7FRT"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export function getApp() {
    if (getApps().length === 0) {
        return initializeApp(firebaseConfig);
    }
    else {
        return getApps()[0];
    }
}
 const db = getFirestore(app);

export { app, auth , db };