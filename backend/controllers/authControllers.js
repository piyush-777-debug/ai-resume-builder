const userModel = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const RegisterUser = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(401).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            fullname,
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const existingUser = await userModel.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate token
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existingUser._id,
                fullname: existingUser.fullname,
                username: existingUser.username,
                email: existingUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const LogoutUser = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { RegisterUser, LoginUser, LogoutUser };
