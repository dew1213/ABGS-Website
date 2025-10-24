import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth,signInWithCustomToken } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyBXcxF8-FtStqwYVeJR9dfTU4hvtlBk6xw",
  authDomain: "car-project-ed264.firebaseapp.com",
  projectId: "car-project-ed264",
  storageBucket: "car-project-ed264.appspot.com",
  messagingSenderId: "203650435065",
  appId: "1:203650435065:web:a55cb3c02bda1259a49f28",
  measurementId: "G-QC2C4FXLGD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { analytics, db, auth,signInWithCustomToken };
