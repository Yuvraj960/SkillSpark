const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Skill = require("../models/Skill");
const { protect } = require("../middleware/authMiddleware");
const {
    createBooking,
    updateBooking,
    getMyBookings
} = require("../controllers/bookingController");

// @route POST /api/bookings
router.post("/", protect, createBooking);

// @route PUT /api/bookings/:id
router.put("/:id", protect, updateBooking);

// @route GET /api/bookings/my
router.get("/my", protect, getMyBookings);

router.post("/bookings", async (req, res) => {
    try {
        const { skillId, userId, date, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(skillId)) {
            return res.status(400).json({ error: "Invalid skill ID format" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ error: "Skill not found" });
        }

        const booking = new Booking({
            skill: skillId,
            user: userId,
            date,
            description,
        });
        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;