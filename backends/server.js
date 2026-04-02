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







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
