import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { getStatusColor, formatStatus, getTypeColor, formatType } from '../utils/projectUtils';
import ProjectDetails from '@/components/ProjectDetails';

interface Project {
    id: number;
    name: string;
    description: string;
    type_projet: string;
    status: string;
    date_debut: string;
    date_fin: string;
    created_at: string;
}

interface ProjectListProps {
    onEditProject?: (id: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onEditProject }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement des projets:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                await api.delete(`/projects/${id}`);
                await fetchProjects();
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
            }
        }
    };

    const handleViewDetails = (projectId: number) => {
        setSelectedProjectId(projectId);
    };

    const handleBackToList = () => {
        setSelectedProjectId(null);
        fetchProjects(); // Rafraîchir la liste
    };

    const handleEditProject = (projectId: number) => {
        setSelectedProjectId(null);
        onEditProject?.(projectId);
    };

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    // Afficher les détails d'un projet si sélectionné
    if (selectedProjectId) {
        return (
            <ProjectDetails
                projectId={selectedProjectId}
                onBack={handleBackToList}
                onEdit={() => handleEditProject(selectedProjectId)}
            />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Liste des Projets</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de début</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de fin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(project.type_projet)}`}>
                                            {formatType(project.type_projet)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                            {formatStatus(project.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {project.date_debut ? new Date(project.date_debut).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {project.date_fin ? new Date(project.date_fin).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(project.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Voir détails
                                            </button>
                                            <button
                                                onClick={() => onEditProject?.(project.id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectList; 