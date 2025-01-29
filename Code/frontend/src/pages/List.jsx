import "../styles/List.css";

const List = () => {
    const users = [
        {
            name: "John Doe",
            profilePic: "profile.jpg",
            skills: ["JavaScript", "React", "Node.js"],
        },
        {
            name: "Jane Smith",
            profilePic: "profile.jpg",
            skills: ["Python", "Django", "Flask"],
        },
        {
            name: "Alex Johnson",
            profilePic: "profile.jpg",
            skills: ["HTML", "CSS", "JavaScript"],
        },
    ];

    return (
        <div className="user-list">
            <h2>User Profiles</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={index} className="user-item">
                        <div className="user-profile">
                            <img
                                src={user.profilePic}
                                alt={`${user.name}'s profile`}
                                className="profile-pic"
                            />
                            <div className="user-info">
                                <h3 className="user-name">{user.name}</h3>
                                <div className="user-skills">
                                    {user.skills.map((skill, i) => (
                                        <span key={i} className="skill">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default List;
