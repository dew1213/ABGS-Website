import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./UserMainPage/Navbar/Navbar";
import Footer from "./UserMainPage/Footer/Footer";

const Report = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    province: "",
    brand: "",
    color: "",
    licensePlate: "",
    driverLicense: "",
    role: "",
    input: "", // Added input field to formData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-4 bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">REPORT</h1>
        <label
          htmlFor="role"
          className="block text-lg font-semibold text-gray-700"
        >
          SELECT TOPIC :
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="bg-base-200 mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">-- เลือกหัวข้อ --</option>
          <option value="option1">หัวข้อ 1</option>
          <option value="option2">หัวข้อ 2</option>
          <option value="option3">หัวข้อ 3</option>
        </select>
        <label
          htmlFor="input"
          className="block text-lg font-semibold text-gray-700 mt-4 "
        >
          DETAIL :
        </label>
        <textarea
          id="input"
          name="input"
          value={formData.input}
          onChange={handleInput}
          className="w-full px-4 mt-2 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Send a message"
          rows="1"
        />
      </div>
      <div className="flex justify-center p-8">
        <Link
          to="/"
          className="bg-blue hover:bg-blue text-white font-bold py-2 px-12 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          CONFIRM
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default Report;
