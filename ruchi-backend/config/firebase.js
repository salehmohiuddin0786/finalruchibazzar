// firebase.js - CommonJS config
let app = null;
let auth = null;

try {
  const { initializeApp } = require("firebase/app");
  const { getAuth } = require("firebase/auth");

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_WEB_API_KEY || "AIzaSyAZeybPt8XoRcN7YkJZazyddWrLPBBMRmI",
    authDomain: "ruchibazzar.firebaseapp.com",
    projectId: "ruchibazzar",
    storageBucket: "ruchibazzar.firebasestorage.app",
    messagingSenderId: "893358907512",
    appId: "1:893358907512:web:3df5973b3f54dfb2220d8d"
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  // Firebase client SDK is optional on backend as auth uses identitytoolkit REST API
}

module.exports = { app, auth };