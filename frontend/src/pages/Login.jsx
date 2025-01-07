import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            localStorage.setItem("authToken", response.data.token);
            alert("Login Successful");
            navigate("/skills");
        } catch (error) {
            console.error(error);
            alert("Login failed");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: "300px" }}>
                <div>
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
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
