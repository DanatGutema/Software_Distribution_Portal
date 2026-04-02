// src/middleware/roleMiddleware.js
import prisma from "../prismaClient.js";

export async function isAdmin(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (user.role !== 2) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function isManager(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (user.role !== 1) {
      return res.status(403).json({ message: "Access denied: Managers only" });
    }

    next();
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}



// Purpose
//Admin routes (approve user, promote, delete) must be restricted
//Manager routes (if you have any) also restricted