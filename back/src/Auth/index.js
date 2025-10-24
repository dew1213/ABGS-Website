import { useState, useEffect } from 'react';
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doSignInWithCustomToken } from './Auth';

const useAuth = () => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);


  const updateUserWithToken = async (token) => {
    try {
      const result = await doSignInWithCustomToken(auth, token);
      setUser(result.user); 
      setToken(result.token);
    } catch (error) {
      console.error('Error logging in with custom token:', error);
    }
  };

  const updateUser = (newUser) => { 
    setUser(newUser); 
  };
  const updateToken = (newToken) =>{
    setToken(newToken);
  }

  return {
    user,          
    token,
    loading,        
    updateUser,     
    updateToken,
    updateUserWithToken,

  };
};

export default useAuth;