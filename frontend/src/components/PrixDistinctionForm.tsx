import React, { useState, useEffect } from 'react';
import api from '../lib/axios';

interface Membre {
    id: number;
    nom: string;
    prenom: string;
}

interface PrixDistinction {
    id?: number;
    nom: string;
    description: string;
    date_obtention: string;
    membre_id: number;
}

interface PrixDistinctionFormProps {
    prix?: PrixDistinction | null;
    onSave: () => void;
    onCancel: () => void;
}

const PrixDistinctionForm: React.FC<PrixDistinctionFormProps> = ({ prix, onSave, onCancel }) => {
    const [formData, setFormData] = useState<PrixDistinction>({
        nom: '',
        description: '',
        date_obtention: '',
        membre_id: 0
    });
    const [membres, setMembres] = useState<Membre[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditing = !!prix;

    useEffect(() => {
        fetchMembres();
        if (prix) {
            setFormData({
                nom: prix.nom,
                description: prix.description,
                date_obtention: prix.date_obtention,
                membre_id: prix.membre_id
            });
        }
    }, [prix]);

    const fetchMembres = async () => {
        try {
            const response = await api.get('/api/membres');
            if (response.data.success) {
                setMembres(response.data.data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des membres:', error);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom du prix est requis';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La description est requise';
        }

        if (!formData.date_obtention) {
            newErrors.date_obtention = 'La date d\'obtention est requise';
        }

        if (!formData.membre_id) {
            newErrors.membre_id = 'Le membre est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            let response;
            if (isEditing && prix?.id) {
                response = await api.put(`/api/prix-distinctions/${prix.id}`, formData);
            } else {
                response = await api.post('/api/prix-distinctions', formData);
            }

            if (response.data.success) {
                alert(isEditing ? 'Prix/distinction mis à jour avec succès' : 'Prix/distinction créé avec succès');
                onSave();
            } else {
                alert('Erreur lors de l\'opération');
            }
        } catch (error: any) {
            console.error('Erreur:', error);
            if (error.response?.data?.errors) {
                const serverErrors: Record<string, string> = {};
                Object.keys(error.response.data.errors).forEach(key => {
                    serverErrors[key] = error.response.data.errors[key][0];
                });
                setErrors(serverErrors);
            } else {
                alert('Erreur lors de l\'opération');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {isEditing ? 'Modifier le Prix/Distinction' : 'Ajouter un Prix/Distinction'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du Prix/Distinction *
                    </label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.nom ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Prix d'Excellence en Recherche"
                    />
                    {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Description détaillée du prix ou de la distinction..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label htmlFor="membre_id" className="block text-sm font-medium text-gray-700 mb-2">
                        Membre *
                    </label>
                    <select
                        id="membre_id"
                        name="membre_id"
                        value={formData.membre_id}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.membre_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Sélectionner un membre</option>
                        {membres.map((membre) => (
                            <option key={membre.id} value={membre.id}>
                                {membre.nom} {membre.prenom}
                            </option>
                        ))}
                    </select>
                    {errors.membre_id && <p className="text-red-500 text-sm mt-1">{errors.membre_id}</p>}
                </div>

                <div>
                    <label htmlFor="date_obtention" className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'obtention *
                    </label>
                    <input
                        type="date"
                        id="date_obtention"
                        name="date_obtention"
                        value={formData.date_obtention}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.date_obtention ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.date_obtention && <p className="text-red-500 text-sm mt-1">{errors.date_obtention}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer')}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrixDistinctionForm; 