const Skill = require("../models/Skill");

/**
 * @desc Create a new skill listing
 * @route POST /api/skills
 * @access Protected (user must be logged in)
 */

exports.createSkill = async (req, res) => {
    try {
        const { title, description, category, rate, mode } = req.body;
        const provider = req.user.userId;

        const newSkill = await Skill.create({
            title,
            description,
            category,
            rate,
            mode,
            provider
        });

        return res.status(201).json({
            message: "Skill created successfully",
            skill: newSkill
        });
    } catch (error) {
        console.error("Create Skill Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Get all skills (with optional filters)
 * @route GET /api/skills
 * @access Public
 */

exports.getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find().populate("provider", "name email rating");
        return res.status(200).json(skills);
    } catch (error) {
        console.error("Get All Skills Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Update a skill listing
 * @route PUT /api/skills/:id
 * @access Protected (only the provider can update)
 */

exports.updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const provider = req.user.userId;

        let skill = await Skill.findById(id);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        if (skill.provider.toString() !== provider) {
            return res.status(403).json({ message: "Not authorized to update this skill" });
        }

        const updatedData = req.body;
        const updatedSkill = await Skill.findByIdAndUpdate(id, updatedData, {
            new: true
        });
        return res.status(200).json({
            message: "Skill updated",
            skill: updatedSkill
        });
    } catch (error) {
        console.error("Update Skill Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc Delete a skill listing
 * @route DELETE /api/skills/:id
 * @access Protected (only the provider can delete)
 */

exports.deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const provider = req.user.userId;

        const skill = await Skill.findById(id);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        if (skill.provider.toString() !== provider) {
            return res.status(403).json({ message: "Not authorized to delete this skill" });
        }

        await Skill.findByIdAndRemove(id);
        return res.status(200).json({ message: "Skill deleted" });
    } catch (error) {
        console.error("Delete Skill Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};
