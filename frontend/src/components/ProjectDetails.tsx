import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { getStatusColor, formatStatus, getTypeColor, formatType } from '../utils/projectUtils';
import ProjectFinanceForm from './ProjectFinanceForm';
import ProjectIncubeForm from './ProjectIncubeForm';

interface Project {
    id: number;
    name: string;
    description: string;
    type_projet: string;
    status: string;
    date_debut: string;
    date_fin: string;
    created_at: string;
    updated_at: string;
}

interface Finance {
    id: number;
    project_id: number;
    financeur: string;
    montant: number;
    type_financement: string;
    date_financement: string;
}

interface Incube {
    id: number;
    project_id: number;
    incubateur: string;
    lieu_incubation: string;
    accompagnateur: string;
    date_entree: string;
}

interface ProjectDetailsProps {
    projectId: number;
    onBack: () => void;
    onEdit: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onBack, onEdit }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [finances, setFinances] = useState<Finance[]>([]);
    const [incubes, setIncubes] = useState<Incube[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFinanceForm, setShowFinanceForm] = useState(false);
    const [showIncubeForm, setShowIncubeForm] = useState(false);
    const [editingFinanceId, setEditingFinanceId] = useState<number | null>(null);
    const [editingIncubeId, setEditingIncubeId] = useState<number | null>(null);

    const fetchProject = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/projects/${projectId}`);
            setProject(response.data);
        } catch (err) {
            console.error('Erreur lors du chargement du projet:', err);
            setError('Erreur lors du chargement du projet');
        } finally {
            setLoading(false);
        }
    };

    const fetchFinances = async () => {
        if (project?.type_projet === 'finance') {
            try {
                const response = await api.get(`/projects/${projectId}/finances`);
                setFinances(response.data);
            } catch (err) {
                console.error('Erreur lors du chargement des financements:', err);
            }
        }
    };

    const fetchIncubes = async () => {
        if (project?.type_projet === 'incube') {
            try {
                const response = await api.get(`/projects/${projectId}/incubes`);
                setIncubes(response.data);
            } catch (err) {
                console.error('Erreur lors du chargement des incubations:', err);
            }
        }
    };

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    useEffect(() => {
        if (project) {
            fetchFinances();
            fetchIncubes();
        }
    }, [project]);

    const handleDeleteFinance = async (financeId: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce financement ?')) {
            try {
                await api.delete(`/projet-finances/${financeId}`);
                await fetchFinances();
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
            }
        }
    };

    const handleDeleteIncube = async (incubeId: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette incubation ?')) {
            try {
                await api.delete(`/projet-incubes/${incubeId}`);
                await fetchIncubes();
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
            }
        }
    };

    const handleFinanceSuccess = () => {
        setShowFinanceForm(false);
        setEditingFinanceId(null);
        fetchFinances();
    };

    const handleIncubeSuccess = () => {
        setShowIncubeForm(false);
        setEditingIncubeId(null);
        fetchIncubes();
    };

    const handleEditFinance = (financeId: number) => {
        setEditingFinanceId(financeId);
        setShowFinanceForm(true);
    };

    const handleEditIncube = (incubeId: number) => {
        setEditingIncubeId(incubeId);
        setShowIncubeForm(true);
    };

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!project) return <div className="text-center">Projet non trouvé</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* En-tête */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
                        <div className="flex space-x-2 mt-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(project.type_projet)}`}>
                                {formatType(project.type_projet)}
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                {formatStatus(project.status)}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={onBack}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Retour
                        </button>
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Modifier
                        </button>
                    </div>
                </div>

                {/* Informations du projet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                        <p className="text-gray-600">{project.description}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Dates</h3>
                        <div className="space-y-2">
                            <p><span className="font-medium">Début :</span> {project.date_debut ? new Date(project.date_debut).toLocaleDateString() : 'Non définie'}</p>
                            <p><span className="font-medium">Fin :</span> {project.date_fin ? new Date(project.date_fin).toLocaleDateString() : 'Non définie'}</p>
                        </div>
                    </div>
                </div>

                {/* Section Financements */}
                {project.type_projet === 'finance' && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Financements</h3>
                            <button
                                onClick={() => setShowFinanceForm(true)}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                Ajouter un financement
                            </button>
                        </div>
                        
                        {finances.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">Financeur</th>
                                            <th className="px-4 py-2 text-left">Montant</th>
                                            <th className="px-4 py-2 text-left">Type</th>
                                            <th className="px-4 py-2 text-left">Date</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {finances.map((finance) => (
                                            <tr key={finance.id} className="border-t border-gray-200">
                                                <td className="px-4 py-2">{finance.financeur}</td>
                                                <td className="px-4 py-2">{finance.montant.toLocaleString('fr-FR')} €</td>
                                                <td className="px-4 py-2">{finance.type_financement}</td>
                                                <td className="px-4 py-2">{finance.date_financement ? new Date(finance.date_financement).toLocaleDateString() : '-'}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditFinance(finance.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFinance(finance.id)}
                                                            className="text-red-600 hover:text-red-900 text-sm"
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
                        ) : (
                            <p className="text-gray-500">Aucun financement enregistré</p>
                        )}
                    </div>
                )}

                {/* Section Incubations */}
                {project.type_projet === 'incube' && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Incubations</h3>
                            <button
                                onClick={() => setShowIncubeForm(true)}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                Ajouter une incubation
                            </button>
                        </div>
                        
                        {incubes.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">Incubateur</th>
                                            <th className="px-4 py-2 text-left">Lieu</th>
                                            <th className="px-4 py-2 text-left">Accompagnateur</th>
                                            <th className="px-4 py-2 text-left">Date d'entrée</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incubes.map((incube) => (
                                            <tr key={incube.id} className="border-t border-gray-200">
                                                <td className="px-4 py-2">{incube.incubateur}</td>
                                                <td className="px-4 py-2">{incube.lieu_incubation || '-'}</td>
                                                <td className="px-4 py-2">{incube.accompagnateur || '-'}</td>
                                                <td className="px-4 py-2">{incube.date_entree ? new Date(incube.date_entree).toLocaleDateString() : '-'}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditIncube(incube.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteIncube(incube.id)}
                                                            className="text-red-600 hover:text-red-900 text-sm"
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
                        ) : (
                            <p className="text-gray-500">Aucune incubation enregistrée</p>
                        )}
                    </div>
                )}

                {/* Formulaires modaux */}
                {showFinanceForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <ProjectFinanceForm
                                projectId={projectId}
                                financeId={editingFinanceId || undefined}
                                onSuccess={handleFinanceSuccess}
                                onCancel={() => {
                                    setShowFinanceForm(false);
                                    setEditingFinanceId(null);
                                }}
                            />
                        </div>
                    </div>
                )}

                {showIncubeForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <ProjectIncubeForm
                                projectId={projectId}
                                incubeId={editingIncubeId || undefined}
                                onSuccess={handleIncubeSuccess}
                                onCancel={() => {
                                    setShowIncubeForm(false);
                                    setEditingIncubeId(null);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails; 