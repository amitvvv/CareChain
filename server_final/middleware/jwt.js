const jwt = require("jsonwebtoken");
const { findById } = require("../api/mongodb");

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

        const user = jwt.verify(token, process.env.JWT_SECRET); // אין צורך ב-callback

        const userDb = await findById(user.id, "-password -passwordHistory");
        if (!userDb) {
            return res.status(404).json({ error: "User not found." });
        }

        req.user = userDb;
        next();
    } catch (error) {
        console.error("❌ Error verifying token:", error);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

const authenticateAdminToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token" });

        try {
            const userDb = await findById(user.id, "-password -passwordHistory");
            if (!userDb) {
                return res.status(404).json({ error: "User not found." });
            }

            if (userDb.userType != 0) return res.status(404).json({ error: "Access denied." });

            req.user = userDb;
            next();
        } catch (error) {
            return res.status(403).json({ error: "Cannot verify user" });
        }

    });
};

module.exports = { authenticateAdminToken, authenticateToken }