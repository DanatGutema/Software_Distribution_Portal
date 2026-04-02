// // prisma/seed.js
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';

// //const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// async function main() {
//   // 1️⃣ Define admin credentials
//   const adminEmail = 'danat.gutema@motiengineering.com';
//   const adminPassword = 'Just4Now';
//   const hashedPassword = await bcrypt.hash(adminPassword, 10);
// //MotiHub!
//   // 2️⃣ Create admin user if not exists
//   let admin = await prisma.user.findUnique({
//     where: { email: adminEmail },
//   });



// if (admin) {
//     console.log("⚠️ Admin already exists.  Skipping creation.");
//     return;
//   }

//   await prisma.user.create({
//     data: {
//       fullname: "Super Admin",
//       email: adminEmail,
//       password: hashedPassword,  // hash it in real use
//       role: 2,
//       status: "approved",
//     },
//   });

//   console.log("🌱 Admin created successfully!");
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());






import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'danat.gutema@motiengineering.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) throw new Error('Please set SEED_ADMIN_PASSWORD in env');

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      fullname: "Super Admin",
      password: hashedPassword,
      role: 2,
      status: "approved"
    },
    create: {
      fullname: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: 2,
      status: "approved"
    }
  });

  console.log('🌱 Admin user seeded (created or updated).');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
