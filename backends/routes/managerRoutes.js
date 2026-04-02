import express from "express";
import authMiddleware from "../middleware/authMiddlewares.js";
//import roleMiddleware from "../middleware/roleMiddleware.js";



const router = express.Router();


// router.get("/reports", authMiddleware, roleMiddleware(1), (req, res) => {
//   res.json({ message: "Manager reports data" });
// });


router.get("/reports", authMiddleware, (req, res) => {
  res.json({ message: "Manager reports data" });
});

export default router;