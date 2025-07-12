import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    githubUsername: currentUser.githubUsername,
    skills: currentUser.skills?.join(', ') || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      
      {!editMode ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {currentUser.fullName}</p>
          <p><strong>Username:</strong> {currentUser.username}</p>
          <p><strong>GitHub:</strong> {currentUser.githubUsername || 'Not provided'}</p>
          {currentUser.userType === 'sparky' && (
            <p><strong>Skills:</strong> {currentUser.skills?.join(', ') || 'None'}</p>
          )}
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>GitHub Username</label>
            <input
              type="text"
              name="githubUsername"
              value={formData.githubUsername}
              onChange={handleChange}
            />
          </div>
          {currentUser.userType === 'sparky' && (
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
          )}
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;