import Navbar from "../Navbar/Navbar";
import GetAllUser from "../Database/GetAllUsers";
import React, { useState } from "react";
import axios from "axios";
import config from "../config/config.json";
import { useNavigate } from "react-router-dom";


const Alluser = () => {
  const Alluser1 = GetAllUser();
  const Alluser2 = Alluser1.userData?.data || [];
  const [selectedUser, setSelectedUser] = useState(null);
  const [warning, setWarning] = useState(null);
  const [showModal, setShowModal] = useState(false);
const navigate = useNavigate();
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };
  const handleOnClickSave = async () => {
    console.log("ส่งข้อมูล:", selectedUser);
    try {
      try {
        const response = await axios.post(
          `${config.apiBaseUrl}/User/SaveChange`,
          {
            selectedUser,
          }
        );
        setShowModal(false);
        navigate(0); 
      } catch (error) {
        setWarning("Please re-check your fields.");
      }
    } catch (error) {
      console.error("Error fetching user data from server: ", error);
    }
  };
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedUsers = [...Alluser2].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bVal = b[sortConfig.key]?.toString().toLowerCase() || "";

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Navbar />
      <div className="p-4 overflow-x-auto">
        <h1 className="text-3xl text-center font-bold mb-6 text-gray-800">
          รายชื่อผู้ใช้ทั้งหมด
        </h1>
        {Alluser2 ? (
          Alluser2.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th
                      onClick={() => handleSort("name")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      ชื่อ
                    </th>
                    <th
                      onClick={() => handleSort("surname")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      นามสกุล
                    </th>
                    <th
                      onClick={() => handleSort("email")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      อีเมล
                    </th>
                    <th
                      onClick={() => handleSort("telephone")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      เบอร์โทร
                    </th>
                    <th
                      onClick={() => handleSort("role")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      สิทธิ์
                    </th>
                    <th
                      onClick={() => handleSort("createdAt")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      วันที่สร้าง
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium border-b">
                      แก้ไข
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => (
                    <tr
                      key={user.uid || index}
                      className="hover:bg-gray-100 transition"
                    >
                      <td className="px-6 py-3 border-b">{user.name || "-"}</td>
                      <td className="px-6 py-3 border-b">
                        {user.surname || "-"}
                      </td>
                      <td className="px-6 py-3 border-b">
                        {user.email || "-"}
                      </td>
                      <td className="px-6 py-3 border-b">
                        {user.telephone || "-"}
                      </td>
                      <td className="px-6 py-3 border-b capitalize">
                        {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}
                      </td>
                      <td className="px-6 py-3 border-b">
                        {user.createdAt
                          ? new Date(
                              user.createdAt._seconds * 1000
                            ).toLocaleDateString("th-TH")
                          : "-"}
                      </td>
                      <td className="px-6 py-3 border-b text-center">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          แก้ไข
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-6">
              ไม่พบข้อมูลผู้ใช้
            </div>
          )
        ) : (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
            <span className="ml-4 text-lg text-gray-600">
              กำลังโหลดข้อมูล...
            </span>
          </div>
        )}
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm">ชื่อ</label>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">นามสกุล</label>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  value={selectedUser.surname}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      surname: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">อีเมล</label>
                <input
                  type="email"
                  className="w-full border px-3 py-1 rounded"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">เบอร์โทร</label>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  value={selectedUser.telephone}
                  maxLength={10}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      telephone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  สิทธิ์
                </label>
                <select
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                >
                  <option value="user">ผู้ใช้ทั่วไป</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                </select>
              </div>
              {warning && (
                <div>
                  <label className="block text-sm mb-1 text-red-700">
                    {warning}
                  </label>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setWarning();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    handleOnClickSave();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alluser;
