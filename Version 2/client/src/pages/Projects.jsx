import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';

const Projects = () => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="projects-page">
      {currentUser.userType === 'client' && (
        <div className="project-actions">
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create New Project'}
          </button>
          {showForm && <ProjectForm />}
        </div>
      )}
      
      <h2>{currentUser.userType === 'client' ? 'Your Projects' : 'Available Projects'}</h2>
      <ProjectList userType={currentUser.userType} userId={currentUser._id} />
    </div>
  );
}

export default Projects;