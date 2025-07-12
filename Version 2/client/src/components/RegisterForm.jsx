// components/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [userType, setUserType] = useState('client');
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    githubUsername: '',
    dob: '',
    skills: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType })
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="register-form">
      <h2>Register as {userType === 'client' ? 'Client' : 'Sparky'}</h2>
      <div className="user-type-toggle">
        <button 
          className={userType === 'client' ? 'active' : ''}
          onClick={() => setUserType('client')}
        >
          Client
        </button>
        <button 
          className={userType === 'sparky' ? 'active' : ''}
          onClick={() => setUserType('sparky')}
        >
          Sparky
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        {userType === 'sparky' && (
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input 
              type="text" 
              name="skills" 
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}