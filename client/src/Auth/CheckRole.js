import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./index"; // นำเข้า useAuth hook เพื่อตรวจสอบสถานะผู้ใช้
import axios from "axios";
import config from "../config/config.json"

const CheckRole = ({ a }) => {
  const { user } = useAuth(); // ใช้ custom hook เพื่อเช็คสถานะผู้ใช้
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (user) {
          const response = await axios.get(`${config.apiBaseUrl}/users/checkRole`, {
            params: { userId: user.uid }, // ส่ง userId เป็น query parameter
          });
          setRole(response.data.role); // ตั้งค่า Role ที่ได้รับจาก API
        }
      } catch (error) {
        console.error(
          "Error checking role:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsLoading(false); // หยุดการโหลดเมื่อดึงข้อมูลเสร็จสิ้น
      }
    };

    fetchUserRole(); // เรียกใช้ฟังก์ชันดึงข้อมูล Role ของผู้ใช้
  }, [user]);

  if (isLoading) {
    return <p>Loading...</p>; // แสดงสถานะการโหลด
  }

  // ตรวจสอบเงื่อนไขเพิ่มเติมจาก props
  if (role === a) {
    return <Navigate to="/UserInformationPage" replace />;
  }

  // ถ้าไม่มีปัญหาอะไร ให้ render หน้า Profile ปกติ
  return null;
};

export default CheckRole;
