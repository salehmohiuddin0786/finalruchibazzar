import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxDikQdmx0v8L8oQlBoRSGtfmp0uX4Qt8",
  authDomain: "ruchibazzar-6eb3b.firebaseapp.com",
  projectId: "ruchibazzar-6eb3b",
  storageBucket: "ruchibazzar-6eb3b.firebasestorage.app",
  messagingSenderId: "839794263601",
  appId: "1:839794263601:web:cf8b8ecd690fa866887710",
  measurementId: "G-VQXBXV899F",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
