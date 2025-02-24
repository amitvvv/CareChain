const express = require('express');
const { authenticateToken, authenticateAdminToken } = require('../middleware/jwt');
const AdminRequest = require('../models/adminRequest');

const router = express.Router();

// New support request
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { description } = req.body;
        const userId = req.user.idNumber;
        const now = new Date();

        const request = new AdminRequest({
            userId,
            description,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0]
        });

        await request.save();
        res.status(201).json({ success: true, message: "Request submitted successfully." });
    } catch (error) {
        console.error("Error submitting support request:", error);
        res.status(500).json({ success: false, error: "Failed to submit support request." });
    }
});

// Get all support requests (Admin Only!)
router.get('/', authenticateAdminToken, async (req, res) => {
    try {
        const requests = await AdminRequest.find({});
        res.status(200).json(requests);
    } catch (error) {
        console.error("Failed to fetch support requests:", error);
        res.status(500).json({ error: "Failed to fetch support requests." });
    }
});

// Set support request completed
router.put('/:id/complete', authenticateAdminToken, async (req, res) => {
    try {
        const requestId = req.params.id;

        const updatedRequest = await AdminRequest.findByIdAndUpdate(
            requestId,
            { completed: true },
            { new: true } // מחזיר את הבקשה המעודכנת
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: "Support request not found." });
        }

        res.status(200).json({ success: true, message: "Request marked as completed." });
    } catch (error) {
        console.error("Failed to mark support request as completed:", error);
        res.status(500).json({ error: "Failed to mark support request as completed." });
    }
});

module.exports = router;