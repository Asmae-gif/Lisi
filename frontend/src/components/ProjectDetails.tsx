import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { getStatusColor, formatStatus, getTypeColor, formatType } from '../utils/projectUtils';
import ProjectFinanceForm from './ProjectFinanceForm';
import ProjectIncubeForm from './ProjectIncubeForm';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
import { Label } from "@/components/ui/label"; // Import Label component

interface Project {
    id: number;
    name: string; // Keep for fallback
    name_fr: string;
    name_en: string;
    name_ar: string;
    description: string; // Keep for fallback
    description_fr: string;
    description_en: string;
    description_ar: string;
    type_projet: string;
    status: string;
    date_debut: string;
    date_fin: string;
    created_at: string;
    updated_at: string;
    finances?: Finance[];
    incubations?: Incube[];
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
    const { t, i18n } = useTranslation();
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
            setError('Erreur lors du chargement des détails du projet');
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
                setError('Erreur lors du chargement des financements');
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
                setError('Erreur lors du chargement des incubations');
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
        if (window.confirm(t('confirm_delete_finance'))) {
            try {
                await api.delete(`/projet-finances/${financeId}`);
                await fetchFinances();
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
                setError('Erreur lors de la suppression du financement');
            }
        }
    };

    const handleDeleteIncube = async (incubeId: number) => {
        if (window.confirm(t('confirm_delete_incubation'))) {
            try {
                await api.delete(`/projet-incubes/${incubeId}`);
                await fetchIncubes();
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
                setError('Erreur lors de la suppression de l\'incubation');
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

    // Helper function to render language-specific content
    const renderLanguageContent = (lang: 'fr' | 'en' | 'ar', label: string) => (
        <TabsContent value={lang} className="space-y-6">
            {/* Nom */}
            <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-700">Nom ({label})</Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg font-medium" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                        {(project![`name_${lang}` as keyof Project] as string) || 'Non défini'}
                    </p>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label className="text-lg font-semibold text-blue-700">Description ({label})</Label>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                        {(project![`description_${lang}` as keyof Project] as string) || 'Non défini'}
                    </p>
                </div>
            </div>
        </TabsContent>
    );

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!project) return <div className="text-center">Projet non trouvé.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* En-tête */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Détails du projet</h1> {/* General title for the details page */}
                        <div className="flex space-x-2 mt-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(project.type_projet)}`}>
                                {t(formatType(project.type_projet).toLowerCase())}
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                {t(formatStatus(project.status).toLowerCase().replace(' ', '_'))}
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

                {/* Contenu multilingue */}
                <Tabs defaultValue="fr" className="w-full mb-8">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="fr">Français</TabsTrigger>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>
                    
                    {renderLanguageContent('fr', 'Français')}
                    {renderLanguageContent('en', 'English')}
                    {renderLanguageContent('ar', 'العربية')}
                </Tabs>

                {/* Autres informations du projet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Dates</h3>
                        <div className="space-y-2">
                            <p><span className="font-medium">Date de début :</span> {project.date_debut ? new Date(project.date_debut).toLocaleDateString('fr-FR') : 'Non défini'}</p>
                            <p><span className="font-medium">Date de fin :</span> {project.date_fin ? new Date(project.date_fin).toLocaleDateString('fr-FR') : 'Non défini'}</p>
                        </div>
                    </div>
                </div>

                {/* Section Financements */}
                {project.type_projet === 'finance' && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Financements</h3>
                            <button
                                onClick={() => { setShowFinanceForm(true); setEditingFinanceId(null); }}
                                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                            >
                                Ajouter un financement
                            </button>
                        </div>
                        {showFinanceForm && (
                            <ProjectFinanceForm
                                projectId={projectId}
                                financeId={editingFinanceId || undefined}
                                onSuccess={handleFinanceSuccess}
                                onCancel={() => setShowFinanceForm(false)}
                            />
                        )}
                        {finances.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Financeur</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type de financement</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date de financement</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {finances.map((finance) => (
                                            <tr key={finance.id}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{finance.financeur}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{finance.montant}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{finance.type_financement}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{new Date(finance.date_financement).toLocaleDateString('fr-FR')}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                    <button onClick={() => handleEditFinance(finance.id)} className="text-indigo-600 hover:text-indigo-900 mr-2">Modifier</button>
                                                    <button onClick={() => handleDeleteFinance(finance.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">Aucun financement ajouté pour ce projet.</p>
                        )}
                    </div>
                )}

                {/* Section Incubations */}
                {project.type_projet === 'incube' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Incubations</h3>
                            <button
                                onClick={() => { setShowIncubeForm(true); setEditingIncubeId(null); }}
                                className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                            >
                                Ajouter une incubation
                            </button>
                        </div>
                        {showIncubeForm && (
                            <ProjectIncubeForm
                                projectId={projectId}
                                incubeId={editingIncubeId || undefined}
                                onSuccess={handleIncubeSuccess}
                                onCancel={() => setShowIncubeForm(false)}
                            />
                        )}
                        {incubes.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Incubateur</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lieu d'incubation</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Accompagnateur</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date d'entrée</th>
                                            <th className="px-4 py-2 whitespace-nowrap text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {incubes.map((incube) => (
                                            <tr key={incube.id}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{incube.incubateur}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{incube.lieu_incubation || '-'}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{incube.accompagnateur || '-'}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{new Date(incube.date_entree).toLocaleDateString('fr-FR')}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                    <button onClick={() => handleEditIncube(incube.id)} className="text-indigo-600 hover:text-indigo-900 mr-2">Modifier</button>
                                                    <button onClick={() => handleDeleteIncube(incube.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">Aucune incubation ajoutée pour ce projet.</p>
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