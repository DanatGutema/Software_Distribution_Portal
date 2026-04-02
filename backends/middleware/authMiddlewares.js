
// import jwt from "jsonwebtoken";

// function authMiddlewarePage(req, res, next) {
//   const token = req.cookies.accessToken;
//  if (!token) return res.sendStatus(401).json({ message: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     //req.user = decoded;
//     req.userId = decoded.id; 
//     req.role = decoded.role;     // easier access
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// }

// export default authMiddlewarePage;




// backends/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

function authMiddlewarePage(req, res, next) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default authMiddlewarePage;
