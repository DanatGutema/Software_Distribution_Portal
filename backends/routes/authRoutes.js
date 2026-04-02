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




// 🔐 Get current logged-in user
router.get("/me", authMiddlewarePage, async (req, res) => {
  try {
    //const userId = req.user.id; // set by authMiddleware
    const accessToken = req.cookies.accessToken; // ← make sure this is present
    console.log("Cookies received:", req.cookies);
   console.log("Cookies received:", req.cookies); // should show accessToken
console.log("Authorization header:", req.headers.authorization); // optional

    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
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






// // ========================
// // UserProfile Routes
// // ========================

// // ✅ View user profile by userId or from session (if using JWT or cookies)
// // GET profile for logged-in user
// router.get("/profile", async (req, res) => {
//   try {
//     // Use the current user from cookies or session
//     const accessToken = req.cookies.accessToken;
//     if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const profile = await prisma.userProfile.findUnique({
//       where: { userId },
//       select: { fullname: true, role: true, contact: true, user: { select: { email: true } } },
//     });

//     if (!profile) return res.json({}); // empty if not yet created
//     res.json({ ...profile, email: profile.user.email });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch profile" });
//   }
// });

// // PUT profile (create or update)
// router.put("/profile", async (req, res) => {
//   try {
//     const accessToken = req.cookies.accessToken;
//     if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const { fullname, role, contact } = req.body;

//     const existingProfile = await prisma.userProfile.findUnique({ where: { userId } });

//     let updatedProfile;
//     if (existingProfile) {
//       // update existing
//       updatedProfile = await prisma.userProfile.update({
//         where: { userId },
//         data: { fullname, role, contact },
//       });
//     } else {
//       // create new profile
//       updatedProfile = await prisma.userProfile.create({
//         data: { userId, fullname, role, contact },
//       });
//     }

//     res.json(updatedProfile);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to update profile" });
//   }
// });





// //for my machine types
// //GET all machine types
// router.get("/", (req, res) => {
//   res.json(machineTypes);
// });


// // // Get all machine types
// router.get("/", async (req, res) => {
//   try {
//     const types = await prisma.machineType.findMany();
//     res.json(types);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch machine types" });
//   }
// });

// // // Add new machine type
// router.post("/", async (req, res) => {
//   const { name } = req.body;
//   try {
//     const newType = await prisma.machineType.create({ data: { name } });
//     res.json(newType);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add machine type" });
//   }
// });


// // // ----------------------
// // // MACHINE MODES ROUTES
// // // ----------------------

// // // GET modes by machine type
// router.get("/machine-modes/:typeId", (req, res) => {
//   const typeId = parseInt(req.params.typeId);
//   const modesForType = machineModes.filter(m => m.machineTypeId === typeId);
//   res.json(modesForType);
// });



// // // POST a new mode
// router.post("/machine-modes", (req, res) => {
//   const { name, machineTypeId } = req.body;
//   if (!name || !machineTypeId) return res.status(400).json({ error: "Missing data" });
//   const newMode = {
//      id: machineModes.length + 1, 
//      name, 
//      machineTypeId: parseInt(machineTypeId) 
//     };

//   machineModes.push(newMode);
//   res.json(newMode);
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