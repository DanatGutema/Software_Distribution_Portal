// // for routes requiring authentication
// import express from "express";
// import { verifyToken } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/dashboard", verifyToken, (req, res) => {
//   res.json({ message: `Welcome user ${req.user.id}! This is a protected route.` });
// });

// export default router;
