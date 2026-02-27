const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // ✅ ADD THIS

// SIGNUP
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        res.status(500).json({ message: "Signup failed" });
    }
};


// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Generate Token
        const token = jwt.sign(
            { userId: user.id },                 // better naming
            process.env.JWT_SECRET,              // use env variable
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
    console.log("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
}
};