import Content from "./UserMainPage/Content.js";
import Navbar from "./UserMainPage/Navbar/Navbar.js";
import Footer from "./UserMainPage/Footer/Footer.js";
import { auth } from "./Auth/firebase.js";
import { useNavigate } from "react-router-dom";
import useAuth from "./Auth/index.js";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <>
      {/* <div>
        {user ? (
          <>
            <p>Email: {user.email}</p>
            <p>User: {user.uid}</p>
          </>
        ) : (
          <p>No user is logged in</p>
        )}
      </div> */}
      <Navbar />
      <Content />
      <Footer />
    </>
  );
}
