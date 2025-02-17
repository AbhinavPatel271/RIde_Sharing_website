import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDzXT_Bf6rhJIUDa2wMVW-zoz41vk5qAM",
  authDomain: "ride-sharing-c67af.firebaseapp.com",
  projectId: "ride-sharing-c67af",
  storageBucket: "ride-sharing-c67af.firebasestorage.app",
  messagingSenderId: "754888268269",
  appId: "1:754888268269:web:09557c4a06300d9057efe4",
  measurementId: "G-YH9HJ1TSVL",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
export default auth;
