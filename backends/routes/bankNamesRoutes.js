import express from "express";
import prisma from "../prismaClient.js";
import authMiddlewarePage from "../middleware/authMiddlewares.js";
const router = express.Router();


console.log("✅ banksRoutes.js LOADED");

// GET all banks
router.get("/", authMiddlewarePage, async (req, res) => {
  try {
    const banks = await prisma.bank.findMany({
      orderBy: { name: "asc" }
    });
    res.json(banks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch banks" });
  }
});

// ADD bank
router.post("/", authMiddlewarePage, async (req, res) => {
     console.log("POST /banks body:", req.body); // <- check what frontend is sending
  const { name } = req.body;
  try {
    const bank = await prisma.bank.create({
      data: { name: req.body.name }
    });
    res.json(bank);
  } catch (error) {
     console.error("prisma ERROR:", error); // <- this will show exact Prisma error
  //   res.status(500).json({ error: "Failed to create bank" });
  // }

    res.status(500).json({
      message: "Failed to create bank",
      prismaCode: error.code,
      prismaMessage: error.message,
    });
}
});

// DELETE bank
router.delete("/:id", authMiddlewarePage,  async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.bank.delete({
      where: { id: Number(id) }
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bank" });
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
    const updatedBank = await prisma.bank.update({
      where: { id: Number(id) },
      data: { name: name.trim() },
    });
    res.json(updatedBank);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update machine type" });
  }
});

export default router;
