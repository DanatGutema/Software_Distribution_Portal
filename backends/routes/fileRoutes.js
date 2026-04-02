import express from "express";
import multer from "multer";
import prisma from "../prismaClient.js";
import authMiddlewarePage from "../middleware/authMiddlewares.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//  ======================upload file=======================

router.post("/upload", authMiddlewarePage, upload.single("file"), async (req, res) => {

  console.log("📦 FILE UPLOAD BODY:", req.body);
  console.log("📁 FILE:", req.file);

  
  const { 
    keywords,  
    bankId,
    machineTypeId,
    machineModeId,
    operatingSystem,
    unifiedAgent,
    swd,
    advanceNdc,
    xfs,
    notes,
    // uploadedBy, 
    // uploaderEmail
    } = req.body;

  const file = req.file;
  //const userId = req.user.id; // 🔥 from auth middleware
  const userId = req.userId;
  if (!userId) {
  return res.status(401).json({ message: "Unauthorized" });
}


if (!file) { return res.status(400).json({ message: "No file uploaded" });}
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
// if (!bankName) { return res.status(400).json({ message: "bankName is required" });}
if (!bankId) {return res.status(400).json({ message: "bankId is required" });}
if (!keywords) {return res.status(400).json({ message: "keywords is required" });}
// if (!machineType) {return res.status(400).json({ message: "machineType is required" });}
// if (!machineMode) {return res.status(400).json({ message: "machineMode is required" });}
if (!machineTypeId) return res.status(400).json({ message: "machineTypeId is required" });
if (!machineModeId) return res.status(400).json({ message: "machineModeId is required" });
if (!operatingSystem) { return res.status(400).json({ message: "operatingSystem is required" });}
if (!unifiedAgent) {return res.status(400).json({ message: "unifiedAgent is required" });}
if (!swd) {return res.status(400).json({ message: "swd is required" });}
if (!advanceNdc) {return res.status(400).json({ message: "advanceNdc is required" });}
if (!xfs) {return res.status(400).json({ message: "xfs is required" });}



  try {


    // ===========================duplicate check==================
         
    const originalFilename = file.originalname;

      const existingFile = await prisma.file.findFirst({
        where: {
          filename: originalFilename,
          bankId: Number(bankId),
          // machineTypeId: Number(machineTypeId),
          // machineModeId: Number(machineModeId),
        },
      });

      if (existingFile) {
        // 🧹 remove uploaded file from disk
        fs.unlinkSync(file.path);

        return res.status(409).json({
          message:
            "This file already exists for the selected bank.",
        });
      }

    // =========================Save file info to database=====================
    const savedFile = await prisma.file.create({
      data: {
        // filename: file.filename,
        filename: originalFilename, // 👈 STORE ORIGINAL NAME
        path: file.path,
        keywords,
        // bankName,

         // 🔥 REQUIRED RELATION
        bank: {connect: { id: Number(bankId),},},
        machineType: { connect: { id: Number(machineTypeId) } },
        machineMode: { connect: { id: Number(machineModeId) } },
        uploadedBy: { connect: { id: userId } },


       
        operatingSystem,
        // unifiedAgent,
        // swd,
        // advanceNdc,
        // xfs,
        unifiedAgent: unifiedAgent
  ? { connect: { id: Number(unifiedAgent) } }
  : undefined,

swd: swd
  ? { connect: { id: Number(swd) } }
  : undefined,

advanceNdc: advanceNdc
  ? { connect: { id: Number(advanceNdc) } }
  : undefined,

xfs: xfs
  ? { connect: { id: Number(xfs) } }
  : undefined,

        notes,
 
      },
    });
    res.json({ message: "File uploaded successfully", file: savedFile });
     
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
});

// Get all files
router.get("/files", async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      // orderBy: {
      //   createdAt: "desc",},
      include: {
        // bank: true,
        // machineType: true,
        // machineMode: true,
        uploadedBy: {
          select: {
            fullname: true,
            email: true,
          },
        },


        bank: {
          select: {
            id: true,
            name: true,
          },
        },


        machineType: {
          select: {
            id: true,
            name: true,
          },
        },

        machineMode: {
          select: {
            id: true,
            name: true,
          },
        },


            // ✅ ADD THESE:
    unifiedAgent: { select: { id: true, name: true } },
    swd: { select: { id: true, name: true } },
    advanceNdc: { select: { id: true, name: true } },
    xfs: { select: { id: true, name: true } },


      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});



// Get count of files added in the last 7 days
router.get("/recent-count", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const count = await prisma.file.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    res.json({ recentFiles: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent files count" });
  }
});
  
      
  
  
   
// Get count of files by type (images vs documents)
router.get("/file-type-counts", async (req, res) => {
  try {
    // Count image files
    const imageCount = await prisma.file.count({
      where: {
        OR: [
          { filename: { contains: ".jpg", mode: "insensitive" } },
          { filename: { contains: ".jpeg", mode: "insensitive" } },
          { filename: { contains: ".png", mode: "insensitive" } },
          { filename: { contains: ".gif", mode: "insensitive" } },
          { filename: { contains: ".bmp", mode: "insensitive" } },
          { filename: { contains: ".webp", mode: "insensitive" } },

        ],
      },
    });

    // Count document files
    const documentCount = await prisma.file.count({
      where: {
        OR: [
          { filename: { endsWith: ".pdf", mode: "insensitive" } },
          { filename: { endsWith: ".doc", mode: "insensitive" } },
          { filename: { endsWith: ".docx", mode: "insensitive" } },
          { filename: { endsWith: ".txt", mode: "insensitive" } },
          { filename: { endsWith: ".xls", mode: "insensitive" } },
          { filename: { endsWith: ".xlsx", mode: "insensitive" } },
          { filename: { endsWith: ".ppt", mode: "insensitive" } },
          { filename: { endsWith: ".pptx", mode: "insensitive" } },
          { filename: { endsWith: ".rtf", mode: "insensitive" } },
        

          { filename: { endsWith: ".mp3", mode: "insensitive" } },
          { filename: { endsWith: ".wav", mode: "insensitive" } },
          { filename: { endsWith: ".ogg", mode: "insensitive" } },
          { filename: { endsWith: ".flac", mode: "insensitive" } },
          { filename: { endsWith: ".aac", mode: "insensitive" } },
          { filename: { endsWith: ".m4a", mode: "insensitive" } },

          { filename: { endsWith: ".mp4", mode: "insensitive" } },
          { filename: { endsWith: ".mov", mode: "insensitive" } },
          { filename: { endsWith: ".avi", mode: "insensitive" } },
          { filename: { endsWith: ".mkv", mode: "insensitive" } },
          { filename: { endsWith: ".flv", mode: "insensitive" } },
          { filename: { endsWith: ".wmv", mode: "insensitive" } },

          { filename: { endsWith: ".zip", mode: "insensitive" } },
          { filename: { endsWith: ".rar", mode: "insensitive" } },
          { filename: { endsWith: ".7z", mode: "insensitive" } },
          { filename: { endsWith: ".tar", mode: "insensitive" } },
          { filename: { endsWith: ".gz", mode: "insensitive" } },


          { filename: { endsWith: ".js", mode: "insensitive" } },
          { filename: { endsWith: ".ts", mode: "insensitive" } },
          { filename: { endsWith: ".jsx", mode: "insensitive" } },
          { filename: { endsWith: ".tsx", mode: "insensitive" } },
          { filename: { endsWith: ".py", mode: "insensitive" } },
          { filename: { endsWith: ".java", mode: "insensitive" } },
          { filename: { endsWith: ".c", mode: "insensitive" } },
          { filename: { endsWith: ".cpp", mode: "insensitive" } },
          { filename: { endsWith: ".cs", mode: "insensitive" } },
          { filename: { endsWith: ".html", mode: "insensitive" } },
          { filename: { endsWith: ".css", mode: "insensitive" } },
          { filename: { endsWith: ".json", mode: "insensitive" } },
          { filename: { endsWith: ".xml", mode: "insensitive" } },
          { filename: { endsWith: ".sh", mode: "insensitive" } },
          { filename: { endsWith: ".bat", mode: "insensitive" } },
           { filename: { endsWith: ".GHO", mode: "insensitive" } },
          { filename: { endsWith: ".iso", mode: "insensitive" } },

          { filename: { endsWith: ".img", mode: "insensitive" } },   // raw disk image
          { filename: { endsWith: ".bin", mode: "insensitive" } },   // binary image
          { filename: { endsWith: ".cue", mode: "insensitive" } },   // cue sheet (paired with .bin)
          { filename: { endsWith: ".nrg", mode: "insensitive" } },   // Nero image
          { filename: { endsWith: ".mdf", mode: "insensitive" } },   // Alcohol 120% image
          { filename: { endsWith: ".mds", mode: "insensitive" } },
          { filename: { endsWith: ".vhd", mode: "insensitive" } },   // virtual hard disk
          { filename: { endsWith: ".vhdx", mode: "insensitive" } },
          { filename: { endsWith: ".vdi", mode: "insensitive" } },   // VirtualBox disk
          { filename: { endsWith: ".vmdk", mode: "insensitive" } },  // VMware disk
          { filename: { endsWith: ".dmg", mode: "insensitive" } },   // macOS disk image
          { filename: { endsWith: ".toast", mode: "insensitive" } }, // Roxio image


          { filename: { endsWith: ".bak", mode: "insensitive" } },
          { filename: { endsWith: ".backup", mode: "insensitive" } },
          { filename: { endsWith: ".old", mode: "insensitive" } },
          { filename: { endsWith: ".wbk", mode: "insensitive" } },  // Word backup
          { filename: { endsWith: ".bkf", mode: "insensitive" } },  // Windows backup


          { filename: { endsWith: ".exe", mode: "insensitive" } },
          { filename: { endsWith: ".msi", mode: "insensitive" } },
          { filename: { endsWith: ".apk", mode: "insensitive" } },
          { filename: { endsWith: ".deb", mode: "insensitive" } },
          { filename: { endsWith: ".rpm", mode: "insensitive" } },
   

          { filename: { endsWith: ".ini", mode: "insensitive" } },
          { filename: { endsWith: ".cfg", mode: "insensitive" } },
          { filename: { endsWith: ".log", mode: "insensitive" } },
          { filename: { endsWith: ".dat", mode: "insensitive" } },
        ],
      },
    });


    res.json({ imageCount, documentCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch file type counts" });
  }
});




/* ===================== RECENT UPLOADS BY USER ===================== */
router.get("/recent-uploads", async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const grouped = await prisma.file.groupBy({
      by: ["uploadedById"],
      where: {
        createdAt: { gte: startOfMonth },
      },
      _count: { id: true },
      orderBy: {
        _count: { id: "desc" },
      },
      take: 5,
    });

    const users = await Promise.all(
      grouped.map(async (g) => {
        const user = await prisma.user.findUnique({
          where: { id: g.uploadedById },
          select: { fullname: true, email: true },
        });

        return {
          fullname: user?.fullname,
          email: user?.email,
          files: g._count.id,
        };
      })
    );

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent uploads" });
  }
});








// ================= Edit uploaded file =================
router.put("/:id", authMiddlewarePage,  upload.single("file"), async (req, res) => {
  const { id } = req.params;
  const {
    filename,
    keywords,
    notes,
    bankId,
    machineTypeId,
    machineModeId,
    operatingSystem,
    unifiedAgent,
    swd,
    advanceNdc,
    xfs,
    status,
  } = req.body;

  try {

     // 🔍 Get existing file (needed if replacing)
      const existingFile = await prisma.file.findUnique({
        where: { id: Number(id) },
      });

      if (!existingFile) {
        return res.status(404).json({ message: "File not found" });
      }

      let newPath = existingFile.path;

      // 🔄 If a new file is uploaded
      if (req.file) {
        // delete old file from disk
        if (existingFile.path && fs.existsSync(existingFile.path)) {
          fs.unlinkSync(existingFile.path);
        }

        newPath = req.file.path;
      }




    const updatedFile = await prisma.file.update({
      where: { id: Number(id) },
      data: {
        ...(filename && { filename: filename.trim() }),
        ...(keywords && { keywords }),
        ...(notes && { notes }),
        ...(bankId && { bank: { connect: { id: Number(bankId) } } }),
        ...(machineTypeId && {
          machineType: { connect: { id: Number(machineTypeId) } },
        }),
        ...(machineModeId && {
          machineMode: { connect: { id: Number(machineModeId) } },
        }),
        ...(operatingSystem && { operatingSystem }),
        // ...(unifiedAgent && { unifiedAgent }),
        // ...(swd && { swd }),
        // ...(advanceNdc && { advanceNdc }),
        // ...(xfs && { xfs }),
        ...(unifiedAgent && { unifiedAgent: { connect: { id: Number(unifiedAgent) } } }),
        ...(swd && { swd: { connect: { id: Number(swd) } } }),
        ...(advanceNdc && { advanceNdc: { connect: { id: Number(advanceNdc) } } }),
        ...(xfs && { xfs: { connect: { id: Number(xfs) } } }),
        
        ...(status && { status }),
        ...(req.file && { path: newPath, filename: req.file.originalname }), // 🔥 update DB path
      },

    include: {
    uploadedBy: { select: { id: true, fullname: true, email: true } },
    bank: { select: { id: true, name: true } },
    machineType: { select: { id: true, name: true } },
    machineMode: { select: { id: true, name: true } },
  },

    });

    res.json({ message: "File updated successfully", file: updatedFile });
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update file" });
  }
});





// this is the origional working one without edit
// router.get("/:id/download", authMiddlewarePage, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const file = await prisma.file.findUnique({
//       where: { id: Number(id) },
//     });

//     if (!file) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     const absolutePath = path.resolve(file.path);

//     res.download(absolutePath, file.filename);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to download file" });
//   }
// });


router.get("/:id/download", authMiddlewarePage, async (req, res) => {
  const { id } = req.params;

  try {
    const fileRecord = await prisma.file.findUnique({
      where: { id: Number(id) },
    });

    if (!fileRecord) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.resolve(fileRecord.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing on server" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    res.setHeader("Content-Disposition", `attachment; filename="${fileRecord.filename}"`);
    res.setHeader("Accept-Ranges", "bytes");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        return res.status(416).send("Requested range not satisfiable");
      }

      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Content-Length": chunkSize,
        "Content-Type": "application/octet-stream",
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "application/octet-stream",
      });

      fs.createReadStream(filePath).pipe(res);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
});









