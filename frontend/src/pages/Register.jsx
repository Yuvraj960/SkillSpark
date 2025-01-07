import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(name, email, password);
            alert("Registration successful");
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert("Registration failed");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister} style={{ maxWidth: "300px" }}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button style={{ marginTop: "1rem" }} type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
