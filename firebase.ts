import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your actual configuration
const firebaseConfig = {
  apiKey: "AIzaSyADwIjQ47UDiFC7CS0QJ8liifT8FZBkg8s",
  authDomain: "trainacademy.firebaseapp.com",
  projectId: "trainacademy",
  storageBucket: "trainacademy.firebasestorage.app",
  messagingSenderId: "496275167687",
  appId: "1:496275167687:web:033793619269cc8334e1e2",
  measurementId: "G-6B5F8WF0Q0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
