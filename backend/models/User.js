const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },

        skillsOffered: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],
        skillsWanted: [
            {
                type: String
            }
        ],

        location: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
