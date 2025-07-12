import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Welcome to SkillSpark</h1>
        <p>The micro-collaboration platform for student projects</p>
        {!currentUser ? (
          <div className="auth-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        ) : (
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        )}
      </header>

      <section className="features-section">
        <div className="feature-card">
          <h3>For Students</h3>
          <p>Get affordable help with your projects from skilled peers</p>
        </div>
        <div className="feature-card">
          <h3>For Sparkies</h3>
          <p>Earn money by helping others with your expertise</p>
        </div>
        <div className="feature-card">
          <h3>Community Driven</h3>
          <p>Built by students, for students</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How SkillSpark Works</h2>
        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Create a project or browse available ones</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>Sparkies bid on your project or you choose from bids</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Collaborate and complete the project</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;