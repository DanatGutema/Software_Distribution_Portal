// import express from "express";
// import multer from "multer";
// import prisma from "../prismaClient.js";
// import authMiddleware from "../middleware/authMiddlewares.js";
// import fs from "fs";

// const router = express.Router();

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure this folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// //  ======================upload file=======================

// router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {

//   console.log("📦 FILE UPLOAD BODY:", req.body);
//   console.log("📁 FILE:", req.file);

  
//   const { 
//     keywords,  
//     bankId,
//     machineTypeId,
//     machineModeId,
//     operatingSystem,
//     unifiedAgent,
//     swd,
//     advanceNdc,
//     xfs,
//     notes,
//     // uploadedBy, 
//     // uploaderEmail
//     } = req.body;

//   const file = req.file;
//   const userId = req.user.id; // 🔥 from auth middleware

// if (!file) { return res.status(400).json({ message: "No file uploaded" });}
//   if (!userId) return res.status(401).json({ message: "Unauthorized" });
// // if (!bankName) { return res.status(400).json({ message: "bankName is required" });}
// if (!bankId) {return res.status(400).json({ message: "bankId is required" });}
// if (!keywords) {return res.status(400).json({ message: "keywords is required" });}
// // if (!machineType) {return res.status(400).json({ message: "machineType is required" });}
// // if (!machineMode) {return res.status(400).json({ message: "machineMode is required" });}
// if (!machineTypeId) return res.status(400).json({ message: "machineTypeId is required" });
// if (!machineModeId) return res.status(400).json({ message: "machineModeId is required" });
// if (!operatingSystem) { return res.status(400).json({ message: "operatingSystem is required" });}
// if (!unifiedAgent) {return res.status(400).json({ message: "unifiedAgent is required" });}
// if (!swd) {return res.status(400).json({ message: "swd is required" });}
// if (!advanceNdc) {return res.status(400).json({ message: "advanceNdc is required" });}
// if (!xfs) {return res.status(400).json({ message: "xfs is required" });}



//   try {


//     // ===========================duplicate check==================
         
//     const originalFilename = file.originalname;

//       const existingFile = await prisma.file.findFirst({
//         where: {
//           filename: originalFilename,
//           bankId: Number(bankId),
//           // machineTypeId: Number(machineTypeId),
//           // machineModeId: Number(machineModeId),
//         },
//       });

//       if (existingFile) {
//         // 🧹 remove uploaded file from disk
//         fs.unlinkSync(file.path);

//         return res.status(409).json({
//           message:
//             "This file already exists for the selected bank.",
//         });
//       }

//     // =========================Save file info to database=====================
//     const savedFile = await prisma.file.create({
//       data: {
//         // filename: file.filename,
//         filename: originalFilename, // 👈 STORE ORIGINAL NAME
//         path: file.path,
//         keywords,
//         // bankName,

//          // 🔥 REQUIRED RELATION
//         bank: {connect: { id: Number(bankId),},},
//         machineType: { connect: { id: Number(machineTypeId) } },
//         machineMode: { connect: { id: Number(machineModeId) } },
//         uploadedBy: { connect: { id: userId } },


//         // machineType,
//         // machineMode,
//         // machineTypeId: typeRecord?.id || null,  // automatically fill ID
//         // machineModeId: modeRecord?.id || null,  // automatically fill ID
//         operatingSystem,
//         unifiedAgent,
//         swd,
//         advanceNdc,
//         xfs,
//         notes,
//         // uploadedBy,
//         // uploaderEmail,
//       },
//     });
//     res.json({ message: "File uploaded successfully", file: savedFile });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload Failed" });
//   }
// });

// // Get all files
// router.get("/files", async (req, res) => {
//   try {
//     const files = await prisma.file.findMany({
//       // orderBy: {
//       //   createdAt: "desc",},
//       include: {
//         // bank: true,
//         // machineType: true,
//         // machineMode: true,
//         uploadedBy: {
//           select: {
//             fullname: true,
//             email: true,
//           },
//         },


//         bank: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },


//         machineType: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },

//         machineMode: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },

//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     res.json(files);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch files" });
//   }
// });



