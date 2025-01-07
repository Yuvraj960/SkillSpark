import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    };

    return (
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
            <Link to="/">Home</Link> | <Link to="/skills">Skills</Link> |{" "}
            {token ? (
                <>
                    <Link to="/create-skill">Create Skill</Link> |{" "}
                    <Link to="/my-bookings">My Bookings</Link> |{" "}
                    <button
                        onClick={handleLogout}
                        style={{ cursor: "pointer" }}
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link> |{" "}
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default NavBar;
