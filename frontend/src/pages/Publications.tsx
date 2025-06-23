import React, { useEffect, useState, useMemo } from 'react';
import { publicationApi } from '../services/publicationApi';
import PublicLayout from '@/components/layout/PublicLayout';
import PageContent from '@/components/common/PageContent';
import ContentCard from '@/components/common/ContentCard';
import ContentGrid from '@/components/common/ContentGrid';
import FilterBar from '@/components/common/FilterBar';
import { useTranslation } from 'react-i18next';

interface Auteur {
    id: number;
    nom: string;
    prenom: string;
    email?: string;
    photo?: string;
    grade?: string;
}

interface Publication {
    id: number;
    titre_publication: string;
    resume: string;
    type_publication: string;
    date_publication: string;
    reference_complete: string;
    fichier_pdf_url?: string;
    lien_externe_doi?: string;
    auteurs?: Auteur[];
    created_at: string;
    updated_at: string;
}

export default function Publications() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const { t } = useTranslation();

    const fetchPublications = async () => {
        try {
            setLoading(true);
            const response = await publicationApi.getAll();
            setPublications(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching publications:', error);
            setError('Erreur lors du chargement des publications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublications();
    }, []);

    const getTypeColor = (type: string) => {
        if (!type) return 'bg-gray-100 text-gray-800';
        
        switch (type.toLowerCase()) {
            case 'article':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'conférence':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'thèse':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'rapport':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'livre':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'article':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                );
            case 'conférence':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
            case 'thèse':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    // Options de filtres
    const filterOptions = useMemo(() => {
        const types = [...new Set(publications.map(p => p.type_publication || 'Non défini'))];
        return types.map(type => ({
            value: type.toLowerCase(),
            label: type,
            count: publications.filter(p => (p.type_publication || 'Non défini').toLowerCase() === type.toLowerCase()).length
        }));
    }, [publications]);

    // Filtrage des publications
    const filteredPublications = useMemo(() => {
        return publications.filter(publication => {
            const publicationTitle = publication.titre_publication || '';
            const publicationResume = publication.resume || '';
            const publicationReference = publication.reference_complete || '';
            const publicationType = publication.type_publication || '';
            
            const matchesSearch = publicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                publicationResume.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                publicationReference.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'all' || publicationType.toLowerCase() === selectedType;
            return matchesSearch && matchesType;
        });
    }, [publications, searchTerm, selectedType]);

    return (
        <PublicLayout
            loading={loading}
            error={error}
            onRetry={fetchPublications}
            pageTitle="Publications Scientifiques"
            pageDescription="Découvrez nos publications scientifiques et nos contributions à la recherche"
            showHero={true}
            heroTitle="Publications Scientifiques"
            heroSubtitle="Explorez nos contributions à la recherche à travers nos publications, articles et communications scientifiques"
        >
            <PageContent
                title="Publications Scientifiques"
                subtitle="Recherche & Innovation"
                description="Nos publications reflètent l'excellence de notre recherche et notre contribution au développement des connaissances scientifiques. Découvrez nos travaux dans des revues internationales, conférences et autres supports scientifiques."
            >
                {/* Statistiques */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-600">Total Publications</p>
                                    <p className="text-2xl font-bold text-blue-900">{publications.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-green-600">Articles</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {publications.filter(p => p.type_publication?.toLowerCase() === 'article').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-purple-600">Conférences</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {publications.filter(p => p.type_publication?.toLowerCase() === 'conférence').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-orange-600">Cette année</p>
                                    <p className="text-2xl font-bold text-orange-900">
                                        {publications.filter(p => {
                                            const pubDate = new Date(p.date_publication);
                                            const currentYear = new Date().getFullYear();
                                            return pubDate.getFullYear() === currentYear;
                                        }).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barre de filtres */}
                <FilterBar
                    searchPlaceholder="Rechercher une publication..."
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterOptions={filterOptions}
                    selectedFilter={selectedType}
                    onFilterChange={setSelectedType}
                />

                {/* Liste des publications */}
                {filteredPublications.length > 0 ? (
                    <ContentGrid columns={2} centered>
                        {filteredPublications.map((publication) => (
                            <ContentCard
                                key={publication.id}
                                title={publication.titre_publication || 'Titre non défini'}
                                description={publication.resume || 'Résumé non disponible'}
                                subtitle={publication.reference_complete || 'Référence non disponible'}
                                date={publication.date_publication}
                                status={publication.type_publication || 'Non défini'}
                                statusColor={getTypeColor(publication.type_publication)}
                                hoverEffect={true}
                                link={`/publications/${publication.id}`}
                                className="group relative overflow-hidden"
                            >
                                {/* Badge de type en haut à droite */}
                                <div className="absolute top-4 right-4 z-10">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(publication.type_publication)}`}>
                                        <div className="mr-1">
                                            {getTypeIcon(publication.type_publication)}
                                        </div>
                                        {publication.type_publication || 'Non défini'}
                                    </div>
                                </div>

                                <div className="space-y-4 mt-8">
                                    {/* Informations principales */}
                                    <div className="space-y-3">
                                        {/* Date de publication */}
                                        <div className="flex items-center space-x-2 text-sm">
                                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-600">Publié le:</span>
                                            <span className="font-semibold text-gray-900">
                                                {new Date(publication.date_publication).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        {/* Description du type */}
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-xs text-blue-800 leading-relaxed">
                                                {publication.type_publication?.toLowerCase() === 'article' && '📄 Article scientifique publié dans une revue académique'}
                                                {publication.type_publication?.toLowerCase() === 'conférence' && '🎤 Communication présentée lors d\'une conférence scientifique'}
                                                {publication.type_publication?.toLowerCase() === 'thèse' && '🎓 Thèse de doctorat ou mémoire de recherche'}
                                                {publication.type_publication?.toLowerCase() === 'rapport' && '📋 Rapport technique ou de recherche'}
                                                {publication.type_publication?.toLowerCase() === 'livre' && '📚 Ouvrage ou chapitre de livre scientifique'}
                                                {!publication.type_publication && '📖 Publication scientifique'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Référence complète */}
                                    {publication.reference_complete && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h5 className="text-xs font-bold text-gray-700 mb-2 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                                Référence complète
                                            </h5>
                                            <p className="text-xs text-gray-700 leading-relaxed font-mono">
                                                {publication.reference_complete}
                                            </p>
                                        </div>
                                    )}

                                    {/* Auteurs */}
                                    {publication.auteurs && publication.auteurs.length > 0 && (
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h5 className="text-xs font-bold text-green-700 mb-2 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Auteurs ({publication.auteurs.length})
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {publication.auteurs.map((auteur, index) => (
                                                    <span 
                                                        key={auteur.id} 
                                                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium"
                                                    >
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                        {auteur.prenom} {auteur.nom}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Actions et liens */}
                                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                        {/* DOI */}
                                        {publication.lien_externe_doi && (
                                            <a
                                                href={publication.lien_externe_doi}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors group-hover:bg-blue-100 border border-blue-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 101.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                                </svg>
                                                DOI
                                            </a>
                                        )}
                                        
                                        {/* PDF */}
                                        {publication.fichier_pdf_url && (
                                            <a
                                                href={publication.fichier_pdf_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors group-hover:bg-red-100 border border-red-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                                PDF
                                            </a>
                                        )}
                                        
                                        {/* Lire la suite */}
                                        <span className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Voir détails
                                        </span>
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
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {searchTerm || selectedType !== 'all' 
                                    ? 'Aucune publication trouvée' 
                                    : 'Aucune publication disponible'}
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm || selectedType !== 'all'
                                    ? 'Essayez de modifier vos critères de recherche.'
                                    : 'Aucune publication n\'est disponible pour le moment. Revenez bientôt pour découvrir nos nouvelles publications.'}
                            </p>
                        </div>
                    </div>
                )}
            </PageContent>
        </PublicLayout>
    );
} 