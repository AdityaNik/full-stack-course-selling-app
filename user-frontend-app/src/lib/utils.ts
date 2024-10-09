import { clsx, type ClassValue } from "clsx"
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



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