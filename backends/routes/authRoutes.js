// src/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import authMiddlewarePage from "../middleware/authMiddlewares.js";

const router = express.Router();






// this is for the signup route
router.post("/signup", async (req, res) => {
  console.log("Signup request body:", req.body); // <--- add this
  try {
    const { fullname, email, password, contact = null } = req.body;

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) return res.status(400).json({ error: "Email already exists" });


    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);


    await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword, // hash recommended
        contact: contact  || null, // safe fallback
        role: 0,        // default user
        status: "pending", // waiting approval
      },
    });

    return res.json({ message: "Signup successful! Wait for admin approval." });
  } catch (err) {
    console.error("Signup error:", err); // <--- log the actual error
    res.status(500).json({ error: "Server error" });
  }
});








// this is for the Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


       // Check if user is approved
      //  if (user.status !== "approved") {
      //   return res.status(403).json({ message: "Wait for admin approval." });
      // }


      //if the status is pending
        if (user.status == "pending") {
        return res.status(403).json({ message: "Wait for admin approval." });
      }

      //if the status is inactive
        if (user.status == "inactive") {
        return res.status(403).json({ message: "Your account has been deactivated by the admin" });
      }


      //generate tokens
    const accessToken = jwt.sign({ id: user.id, role: user.role  }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });


    // set tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      //sameSite: "strict",
      sameSite: "lax",      // allow cross-origin requests from frontend
      //secure: process.env.NODE_ENV === "production",
      secure: false,         // false for localhost
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      //sameSite: "strict",
      sameSite: "lax",      // allow cross-origin requests from frontend
      //secure: process.env.NODE_ENV === "production",
      secure: false,         // false for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    


      // 🔥 SEND USER DATA BACK TO FRONTEND
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});











// this is for the Refresh route
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      //sameSite: "strict",
      sameSite: "lax",
      secure: false,
      //secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token/ Refresh token expired" });
  }
});







//this is for the logout route
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});




export default router;





















// router.get("/files", async (req, res) => {
//   try {
//     const result = await db.query("SELECT * FROM files ORDER BY created_at DESC");
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch files" });
//   }
// });











































// let machineModes = [
//   // Example: { id: 1, name: "Deposit", machineTypeId: 1 }
// ];





















// // Mock data (replace with DB later)
// // let machineTypes = [
// //   { id: 0, name: "ATM" },
// //   { id: 1, name: "POS" },
// //   { id: 2, name: "Kiosk" },
// // ];
