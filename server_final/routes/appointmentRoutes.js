const express = require('express');
const { authenticateToken } = require('../middleware/jwt');
const { User } = require('../api/mongodb');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Appointment managment
router.post("/", authenticateToken, async (req, res) => {
    try {
        // Doctors only!
        if (req.user.userType !== 1) {
            return res.status(403).json({ error: "Access denied. Only doctors can create appointments." });
        }

        const { doctorId, patientId, date, time, description } = req.body;

        const appointment = new Appointment({ doctorId, patientId, date, time, description });
        await appointment.save();

        res.status(201).json({ message: "Appointment created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create appointment" });
    }
});

// Get appointments
router.get("/doctor/:doctorId", authenticateToken, async (req, res) => {
    try {
        // Doctors only!
        if (req.user.userType !== 1) {
            return res.status(403).json({ error: "Access denied. Only doctors can view their appointments." });
        }

        const appointments = await Appointment.find({ doctorId: req.params.doctorId });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});

// Cancel Appointment
router.put("/:id/cancel", authenticateToken, async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const userType = req.user.userType;
        const userId = req.user.idNumber;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        // Doctor can cancel his appointments only!
        if (userType === 1 && appointment.doctorId !== userId) {
            return res.status(403).json({ error: "Doctors can only cancel their own appointments." });
        }

        // Patient cancel to his appointments only!
        if (userType === 2 && appointment.patientId !== userId) {
            return res.status(403).json({ error: "You can only cancel your own appointments." });
        }

        await Appointment.findByIdAndUpdate(appointmentId, { canceled: true });
        res.status(200).json({ message: "Appointment canceled successfully." });
    } catch (error) {
        console.error("Failed to cancel appointment:", error);
        res.status(500).json({ error: "Failed to cancel appointment." });
    }
});

// Update appointment
router.put("/:id/toggle", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { canceled } = req.body;

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { canceled },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ error: "Failed to update appointment status" });
    }
});

// Get appointments by ID
router.get("/patient/:patientId", authenticateToken, async (req, res) => {
    try {
        const { patientId } = req.params;
        const appointments = await Appointment.find({ patientId });

        // Fetch doctor names for each appointment
        const enhancedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
                const doctor = await User.findOne({ idNumber: appointment.doctorId }, "firstName lastName");
                return {
                    ...appointment.toObject(),
                    doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown"
                };
            })
        );

        res.status(200).json(enhancedAppointments);
    } catch (error) {
        console.error("Error fetching appointments for patient:", error);
        res.status(500).json({ error: "Failed to fetch appointments." });
    }
});

module.exports = router;