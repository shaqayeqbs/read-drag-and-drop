import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzDuvNd35ujn76w7P-GW3O1kRoTxg35cE",
  authDomain: "orderfood-c0928.firebaseapp.com",
  databaseURL: "https://orderfood-c0928-default-rtdb.firebaseio.com",
  projectId: "orderfood-c0928",
  storageBucket: "orderfood-c0928.firebasestorage.app",
  messagingSenderId: "471513642571",
  appId: "1:471513642571:web:2526accaa58aa61de4ffce",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
