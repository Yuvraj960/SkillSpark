const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        },

        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            default: "pending"
        },

        sessionDate: {
            type: Date,
            required: true
        },

        paymentAmount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
