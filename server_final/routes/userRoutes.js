const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken, authenticateAdminToken } = require('../middleware/jwt');
const { User } = require('../api/mongodb');

const router = express.Router();

// User details
router.get("/user-details", authenticateToken, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user details." });
    }
});

// User List (Admin Only!)
router.get('/', authenticateAdminToken, async (req, res) => {
    try {
        const users = await User.find({}, '-password -passwordHistory');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// New User (Admin only!)
router.post('/', authenticateAdminToken, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// User Update! (Admin only!)
router.put('/:id', authenticateAdminToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete user! (Admin only!)
router.delete('/:id', authenticateAdminToken, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Unblock user
router.put("/:id/toggle-active", authenticateAdminToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.active = req.body.active;
        await user.save();

        res.status(200).json({ message: "User active status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user status" });
    }
});

// Get user name
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ idNumber: req.params.id }, "firstName lastName");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

module.exports = router;