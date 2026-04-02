import express from "express";
import prisma from "../prismaClient.js";
import authMiddlewarePage from "../middleware/authMiddlewares.js";
//import roleMiddleware from "../middleware/roleMiddleware.js";



const router = express.Router();




// router.get("/stats", authMiddleware, roleMiddleware(2), (req, res) => {
//   res.json({ message: "Admin stats data" });
// });


router.get("/stats", authMiddlewarePage, (req, res) => {
  res.json({ message: "Admin stats data" });
});

// GET all users from the database and display in my admin dashboard
router.get("/users", authMiddlewarePage, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});






// //backend route to approve the user
router.put("/users/:id/approve", authMiddlewarePage, async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.update({
    where: { id },
    data: { status: "approved" },
  });
  res.json(user);
});




// //backend route to promote the user
// router.put("/users/:id/promote", authMiddleware, async (req, res) => {
//   const id = parseInt(req.params.id);
//   const { role } = req.body;

//   const user = await prisma.user.update({
//     where: { id },
//     data: { role, status: "approved" },
//   });

//   res.json(user);
// });
router.put("/users/:id/promote", authMiddlewarePage, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Block promotion if not approved
    if (existingUser.status !== "approved") {
      return res
        .status(400)
        .json({ message: "User must be approved before promotion" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to promote user" });
  }
});





// //backend route to delete the user
router.delete("/users/:id", authMiddlewarePage,  async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ message: "User deleted" });
});




//to deactivate the account 
router.put("/users/:id/inactive", authMiddlewarePage, async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.update({
    where: { id },
    data: { status: "inactive" },
  });
  res.json(user);
});




//to active the account 
router.put("/users/:id/active", authMiddlewarePage, async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.update({
    where: { id },
    data: { status: "approved" },
  });
  res.json(user);
});


export default router;