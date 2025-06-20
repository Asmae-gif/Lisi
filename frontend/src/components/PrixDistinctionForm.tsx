import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { PrixDistinction, PrixDistinctionFormData } from '../types/prixDistinction';

interface Membre {
    id: number;
    nom: string;
    prenom: string;
}

interface PrixDistinctionFormProps {
    prix?: PrixDistinction | null;
    onSave: () => void;
    onCancel: () => void;
}

const PrixDistinctionForm: React.FC<PrixDistinctionFormProps> = ({ prix, onSave, onCancel }) => {
    const [formData, setFormData] = useState<PrixDistinctionFormData>({
        nom: '',
        description: '',
        date_obtention: '',
        organisme: '',
        image_url: '',
        lien_externe: '',
        membres: []
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
                organisme: '',
                image_url: '',
                lien_externe: '',
                membres: prix.membres.map(m => ({
                    membre_id: m.id,
                    role: m.role || '',
                    ordre: m.ordre || 1
                }))
            });
        }
    }, [prix]);

    const fetchMembres = async () => {
        try {
            const response = await api.get('/api/membres');
            setMembres(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des membres:', error);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nom.trim()) newErrors.nom = 'Le nom du prix est requis';
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        if (!formData.date_obtention) newErrors.date_obtention = 'La date d\'obtention est requise';
        if (formData.membres.length === 0) newErrors.membres = 'Au moins un membre est requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
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
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Gestion des membres (ajout, suppression, édition)
    const addMembre = () => {
        setFormData(prev => ({
            ...prev,
            membres: [...prev.membres, { membre_id: 0, role: '', ordre: prev.membres.length + 1 }]
        }));
    };
    const removeMembre = (index: number) => {
        setFormData(prev => ({
            ...prev,
            membres: prev.membres.filter((_, i) => i !== index)
        }));
    };
    const updateMembre = (index: number, field: string, value: any) => {
        setFormData(prev => ({
                ...prev,
            membres: prev.membres.map((m, i) => i === index ? { ...m, [field]: value } : m)
            }));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {isEditing ? 'Modifier le Prix/Distinction' : 'Ajouter un Prix/Distinction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">Nom du Prix/Distinction *</label>
                    <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nom ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: Prix d'Excellence en Recherche" />
                    {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Description détaillée du prix ou de la distinction..." />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                <div>
                    <label htmlFor="date_obtention" className="block text-sm font-medium text-gray-700 mb-2">Date d'obtention *</label>
                    <input type="date" id="date_obtention" name="date_obtention" value={formData.date_obtention} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date_obtention ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.date_obtention && <p className="text-red-500 text-sm mt-1">{errors.date_obtention}</p>}
                </div>
                <div>
                    <label htmlFor="organisme" className="block text-sm font-medium text-gray-700 mb-2">Organisme</label>
                    <input type="text" id="organisme" name="organisme" value={formData.organisme} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.organisme ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: Université de Paris" />
                    {errors.organisme && <p className="text-red-500 text-sm mt-1">{errors.organisme}</p>}
                </div>
                <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">URL de l'image</label>
                    <input type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.image_url ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: https://example.com/image.jpg" />
                    {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>}
                </div>
                <div>
                    <label htmlFor="lien_externe" className="block text-sm font-medium text-gray-700 mb-2">Lien externe</label>
                    <input type="text" id="lien_externe" name="lien_externe" value={formData.lien_externe} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lien_externe ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: https://example.com" />
                    {errors.lien_externe && <p className="text-red-500 text-sm mt-1">{errors.lien_externe}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Membres *</label>
                    <div className="space-y-2">
                        {formData.membres.map((membre, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">Membre</label>
                                    <select value={membre.membre_id} onChange={e => updateMembre(index, 'membre_id', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Sélectionner un membre</option>
                                        {membres.map(m => (
                                            <option key={m.id} value={m.id}>{m.nom} {m.prenom}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">Rôle</label>
                                    <input type="text" value={membre.role} onChange={e => updateMembre(index, 'role', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Gagnant principal" />
                                </div>
                                <div className="w-20">
                                    <label className="block text-xs text-gray-500 mb-1">Ordre</label>
                                    <input type="number" value={membre.ordre} onChange={e => updateMembre(index, 'ordre', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1" />
                                </div>
                                <button type="button" onClick={() => removeMembre(index)} className="text-red-500 hover:text-red-700 mt-6">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addMembre} className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">+ Ajouter un membre</button>
                    </div>
                    {errors.membres && <p className="text-red-500 text-sm mt-1">{errors.membres}</p>}
                </div>
                <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors">{loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer')}</button>
                    <button type="button" onClick={onCancel} disabled={loading} className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors">Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default PrixDistinctionForm; 