//this is the newest route to controll resunig of the file download,
// router.get("/:id/chunk", authMiddlewarePage, async (req, res) => {
//   const { id } = req.params;
//   const { start, end } = req.query;

//   try {
//     const fileRecord = await prisma.file.findUnique({
//       where: { id: Number(id) },
//     });

//     if (!fileRecord) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     const filePath = path.resolve(fileRecord.path);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: "File missing" });
//     }

//     const stat = fs.statSync(filePath);
//     const fileSize = stat.size;

//     const chunkStart = parseInt(start);
//     const chunkEnd = Math.min(parseInt(end), fileSize - 1);

//     const chunkSize = chunkEnd - chunkStart + 1;

//     res.writeHead(206, {
//       "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": chunkSize,
//       "Content-Type": "application/octet-stream",
//     });

//     fs.createReadStream(filePath, {
//       start: chunkStart,
//       end: chunkEnd,
//     }).pipe(res);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Chunk download failed" });
//   }
// });


router.get("/:id/chunk", authMiddlewarePage, async (req, res) => {
  const { id } = req.params;
  const start = parseInt(req.query.start);
  const end = parseInt(req.query.end);

  try {
    const fileRecord = await prisma.file.findUnique({
      where: { id: Number(id) },
    });

    if (!fileRecord) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.resolve(fileRecord.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing on server" });
    }

    const stats = fs.statSync(filePath);
    const total = stats.size;

    const chunkStart = start;
    const chunkEnd = Math.min(end, total - 1);
    const chunkSize = chunkEnd - chunkStart + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${total}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "application/octet-stream",
    });

    fs.createReadStream(filePath, {
      start: chunkStart,
      end: chunkEnd,
    }).pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chunk download failed" });
  }
});

export default router;
