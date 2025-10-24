import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './index'; // นำเข้า useAuth hook เพื่อตรวจสอบสถานะผู้ใช้

const PrivateRoute = ({ element,a}) => {

  const {user} = useAuth(); // ใช้ custom hook เพื่อเช็คสถานะผู้ใช้
  const [valueA,setValueA] = useState(null)
  
  useEffect(() => {
    setValueA(a);
  }, [a]);
 
  if (user && valueA === true) {
    return <Navigate to="/home" replace />;
  }else if(user === null && valueA ===false){
    return <Navigate to="/loginpage" replace />;
  }

  return element;
};
export default PrivateRoute;

