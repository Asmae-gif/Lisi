import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../utils/projectUtils';

interface ProjectFormProps {
    projectId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

interface ProjectFormData {
    name: string;
    description: string;
    type_projet: string;
    status: string;
    date_debut: string;
    date_fin: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'en_attente': return 'bg-yellow-100 text-yellow-800';
        case 'en_cours': return 'bg-blue-100 text-blue-800';
        case 'termine': return 'bg-green-100 text-green-800';
        case 'annule': return 'bg-red-100 text-red-800';
        case 'publie': return 'bg-teal-100 text-teal-800';
        case 'archive': return 'bg-gray-100 text-gray-800';
        case 'suspendu': return 'bg-orange-100 text-orange-800';
        case 'rejete': return 'bg-red-300 text-red-900';
        default: return 'bg-gray-100 text-gray-600';
    }
};

const ProjectForm: React.FC<ProjectFormProps> = ({ projectId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        description: '',
        type_projet: 'finance',
        status: 'en_attente',
        date_debut: '',
        date_fin: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = useCallback(async () => {
        if (!projectId) return;
        
        try {
            setLoading(true);
            const response = await api.get(`/projects/${projectId}`);
            // Formatage des dates pour les inputs type date
            setFormData({
                ...response.data,
                date_debut: response.data.date_debut ? response.data.date_debut.substring(0, 10) : '',
                date_fin: response.data.date_fin ? response.data.date_fin.substring(0, 10) : '',
            });
        } catch (err) {
            console.error('Erreur lors du chargement du projet:', err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Debug: afficher les données envoyées
            console.log('Données envoyées:', formData);
            
            if (projectId) {
                const response = await api.put(`/projects/${projectId}`, formData);
                console.log('Réponse mise à jour:', response.data);
            } else {
                const response = await api.post('/projects', formData);
                console.log('Réponse création:', response.data);
            }
            onSuccess();
        } catch (err: any) {
            console.error('Erreur lors de la sauvegarde:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat();
                setError(errorMessages.join(', '));
            } else {
                setError('Erreur lors de la sauvegarde du projet');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading && projectId) {
        return <div className="flex justify-center items-center h-64">Chargement...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                {projectId ? 'Modifier le projet' : 'Nouveau projet'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="type_projet" className="block text-sm font-medium text-gray-700">Type de projet</label>
                    <select
                        id="type_projet"
                        name="type_projet"
                        value={formData.type_projet}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                        required
                    >
                        {PROJECT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700">Date de début</label>
                    <input
                        type="date"
                        id="date_debut"
                        name="date_debut"
                        value={formData.date_debut}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <input
                        type="date"
                        id="date_fin"
                        name="date_fin"
                        value={formData.date_fin}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        {PROJECT_STATUSES.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export { getStatusColor, PROJECT_STATUSES };
export default ProjectForm; 