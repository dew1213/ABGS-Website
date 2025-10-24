import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import useAuth from "../Auth";

const LogoutOnClose = () => {
  const { updateUser, updateToken } = useAuth();
  useEffect(() => {
    const handleBeforeUnload = () => {
      const logoutTime = Date.now() + 10 * 60 * 1000; // กำหนดเวลา logout (10 นาที)
      localStorage.setItem('logoutTime', logoutTime); // เก็บเวลาใน localStorage
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const checkLogoutTime = () => {
      const logoutTime = localStorage.getItem('logoutTime');

      if (logoutTime && Date.now() >= logoutTime) {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            updateUser(null);
            updateToken(null);
            localStorage.removeItem('logoutTime'); // ลบเวลาที่บันทึกไว้หลังจาก logout
          })
          .catch((error) => {
            console.error('Error logging out: ', error);
          });
      }
    };

    // ตรวจสอบทุกๆ ครั้งที่หน้าโหลด
    checkLogoutTime();
  }, []);

  return null;
};

export default LogoutOnClose;
