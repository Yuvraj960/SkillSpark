const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createSkill,
    getAllSkills,
    updateSkill,
    deleteSkill
} = require("../controllers/skillController");

// @route POST /api/skills
router.post("/", protect, createSkill);

// @route GET /api/skills
router.get("/", getAllSkills);

// @route PUT /api/skills/:id
router.put("/:id", protect, updateSkill);

// @route DELETE /api/skills/:id
router.delete("/:id", protect, deleteSkill);

module.exports = router;
