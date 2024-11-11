// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_ABI_KEY,
  authDomain: "taskmanager-42687.firebaseapp.com",
  projectId: "taskmanager-42687",
  storageBucket: "taskmanager-42687.appspot.com",
  messagingSenderId: "36806657269",
  appId: "1:36806657269:web:4914285325e2da0f4eb1bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);