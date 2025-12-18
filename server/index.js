const CheckverifyPassword = require("./admin/checkpassword");

const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
const app = express();
const port = 8000;

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const allowedOrigins = [
  "https://websitebackcarproject.vercel.app",
  "https://test1-khaki-two-95.vercel.app",
  "http://localhost:1000",
  "http://localhost:2000"
];
app.use(cors(
  {
    origin: allowedOrigins ,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true 

  }
));
app.use(express.json());
// app.use(bodyParser.json());

const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // ตรวจสอบ token และดึง UID
    req.uid = decodedToken.uid; // เก็บ UID ของผู้ใช้ที่ล็อกอินอยู่
    next(); // ทำงานต่อไป
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized", errorMessage: error.message });
  }
};

//ดึงข้อมูล User มาเเสดง
app.get("/users/profile", checkAuth, async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้จาก Firestore โดยใช้ UID ที่ได้จาก token
    const userRef = db.collection("users").doc(req.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    // ดึงข้อมูลผู้ใช้จาก Firestore
    const userData = doc.data();
    // ส่งข้อมูลผู้ใช้กลับไปที่ frontend
    res.status(200).json(userData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});
app.get("/users/profile/mycar", checkAuth, async (req, res) => {
  try {
    const MyCarRef = db.collection("carsRequest");
    const snapshot = await MyCarRef
      .where("userId", "==", req.uid)
      .where("isdelete", "in", ["0", null])
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "car not found" });
    }

    const MycarList = [];
    snapshot.forEach((doc) => {
      MycarList.push(doc.data());
    });
    // console.log(MycarList)

    // res.status(200).json({data:MycarList,Amount:MycarList.length});
    res.status(200).json(MycarList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});

//Register new user
app.post("/users/register", async (req, res) => {
  const { name, surname, email, telephone, password } = req.body.formData || "";
  try {
    if (!(name && surname && email && telephone && password)) {
      return res.status(400).json({
        message: "please fill in all fields.",
      });
    }

    // ตรวจสอบว่าอีเมลมีอยู่แล้วหรือไม่
    try {
      const existingUser = await admin.auth().getUserByEmail(email);
      // ถ้ามีผู้ใช้อีเมลนี้อยู่แล้ว
      return res.status(400).json({
        status: "failed",
        message: "Email already exists.",
      });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // ถ้าไม่มีผู้ใช้อีเมลนี้ก็สร้างใหม่
        const userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          displayName: `${name} ${surname}`,
        });

        // บันทึกข้อมูลลงใน Firestore
        await db.collection("users").doc(userRecord.uid).set({
          uid: userRecord.uid,
          name: name,
          surname: surname,
          email: email,
          role: "user",
          password: password,
          telephone: telephone,
          isdelete:"0",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // สร้าง token และส่งกลับไปยัง frontend
        const token = await admin.auth().createCustomToken(userRecord.uid);
        return res.status(200).json({
          status: "success",
          message: "Data saved",
          uid: userRecord.uid,
          token: token,
          email: userRecord.email,
        });
      } else {
        throw error; // หากเป็น error อื่นๆ ให้ส่งกลับไปยัง catch block
      }
    }
  } catch (error) {
    console.log(error.message);
    console.log("error");
    return res.status(500).json({ status: "failed", error: error.message });
  }
});

//Login user
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body || "";
  try {
    if (!(email && password)) {
      return res.status(400).json({
        message: "please fill in all fields.",
      });
    }

    // const check = await CheckverifyPassword(email, password);
    check = true;
    console.log("re " + check);

    if (check) {
      const userRecord = await admin.auth().getUserByEmail(email);
      const checkpass = await db.collection("users").doc(userRecord.uid).get();
      if (!checkpass.exists) {
        return res.status(404).json({ message: "User not found" });
      }

       const userData = checkpass.data();

      // ✅ ตรวจสอบสถานะ isdelete
      if (userData.isdelete === "1") {
        return res.status(403).json({
          status: "403",
          message: "บัญชีนี้ถูกระงับหรือถูกลบแล้ว ไม่สามารถเข้าสู่ระบบได้",
        });
      }

      const pass = checkpass.data().password;
      const token = await admin.auth().createCustomToken(userRecord.uid);
      if (pass == password) {
        return res.status(200).json({
          status: "success",
          uid: userRecord.uid,
          email: userRecord.email,
          token: token,
        });
      } else {
        return res
          .status(401)
          .json({ status: "401", message: "รหัสผ่านไม่ถูกต้อง" });
      }
    } else {
      return res
        .status(401)
        .json({ status: "401", message: "ไม่สามารถเข้าสู่ระบบได้" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "failed", error: error.message });
  }
});

