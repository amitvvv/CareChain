const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, authenticateAdminToken } = require('../middleware/jwt');
const { User, findOne } = require('../api/mongodb');
const { sendEmail } = require('../utils/emailService');
const generateToken = require('../utils/tokenUtils');
const { validateInputs, validatePassword } = require('../utils/validation');
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");


const router = express.Router();
const MAX_FAILED_ATTEMPTS = 3; // כמות ניסיונות מותרת
const LOCK_TIME = 15 * 60 * 1000; // 15 דקות נעילה

// Auth check for token
router.get("/auth-check", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Authenticated", userType: req.user.userType });
});

// Auth check for admin token
router.get("/auth-check-admin", authenticateAdminToken, (req, res) => {
    res.status(200).json({ message: "Authenticated" });
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        
        const user = await findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const resetToken = generateToken();
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // שעה אחת
        await user.save();

        sendEmail(user.email, `Your password reset token is ${resetToken}`);

        res.json({ message: "Reset token sent to your email" });
    } catch (error) {
        console.error("Error sending reset token:", error.body);
        res.status(500).json({ error: `Failed to send reset token` });
    }
});

// Password Reset
router.post("/reset-password", async (req, res) => {
    const { email, token, newPassword } = req.body;

    try {

        const validation = validatePassword(newPassword)
        if (validation) {
            return res.status(400).json({ error: validation });
        }


        const user = await findOne({
            email,
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }

        });


        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({ error: "You cannot use a previously used password." });

        }


        const isPasswordUsed = await Promise.all(
            user.passwordHistory.map(async (oldPasswordHash) => {
                return await bcrypt.compare(newPassword, oldPasswordHash);
            })
        );

        if (isPasswordUsed.includes(true)) {
            return res.status(400).json({ error: "You cannot use a previously used password." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.passwordHistory.push(user.password);
        if (user.passwordHistory.length > 3) user.passwordHistory.shift(); // שמירת 3 סיסמאות אחרונות בלבד
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ error: "Failed to reset password." });
    }
});

// Token verification
router.post("/verify-token", async (req, res) => {
    const { email, token } = req.body;

    try {
        const user = await User.findOne({
            email,
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        res.json({ message: "Token verified successfully" });
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({ error: "Failed to verify token" });
    }
});

// Registration
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, phone, idNumber, password, birthDate } = req.body;

    try {
        // Check inputs first
        const validationError = validateInputs({ firstName, lastName, email, phone, idNumber, password, birthDate });
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        // Check if ID exists
        const existingUser = await findOne({ idNumber });
        if (existingUser) {
            return res.status(400).json({ error: "ID Number is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            idNumber,
            password: hashedPassword,
            birthDate,
            userType: 2,
            passwordHistory: [hashedPassword]  // Add password to password history
        });

        // Log the registered user's information to the console
        console.log("New user registered:", {
            firstName,
            lastName,
            email,
            phone,
            idNumber,
            birthDate,
        });

        await user.save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
});

// Login
// מגבלת כניסות - הגנה מפני Brute Force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 דקות
    max: 3, // עד 5 ניסיונות
    message: { error: "Too many login attempts, please try again later." }
});

// פונקציית כניסה מאובטחת


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Invalid input type." });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // ✅ חסימת משתמשים לא פעילים **לפני בדיקת סיסמה**
        if (!user.active) {
            return res.status(403).json({ error: "Your account has been disabled. Please contact support." });
        }

        // ✅ אם המשתמש חסום זמנית (לא לצמיתות)
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(403).json({ error: "Your account is temporarily locked. Try again later." });
        }

        // ✅ בדיקת סיסמה – תתבצע **רק אם המשתמש אקטיבי**
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            user.failedAttempts += 1;

            // ✅ אם עבר את הסף, המשתמש ייחסם לצמיתות
            if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
                user.active = false; // חשבון מושבת
                await user.save();
                return res.status(403).json({ error: "Your account has been disabled due to multiple failed attempts. Please contact support." });
            }

            // ✅ אם המשתמש עדיין לא הגיע לסף, תן לו נעילה זמנית
            await user.save();
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // ✅ אם המשתמש התחבר בהצלחה – אפס את ניסיונות הכניסה
        user.failedAttempts = 0;
        user.lockUntil = null;
        await user.save();

        // ✅ יצירת טוקן
        const token = jwt.sign({ id: user._id, role: user.userType }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ הגדרת עוגייה מאובטחת
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 3600000
        });

        res.json({ message: "Logged in successfully", userType: user.userType, active: user.active });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});


router.get("/", (req, res) => {
    res.json({ message: "Server is online" });
});

module.exports = router;