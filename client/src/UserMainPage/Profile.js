import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import UserProfile from "../Database/Profiledb";

const Profile = () => {
  const {userData} = UserProfile();

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-8 bg-white ">
        <h1 className="text-3xl font-bold text-center mb-4">PROFILE</h1>

        <div className="flex justify-center mb-6">
          <div className="w-40 h-40 overflow-hidden rounded-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              NAME
            </label>
            <input
              type="text"
              value={userData ? userData.name : "Loading..."}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-base-200  border-gray-300 rounded-md shadow-sm focus:outline-none "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SURNAME
            </label>
            <input
              type="text"
              value={userData ? userData.surname : "Loading..."}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-base-200  border-gray-300 rounded-md shadow-sm focus:outline-none "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              TEL
            </label>
            <input
              type="text"
              value={userData ? userData.telephone : "Loading..."}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-base-200  border-gray-300 rounded-md shadow-sm focus:outline-none "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              EMAIL
            </label>
            <input
              type="email"
              value={userData ? userData.email : "Loading..."}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-base-200  border-gray-300 rounded-md shadow-sm focus:outline-none "
            />
          </div>
        </div>

        <div className="flex justify-center ">
          <Link
            to="/"
            className="bg-blue hover:bg-blue text-white font-bold py-2 px-12 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            CONFIRM
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
