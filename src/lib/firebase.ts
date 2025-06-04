
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from "firebase/analytics"; // Optional: if you need Analytics

const firebaseConfig = {
  apiKey: "AIzaSyCEtciXLXGNf2Il037w_d_TlQUbF0VL01U",
  authDomain: "hygienea-7ae6f.firebaseapp.com",
  projectId: "hygienea-7ae6f",
  storageBucket: "hygienea-7ae6f.firebasestorage.app",
  messagingSenderId: "681110615190",
  appId: "1:681110615190:web:e4c36b8c67c0907577beb7",
  measurementId: "G-QZXFKJK0H5"
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
// let analytics: Analytics; // Optional

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // analytics = getAnalytics(app); // Optional: Initialize Analytics if needed and run on client side
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

export { app, auth, db, storage, firebaseConfig };
