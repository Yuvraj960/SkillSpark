const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Skill title is required"]
        },
        description: {
            type: String
        },
        category: {
            type: String,
            default: "Miscellaneous"
        },

        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        rate: {
            type: Number,
            default: 0
        },

        mode: {
            type: String,
            enum: ["online", "in-person", "both"],
            default: "online"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
