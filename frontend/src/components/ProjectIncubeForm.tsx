import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface ProjectIncubeFormProps {
    projectId: number;
    onSuccess: () => void;
    onCancel: () => void;
    incubeId?: number;
}

interface IncubeFormData {
    incubateur: string;
    lieu_incubation: string;
    accompagnateur: string;
    date_entree: string;
}

const ProjectIncubeForm: React.FC<ProjectIncubeFormProps> = ({ 
    projectId, 
    onSuccess, 
    onCancel, 
    incubeId 
}) => {
    const [formData, setFormData] = useState<IncubeFormData>({
        incubateur: '',
        lieu_incubation: '',
        accompagnateur: '',
        date_entree: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIncube = async () => {
        if (!incubeId) return;
        
        try {
            setLoading(true);
            const response = await api.get(`/projet-incubes/${incubeId}`);
            setFormData({
                ...response.data,
                date_entree: response.data.date_entree ? response.data.date_entree.substring(0, 10) : '',
            });
        } catch (err) {
            console.error('Erreur lors du chargement de l\'incubation:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncube();
    }, [incubeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = {
                ...formData,
                project_id: projectId
            };

            if (incubeId) {
                await api.put(`/admin/projet-incubes/${incubeId}`, data);
            } else {
                await api.post('/admin/projet-incubes', data);
            }
            onSuccess();
        } catch (err: any) {
            console.error('Erreur lors de la sauvegarde:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Erreur lors de la sauvegarde de l\'incubation');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading && incubeId) {
        return <div className="flex justify-center items-center h-64">Chargement...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
                {incubeId ? 'Modifier l\'incubation' : 'Nouvelle incubation'}
            </h3>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="incubateur" className="block text-sm font-medium text-gray-700">Incubateur</label>
                    <input
                        type="text"
                        id="incubateur"
                        name="incubateur"
                        value={formData.incubateur}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="lieu_incubation" className="block text-sm font-medium text-gray-700">Lieu d'incubation</label>
                    <input
                        type="text"
                        id="lieu_incubation"
                        name="lieu_incubation"
                        value={formData.lieu_incubation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="accompagnateur" className="block text-sm font-medium text-gray-700">Accompagnateur</label>
                    <input
                        type="text"
                        id="accompagnateur"
                        name="accompagnateur"
                        value={formData.accompagnateur}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="date_entree" className="block text-sm font-medium text-gray-700">Date d'entrée</label>
                    <input
                        type="date"
                        id="date_entree"
                        name="date_entree"
                        value={formData.date_entree}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
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

export default ProjectIncubeForm; 