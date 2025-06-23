import React, { useEffect, useState } from 'react';
import { partenaireApi } from '../services/partenaireApi';
import PublicLayout from '@/components/layout/PublicLayout';
import PageContent from '@/components/common/PageContent';
import ContentCard from '@/components/common/ContentCard';
import ContentGrid from '@/components/common/ContentGrid';
import { useTranslation } from 'react-i18next';

interface Partenaire {
    id: number;
    nom: string;
    logo?: string;
    lien?: string;
    created_at: string;
    updated_at: string;
}

export default function Partenaires() {
    const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const fetchPartenaires = async () => {
        try {
            setLoading(true);
            const response = await partenaireApi.getAll();
            setPartenaires(response.data.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching partenaires:', error);
            setError('Erreur lors du chargement des partenaires');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartenaires();
    }, []);

    return (
        <PublicLayout
            loading={loading}
            error={error}
            onRetry={fetchPartenaires}
            pageTitle="Nos Partenaires"
            pageDescription="Découvrez nos partenaires académiques et industriels"
            showHero={true}
            heroTitle="Nos Partenaires"
            heroSubtitle="Collaborations stratégiques pour l'innovation et l'excellence scientifique"
        >
            <PageContent
                title="Nos Partenaires"
                subtitle="Collaboration & Innovation"
                description="Nous collaborons avec des institutions académiques prestigieuses et des entreprises innovantes pour faire avancer la recherche et développer des solutions technologiques de pointe."
            >
                {/* Statistiques */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-600">Total Partenaires</p>
                                    <p className="text-2xl font-bold text-blue-900">{partenaires.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-green-600">Partenaires Académiques</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {partenaires.filter(p => p.nom.toLowerCase().includes('université') || p.nom.toLowerCase().includes('école') || p.nom.toLowerCase().includes('institut')).length}
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
                                    <p className="text-sm font-medium text-purple-600">Partenaires Industriels</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {partenaires.filter(p => !p.nom.toLowerCase().includes('université') && !p.nom.toLowerCase().includes('école') && !p.nom.toLowerCase().includes('institut')).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section d'introduction */}
                <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Collaborations d'Excellence
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Notre réseau de partenaires comprend des institutions académiques de renommée mondiale, 
                            des centres de recherche innovants et des entreprises technologiques de pointe. 
                            Ces collaborations nous permettent de mener des projets ambitieux et de contribuer 
                            significativement à l'avancement des connaissances scientifiques.
                        </p>
                    </div>
                </div>

                {partenaires.length > 0 ? (
                    <ContentGrid columns={4} centered>
                        {partenaires.map((partenaire) => (
                            <ContentCard
                                key={partenaire.id}
                                title={partenaire.nom}
                                image={partenaire.logo}
                                externalLink={partenaire.lien}
                                className="text-center group hover:shadow-xl transition-all duration-300"
                                hoverEffect={true}
                            >
                                <div className="mt-4">
                                    {partenaire.lien && (
                                        <a
                                            href={partenaire.lien}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors group-hover:text-blue-700"
                                        >
                                            <span>Visiter le site</span>
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
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
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Aucun partenaire disponible
                            </h3>
                            <p className="text-muted-foreground">
                                Aucun partenaire n'est disponible pour le moment. Revenez bientôt pour découvrir nos nouvelles collaborations.
                            </p>
                        </div>
                    </div>
                )}
            </PageContent>
        </PublicLayout>
    );
} 