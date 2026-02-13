import jwt from "jsonwebtoken";

export const requireAuth = (roles = []) => (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
