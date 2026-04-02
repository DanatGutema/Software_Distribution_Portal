// src/server.js
import "dotenv/config"; // automatically loads .env
import express from "express";
import cors from "cors";
import prisma from "./prismaClient.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
//import protectedRoutes from "./routes/protectedRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import machineTypesRouter from "./routes/machineTypesRoutes.js"; // note the .js extension
import machineModesRouter from "./routes/machineModesRoutes.js";
import banksRoutes from "./routes/bankNamesRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import advancedNDCRoutes from "./routes/advancedRoutes.js";
import swdRoutes from "./routes/swdRoutes.js";
import xfsRoutes from "./routes/xfsRoutes.js";
import unifiedAgentRoutes from "./routes/unifiedAgentRoutes.js";




dotenv.config();



const app = express();

// Body parsing
app.use(express.json());
app.use(cookieParser());




// ✅ Configure CORS
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // allow cookies
  methods: ["GET","POST","PUT","DELETE","OPTIONS"], // allow all HTTP methods
  exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"], // 👈 ADD THIS LINE
}));




//here in my authRoutes unprotected route will be there. which is for
//signup
//login
//logout
//referesh
//me

app.use("/api/auth", authRoutes);
//app.use("/api", protectedRoutes);
app.use("/api/machine-types", machineTypesRouter);
app.use("/api/machine-modes", machineModesRouter);
app.use("/api/banks", banksRoutes);
app.use("/api/files", fileRoutes);
// app.use("/api/uploaded-files", editUploadFiles);
app.use("/api/admin", adminRoutes); 
app.use("/api/dashboard", managerRoutes);
app.use("/api/", userRoutes);
app.use("/api/advanced-ndc", advancedNDCRoutes);
app.use("/api/swd", swdRoutes);
app.use("/api/xfs", xfsRoutes);
app.use("/api/unified-agent", unifiedAgentRoutes);
// app.use("/api", profileRoutes);






// Make uploads folder static
app.use("/uploads", express.static("uploads"));



//app.use(express.json());
//app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:5173", // your frontend URL
//   credentials: true, // ✅ allow sending cookies
// }));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
