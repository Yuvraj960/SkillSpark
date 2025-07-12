import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, userType, userId }) => {
  const { currentUser } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/projects/${project._id}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: bidAmount })
      });
      
      if (response.ok) {
        setShowBidForm(false);
        setBidAmount('');
      }
    } catch (err) {
      console.error('Failed to submit bid', err);
    }
  };

  const handleAssign = async (sparkyId) => {
    try {
      const response = await fetch(`/api/projects/${project._id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ sparkyId })
      });
      
      if (!response.ok) {
        console.error('Failed to assign project');
      }
    } catch (err) {
      console.error('Failed to assign project', err);
    }
  };

  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="project-meta">
        <span>Skills: {project.skillsRequired.join(', ')}</span>
        <span>Posted by: {project.clientId.username}</span>
        {project.deadline && <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>}
      </div>
      
      {userType === 'sparky' && project.status === 'open' && (
        <>
          {!showBidForm ? (
            <button onClick={() => setShowBidForm(true)}>Bid on Project</button>
          ) : (
            <form onSubmit={handleBidSubmit}>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Your bid amount"
                required
              />
              <button type="submit">Submit Bid</button>
              <button type="button" onClick={() => setShowBidForm(false)}>
                Cancel
              </button>
            </form>
          )}
        </>
      )}
      
      {userType === 'client' && project.clientId._id === userId && (
        <div className="project-bids">
          <h4>Bids Received:</h4>
          {project.bids.length === 0 ? (
            <p>No bids yet</p>
          ) : (
            <ul>
              {project.bids.map(bid => (
                <li key={bid._id}>
                  <div>
                    <span>{bid.sparkyId.username}</span>
                    <span>${bid.amount}</span>
                    {project.status === 'open' && (
                      <button onClick={() => handleAssign(bid.sparkyId._id)}>
                        Assign Project
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectCard;