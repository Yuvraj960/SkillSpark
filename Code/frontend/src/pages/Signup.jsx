import { useState } from 'react';
import axios from 'axios';
import "../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gitHub: '',
    password: '',
    confirmPassword: '',
    role: 'client',
});

const [error, setError] = useState('');

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', formData);
        console.log('Registration successful:', response.data);
    } catch (error) {
        console.error('Error registering user:', error);
        setError('Failed to register');
    }
};

return (
    <div className="registration-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="registration-form">
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                GitHub Link:
                <input
                    type="text"
                    name="gitHub"
                    value={formData.gitHub}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Confirm Password:
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Role:
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="client">Client</option>
                    <option value="sparky">Sparky</option>
                </select>
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit">Register</button>
        </form>
    </div>
    );
};

export default Signup;
