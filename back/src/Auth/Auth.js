import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCustomToken,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { Navigate } from "react-router-dom";


export const doSignInWithCustomToken = async (auth, token) => {
  return signInWithCustomToken(auth,token);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const doSignOut = () => {
  return auth.signOut();
};
