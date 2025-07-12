// components/ProjectList.js
import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ userType, userId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const endpoint = userType === 'sparky' 
          ? '/api/projects' 
          : `/api/projects/client/${userId}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userType, userId]);

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="project-list">
      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map(project => (
          <ProjectCard 
            key={project._id} 
            project={project} 
            userType={userType}
            userId={userId}
          />
        ))
      )}
    </div>
  );
}

export default ProjectList;