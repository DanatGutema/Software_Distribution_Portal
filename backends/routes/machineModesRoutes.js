import express from "express";
import prisma from "../prismaClient.js";
import authMiddlewarePage from "../middleware/authMiddlewares.js";

const router = express.Router();



// router.get("/:typeId", (req, res) => {
//   const typeId = parseInt(req.params.typeId);
//   const modes = machineModes.filter(m => m.machineTypeId === typeId);
//   res.json(modes);
// });

 // GET modes by machine type

router.get("/:typeId",  authMiddlewarePage, async (req, res) => {
  const typeId = Number(req.params.typeId);

  try {
    const modes = await prisma.machineMode.findMany({
      where: { machineTypeId: typeId },
    });
    res.json(modes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch machine modes" });
  }
});



// router.post("/", (req, res) => {
//   const { name, machineTypeId } = req.body;

//   const newMode = {
//     id: machineModes.length + 1,
//     name,
//     machineTypeId: parseInt(machineTypeId),
//   };

//   machineModes.push(newMode);
//   res.json(newMode);
// });

// CREATE mode
router.post("/", authMiddlewarePage, async (req, res) => {
  const { name, machineTypeId } = req.body;

  try {
    const newMode = await prisma.machineMode.create({
      data: {
        name,
        machineTypeId: Number(machineTypeId),
      },
    });
    res.json(newMode);
  } catch (error) {
    res.status(500).json({ error: "Failed to create machine mode" });
  }
});



//  * DELETE mode
router.delete("/:id", authMiddlewarePage, async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.machineMode.delete({
      where: { id },
    });
    res.json({ message: "Machine mode deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete machine mode" });
  }
});



// ================Edit (rename) machine Mode==================

router.put("/:id", authMiddlewarePage, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const updatedMode = await prisma.machineMode.update({
      where: { id: Number(id) },
      data: { name: name.trim() },
    });
    res.json(updatedMode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update machine type" });
  }
});


export default router;
