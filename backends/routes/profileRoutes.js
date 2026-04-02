// import express from "express";
// //import prisma from "../prisma/client.js";
// import prisma from "../prismaClient.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // 🔐 Get current logged-in user
// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     //const userId = req.user.id; // set by authMiddleware

//     const userId = req.userId;

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         fullname: true,
//         email: true,
//         role: true,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
