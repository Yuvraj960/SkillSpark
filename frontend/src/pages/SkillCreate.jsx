import { useState } from "react";
import { createSkill } from "../services/api";
import { useNavigate } from "react-router-dom";

const SkillCreate = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [rate, setRate] = useState(0);
    const [category, setCategory] = useState("");
    const [mode, setMode] = useState("online");
    const navigate = useNavigate();

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        try {
            const skillData = { title, description, rate, category, mode };
            await createSkill(skillData);
            alert("Skill created successfully!");
            navigate("/skills");
        } catch (error) {
            console.error(error);
            alert("Failed to create skill");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Create Skill</h2>
            <form onSubmit={handleCreateSkill} style={{ maxWidth: "300px" }}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <label>Rate:</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <label>Mode:</label>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="online">Online</option>
                        <option value="in-person">In-Person</option>
                        <option value="both">Both</option>
                    </select>
                </div>
                <button style={{ marginTop: "1rem" }} type="submit">
                    Create
                </button>
            </form>
        </div>
    );
};

export default SkillCreate;
