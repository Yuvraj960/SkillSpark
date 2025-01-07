import { useEffect, useState } from "react";
import { getSkills } from "../services/api";

const SkillList = () => {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await getSkills();
                setSkills(response.data);
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };
        fetchSkills();
    }, []);

    return (
        <div style={{ padding: "1rem" }}>
            <h2>All Skills</h2>
            {skills && skills.length ? (
                <ul>
                    {skills.map((skill) => (
                        <li key={skill._id}>
                            <strong>{skill.title}</strong> by{" "}
                            {skill.provider?.name}
                            {" – "} Rate: {skill.rate} | Category:{" "}
                            {skill.category}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No skills available yet.</p>
            )}
        </div>
    );
};

export default SkillList;
