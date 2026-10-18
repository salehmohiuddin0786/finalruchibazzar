import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const getAuthDomain = () => {
  if (typeof window !== "undefined") {
    const host = window.location.host;
    if (host.includes("ruchibazaar.in")) {
      return host;
    }
  }
  return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ruchibazzar-6eb3b.firebaseapp.com";
};

const firebaseConfig = {
  apiKey: "AIzaSyBxDikQdmx0v8L8oQlBoRSGtfmp0uX4Qt8",
  authDomain: getAuthDomain(),
  projectId: "ruchibazzar-6eb3b",
  storageBucket: "ruchibazzar-6eb3b.firebasestorage.app",
  messagingSenderId: "839794263601",
  appId: "1:839794263601:web:cf8b8ecd690fa866887710",
  measurementId: "G-VQXBXV899F",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
