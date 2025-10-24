import useAuth from "../Auth";
import Navbar from "../Navbar/Navbar";
import UserProfile from "../Database/Profiledb";

const Home  = ()=>{
  const { userData } = UserProfile();
const { user } = useAuth();
return(

    <div className="min-h-screen flex flex-col bg-gray-200 ">
  {/* Navbar ด้านบน */}
  <Navbar />

  {/* ส่วนกลางของหน้าจอ */}
  <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
    {userData ? (
      <>
        <h1 className="text-3xl font-bold mb-2 text-blue-600">ยินดีต้อนรับ</h1>
        <p className="text-lg text-gray-700 mb-1">Name:  {userData.name} {userData.surname}</p>
        <p className="text-sm text-gray-600">Email: {userData.email} </p>
      </>
    ) : (
      <p className="text-xl text-gray-500">No user is logged in</p>
    )}
  </div>
</div>




    
)
}
export default Home;