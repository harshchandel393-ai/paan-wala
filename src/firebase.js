import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBsXwYSylA1qmLSvVrlQyHpd_eFHoqTz7A",
  authDomain: "paan-wala-6730f.firebaseapp.com",
  databaseURL:
    "https://paan-wala-6730f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "paan-wala-6730f",
  storageBucket: "paan-wala-6730f.firebasestorage.app",
  messagingSenderId: "137256056216",
  appId: "1:137256056216:web:24959fe406151b14e227ed",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);