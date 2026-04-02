import express from "express";
import prisma from "../prismaClient.js";
import authMiddlewarePage from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get("/", authMiddlewarePage, async (req, res) => {
  const types = await prisma.machineType.findMany();
  res.json(types);
});

router.post("/", authMiddlewarePage, async (req, res) => {
  const { name } = req.body;
  const newType = await prisma.machineType.create({ data: { name } });
  res.json(newType);
});


router.delete("/:id", authMiddlewarePage, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.machineType.delete({ where: { id: Number(id) } });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete machine type" });
  }
});



// ================Edit (rename) machine Type==================

router.put("/:id", authMiddlewarePage, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const updatedType = await prisma.machineType.update({
      where: { id: Number(id) },
      data: { name: name.trim() },
    });
    res.json(updatedType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update machine type" });
  }
});


export default router;
