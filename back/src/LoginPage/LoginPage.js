// LoginPage component (แยกไฟล์)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../Auth/Auth";
import axios from "axios";
import useAuth from "../Auth";
import config from "../config/config.json";

const LoginPage = ({ onLogin }) => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUserWithToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email || !password) {
        console.log("Missing email or password");
        setError("Please fill in all fields.");
        throw new Error("Please fill in all fields.");
      }
      const response = await axios.post(`${config.apiBaseUrl}/admin/login`, {
        email,
        password,
      });
      console.log(response.data.message)
      setError(response.data.message)
      if (response.data.status === "success") {
        await updateUserWithToken(response.data.token);

        navigate("/home");
      }

    } catch (err) {
      console.error(err.message);
    }finally {
      setLoading(false); // ✅ กลับเป็นสถานะปกติหลังจากเสร็จทุกอย่าง
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-r from-blue-400 via-white to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">
          LOGIN ACCOUNT
        </h2>
        <p className="mb-6 text-sm text-center text-gray-600">
          Please log in to gain access. <br />
          If you don't have an account yet, you can register below.
        </p>

        {error && (
          <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-base-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={email}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-base-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-semibold py-2 rounded-xl transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 hover:scale-105"}
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              {/* daisyUI หรือ tailwind spinner */}
              <svg
                className="w-5 h-5 animate-spin text-white"
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
              <span>Loading...</span>
            </div>
          ) : (
            "LOGIN"
          )}
        </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