//admin
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body || "";
  try {
    if (!(email && password)) {
      return res.status(400).json({
        status: "400",
        message: "please fill in all fields.",
      });
    }

    //const check = await CheckverifyPassword(email, password);
    check = true;
    console.log("re " + check);

    if (check) {
      const userRecord = await admin.auth().getUserByEmail(email);
      const token = await admin.auth().createCustomToken(userRecord.uid);
      const userRef = db.collection("users").doc(userRecord.uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: "User not found" });
      }
      const pass = doc.data().password;
      const userData = doc.data();
      if (userData.role == "admin" && userData.isdelete != "1") {
        if (pass == password) {
          return res.status(200).json({
            status: "success",
            uid: userRecord.uid,
            email: userRecord.email,
            token: token,
          });
        } else {
          return res
            .status(200)
            .json({ status: "401", message: "รหัสผ่านไม่ถูกต้อง" });
        }
      } else {
        return res
          .status(200)
          .json({ status: "401", message: "ไม่สามารถเข้าใช้งานได้" });
      }
    } else {
      return res
        .status(200)
        .json({ status: "401", message: "รหัสผ่านไม่ถูกต้อง" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "failed", error: error.message });
  }
});

app.post("/users/signInCar", async (req, res) => {
  const {
    // name,
    // surname,
    province,
    brand,
    color,
    licensePlate,
    userId,
  } = req.body.formData || "";

  try {
    // ตรวจสอบข้อมูลที่จำเป็นว่าครบถ้วนหรือไม่
    if (
      !(
        // name &&
        // surname &&
        (province && brand && color && licensePlate)
      )
    ) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }
     const existingCar = await db
      .collection("carsRequest")
      .where("licensePlate", "==", licensePlate)
      .where("isdelete", "==", "0")
      .get();

    if (!existingCar.empty) {
      // ถ้ามีข้อมูลซ้ำ
      return res.status(200).json({
        status: "duplicate",
        message: "This license plate already exists.",
      });
    }

    // เพิ่มข้อมูลลง Firestore โดยใช้ uid เป็น document ID // merge: true เพื่อไม่ลบข้อมูลที่มีอยู่แล้ว
    await db.collection("carsRequest").doc().set(
      {
        province: province,
        brand: brand,
        color: color,
        licensePlate: licensePlate,
        userId: userId,
        status: "0",
        isdelete:"0",
        dateExpire: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // ส่งสถานะกลับหลังจากบันทึกข้อมูลสำเร็จ
    return res.status(200).json({
      status: "success",
      userId: userId,
      // name: name,
      // surname: surname,
    });
  } catch (error) {
    console.error("Error saving user car data: ", error);
    return res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
});

app.post("/test", async (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "failed", error: error.message });
  }
});
//
app.get("/users/checkRole", async (req, res) => {
  try {
    console.log(req.body);
    const { userId } = req.body || "";
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = doc.data();
    const userRole = userData.role;

    res.status(200).json({ status: "success", userRole: userRole });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});
//getallcar
app.get("/get/allUsers", async (req, res) => {
  try {
    const GetAllUser = db.collection("users");
    const snapshot = await GetAllUser.get();
    console.log(snapshot);

    if (snapshot.empty) {
      return res.status(404).json({ message: "No users found" });
    }

    const usersList = snapshot.docs
      .map((doc) => doc.data())
      .filter((user) => user.isdelete !== "1");

    if (usersList.length === 0) {
      return res.status(404).json({ message: "No active users found" });
    }

    res.status(200).json({ status: "success", data: usersList });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});
app.get("/get/allCars", async (req, res) => {
  try {
    const GetAllUser = db.collection("carsRequest");
    const snapshot = await GetAllUser
      .where("isdelete", "in", ["0", null]) // เลือกเฉพาะที่ยังไม่ถูกลบ
      .get();
    console.log(snapshot);

    if (snapshot.empty) {
      return res.status(404).json({ message: "No users found" });
    }
    console;
    const usersList = snapshot.docs.map((doc) => ({
      docid: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ status: "success", data: usersList });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});

app.post("/User/SaveChange", async (req, res) => {
  try {
    const { uid, role, name, surname, telephone, email } =
      req.body.selectedUser || "";
    if (!uid) {
      return res.status(400).json({ status: "400", message: "UID ไม่ถูกต้อง" });
    }
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      role,
      name,
      surname,
      telephone,
      email,
      updatedAt: new Date(),
    });
    res.status(200).json({ status: "200", message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});
app.post("/Car/SaveChange", async (req, res) => {
  try {
    const { userId, licensePlate, brand, color, dateExpire, province, status ,docid} =
      req.body.selectedCar || "";
    if (!userId) {
      return res.status(400).json({ status: "400", message: "UID ไม่ถูกต้อง" });
    }
    const userRef = db.collection("carsRequest").doc(docid);

    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }

    await userRef.update({
      docid,
      userId,
      licensePlate,
      brand,
      color,
      dateExpire,
      province,
      status,
      updatedAt: new Date(),
    });
    res.status(200).json({ status: "200", message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});
app.post("/users/updatebyuser", async (req, res) => {
  const { uid, name, surname, telephone } = req.body || {};

  if (!uid) {
    return res.status(400).json({ status: "failed", message: "UID is required." });
  }

  try {
    // สมมติว่าใช้ Firestore collection "users"
    const userRef = admin.firestore().collection("users").doc(uid);

    // ตรวจสอบว่ามี doc ไหม
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }


    await userRef.update({
      name: name,
      surname: surname,
      telephone: telephone,
      updatedAt:new Date(),
    });

    return res.status(200).json({
      status: "success",
      message: "User profile updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Error updating user profile.",
    });
  }
});
app.post("/Car/deletecar", async (req, res) => {
  try {
    const { userId, licensePlate, brand, color, dateExpire, province, status ,docid} =
      req.body.selectedCar || "";
    if (!userId) {
      return res.status(400).json({ status: "400", message: "UID ไม่ถูกต้อง" });
    }
    const carRef = db.collection("carsRequest").doc(docid);
    const doc = await carRef.get();
    if (!doc.exists) {
      return res.status(404).json({ status: "404", message: "ไม่พบข้อมูลรถในระบบ" });
    }

    await carRef.update({
      isdelete: "1",
      updatedAt:new Date(),
    });
    
    res.status(200).json({ status: "200", message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});

app.post("/User/deleteuser", async (req, res) => {
  try {
    const { uid } = req.body.selectedUser || {};

    if (!uid) {
      return res.status(400).json({ status: "400", message: "ไม่พบ UID ผู้ใช้" });
    }

    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ status: "404", message: "ไม่พบข้อมูลผู้ใช้" });
    }

     await userRef.update({
      isdelete: "1",
      updatedAt:new Date(),
    });

    const carsSnapshot = await db.collection("carsRequest").where("userId", "==", uid).get();

    if (!carsSnapshot.empty) {
      const batch = db.batch();

      carsSnapshot.forEach((doc) => {
        const carRef = db.collection("carsRequest").doc(doc.id);
        batch.update(carRef, { isdelete: "1",status: "0" , updatedAt: new Date() });
      });

      await batch.commit(); // ✅ commit batch
    }

    res.status(200).json({ status: "200", message: "ลบผู้ใช้สำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "500",
      message: "เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้",
      error: error.message,
    });
  }
});

//add single car
app.post("/cars/insertcar", async (req, res) => {
  let {
    province,
    brand,
    color,
    licensePlate,
    status
  } = req.body.formData || {};

  try {
    // 🔽 normalize + toLowerCase
    province = province?.toString().trim().toLowerCase();
    brand = brand?.toString().trim().toLowerCase();
    color = color?.toString().trim().toLowerCase();
    licensePlate = licensePlate?.toString().trim().toLowerCase();
    status = status?.toString().trim().toLowerCase();

    // validate
    if (!(province && brand && color && licensePlate && status)) {
      return res.status(200).json({
        status: "400",
        message: "Please fill in all fields.",
      });
    }

    // check duplicate (ใช้ lowercase แล้ว)
    const existingCar = await db
      .collection("cars")
      .where("licensePlate", "==", licensePlate)
      .where("isdelete", "==", "0")
      .get();

    if (!existingCar.empty) {
      return res.status(200).json({
        status: "duplicate",
        message: "This license plate already exists.",
      });
    }

    const carRef = db.collection("cars").doc();
    await carRef.set({
      cid: carRef.id,
      brand,
      color,
      licensePlate,
      province,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isdelete: "0",
    });

    return res.status(200).json({
      status: "success",
      message: "create car success",
      cid: carRef.id,
    });

  } catch (error) {
    console.error("Error saving car data: ", error);
    return res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
});

//ad multi car
app.post("/cars/multlinsertcar", async (req, res) => {
  const formData = req.body.formData;

  if (!Array.isArray(formData) || formData.length === 0) {
    return res.status(400).json({
      status: "400",
      message: "formData must be a non-empty array",
    });
  }

  const success = [];
  const duplicate = [];
  const failed = [];

  try {
    for (const item of formData) {
      let { province, brand, color, licensePlate, status } = item;

      // 🔽 แปลงเป็น lowercase + trim
      province = province?.toString().trim().toLowerCase();
      brand = brand?.toString().trim().toLowerCase();
      color = color?.toString().trim().toLowerCase();
      licensePlate = licensePlate?.toString().trim().toLowerCase();
      status = status?.toString().trim().toLowerCase();

      // validate
      if (!(province && brand && color && licensePlate && status)) {
        failed.push({
          licensePlate,
          reason: "missing field",
        });
        continue;
      }

      // check duplicate (ใช้ licensePlate ที่เป็น lowercase แล้ว)
      const existingCar = await db
        .collection("cars")
        .where("licensePlate", "==", licensePlate)
        .where("isdelete", "==", "0")
        .get();

      if (!existingCar.empty) {
        duplicate.push(licensePlate);
        continue;
      }

      const carRef = db.collection("cars").doc();
      await carRef.set({
        cid: carRef.id,
        brand,
        color,
        licensePlate,
        province,
        status,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isdelete: "0",
      });

      success.push({
        cid: carRef.id,
        licensePlate,
      });
    }

    return res.status(200).json({
      status: "success",
      summary: {
        total: formData.length,
        success: success.length,
        duplicate: duplicate.length,
        failed: failed.length,
      },
      success,
      duplicate,
      failed,
    });

  } catch (error) {
    console.error("Error saving car data: ", error);
    return res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
});

//countcar
app.get("/cars/count", async (req, res) => {
  try {
    const snapshot = await db
      .collection("cars")
      .where("isdelete", "==", "0")
      .get();

    return res.status(200).json({
      status: "success",
      total: snapshot.size, // 👈 จำนวน document
    });

  } catch (error) {
    console.error("Error counting cars: ", error);
    return res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
});

//add history
app.post("/historycars/insert", async (req, res) => {
  let {
    brand,
    color,
    licensePlate,
    province
  } = req.body.formData || {};

  try {
    // 🔽 normalize + toLowerCase
    brand = brand?.toString().trim().toLowerCase();
    color = color?.toString().trim().toLowerCase();
    licensePlate = licensePlate?.toString().trim().toLowerCase();
    province = province?.toString().trim().toLowerCase();

    // validate
    if (!(brand && color && licensePlate && province)) {
      return res.status(400).json({
        status: "400",
        message: "Please fill in all fields",
      });
    }

    // 🔍 check licensePlate in cars
    const carSnapshot = await db
      .collection("cars")
      .where("licensePlate", "==", licensePlate)
      .where("isdelete", "==", "0")
      .limit(1)
      .get();

    let cid = "";
    let isregister = 0;
    let statuscar = "general";
    if (!carSnapshot.empty) {
      const carData = carSnapshot.docs[0].data();
      cid = carData.cid || "";
      isregister = 1;
      statuscar = carData.status || "";
    }

    // ➕ insert to historycars
    const historyRef = db.collection("historycars").doc();

    await historyRef.set({
      hid: historyRef.id,
      datetimeuse: admin.firestore.FieldValue.serverTimestamp(),
      brand,
      color,
      licensePlate,
      province,
      isregister,
      cid
    });

    return res.status(200).json({
      status: "success",
      message: "insert history car success",
      data: {
        hid: historyRef.id,
        licensePlate,
        isregister,
        statuscar,
        cid
      }
    });

  } catch (error) {
    console.error("Error insert historycars: ", error);
    return res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
});


app.listen(port, (req, res) => {
  console.log("http server run at http://localhost:" + port);
});
