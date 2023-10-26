// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg3Oy2AhAa4EhcpR5xHXe0QNfOCNa5FKA",
  authDomain: "lifelog-a8c23.firebaseapp.com",
  projectId: "lifelog-a8c23",
  storageBucket: "lifelog-a8c23.appspot.com",
  messagingSenderId: "680952578763",
  appId: "1:680952578763:web:a3ba9e6c0770bc4f73514e",
  measurementId: "G-4S3MSGDJVS",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export default auth;
