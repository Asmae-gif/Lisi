import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectApi } from '../services/projectApi';
import PublicLayout from '@/components/layout/PublicLayout';
import { useTranslation } from 'react-i18next';
import IconMapper from '@/components/common/IconMapper';

interface Project {
    id: number;
    name: string;
    description: string;
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
    const { t } = useTranslation();

    const fetchProject = async () => {
        try {
            setLoading(true);
            const response = await projectApi.getOne(parseInt(id!));
            setProject(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching project:', error);
            setError('Erreur lors du chargement du projet');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id]);

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        
        switch (status.toLowerCase()) {
            case 'en cours':
                return 'bg-blue-100 text-blue-800';
            case 'terminé':
                return 'bg-green-100 text-green-800';
            case 'en attente':
                return 'bg-yellow-100 text-yellow-800';
            case 'annulé':
                return 'bg-red-100 text-red-800';
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
            pageTitle={project?.name || 'Détails du Projet'}
            pageDescription="Découvrez les détails complets de ce projet de recherche"
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
                            Retour aux projets
                        </Link>
                    </div>

                    {project && (
                        <div className="space-y-8">
                            {/* En-tête du projet */}
                            <div className="bg-card rounded-2xl p-8 shadow-lg border">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-foreground mb-4">
                                            {project.name}
                                        </h1>
                                        <p className="text-xl text-muted-foreground leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ml-4 ${getStatusColor(project.status)}`}>
                                        {project.status || 'Non défini'}
                                    </span>
                                </div>

                                {/* Informations de base */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Date de création</h3>
                                        <p className="text-foreground">{formatDate(project.created_at)}</p>
                                    </div>
                                    {project.date_debut && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Date de début</h3>
                                            <p className="text-foreground">{formatDate(project.date_debut)}</p>
                                        </div>
                                    )}
                                    {project.date_fin && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Date de fin</h3>
                                            <p className="text-foreground">{formatDate(project.date_fin)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Détails financiers et d'incubation */}
                            {project.type_projet === 'finance' && project.finances && project.finances.length > 0 && (
                                <div className="bg-card rounded-2xl p-8 shadow-lg border">
                                    <h2 className="text-2xl font-bold text-foreground mb-6">Informations Financières</h2>
                                    <div className="space-y-6">
                                        {project.finances.map((finance, index) => (
                                            <div key={index} className="bg-muted p-6 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-2">Financeur</h3>
                                                        <p className="text-foreground">{finance.financeur}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-2">Montant</h3>
                                                        <p className="text-2xl font-bold text-primary">{formatBudget(finance.montant)}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-2">Type de financement</h3>
                                                        <p className="text-foreground">{finance.type_financement}</p>
                                                    </div>
                                                    {finance.date_financement && (
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">Date de financement</h3>
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
                                    <h2 className="text-2xl font-bold text-foreground mb-6">Informations d'Incubation</h2>
                                    <div className="space-y-6">
                                        {project.incubations.map((incubation, index) => (
                                            <div key={index} className="bg-muted p-6 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-2">Incubateur</h3>
                                                        <p className="text-foreground">{incubation.incubateur}</p>
                                                    </div>
                                                    {incubation.lieu_incubation && (
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">Lieu d'incubation</h3>
                                                            <p className="text-foreground">{incubation.lieu_incubation}</p>
                                                        </div>
                                                    )}
                                                    {incubation.accompagnateur && (
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">Accompagnateur</h3>
                                                            <p className="text-foreground">{incubation.accompagnateur}</p>
                                                        </div>
                                                    )}
                                                    {incubation.date_entree && (
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">Date d'entrée</h3>
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
                                    Voir tous les projets
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
} 