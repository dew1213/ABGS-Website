import { useState, useEffect } from 'react';
import { auth } from './firebase'; // import signInWithCustomToken
import { onAuthStateChanged } from 'firebase/auth';
import { doSignInWithCustomToken } from './Auth';

const useAuth = () => {
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [token, setToken] = useState(null); // เก็บข้อมูลtoken
  const [loading, setLoading] = useState(true); // แสดงสถานะการโหลดข้อมูล

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // หยุดการโหลดข้อมูลเมื่อได้ผู้ใช้
    });

    return () => unsubscribe(); // cleanup subscription เมื่อ component ถูก unmount
  }, []);

  // ฟังก์ชันอัปเดตผู้ใช้ด้วย custom token
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
    setUser(newUser); // ฟังก์ชันนี้ยังคงใช้เพื่ออัปเดตข้อมูลผู้ใช้ทั่วไปได้
  };
  const updateToken = (newToken) =>{
    setToken(newToken);
  }

  return {
    user,           // ข้อมูลผู้ใช้ที่ล็อกอิน
    token,
    loading,        // สถานะการโหลดข้อมูล
    updateUser,     // ฟังก์ชันอัปเดตผู้ใช้ทั่วไป
    updateToken,
    updateUserWithToken, // ฟังก์ชันอัปเดตผู้ใช้ด้วย token

  };
};

export default useAuth;