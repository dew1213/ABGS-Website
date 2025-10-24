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



// export const doCreateUserWithEmailAndPassword = async (email, password) => {
//   return createUserWithEmailAndPassword(auth, email, password);
// };

// export const doSignInWithEmailAndPassword = async (email, password) => {
//   return signInWithEmailAndPassword(auth, email, password);
// };

export const doSignInWithCustomToken = async (auth, token) => {
  return signInWithCustomToken(auth,token);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  //result.user
  return result;
};

export const doSignOut = () => {
  return auth.signOut();
};



// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth,email);
// };
// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser,password);
// };

// export const doSendEmailVerification = () =>{
//     return sendEmailVerification(auth.currentUser,{
//         url:`${window.location.origin}/Home`,
//     }
// );
// };
