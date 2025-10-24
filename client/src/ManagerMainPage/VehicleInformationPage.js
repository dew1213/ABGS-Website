import React from "react";
import Menubar from "./Menubar";

const VehicleInformationPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Menubar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Vehicle Information
          </h1>
          <div className="flex-none flex items-center space-x-4">
            <p className="btn btn-ghost text-gray text-lg">SOMRAK JAIDEE</p>
            <button className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Avatar"
                />
              </div>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 h-[calc(100vh-12rem)]">
          {/* Content goes here */}
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          Copyright © 2024 Automaticthai .CO All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default VehicleInformationPage;
