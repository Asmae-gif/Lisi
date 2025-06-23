import React, { useEffect, useState } from 'react';
import { PrixDistinction } from '../types/prixDistinction';
import api from '../lib/axios';
import PublicLayout from '@/components/layout/PublicLayout';
import PageContent from '@/components/common/PageContent';
import ContentCard from '@/components/common/ContentCard';
import ContentGrid from '@/components/common/ContentGrid';
import { useTranslation } from 'react-i18next';

export default function PrixDistinctions() {
    const [prixDistinctions, setPrixDistinctions] = useState<PrixDistinction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const fetchPrixDistinctions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/prix-distinctions');
            if (response.data.success) {
                setPrixDistinctions(response.data.data);
            } else {
                setError('Erreur lors du chargement des prix et distinctions');
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching prix et distinctions:', error);
            setError('Erreur lors du chargement des prix et distinctions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrixDistinctions();
    }, []);

    const getPrixTypeColor = (membres: any[]) => {
        return membres && membres.length > 1 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-orange-100 text-orange-800';
    };

    const getPrixTypeText = (membres: any[]) => {
        return membres && membres.length > 1 
            ? 'Prix collectif' 
            : 'Prix individuel';
    };

    return (
        <PublicLayout
            loading={loading}
            error={error}
            onRetry={fetchPrixDistinctions}
            pageTitle="Prix et Distinctions"
            pageDescription="Découvrez les prix et distinctions obtenus par nos chercheurs"
            showHero={true}
            heroTitle="Prix et Distinctions"
            heroSubtitle="Reconnaissance de l'excellence de notre recherche et de nos contributions scientifiques"
        >
            <PageContent
                title="Prix et Distinctions"
                subtitle="Excellence & Reconnaissance"
                description="Nos chercheurs et équipes sont régulièrement récompensés pour l'excellence de leurs travaux et leurs contributions innovantes à la recherche scientifique."
            >
                {/* Statistiques */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-yellow-600">Total Prix</p>
                                    <p className="text-2xl font-bold text-yellow-900">{prixDistinctions.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-orange-600">Prix Individuels</p>
                                    <p className="text-2xl font-bold text-orange-900">
                                        {prixDistinctions.filter(p => p.membres && p.membres.length === 1).length}
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
                                    <p className="text-sm font-medium text-purple-600">Prix Collectifs</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {prixDistinctions.filter(p => p.membres && p.membres.length > 1).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-green-600">Cette année</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {prixDistinctions.filter(p => {
                                            const prixDate = new Date(p.date_obtention);
                                            const currentYear = new Date().getFullYear();
                                            return prixDate.getFullYear() === currentYear;
                                        }).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section d'introduction */}
                <div className="mb-8 bg-gradient-to-r from-yellow-50 to-yellow-100 p-8 rounded-2xl border border-yellow-200">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-yellow-900 mb-4">
                            Excellence & Reconnaissance
                        </h2>
                        <p className="text-lg text-yellow-800 leading-relaxed">
                            Nos chercheurs et équipes sont régulièrement récompensés pour l'excellence de leurs travaux 
                            et leurs contributions innovantes à la recherche scientifique. Ces prix et distinctions 
                            témoignent de la qualité de nos recherches et de notre impact dans la communauté scientifique.
                        </p>
                    </div>
                </div>

                {prixDistinctions.length > 0 ? (
                    <ContentGrid columns={2} centered>
                        {prixDistinctions.map((prix) => (
                            <ContentCard
                                key={prix.id}
                                title={prix.nom}
                                description={prix.description}
                                date={prix.date_obtention}
                                status={getPrixTypeText(prix.membres)}
                                statusColor={getPrixTypeColor(prix.membres)}
                                hoverEffect={false}
                                image={prix.image_url}
                                externalLink={prix.lien_externe}
                            >
                                <div className="mt-4 space-y-3">
                                    {/* Organisme */}
                                    {prix.organisme && (
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Organisme:</span>{' '}
                                            {prix.organisme}
                                        </p>
                                    )}
                                    
                                    {/* Membres avec rôles */}
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium">Attribué à:</span>{' '}
                                        {prix.membres && prix.membres.length > 0
                                            ? prix.membres.map(m => `${m.prenom} ${m.nom}${m.role ? ` (${m.role})` : ''}`).join(', ')
                                            : 'Aucun membre'
                                        }
                                    </p>
                                    
                                    {/* Date d'obtention */}
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium">Date d'obtention:</span>{' '}
                                        {new Date(prix.date_obtention).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    
                                    {/* Lien externe */}
                                    {prix.lien_externe && (
                                        <div className="pt-2">
                                            <a
                                                href={prix.lien_externe}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <span>En savoir plus</span>
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    )}
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
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Aucun prix ou distinction disponible
                            </h3>
                            <p className="text-muted-foreground">
                                Aucun prix ou distinction n'est disponible pour le moment. Revenez bientôt pour découvrir nos nouvelles récompenses.
                            </p>
                        </div>
                    </div>
                )}
            </PageContent>
        </PublicLayout>
    );
} 