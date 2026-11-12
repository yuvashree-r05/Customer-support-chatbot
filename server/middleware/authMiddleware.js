
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1. Read Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Authentication token required.",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    // 3. Check JWT secret configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Authentication service is unavailable",
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 5. Validate token payload
    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof decoded.userId !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    // 6. Attach authenticated user information
    req.user = {
      id: decoded.userId,
    };

    // 7. Continue to the next middleware or route
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Authentication token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};

module.exports = authMiddleware;
