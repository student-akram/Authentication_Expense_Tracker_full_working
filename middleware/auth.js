const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token missing" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error.message);
        return res.status(401).json({ message: "Token expired or invalid" });
    }
};