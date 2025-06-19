import React, { useEffect, useState } from 'react';
import { projectApi } from '../services/projectApi';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await projectApi.getAll();
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    getProjects();
  }, []);

  return (
    <div>
      <h2>Liste des Projets</h2>
      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 border rounded shadow">
            <h3 className="font-bold">{project.title}</h3>
            <p>{project.description}</p>
            <span className="text-sm text-gray-500">Status: {project.status}</span>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          Aucun projet disponible.
        </p>
      )}
    </div>
  );
}