import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Auth";
import { doSignOut } from "../Auth/Auth";
import UserProfile from "../Database/Profiledb";
function Navbar() {
  const scrollToTop = () => {
    const scrollStep = -window.scrollY / (1000 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
    navigate("/");
  };
  const { userData } = UserProfile();
  const navigate = useNavigate();
  const { token, user, updateUser, updateToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = () => {
    doSignOut() // ฟังก์ชันสำหรับ sign out ผู้ใช้
      .then(() => {
        setIsOpen(false); // ปิดเมนูหรือ modal ที่เปิดอยู่ (ถ้ามี)
        updateUser(null);
        updateToken(null);
        localStorage.removeItem("logoutTime");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  return (
    <div className="navbar bg-blue-600 text-white sticky top-0 z-50 shadow-md px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* ส่วนซ้าย - LOGO */}
        <div className="flex-1">
          <div className="text-2xl font-semibold tracking-wide">
            <Link to="/">Back End Office</Link>
          </div>
        </div>

        {/* ส่วนกลาง - เมนู Allcar / Alluser */}
        {user && (
          <div className="flex-1 flex justify-center space-x-8">
            <Link
              to="/Allcar"
              className="text-white hover:text-gray-200 text-lg transition duration-150"
            >
              Allcar
            </Link>
            <Link
              to="/Alluser"
              className="text-white hover:text-gray-200 text-lg transition duration-150"
            >
              Alluser
            </Link>
          </div>
        )}

        {/* ส่วนขวา - User info / Login / Logout */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          {user ? (
            <>
              {userData ? (
                <p className="font-medium text-sm bg-blue-800 px-3 py-1 rounded-full">
                  {userData.name} {userData.surname}
                </p>
              ) : (
                <p className="italic text-sm text-gray-200">Loading...</p>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md text-sm transition duration-200"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <button
              onClick={scrollToTop}
              className="bg-white text-blue-600 hover:bg-gray-100 py-1 px-4 rounded-md text-sm transition duration-200"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
