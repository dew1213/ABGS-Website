import React from "react";
import { Link } from "react-router-dom";
import mailIcon from "./Images/mail.png";
import AddressBook from "./Images/address-book.png";
import AngleSmall from "./Images/angle-small-right.png";
import TruckSide from "./Images/truck-side.png";
import CarLogo from "./Images/Car-brg.png";

const Menubar = () => {
  return (
    <div className="h-screen w-54 bg-gradient-to-t from-[#DAE5FF] via-[#DAE5FF] via-5% to-[#5F8BF1] to-25% p-5 rounded-r-2xl">
      <div className="flex flex-col items-center space-y-2 mb-4">
        <div className="p-2 rounded-full">
          <img src={CarLogo} alt="Email Icon" width={100} height={100} />
        </div>
        <p className="text-lg font-bold text-white">ABGS ADMIN</p>
      </div>

      <div className="border-b border-white mb-2"></div>
      <ul className="space-y-2">
        <li className="text-white text-sm font-semibold">
          User Data Management
        </li>

        <Link to="/UserRequestPage">
          <li className="flex items-center justify-between p-2 hover:bg-blue rounded-md mt-2">
            <div className="flex items-center space-x-3">
              <img src={mailIcon} alt="Email Icon" width={24} height={24} />
              <span className="text-white text-xs">User Requests</span>
            </div>
            <img src={AngleSmall} alt="Expand Icon" width={16} height={16} />
          </li>
        </Link>

        <Link to="/UserInformationPage">
          <li className="flex items-center justify-between p-2 hover:bg-blue rounded-md ">
            <div className="flex items-center space-x-3">
              <img
                src={AddressBook}
                alt="Address Book Icon"
                width={24}
                height={24}
              />
              <span className="text-white text-xs">User Information</span>
            </div>
            <img src={AngleSmall} alt="Expand Icon" width={16} height={16} />
          </li>
        </Link>

        <div className="border-b border-white my-2"></div>

        <li className="text-white text-sm font-semibold">
          Vehicle Data Management
        </li>

        <Link to="/VehicleRegistrationInformationPage">
          <li className="flex items-center justify-between p-2 hover:bg-blue rounded-md mt-2">
            <div className="flex items-center space-x-3">
              <img src={mailIcon} alt="Mail Icon" width={24} height={24} />
              <span className="text-white text-xs">
                Vehicle Registration Information
              </span>
              <img src={AngleSmall} alt="Expand Icon" width={16} height={16} />
            </div>
          </li>
        </Link>

        <Link to="/VehicleInformationPage">
          <li className="flex items-center justify-between p-2 hover:bg-blue rounded-md">
            <div className="flex items-center space-x-3">
              <img src={TruckSide} alt="Truck Icon" width={24} height={24} />
              <span className="text-white text-xs">Vehicle Information</span>
            </div>
            <img src={AngleSmall} alt="Expand Icon" width={16} height={16} />
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Menubar;
