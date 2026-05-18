// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU3R9sJiNuZiD8yBu7FIg1lfy9kg3zRUc",
  authDomain: "next-commerce-9e142.firebaseapp.com",
  projectId: "next-commerce-9e142",
  storageBucket: "next-commerce-9e142.firebasestorage.app",
  messagingSenderId: "321128604938",
  appId: "1:321128604938:web:b69156629eb50c93d146f3",
  measurementId: "G-YPE4RJ578W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);