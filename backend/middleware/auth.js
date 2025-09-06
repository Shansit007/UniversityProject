const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // expects "Bearer <token>"
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 🔑 must match payload from loginStudent
    req.user = { studentId: decoded.studentId };
    next();
  } catch (err) {
    console.error("Student auth error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
