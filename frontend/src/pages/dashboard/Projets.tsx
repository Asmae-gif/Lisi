import React, { useState } from 'react';
import ProjectList from '@/components/ProjectList';
import ProjectForm from '@/components/ProjectForm';

const Projets: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);
    const [refreshList, setRefreshList] = useState(0);

    const handleAddProject = () => {
        setSelectedProjectId(undefined);
        setShowForm(true);
    };

    const handleEditProject = (projectId: number) => {
        setSelectedProjectId(projectId);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setSelectedProjectId(undefined);
        setRefreshList(prev => prev + 1);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setSelectedProjectId(undefined);
    };

  return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Projets</h1>
                {!showForm && (
                    <button
                        onClick={handleAddProject}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Nouveau Projet
                    </button>
                )}
      </div>

            {showForm ? (
                <ProjectForm
                    projectId={selectedProjectId}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            ) : (
                <ProjectList 
                    key={refreshList} 
                    onEditProject={handleEditProject}
                />
            )}
    </div>
  );
};

export default Projets;
