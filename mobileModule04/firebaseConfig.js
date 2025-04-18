import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC7VQ8nneRL_SbzcW_f3ARJ4nV1JcxVSE4",
    authDomain: "diary-app-b675f.firebaseapp.com",
    projectId: "diary-app-b675f",
    storageBucket: "diary-app-b675f.firebasestorage.app",
    messagingSenderId: "360515663074",
    appId: "1:360515663074:web:b07c2474da223c881f1abb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);