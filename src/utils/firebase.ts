// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDakDaZ40S_yjFHFfQgglzwCyhIO0mwmwA",
  authDomain: "kindreach-badminton.firebaseapp.com",
  projectId: "kindreach-badminton",
  storageBucket: "kindreach-badminton.firebasestorage.app",
  messagingSenderId: "967790718493",
  appId: "1:967790718493:web:7f1e256f8065c05f95e0f4",
  measurementId: "G-FVGD6BCRMG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const apiPrefix = "http://127.0.0.1:5008/kindreach-badminton/us-central1/adminAPIServer/admin";
// export const apiPrefix = "https://adminapiserver-i4siavjroa-uc.a.run.app/admin";

