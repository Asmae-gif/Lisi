import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicationApi } from '../services/publicationApi';
import PublicLayout from '@/components/layout/PublicLayout';
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

export default function PublicationDetail() {
    const { id } = useParams<{ id: string }>();
    const [publication, setPublication] = useState<Publication | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const fetchPublication = async () => {
        try {
            setLoading(true);
            const response = await publicationApi.getOne(parseInt(id!));
            setPublication(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching publication:', error);
            setError('Erreur lors du chargement de la publication');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPublication();
        }
    }, [id]);

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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                );
            case 'conférence':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
            case 'thèse':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    const getTypeDescription = (type: string) => {
        switch (type.toLowerCase()) {
            case 'article':
                return 'Article scientifique publié dans une revue académique';
            case 'conférence':
                return 'Communication présentée lors d\'une conférence scientifique';
            case 'thèse':
                return 'Thèse de doctorat ou mémoire de recherche';
            case 'rapport':
                return 'Rapport technique ou de recherche';
            case 'livre':
                return 'Ouvrage ou chapitre de livre scientifique';
            default:
                return 'Publication scientifique';
        }
    };

    if (loading) {
        return (
            <PublicLayout
                loading={true}
                pageTitle="Chargement..."
                pageDescription=""
            >
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement de la publication...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    if (error || !publication) {
        return (
            <PublicLayout
                error={error || 'Publication non trouvée'}
                onRetry={fetchPublication}
                pageTitle="Erreur"
                pageDescription=""
            >
                <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Publication non trouvée
                        </h3>
                        <p className="text-gray-600 mb-6">
                            La publication que vous recherchez n'existe pas ou a été supprimée.
                        </p>
                        <Link
                            to="/publications"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour aux publications
                        </Link>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout
            pageTitle={publication.titre_publication}
            pageDescription={publication.resume}
            showHero={false}
        >
            <div className="container mx-auto px-4 py-8">
                {/* Navigation */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li>
                            <Link to="/" className="hover:text-blue-600 transition-colors">
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </li>
                        <li>
                            <Link to="/publications" className="hover:text-blue-600 transition-colors">
                                Publications
                            </Link>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </li>
                        <li className="text-gray-900 font-medium">Détails</li>
                    </ol>
                </nav>

                {/* Contenu principal */}
                <div className="max-w-4xl mx-auto">
                    {/* En-tête */}
                    <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                    {publication.titre_publication}
                                </h1>
                                
                                {/* Type et date */}
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getTypeColor(publication.type_publication)}`}>
                                        <div className="mr-2">
                                            {getTypeIcon(publication.type_publication)}
                                        </div>
                                        <span className="font-medium">
                                            {publication.type_publication || 'Type non défini'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">
                                            {new Date(publication.date_publication).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Description du type */}
                                <p className="text-gray-600 mb-6">
                                    {getTypeDescription(publication.type_publication)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informations détaillées */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Colonne principale */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Résumé */}
                            <div className="bg-white rounded-2xl shadow-lg border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Résumé</h2>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {publication.resume || 'Aucun résumé disponible pour cette publication.'}
                                    </p>
                                </div>
                            </div>

                            {/* Référence complète */}
                            {publication.reference_complete && (
                                <div className="bg-white rounded-2xl shadow-lg border p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Référence complète</h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <p className="text-gray-700 leading-relaxed font-mono text-sm">
                                            {publication.reference_complete}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Colonne latérale */}
                        <div className="space-y-6">
                            {/* Actions */}
                            <div className="bg-white rounded-2xl shadow-lg border p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Accès</h3>
                                <div className="space-y-3">
                                    {publication.lien_externe_doi && (
                                        <a
                                            href={publication.lien_externe_doi}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 101.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                            </svg>
                                            Voir sur DOI
                                        </a>
                                    )}
                                    
                                    {publication.fichier_pdf_url && (
                                        <a
                                            href={publication.fichier_pdf_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                            Télécharger PDF
                                        </a>
                                    )}
                                    
                                    <Link
                                        to="/publications"
                                        className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Retour aux publications
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
} 