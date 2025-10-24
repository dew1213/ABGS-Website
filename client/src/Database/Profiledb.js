import React, { useEffect, useState } from "react";
import { auth} from "../Auth/firebase";
import axios from "axios";
import useAuth from "../Auth";
import config from "../config/config.json"

const UserProfile = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user,token,updateToken} = useAuth()

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          updateToken(token)
          // console.log(token)
          const response = await axios.get(`${config.apiBaseUrl}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`, // ส่ง token ใน headers
            },
          });
          
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data from server: ", error);
        } finally {
          setLoading(false); // หยุดการโหลด
        }
      } else {
        setUserData(null); // ถ้าไม่ได้ล็อกอิน ให้เคลียร์ข้อมูล
        setLoading(false); // หยุดการโหลด
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // ตรวจสอบว่ามีข้อมูลผู้ใช้หรือไม่
  if (!userData) {
    return <p>No user data available.</p>;
  }
//  console.log(userData)
//  console.log("1")
  return { userData };
};

export default UserProfile;
