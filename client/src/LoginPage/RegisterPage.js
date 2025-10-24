import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../Auth";
import { auth } from "../Auth/firebase";
import config from "../config/config.json";

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    telephone: "",
    password: "",
  });
  const { updateUserWithToken } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const isFormEmpty = () => {
    return Object.values(formData).some((value) => value === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      const regex = /^[0-9]+$/;
      if (isFormEmpty()) {
        setIsSubmitting(false)
        throw new Error("please fill in all fields.");
      } else if (!regex.test(formData.telephone)) {
        setIsSubmitting(false)
        throw new Error("Please enter your number");
      } else if (formData.password.length < 6) {
        setIsSubmitting(false)
        throw new Error(
          "The password must be a string with at least 6 characters."
        );
      }
      // else{
      //   throw new Error('')
      // }

      // const response = await axios.post("/users/register", { formData });
      const response = await axios.post(`${config.apiBaseUrl}/users/register`, { formData });
      if (response.data.status === "success") {
        // console.log(response.data.uid)
        // console.log(response.data.token)
        // console.log(response.data.email)

        await updateUserWithToken(response.data.token);
        // updateUser({
        //   uid: response.data.uid,
        //   token: response.data.token,
        //   email: formData.email,
        // });
        navigate("/home");
      }
      // const user = userCredential.user;

      // updateUser(user);
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-r from-blue to-white w-full">
        {/* Left Section */}
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

        {/* Right Section */}
        <div className="w-2/5 bg-white flex items-center justify-center rounded-l-2xl">
          <div className="w-6/6 max-w-sm">
            <h2 className="text-2xl font-bold mb-3 text-center">SIGN UP</h2>
            {error && <p className="text-red mb-4">{error}</p>}
            <form className="w-full max-w-md" onSubmit={handleSubmit}>
              {Object.entries(formData).map(([key, value]) => (
                <div className="mb-1" key={key}>
                  <label
                    className="block text-gray-700 text-xs font-semibold mb-2"
                    htmlFor={key}
                  >
                    {key.toUpperCase()}
                  </label>
                  <input
                    className="w-full p-1 mb-1 bg-base-200 rounded-lg"
                    id={key}
                    type={
                      key === "password"
                        ? "password"
                        : key === "email"
                        ? "email"
                        : "text"
                    }
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    onChange={handleInputChange}
                    maxLength={
                      key === "telephone"
                      ? 10
                      :""
                    }
                  />
                </div>
              ))}

              <div className="mt-3 text-center text-xs">
                <label className="flex items-center justify-center">
                  {/* <input
                  type="checkbox"
                  className="mr-2"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                /> */}

                  <span className="font-semibold">
                    ---------------------------------------------------------------------------
                    {/* BY SIGNING UP I AGREE WITH{" "} */}
                    <span className="font-semibold text-blue underline">
                      {/* TERMS & CONDITIONS */}
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-center mt-2 ">
                <button
                  className="bg-blue hover:bg-blue-600 text-white font-bold py-2 px-12 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                  type="submit"
                  disabled={isSubmitting}
                >
                  SIGN UP
                </button>
              </div>
            </form>
            <p className="mt-5 text-center font-semibold text-sm">
              ALREADY HAVE AN ACCOUNT ? {"   "}
              <Link
                to={"/loginpage"}
                className="font-semibold text-blue ml-1 underline"
              >
                CONTINUE
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
    </>
  );
};

export default RegisterPage;