// // Get count of files added in the last 7 days
// router.get("/recent-count", async (req, res) => {
//   try {
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     const count = await prisma.file.count({
//       where: {
//         createdAt: {
//           gte: sevenDaysAgo,
//         },
//       },
//     });

//     res.json({ recentFiles: count });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch recent files count" });
//   }
// });
  
      
  
  
   
// // Get count of files by type (images vs documents)
// router.get("/file-type-counts", async (req, res) => {
//   try {
//     // Count image files
//     const imageCount = await prisma.file.count({
//       where: {
//         OR: [
//           { filename: { contains: ".jpg", mode: "insensitive" } },
//           { filename: { contains: ".jpeg", mode: "insensitive" } },
//           { filename: { contains: ".png", mode: "insensitive" } },
//           { filename: { contains: ".gif", mode: "insensitive" } },
//           { filename: { contains: ".bmp", mode: "insensitive" } },
//           { filename: { contains: ".webp", mode: "insensitive" } },

//         ],
//       },
//     });

//     // Count document files
//     const documentCount = await prisma.file.count({
//       where: {
//         OR: [
//           { filename: { endsWith: ".pdf", mode: "insensitive" } },
//           { filename: { endsWith: ".doc", mode: "insensitive" } },
//           { filename: { endsWith: ".docx", mode: "insensitive" } },
//           { filename: { endsWith: ".txt", mode: "insensitive" } },
//           { filename: { endsWith: ".xls", mode: "insensitive" } },
//           { filename: { endsWith: ".xlsx", mode: "insensitive" } },
//           { filename: { endsWith: ".ppt", mode: "insensitive" } },
//           { filename: { endsWith: ".pptx", mode: "insensitive" } },
//           { filename: { endsWith: ".rtf", mode: "insensitive" } },
        

//           { filename: { endsWith: ".mp3", mode: "insensitive" } },
//           { filename: { endsWith: ".wav", mode: "insensitive" } },
//           { filename: { endsWith: ".ogg", mode: "insensitive" } },
//           { filename: { endsWith: ".flac", mode: "insensitive" } },
//           { filename: { endsWith: ".aac", mode: "insensitive" } },
//           { filename: { endsWith: ".m4a", mode: "insensitive" } },

//           { filename: { endsWith: ".mp4", mode: "insensitive" } },
//           { filename: { endsWith: ".mov", mode: "insensitive" } },
//           { filename: { endsWith: ".avi", mode: "insensitive" } },
//           { filename: { endsWith: ".mkv", mode: "insensitive" } },
//           { filename: { endsWith: ".flv", mode: "insensitive" } },
//           { filename: { endsWith: ".wmv", mode: "insensitive" } },

//           { filename: { endsWith: ".zip", mode: "insensitive" } },
//           { filename: { endsWith: ".rar", mode: "insensitive" } },
//           { filename: { endsWith: ".7z", mode: "insensitive" } },
//           { filename: { endsWith: ".tar", mode: "insensitive" } },
//           { filename: { endsWith: ".gz", mode: "insensitive" } },


//           { filename: { endsWith: ".js", mode: "insensitive" } },
//           { filename: { endsWith: ".ts", mode: "insensitive" } },
//           { filename: { endsWith: ".jsx", mode: "insensitive" } },
//           { filename: { endsWith: ".tsx", mode: "insensitive" } },
//           { filename: { endsWith: ".py", mode: "insensitive" } },
//           { filename: { endsWith: ".java", mode: "insensitive" } },
//           { filename: { endsWith: ".c", mode: "insensitive" } },
//           { filename: { endsWith: ".cpp", mode: "insensitive" } },
//           { filename: { endsWith: ".cs", mode: "insensitive" } },
//           { filename: { endsWith: ".html", mode: "insensitive" } },
//           { filename: { endsWith: ".css", mode: "insensitive" } },
//           { filename: { endsWith: ".json", mode: "insensitive" } },
//           { filename: { endsWith: ".xml", mode: "insensitive" } },
//           { filename: { endsWith: ".sh", mode: "insensitive" } },
//           { filename: { endsWith: ".bat", mode: "insensitive" } },
   
//         ],
//       },
//     });


//     res.json({ imageCount, documentCount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch file type counts" });
//   }
// });



// // router.get("/recent-uploads", async (req, res) => {
// //   try {
// //     // Count total uploads this month
// //     const startOfMonth = new Date();
// //     startOfMonth.setDate(1);
// //     startOfMonth.setHours(0, 0, 0, 0);

// //     const totalUploadsThisMonth = await prisma.file.count({
// //       where: {
// //         createdAt: {
// //           gte: startOfMonth,
// //         },
// //       },
// //     });

// //     // Group by user (assuming you have userId or uploader info in DB)
// //     // Adjust field name based on your schema (e.g. `uploadedBy`, `userId`, or `username`)
// //     const userUploads = await prisma.file.groupBy({
// //       by: ["uploadedBy", "uploaderEmail"],
// //       _count: {
// //         id: true,
// //       },
// //       orderBy: {
// //         _count: {
// //           id: "desc",
// //         },
// //       },
// //       take: 5, // limit to 5 recent users
// //     });

// //     res.json({
// //       totalUploadsThisMonth,
// //       users: userUploads.map((u) => ({
// //         name: u.uploadedBy,
// //         email: u.uploaderEmail,
// //         files: u._count.id,
// //       })),
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Failed to fetch recent uploads" });
// //   }
// // });



// /* ===================== RECENT UPLOADS BY USER ===================== */
// router.get("/recent-uploads", async (req, res) => {
//   try {
//     const startOfMonth = new Date();
//     startOfMonth.setDate(1);
//     startOfMonth.setHours(0, 0, 0, 0);

//     const grouped = await prisma.file.groupBy({
//       by: ["uploadedById"],
//       where: {
//         createdAt: { gte: startOfMonth },
//       },
//       _count: { id: true },
//       orderBy: {
//         _count: { id: "desc" },
//       },
//       take: 5,
//     });

//     const users = await Promise.all(
//       grouped.map(async (g) => {
//         const user = await prisma.user.findUnique({
//           where: { id: g.uploadedById },
//           select: { fullname: true, email: true },
//         });

//         return {
//           fullname: user?.fullname,
//           email: user?.email,
//           files: g._count.id,
//         };
//       })
//     );

//     res.json({ users });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch recent uploads" });
//   }
// });


// export default router;
