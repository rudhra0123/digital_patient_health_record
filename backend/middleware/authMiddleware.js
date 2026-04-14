const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  
  try {

    const decoded = jwt.verify(token, "health_secret_key");

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }

};

module.exports = authMiddleware;