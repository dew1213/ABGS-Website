// LoginPage component (แยกไฟล์)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../Auth/Auth";
import axios from "axios";
import useAuth from "../Auth";
import config from "../config/config.json"

const LoginPage = ({ onLogin }) => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUserWithToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email && password === "") {
        throw new Error("please fill in all fields.");
      }
      // const response = await axios.post("/users/login", { email, password });
      const response = await axios.post(`${config.apiBaseUrl}/users/login`, { email, password });
      if (response.data.status === "success") {
        await updateUserWithToken(response.data.token);

        // console.log("response data", response.data);

        // const userCredential = await doSignInWithEmailAndPassword(email, password);
        // const user = userCredential.user;
        // updateUser(user);
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
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
          <p className="mb-4">
            Please log in to gain access. If you don't have an account yet you
            can register below
          </p>
          {error && <p className="text-red mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="block text-gray-700 text-xs font-semibold mb-2">
              Email
            </div>
            <input
              type="text"
              placeholder="Email"
              className="w-full p-1 mb-1 bg-base-200 rounded-lg"
              value={email}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="block text-gray-700 text-xs font-semibold mb-2">
              Password
            </div>
            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full p-1 mb-1 bg-base-200 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <div className="flex justify-between items-center mb-6 text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                />
                <span>KEEP ME SIGNED IN</span>
              </label>
              <Link to="/forgot-password" className="text-black">
                FORGET YOUR PASSWORD
              </Link>
            </div> */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-blue hover:bg-blue text-white font-bold py-2 px-12 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
              >
                LOGIN
              </button>
            </div>
          </form>
          <p className="mt-5 text-center font-semibold text-sm">
            DON'T HAVE AN ACCOUNT
            <Link
              to="/registerpage"
              className="font-semibold text-blue ml-1 underline"
            >
              SIGN UP
            </Link>
          </p>
          <p className="mt-2 text-center font-semibold text-sm">
            BACK TO 
            <Link
              to="/home"
              className="font-semibold text-blue ml-1 underline"
            >
              HOME
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
