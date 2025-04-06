import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG) as FirebaseOptions

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);