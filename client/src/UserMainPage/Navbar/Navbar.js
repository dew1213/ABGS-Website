import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut } from "../../Auth/Auth";

import useAuth from "../../Auth";
import UserProfile from "../../Database/Profiledb";
// import { useUser } from "../../Auth/userContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    const scrollStep = -window.scrollY / (1000 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };
  const { userData } = UserProfile();
  const { token,user,updateUser,updateToken } = useAuth();
  
  const navigate = useNavigate();

  const handleLogout = () => {
    doSignOut() // ฟังก์ชันสำหรับ sign out ผู้ใช้
      .then(() => {
        setIsOpen(false); // ปิดเมนูหรือ modal ที่เปิดอยู่ (ถ้ามี)
        updateUser(null)
        updateToken(null)
        localStorage.removeItem('logoutTime'); 
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  // const { user } = useUser();

  return (
    <>
      <div className="navbar bg-blue sticky top-0 z-50 shadow-md">
        <div className="flex-1">
          <Link
            to="/home"
            className="btn btn-ghost text-white text-xl"
            onClick={scrollToTop}
          >
            AUTOMATIC BARRIER GATE SYSTEM
          </Link>
        </div>

        {/* <Logout /> */}

        {user ? (
          <div className="flex-none flex items-center space-x-4">
            {userData ? (
              <Link to="/Profile" className="btn btn-ghost text-white text-xl">
                 {userData.name}  {userData.surname}
              </Link>
            ) : (
              <Link to="/Profile" className="btn btn-ghost text-white text-xl">
                loading....
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Avatar"
                />
              </div>
            </button>
          </div>
        ) : (
          <div className="flex-none flex items-center space-x-4">
            <Link
              to="/loginpage"
              className="btn btn-ghost text-white text-xl"
              onClick={scrollToTop}
            >
              Login
            </Link>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-grow">
            <ul className="p-4 space-y-2">
              <li>
                <Link
                  to="/Profile"
                  className="block py-2 px-4 hover:bg-gray-100 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  MY PROFILE
                </Link>
              </li>
              <div className="border-b"></div>
              <li>
                <Link
                  to="/CarInfo"
                  className="block py-2 px-4 hover:bg-gray-100 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  MY CAR
                </Link>
              </li>
              <div className="border-b"></div>
              <li>
                <Link
                  to="/RegisterCar"
                  className="block py-2 px-4 hover:bg-gray-100 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  REGISTER
                </Link>
              </li>
              {/* <div className="border-b"></div> */}
              {/* <li>
                <Link
                  to="/Report"
                  className="block py-2 px-4 hover:bg-gray-100 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  REPORT
                </Link>
              </li> */}
              <div className="border-b"></div>
              <li>
                <Link
                  to="/"
                  className="block py-2 px-4 hover:bg-gray-100 text-center"
                  onClick={handleLogout}
                >
                  LOGOUT
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
