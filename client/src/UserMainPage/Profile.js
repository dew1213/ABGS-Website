import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import UserProfile from "../Database/Profiledb";
import axios from "axios";
import config from "../config/config.json";

const Profile = () => {
  const { userData: initialUserData } = UserProfile();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    uid: "",
    name: "",
    surname: "",
    telephone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialUserData) {
      setUserData(initialUserData);
      setLoading(false);
    }
  }, [initialUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};
    Object.keys(userData).forEach((key) => {
      const value = String(userData[key] || "").trim();

      if (!value) {
        newErrors[key] = "กรุณากรอกข้อมูลให้ครบถ้วน";
      } else if (key === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors[key] = "กรุณากรอกอีเมลให้ถูกต้อง";
        }
      } else if (key === "telephone") {
        const telPattern = /^[0-9]{9,10}$/;
        if (!telPattern.test(value)) {
          newErrors[key] = "กรุณากรอกเบอร์โทรเป็นตัวเลข 9-10 หลัก";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post(`${config.apiBaseUrl}/users/updatebyuser`, {
        uid: userData.uid,
        name: userData.name,
        surname: userData.surname,
        telephone: userData.telephone,
        email: userData.email,
      });

      if (response.data.status === "success") {
        alert(response.data.message);
        navigate("/");
      } else if (response.data.status === "failed") {
        alert(response.data.message);
      } else {
        throw new Error("Please re-check your fields.");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  if (loading) return <div className="text-center mt-10">กำลังโหลดข้อมูล...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">PROFILE</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">NAME</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 bg-base-200 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SURNAME</label>
            <input
              type="text"
              name="surname"
              value={userData.surname}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 bg-base-200 border ${
                errors.surname ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none`}
            />
            {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">TEL</label>
            <input
              type="text"
              name="telephone"
              maxLength={10}
              value={userData.telephone}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 bg-base-200 border ${
                errors.telephone ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none`}
            />
            {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">EMAIL</label>
            <input
              type="email"
              name="email"
              readOnly
              value={userData.email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue hover:bg-blue text-white font-bold py-2 px-12 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            CONFIRM
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
