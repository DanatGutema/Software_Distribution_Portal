import express from "express";
import authMiddleware from "../middleware/authMiddlewares.js";
import prisma from "../prismaClient.js";
//import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();



// router.get("/profile", authMiddleware, (req, res) => {
//   res.json({ user: req.user, // 👈 current logged-in user
//    });
// });

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;