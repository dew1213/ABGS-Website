import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import MyCar from "../Database/MyCar";
import UserProfile from "../Database/Profiledb";

const CarInfo = () => {
  const { userData2 } = MyCar();
  const { userData } = UserProfile();

  return (
    <>
      <Navbar />
      <div className="max-w-full mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-4">MY CAR</h1>
        {userData2 ? (
          userData2.length > 0 ? (
            userData2.map((car, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-xl shadow-xl p-6 mb-4 text-center w-full h-auto mx-auto"
              >
                <table className="table-fixed w-full">
                  <thead className="w-full text-sm font-semibold items-center">
                    <tr>
                      <th className="px-2 whitespace-nowrap text-center">
                        PERMISSION
                      </th>
                      <th className="px-2 whitespace-nowrap text-center">
                        LICENSE PLATE
                      </th>
                      <th className="px-2 whitespace-nowrap text-center">
                        PROVINCE
                      </th>
                      <th className="px-2 whitespace-nowrap text-center">
                        BRAND
                      </th>
                      <th className="px-2 whitespace-nowrap text-center">
                        COLOR
                      </th>
                      <th className="px-2 whitespace-nowrap text-center">
                        DATE
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="space-x-4">
                      <td className="px-2 text-center">
                        {car ? (
                          <div className="flex items-center justify-center">
                            <span
                              className={`ml-2 text-xs font-medium ${
                                car.status === "1"
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {car.status === "1"
                                ? "สามารถเข้าใช้งานได้"
                                : "ไม่สามารถเข้าใช้งานได้"}
                            </span>
                          </div>
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td className="px-2 text-center">
                        {car ? car.licensePlate : "Loading..."}
                      </td>
                      <td className="px-2 text-center">
                        {car ? car.province : "Loading..."}
                      </td>
                      <td className="px-2 text-center">
                        {car ? car.brand : "Loading..."}
                      </td>
                      <td className="px-2 text-center">
                        {car ? car.color : "Loading..."}
                      </td>
                      <td className="px-2 text-center">
                        {car ? car.dateExpire : "Loading..."}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-center p-4">ไม่พบข้อมูลรถ</div>
          )
        ) : (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">กำลังโหลดข้อมูล...</span>
          </div>
        )}
        <div className="flex justify-center p-4">
          <Link
            to="/"
            className="bg-blue hover:bg-blue text-white font-bold py-2 px-12 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            BACK
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CarInfo;
