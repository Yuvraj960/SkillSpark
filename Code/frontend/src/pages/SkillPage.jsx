import "../styles/SkillPage.css";
import profile from "../images/Studenta.png";
import html from "../images/html-icon.png";
import css from "../images/css-icon.png";
import js from "../images/javascript-icon.png";
import react from "../images/react-icon.png";
import nodejs from "../images/nodejs-icon.jpg";
const SkillPage = () => {
    return (
        <div className="skill-page-container">
            {/* Left Section - User Profile */}
            <div className="profile-section">
                <div className="profile-header">
                    <img src={profile} alt="User" className="user-photo" />
                    <h2>John Doe</h2>
                    <p>Full-Stack Developer</p>
                </div>
                <div className="resume">
                    <h3>Resume</h3>
                    <a href="resume.pdf" download>
                        Download Resume
                    </a>
                </div>
            </div>

            {/* Right Section - Skills, Achievements, and Certifications */}
            <div className="details-section">
                {/* Skills Section */}
                <div className="skills-section">
                    <h3>Skills</h3>
                    <div className="skills-grid">
                        <div className="skill">
                            <img src={html} alt="HTML" />
                            <p>HTML</p>
                        </div>
                        <div className="skill">
                            <img src={css} alt="CSS" />
                            <p>CSS</p>
                        </div>
                        <div className="skill">
                            <img src={js} alt="JavaScript" />
                            <p>JavaScript</p>
                        </div>
                        <div className="skill">
                            <img src={react} alt="React" />
                            <p>React</p>
                        </div>
                        <div className="skill">
                            <img src={nodejs} alt="Node.js" />
                            <p>Node.js</p>
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="achievements-section">
                    <h3>Achievements</h3>
                    <ul>
                        <li>Winner of Smart India Hackathon 2024</li>
                        <li>
                            Built a full-stack internship portal for college
                        </li>
                        <li>Developed a travel booking website with React</li>
                    </ul>
                </div>

                {/* Certifications Section */}
                <div className="certifications-section">
                    <h3>Certifications</h3>
                    <ul>
                        <li>React Development - Coursera</li>
                        <li>Full-Stack Web Development - Udemy</li>
                        <li>Data Structures and Algorithms - GeeksforGeeks</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SkillPage;
