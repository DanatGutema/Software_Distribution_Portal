// exports a ready to use prisma clent

// // src/prismaClient.js
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// export default prisma;







// import pkg from "@prisma/client";

// const { PrismaClient } = pkg;

// const prisma = new PrismaClient();

// export default prisma;



import pkg from "@prisma/client";
const { PrismaClient } = pkg;
export default new PrismaClient();
