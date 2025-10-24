import React, { useEffect, useState } from "react";
import { auth} from "../Auth/firebase";
import axios from "axios";
import useAuth from "../Auth";
import config from "../config/config.json"

const GetAllCar = () => {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user,token,updateToken} = useAuth()

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          updateToken(token)
          // console.log(token)
          const response = await axios.get(`${config.apiBaseUrl}/get/allCars`, {});
          
          setCarData(response.data);
        } catch (error) {
          console.error("Error fetching user data from server: ", error);
        } finally {
          setLoading(false); 
        }
      } else {
        setCarData(null); 
        setLoading(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // ตรวจสอบว่ามีข้อมูลผู้ใช้หรือไม่
  if (!carData) {
    return <p>No user data available.</p>;
  }
//  console.log(userData)
//  console.log("1")
  return { carData };
};

export default GetAllCar;
