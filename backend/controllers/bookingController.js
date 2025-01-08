const Booking = require("../models/Booking");
const Skill = require("../models/Skill");

/**
 * @desc Create a new booking (session request)
 * @route POST /api/bookings
 * @access Protected (user must be logged in)
 */

exports.createBooking = async (req, res) => {
    try {
        const { skillId, sessionDate, paymentAmount } = req.body;
        const requester = req.user.userId;

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        const newBooking = await Booking.create({
            skill: skillId,
            requester,
            provider: skill.provider,
            sessionDate,
            paymentAmount
        });

        return res.status(201).json({
            message: "Booking created successfully",
            booking: newBooking
        });
    } catch (error) {
        console.error("Create Booking Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Update booking status (e.g., confirm, complete, cancel)
 * @route PUT /api/bookings/:id
 * @access Protected
 */

exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = status;
        await booking.save();

        return res.status(200).json({
            message: `Booking ${status}`,
            booking
        });
    } catch (error) {
        console.error("Update Booking Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Get bookings for the logged-in user
 * @route GET /api/bookings/my
 * @access Protected
 */

exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookings = await Booking.find({
            $or: [{ requester: userId }, { provider: userId }]
        })
            .populate("skill")
            .populate("requester", "name email")
            .populate("provider", "name email");

        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Get My Bookings Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};
