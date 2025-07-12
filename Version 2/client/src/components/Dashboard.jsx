// components/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectList from './ProjectList';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard">
      <h2>Welcome, {currentUser.fullName}</h2>
      
      {currentUser.userType === 'sparky' && (
        <div className="wallet-section">
          <h3>Your Wallet</h3>
          <p>Balance: ${currentUser.wallet}</p>
        </div>
      )}

      <div className="active-projects">
        <h3>{currentUser.userType === 'client' ? 'Your Projects' : 'Projects You\'re Working On'}</h3>
        <ProjectList userType={currentUser.userType} userId={currentUser._id} />
      </div>
    </div>
  );
}