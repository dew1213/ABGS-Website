//react router dom
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
//page components
import LoginPage from "./LoginPage/LoginPage";
import Main from "./Main";
import RegisterPage from "./LoginPage/RegisterPage";
import Profile from "./UserMainPage/Profile";
import CarInfo from "./UserMainPage/CarInfo";
import RegisterCar from "./UserMainPage/RegisterCar";
import Report from "./Report";
import UserInformationPage from "./ManagerMainPage/UserInformationPage";
import UserRequestPage from "./ManagerMainPage/UserRequestPage";
import VehicleInformation from "./ManagerMainPage/VehicleInformationPage";
import VehicleRegistrationInformation from "./ManagerMainPage/VehicleRegistrationInformationPage";
import Home from "./Home";
// import Logout from "./LoginPage/Logout";
import PrivateRoute from "./Auth/PrivateRoute";
import CheckRole from "./Auth/CheckRole";
import LogoutOnClose from "./LoginPage/Logoutonclose";

// const a = false;
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/registerpage",
    element: <PrivateRoute element={<RegisterPage />} a={true} />,
  },
  {
    path: "/loginpage",
    element: <PrivateRoute element={<LoginPage />} a={true} />,
  },
  {
    path: "/Profile",
    element: <PrivateRoute element={<Profile />} a={false} />,
  },
  {
    path: "/CarInfo",
    element: <PrivateRoute element={<CarInfo />} a={false} />,
  },
  {
    path: "/RegisterCar",
    element: <PrivateRoute element={<RegisterCar />} a={false} />,
  },
  {
    path: "/Report",
    element: <PrivateRoute element={<Report />} a={false} />,
  },
  {
    path: "/UserInformationPage",
    element: <UserInformationPage />,
  },
  {
    path: "/UserRequestPage",
    element: <UserRequestPage />,
  },
  {
    path: "/VehicleInformationPage",
    element: <VehicleInformation />,
  },
  {
    path: "/VehicleRegistrationInformationPage",
    element: <VehicleRegistrationInformation />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  // {
  //   path: "/Logout",
  //   element: <Logout />,
  // },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // a ? (
    <React.StrictMode>
      <LogoutOnClose/>
      <RouterProvider router={router} />
    </React.StrictMode>
  // ) : (
  //   <React.StrictMode>
  //     <RouterProvider router={router} />
  //   </React.StrictMode>
  // )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
