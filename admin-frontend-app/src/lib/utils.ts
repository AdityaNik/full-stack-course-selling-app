import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsLieje7ksXOKFj4clUTy5m7uQdi87o_8",
  authDomain: "course-selling-web-app.firebaseapp.com",
  projectId: "course-selling-web-app",
  storageBucket: "course-selling-web-app.appspot.com",
  messagingSenderId: "379515229817",
  appId: "1:379515229817:web:1d7035607d9b35ca08e6a8",
  measurementId: "G-J5KD8TV7ZK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);