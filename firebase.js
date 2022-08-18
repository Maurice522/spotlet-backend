// Import the functions you need from the SDKs you need

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW2-kYrd4E7aAgOKfiLtZreEVIN5Wehrs",
  authDomain: "gorecce-5a416.firebaseapp.com",
  projectId: "gorecce-5a416",
  storageBucket: "gorecce-5a416.appspot.com",
  messagingSenderId: "613994545135",
  appId: "1:613994545135:web:c3b3cff7547c0debc2001a",
  measurementId: "G-RE5GGQM60X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = getStorage(app);
