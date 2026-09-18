const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    try {

        // Get token from request header
        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. Please login."
            });
        }

        // Expected format:
        // Bearer TOKEN
        const token =
            authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token missing"
            });
        }

        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // Store logged-in user information
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;