// LoginPage component (แยกไฟล์)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../Auth";
import config from "../config/config.json";

const LoginPage = ({ onLogin }) => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ state สำหรับโหลด
  const navigate = useNavigate();
  const { updateUserWithToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ เริ่มโหลด

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields.");
      }

      const response = await axios.post(`${config.apiBaseUrl}/users/login`, {
        email,
        password,
      });

      if (response.data.status === "success") {
        await updateUserWithToken(response.data.token);
        navigate("/home");
      } else {
        throw new Error(response.data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false); // ✅ โหลดเสร็จ กลับสู่ปกติ
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue to-white w-full">
      {/* Left side */}
      <div className="w-3/5 flex items-center justify-center text-white p-12">
        <div>
          <h1 className="text-4xl text-center font-bold mb-4">WELCOME</h1>
          <p className="text-lg font-semibold text-center">
            " This is a platform for accessing the automatic barrier gate
            system. Please log in or register to access the automatic barrier
            gate. "
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-2/5 bg-white flex items-center justify-center rounded-2xl">
        <div className="w-5/6 max-w-md">
          <h2 className="text-2xl font-bold mb-3 text-center">LOGIN ACCOUNT</h2>
          <p className="mb-4 text-sm text-gray-600">
            Please log in to gain access. If you don't have an account yet you
            can register below.
          </p>

          {error && (
            <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="block text-gray-700 text-xs font-semibold mb-2">
              Email
            </div>
            <input
              type="text"
              placeholder="Email"
              className="w-full p-2 mb-3 bg-base-200 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={email}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <div className="block text-gray-700 text-xs font-semibold mb-2">
              Password
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 bg-base-200 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center bg-blue text-white font-bold py-2 px-12 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-600 hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "LOGIN"
                )}
              </button>
            </div>
          </form>

          <p className="mt-5 text-center font-semibold text-sm">
            DON'T HAVE AN ACCOUNT?
            <Link
              to="/registerpage"
              className="font-semibold text-blue ml-1 underline"
            >
              SIGN UP
            </Link>
          </p>

          <p className="mt-2 text-center font-semibold text-sm">
            BACK TO
            <Link to="/home" className="font-semibold text-blue ml-1 underline">
              HOME
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
