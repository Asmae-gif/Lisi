import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface ProjectFinanceFormProps {
    projectId: number;
    onSuccess: () => void;
    onCancel: () => void;
    financeId?: number;
}

interface FinanceFormData {
    financeur: string;
    montant: string;
    type_financement: string;
    date_financement: string;
}

const ProjectFinanceForm: React.FC<ProjectFinanceFormProps> = ({ 
    projectId, 
    onSuccess, 
    onCancel, 
    financeId 
}) => {
    const [formData, setFormData] = useState<FinanceFormData>({
        financeur: '',
        montant: '',
        type_financement: '',
        date_financement: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFinance = async () => {
        if (!financeId) return;
        
        try {
            setLoading(true);
            const response = await api.get(`/projet-finances/${financeId}`);
            setFormData({
                ...response.data,
                date_financement: response.data.date_financement ? response.data.date_financement.substring(0, 10) : '',
            });
        } catch (err) {
            console.error('Erreur lors du chargement du financement:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinance();
    }, [financeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = {
                ...formData,
                project_id: projectId,
                montant: parseFloat(formData.montant)
            };

            if (financeId) {
                await api.put(`/projet-finances/${financeId}`, data);
            } else {
                await api.post('/projet-finances', data);
            }
            onSuccess();
        } catch (err: any) {
            console.error('Erreur lors de la sauvegarde:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Erreur lors de la sauvegarde du financement');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading && financeId) {
        return <div className="flex justify-center items-center h-64">Chargement...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
                {financeId ? 'Modifier le financement' : 'Nouveau financement'}
            </h3>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="financeur" className="block text-sm font-medium text-gray-700">Financeur</label>
                    <input
                        type="text"
                        id="financeur"
                        name="financeur"
                        value={formData.financeur}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="montant" className="block text-sm font-medium text-gray-700">Montant</label>
                    <input
                        type="number"
                        step="0.01"
                        id="montant"
                        name="montant"
                        value={formData.montant}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="type_financement" className="block text-sm font-medium text-gray-700">Type de financement</label>
                    <select
                        id="type_financement"
                        name="type_financement"
                        value={formData.type_financement}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        <option value="">Sélectionner un type</option>
                        <option value="Prêt">Prêt</option>
                        <option value="Subvention">Subvention</option>
                        <option value="Investissement">Investissement</option>
                        <option value="Don">Don</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="date_financement" className="block text-sm font-medium text-gray-700">Date de financement</label>
                    <input
                        type="date"
                        id="date_financement"
                        name="date_financement"
                        value={formData.date_financement}
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

export default ProjectFinanceForm; 