// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//import firestore
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSNbXB_OKKcf4uwZ2gpLxx8UWarU67buw",
  authDomain: "student-map-a56a7.firebaseapp.com",
  projectId: "student-map-a56a7",
  storageBucket: "student-map-a56a7.appspot.com",
  messagingSenderId: "740998282445",
  appId: "1:740998282445:web:69e5a092147df60f963d84",
  measurementId: "G-9EBY3W58N5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();
export const ssr = false;
