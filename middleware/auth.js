const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ message: "Token missing" });
        }

        // 🔥 Remove "Bearer "
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (err) {
        console.log("AUTH ERROR:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};