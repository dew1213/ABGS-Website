import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Home from "../src/Page/Home";
import LoginPage from "./LoginPage/LoginPage"
import LogoutOnClose from "./LoginPage/Logoutonclose";
import PrivateRoute from "./Auth/PrivateRoute";
import Allcar from "./Content/Allcar";
import Alluser from "./Content/Alluser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute element={<LoginPage />} a={true} />,
  },
  {
    path: "/home",
    element: <PrivateRoute element={ <Home />} a = {false}/>,
  },
  {
    path: "/Allcar",
    element: <PrivateRoute element={ <Allcar />} a = {false}/>,
  },
  {
    path: "/Alluser",
    element: <PrivateRoute element={ <Alluser />} a = {false}/>,
  },
]);
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
      <LogoutOnClose/>
      <RouterProvider router={router} />
    </React.StrictMode>
);

reportWebVitals();
