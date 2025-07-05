// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth }        from "firebase/auth";
import { getFirestore }   from "firebase/firestore";

const firebaseConfig = {
  apiKey:             "AIzaSyCIx6n0zJN6uz5_B1C0BTsLDRsRYuKfxi8",
  authDomain:         "tarea-realizada.firebaseapp.com",
  projectId:          "tarea-realizada",
  storageBucket:      "tarea-realizada.appspot.com",
  messagingSenderId:  "1017744993947",
  appId:              "1:1017744993947:web:9e0d98972b688f799f603e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
