// const jwt = require("jsonwebtoken");

// exports.authenticateUser = (req, res, next) => {
//   try {
//     let token;

//     // ✅ First check cookie
//     if (req.cookies && req.cookies.access_token) {
//       token = req.cookies.access_token;
//     }

//     // ✅ Then check Authorization header
//     else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
//     }

//     // ✅ Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ Attach decoded user info to request
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };
