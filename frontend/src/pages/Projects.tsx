import React, { useEffect, useState, useMemo } from 'react';
import { projectApi } from '../services/projectApi';
import PublicLayout from '@/components/layout/PublicLayout';
import PageContent from '@/components/common/PageContent';
import ContentCard from '@/components/common/ContentCard';
import ContentGrid from '@/components/common/ContentGrid';
import FilterBar from '@/components/common/FilterBar';
import { useTranslation } from 'react-i18next';

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
    finances?: any[];
    incubations?: any[];
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const { t } = useTranslation();

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectApi.getAll();
            setProjects(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Erreur lors du chargement des projets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

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

    // Options de filtres
    const filterOptions = useMemo(() => {
        const statuses = [...new Set(projects.map(p => p.status || 'Non défini'))];
        return statuses.map(status => ({
            value: status.toLowerCase(),
            label: status,
            count: projects.filter(p => (p.status || 'Non défini').toLowerCase() === status.toLowerCase()).length
        }));
    }, [projects]);

    // Filtrage des projets
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const projectTitle = project.name || '';
            const projectDescription = project.description || '';
            const projectStatus = project.status || '';
            
            const matchesSearch = projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                projectDescription.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'all' || projectStatus.toLowerCase() === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, selectedStatus]);

    return (
        <PublicLayout
            loading={loading}
            error={error}
            onRetry={fetchProjects}
            pageTitle="Nos Projets"
            pageDescription="Découvrez nos projets de recherche en cours et réalisés"
            showHero={true}
            heroTitle="Nos Projets de Recherche"
            heroSubtitle="Explorez les projets innovants que nous développons pour faire avancer la science et la technologie"
        >
            <PageContent
                title="Projets de Recherche"
                subtitle="Innovation & Excellence"
                description="Nos projets reflètent notre engagement envers l'excellence scientifique et l'innovation technologique. Chaque projet contribue à l'avancement des connaissances dans nos domaines d'expertise."
            >
                {/* Barre de filtres */}
                <FilterBar
                    searchPlaceholder="Rechercher un projet..."
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterOptions={filterOptions}
                    selectedFilter={selectedStatus}
                    onFilterChange={setSelectedStatus}
                />

                {/* Statistiques */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-indigo-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-indigo-600">Total Projets</p>
                                    <p className="text-2xl font-bold text-indigo-900">{projects.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-green-600">Projets Financés</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {projects.filter(p => p.type_projet === 'finance').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-purple-600">Projets Incubés</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {projects.filter(p => p.type_projet === 'incube').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-600">En Cours</p>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {projects.filter(p => p.status?.toLowerCase() === 'en cours').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des projets */}
                {filteredProjects.length > 0 ? (
                    <ContentGrid columns={3} centered>
                        {filteredProjects.map((project) => (
                            <ContentCard
                                key={project.id}
                                title={project.name || 'Titre non défini'}
                                description={project.description || 'Description non disponible'}
                                subtitle={`Type: ${project.type_projet === 'finance' ? 'Projet Financé' : 'Projet Incubé'}`}
                                date={project.created_at}
                                status={project.status || 'Non défini'}
                                statusColor={getStatusColor(project.status)}
                                hoverEffect={true}
                                link={`/projets/${project.id}`}
                                className="group"
                            >
                                <div className="space-y-3 mt-4">
                                    {/* Type de projet avec icône */}
                                    <div className="flex items-center space-x-2">
                                        <div className={`p-1 rounded-full ${project.type_projet === 'finance' ? 'bg-green-100' : 'bg-purple-100'}`}>
                                            {project.type_projet === 'finance' ? (
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {project.type_projet === 'finance' ? 'Projet Financé' : 'Projet Incubé'}
                                        </span>
                                    </div>
                                    
                                    {/* Dates du projet */}
                                    {(project.date_debut || project.date_fin) && (
                                        <div className="space-y-1">
                                            {project.date_debut && (
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-muted-foreground">Début:</span>
                                                    <span className="font-medium">{new Date(project.date_debut).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            )}
                                            {project.date_fin && (
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-muted-foreground">Fin:</span>
                                                    <span className="font-medium">{new Date(project.date_fin).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Informations supplémentaires */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Statut:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                {project.status || 'Non défini'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </ContentCard>
                        ))}
                    </ContentGrid>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-12 h-12 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {searchTerm || selectedStatus !== 'all' 
                                    ? 'Aucun projet trouvé' 
                                    : 'Aucun projet disponible'}
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm || selectedStatus !== 'all'
                                    ? 'Essayez de modifier vos critères de recherche.'
                                    : 'Aucun projet n\'est disponible pour le moment. Revenez bientôt pour découvrir nos nouvelles initiatives.'}
                            </p>
                        </div>
                    </div>
                )}
            </PageContent>
        </PublicLayout>
    );
} 