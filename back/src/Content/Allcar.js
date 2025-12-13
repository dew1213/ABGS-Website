import GetAllCar from "../Database/GetAllCar";
import Navbar from "../Navbar/Navbar";
import React, { useState } from "react";
import axios from "axios";
import config from "../config/config.json";
import { useNavigate } from "react-router-dom";

const Allcar = () => {
  const Allcar1 = GetAllCar();
  const Allcar2 = Allcar1.carData?.data || [];
  const [selectedCar, setSelectedCar] = useState(null);
  const [warning, setWarning] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
 const navigate = useNavigate();
  const handleEditClick = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };



  const handleOnClickSave = async () => {
    console.log("ส่งข้อมูล:", selectedCar);
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/Car/SaveChange`,
        { selectedCar }
      );
      setShowModal(false);
      navigate(0); 
    } catch (error) {
      setWarning("Please re-check your fields.");
      console.error(error);
    }
  };


  const handleDeleteClick = async (car) => {
    console.log("ส่งข้อมูล:", car);
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/Car/deletecar`,
        { selectedCar: car } // ส่ง car ตรง ๆ
      );
      navigate(0); 
    } catch (error) {
      setWarning("Please re-check your fields.");
      console.error("Error deleting car:", error);
    }
  };


  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedUsers = [...Allcar2].sort((a, b) => {
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
    <div className="min-h-screen flex flex-col bg-gray-200 ">
      <Navbar />
      <div className="p-4 overflow-x-auto">
        <h1 className="text-3xl text-center font-bold mb-6 text-gray-800">
          รายชื่อรถทั้งหมด
        </h1>
        {Allcar2 ? (
          Allcar2.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th
                      onClick={() => handleSort("licensePlate")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      ป้ายทะเบียน
                    </th>
                    <th
                      onClick={() => handleSort("color")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      สีรถ
                    </th>
                    <th
                      onClick={() => handleSort("province")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      จังหวัด
                    </th>
                    <th
                      onClick={() => handleSort("brand")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      รุ่น
                    </th>
                    <th
                      onClick={() => handleSort("dateExpire")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      วันหมดอายุ
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      อนุญาติ
                    </th>
                    <th
                      onClick={() => handleSort("createdAt")}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-medium border-b hover:bg-gray-100"
                    >
                      วันที่สร้าง
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium border-b">
                      การดำเนินการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((car, index) => (
                    <tr
                      key={car.uid || index}
                      className="hover:bg-gray-100 transition"
                    >
                      <td className="px-6 py-3 border-b">
                        {car.licensePlate || "-"}
                      </td>
                      <td className="px-6 py-3 border-b">{car.color || "-"}</td>
                      <td className="px-6 py-3 border-b">
                        {car.province || "-"}
                      </td>
                      <td className="px-6 py-3 border-b">{car.brand || "-"}</td>
                      <td className="px-6 py-3 border-b">{car.dateExpire || "-"}</td>
                      {/* <td className="px-6 py-3 border-b">
                        {car.dateExpire
                          ? new Date(
                              car.dateExpire._seconds * 1000
                            ).toLocaleDateString("th-TH")
                          : "-"}
                      </td> */}
                      <td className="px-6 py-3 border-b capitalize">
                        {car.status === "0"
                          ? "ไม่สามารถใช้งานได้"
                          : "สามารถใช้งานได้"}
                      </td>
                      <td className="px-6 py-3 border-b">
                        {car.createdAt
                          ? new Date(
                              car.createdAt._seconds * 1000
                            ).toLocaleDateString("th-TH")
                          : "-"}
                      </td>
                      <td className="px-6 py-3 border-b text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(car)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(car)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            ลบ
                          </button>
                        </div>
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

      {showModal && selectedCar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลรถ</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm">ป้ายทะเบียน</label>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  value={selectedCar.licensePlate}
                  onChange={(e) =>
                    setSelectedCar({
                      ...selectedCar,
                      licensePlate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">สีรถ</label>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  value={selectedCar.color}
                  onChange={(e) =>
                    setSelectedCar({
                      ...selectedCar,
                      color: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">จังหวัด</label>
                <input
                  type="email"
                  className="w-full border px-3 py-1 rounded"
                  value={selectedCar.province}
                  onChange={(e) =>
                    setSelectedCar({ ...selectedCar, province: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">รุ่น</label>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  value={selectedCar.brand}
                  onChange={(e) =>
                    setSelectedCar({
                      ...selectedCar,
                      brand: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">วันหมดอายุ</label>
                <input
                  type="date"
                  className="w-full border px-3 py-1 rounded"
                  value={
                    selectedCar.dateExpire
                      ? new Date(selectedCar.dateExpire)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedCar({
                      ...selectedCar,
                      dateExpire: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  อนุญาติ
                </label>
                <select
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCar.status}
                  onChange={(e) =>
                    setSelectedCar({ ...selectedCar, status: e.target.value })
                  }
                >
                  <option value="0">ไม่สามารถใช้งานได้</option>
                  <option value="1">สามารถใช้งานได้</option>
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
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
            <p className="mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบรถ {showDeleteModal.licensePlate}?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => { handleDeleteClick(showDeleteModal); setShowDeleteModal(null); }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Allcar;
