import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../utils/projectUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AxiosError } from 'axios';

interface ProjectFormProps {
    projectId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

interface ProjectFormData {
    name_fr: string;
    name_en: string;
    name_ar: string;
    description?: string;
    description_fr: string;
    description_en: string;
    description_ar: string;
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
        name_fr: '',
        name_en: '',
        name_ar: '',
        description_fr: '',
        description_en: '',
        description_ar: '',
        type_projet: 'finance',
        status: 'en_attente',
        date_debut: '',
        date_fin: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('fr');

    // Ensure tab exists, fallback to 'fr'
    useEffect(() => {
        if (!['fr', 'en', 'ar'].includes(activeTab)) {
            setActiveTab('fr');
        }
    }, [activeTab]);

    const fetchProject = useCallback(async () => {
        if (!projectId) return;
        
        try {
            setLoading(true);
            const response = await api.get(`/admin/projects/${projectId}`);
            setFormData({
                name_fr: response.data.name_fr || '',
                name_en: response.data.name_en || '',
                name_ar: response.data.name_ar || '',
                description_fr: response.data.description_fr || '',
                description_en: response.data.description_en || '',
                description_ar: response.data.description_ar || '',
                type_projet: response.data.type_projet,
                status: response.data.status,
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
            const dataToSend = {
                name_fr: formData.name_fr,
                name_en: formData.name_en,
                name_ar: formData.name_ar,
                description_fr: formData.description_fr,
                description_en: formData.description_en,
                description_ar: formData.description_ar,
                name: formData.name_fr,
                description: formData.description_fr,
                type_projet: formData.type_projet,
                status: formData.status,
                date_debut: formData.date_debut,
                date_fin: formData.date_fin,
            };

            if (projectId) {
                await api.put(`/admin/projects/${projectId}`, dataToSend);
            } else {
                await api.post('/admin/projects', dataToSend);
            }
            onSuccess();
        } catch (err: unknown) {
            console.error('Erreur lors de la sauvegarde:', err);
            if (err instanceof AxiosError && err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof AxiosError && err.response?.data?.errors) {
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
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="fr">Français</TabsTrigger>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>
                    <TabsContent value="fr">
                        <div>
                            <label htmlFor="name_fr" className="block text-sm font-medium text-gray-700">Nom du projet (Français)</label>
                            <input
                                type="text"
                                id="name_fr"
                                name="name_fr"
                                value={formData.name_fr}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="description_fr" className="block text-sm font-medium text-gray-700">Description (Français)</label>
                            <textarea
                                id="description_fr"
                                name="description_fr"
                                value={formData.description_fr}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={loading}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="en">
                        <div>
                            <label htmlFor="name_en" className="block text-sm font-medium text-gray-700">Project Name (English)</label>
                            <input
                                type="text"
                                id="name_en"
                                name="name_en"
                                value={formData.name_en}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">Description (English)</label>
                            <textarea
                                id="description_en"
                                name="description_en"
                                value={formData.description_en}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={loading}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="ar">
                        <div>
                            <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700" style={{direction: 'rtl', textAlign: 'right'}}>اسم المشروع (العربية)</label>
                            <input
                                type="text"
                                id="name_ar"
                                name="name_ar"
                                value={formData.name_ar}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={loading}
                                style={{direction: 'rtl', textAlign: 'right'}}
                            />
                        </div>
                        <div>
                            <label htmlFor="description_ar" className="block text-sm font-medium text-gray-700" style={{direction: 'rtl', textAlign: 'right'}}>الوصف (العربية)</label>
                            <textarea
                                id="description_ar"
                                name="description_ar"
                                value={formData.description_ar}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={loading}
                                style={{direction: 'rtl', textAlign: 'right'}}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

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
                        required
                    >
                        {PROJECT_STATUSES.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;