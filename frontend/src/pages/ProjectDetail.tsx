import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectApi } from '../services/projectApi';
import PublicLayout from '@/components/layout/PublicLayout';
import { useTranslation } from 'react-i18next';
import IconMapper from '@/components/common/IconMapper';

interface Project {
    id: number;
    name_fr?: string;
    name_en?: string;
    name_ar?: string;
    description_fr?: string;
    description_en?: string;
    description_ar?: string;
    type_projet: 'finance' | 'incube';
    status: string;
    date_debut?: string;
    date_fin?: string;
    created_at: string;
    updated_at: string;
    finances?: ProjetFinance[];
    incubations?: ProjetIncube[];
}

interface ProjetFinance {
    id: number;
    project_id: number;
    financeur: string;
    montant: number;
    type_financement: string;
    date_financement?: string;
    created_at: string;
    updated_at: string;
}

interface ProjetIncube {
    id: number;
    project_id: number;
    incubateur: string;
    lieu_incubation?: string;
    accompagnateur?: string;
    date_entree?: string;
    created_at: string;
    updated_at: string;
}

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const { t, i18n } = useTranslation('project');

    const fetchProject = async () => {
        try {
            setLoading(true);
            const response = await projectApi.getOne(parseInt(id!));
            setProject(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching project:', error);
            setError(t('error_loading_project_details'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id]);

    const getProjectTitle = (project: Project) => {
        switch (i18n.language) {
            case 'fr': return project.name_fr || t('title_not_defined');
            case 'en': return project.name_en || t('title_not_defined_en');
            case 'ar': return project.name_ar || t('title_not_defined_ar');
            default: return project.name_fr || t('title_not_defined');
        }
    };

    const getProjectDescription = (project: Project) => {
        switch (i18n.language) {
            case 'fr': return project.description_fr || t('description_not_available');
            case 'en': return project.description_en || t('description_not_available_en');
            case 'ar': return project.description_ar || t('description_not_available_ar');
            default: return project.description_fr || t('description_not_available');
        }
    };

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        
        switch (status.toLowerCase()) {
            case 'en attente':
                return 'bg-yellow-100 text-yellow-800';
            case 'en cours':
                return 'bg-blue-100 text-blue-800';
            case 'suspendu':
                return 'bg-orange-100 text-orange-800';
            case 'termine':
                return 'bg-green-100 text-green-800';
            case 'annule':
                return 'bg-red-100 text-red-800';
            case 'publie':
                return 'bg-purple-100 text-purple-800';
            case 'archive':
                return 'bg-gray-200 text-gray-800';
            case 'rejete':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatBudget = (budget: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(budget);
    };

    return (
        <PublicLayout
            loading={loading}
            error={error}
            onRetry={fetchProject}
            pageTitle={getProjectTitle(project || {} as Project)}
            pageDescription={t('project_details_description')}
            showHero={false}
        >
            <div className="py-20 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Bouton retour */}
                    <div className="mb-8">
                        <Link
                            to="/projets"
                            className="inline-flex items-center text-primary hover:text-primary/80 font-medium group"
                        >
                            <IconMapper iconKey="ArrowLeft" className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            {t('back_to_projects')}
                        </Link>
                    </div>

                    {project && (
                        <div className="space-y-8">
                            {/* En-tête du projet */}
                            <div className="bg-card rounded-2xl p-8 shadow-lg border">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-foreground mb-4">
                                            {getProjectTitle(project)}
                                        </h1>
                                        <p className="text-xl text-muted-foreground leading-relaxed">
                                            {getProjectDescription(project)}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ml-4 ${getStatusColor(project.status)}`}>
                                        {t(project.status || 'not_defined')}
                                    </span>
                                </div>

                                {/* Informations de base */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('created_at_label')}</h3>
                                        <p className="text-foreground">{formatDate(project.created_at)}</p>
                                    </div>
                                    {project.date_debut && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('start_date')}</h3>
                                            <p className="text-foreground">{formatDate(project.date_debut)}</p>
                                        </div>
                                    )}
                                    {project.date_fin && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('end_date')}</h3>
                                            <p className="text-foreground">{formatDate(project.date_fin)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Détails financiers et d'incubation */}
                            {project.type_projet === 'finance' && project.finances && project.finances.length > 0 && (
                                <div className="bg-card rounded-2xl p-8 shadow-lg border">
                                    <h2 className="text-2xl font-bold text-foreground mb-6">{t('finance_info')}</h2>
                                    <div className="space-y-6">
                                        {project.finances.map((finance, index) => (
                                            <div key={index} className="bg-muted p-6 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-2">{t('financier')}</h3>
                                                        <p className="text-foreground">{finance.financeur}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-2">{t('amount')}</h3>
                                                        <p className="text-2xl font-bold text-primary">{formatBudget(finance.montant)}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-2">{t('finance_type')}</h3>
                                                        <p className="text-foreground">{finance.type_financement}</p>
                                                    </div>
                                                    {finance.date_financement && (
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">{t('finance_date')}</h3>
                                                            <p className="text-foreground">{formatDate(finance.date_financement)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Informations d'incubation */}
                            {project.type_projet === 'incube' && project.incubations && project.incubations.length > 0 && (
                                <div className="bg-card rounded-2xl p-8 shadow-lg border">
                                    <h2 className="text-2xl font-bold text-foreground mb-6">{t('incubation_info')}</h2>
                                    <div className="space-y-6">
                                        {project.incubations.map((incubation, index) => (
                                            <div key={index} className="bg-muted p-6 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-2">{t('incubator')}</h3>
                                                        <p className="text-foreground">{incubation.incubateur}</p>
                                                    </div>
                                                    {incubation.lieu_incubation && (
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">{t('incubation_location')}</h3>
                                                            <p className="text-foreground">{incubation.lieu_incubation}</p>
                                                        </div>
                                                    )}
                                                    {incubation.accompagnateur && (
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">{t('advisor')}</h3>
                                                            <p className="text-foreground">{incubation.accompagnateur}</p>
                                                        </div>
                                                    )}
                                                    {incubation.date_entree && (
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">{t('entry_date')}</h3>
                                                            <p className="text-foreground">{formatDate(incubation.date_entree)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-center pt-8">
                                <Link
                                    to="/projets"
                                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    {t('back_to_projects')}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
} 