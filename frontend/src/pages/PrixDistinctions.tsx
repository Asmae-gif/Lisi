import  { useEffect, useState, useMemo } from 'react';
import { PrixDistinction } from '../types/prixDistinction';
import api from '../lib/axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContentCard from '@/components/common/ContentCard';
import ContentGrid from '@/components/common/ContentGrid';
import { useTranslation } from 'react-i18next';
import { buildImageUrl } from '@/utils/imageUtils'; 
import { usePrixDistinctionSettings } from '@/hooks/usePrixDistinction';
import FilterBar from '@/components/common/FilterBar';

export default function PrixDistinctions() {
    const [prixDistinctions, setPrixDistinctions] = useState<PrixDistinction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const { t, i18n } = useTranslation('prixDistinctions');
    const { settings, loading: settingsLoading, error: settingsError } = usePrixDistinctionSettings();

    useEffect(() => {
        const getPrixDistinctions = async () => {
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
                setError('Erreur lors du chargement des prix et distinctions');
            } finally {
                setLoading(false);
            }
        };
        getPrixDistinctions();
    }, []);

    const getPrixTypeColor = (membres: unknown[]) => {
        return membres && membres.length > 1 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-orange-100 text-orange-800';
    };

    const getPrixTypeText = (membres: unknown[]) => {
        return membres && membres.length > 1 
            ? t('stats.collective_awards')
            : t('stats.individual_awards');
    };

    // Options de filtres
    const filterOptions = useMemo(() => {
        const types = [
            { value: 'individual', label: t('stats.individual_awards') },
            { value: 'collective', label: t('stats.collective_awards') }
        ];
        return types.map(type => ({
            value: type.value,
            label: type.label,
            count: prixDistinctions.filter(p => 
                type.value === 'individual' 
                    ? (p.membres && p.membres.length === 1)
                    : (p.membres && p.membres.length > 1)
            ).length
        }));
    }, [prixDistinctions, t]);

    // Filtrage des prix
    const filteredPrix = useMemo(() => {
        return prixDistinctions.filter(prix => {
            const matchesSearch = (
                (prix.titre_fr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (prix.titre_en?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (prix.titre_ar?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (prix.description_fr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (prix.description_en?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (prix.description_ar?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (prix.membres && prix.membres.some(m => 
                    `${m.nom} ${m.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            );

            const matchesType = selectedType === 'all' || 
                (selectedType === 'individual' && prix.membres && prix.membres.length === 1) ||
                (selectedType === 'collective' && prix.membres && prix.membres.length > 1);

            return matchesSearch && matchesType;
        });
    }, [prixDistinctions, searchTerm, selectedType]);

    const getPrixTitle = (prix: PrixDistinction) => {
        switch (i18n.language) {
            case 'fr': return prix.titre_fr || t('title_not_defined');
            case 'en': return prix.titre_en || t('title_not_defined_en');
            case 'ar': return prix.titre_ar || t('title_not_defined_ar');
            default: return prix.titre_fr || t('title_not_defined');
        }
    };

    const getPrixDescription = (prix: PrixDistinction) => {
        switch (i18n.language) {
            case 'fr': return prix.description_fr || t('description_not_available');
            case 'en': return prix.description_en || t('description_not_available_en');
            case 'ar': return prix.description_ar || t('description_not_available_ar');
            default: return prix.description_fr || t('description_not_available');
        }
    };

    const heroTitle = settings?.[`prix_titre_${i18n.language}` as keyof typeof settings] || settings?.prix_titre_fr;
    const heroSubtitle = settings?.[`prix_sous_titre_${i18n.language}` as keyof typeof settings] || settings?.prix_sous_titre_fr;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            {/* Hero Section */}
            <section
                className="bg-gradient-to-br from-green-50 to-indigo-100 py-16"
                style={settings?.prix_image ? {
                    backgroundImage: `url(${buildImageUrl(settings.prix_image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                } : undefined}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {heroTitle || t('project_hero_title_default')}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {heroSubtitle || t('project_hero_subtitle_default')}
                        </p>
                    </div>
                </div>
            </section>
            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="py-20 px-4">
                    {/* Barre de filtres */}
                    <FilterBar
                        searchPlaceholder={t('search_prix_placeholder')}
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterOptions={filterOptions}
                        selectedFilter={selectedType}
                        onFilterChange={setSelectedType}
                    />

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                            <div className="flex items-center rtl:space-x-reverse space-x-3">
                                <div className="p-2 bg-yellow-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-yellow-600">{t('stats.total')}</p>
                                    <p className="text-2xl font-bold text-yellow-900">{prixDistinctions.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                            <div className="flex items-center rtl:space-x-reverse space-x-3">
                                <div className="p-2 bg-orange-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-orange-600">{t('stats.individual_awards')}</p>
                                    <p className="text-2xl font-bold text-orange-900">
                                        {prixDistinctions.filter(p => p.membres && p.membres.length === 1).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                            <div className="flex items-center rtl:space-x-reverse space-x-3">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-purple-600">{t('stats.collective_awards')}</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {prixDistinctions.filter(p => p.membres && p.membres.length > 1).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center rtl:space-x-reverse space-x-3">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-green-600">{t('stats.this_year')}</p>
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

                    {/* Liste des prix */}
                    {filteredPrix.length > 0 ? (
                        <ContentGrid columns={3} centered>
                            {filteredPrix.map((prix) => (
                                <ContentCard
                                    key={prix.id}
                                    title={getPrixTitle(prix)}
                                    description={getPrixDescription(prix)}
                                    date={prix.date_obtention}
                                    status={getPrixTypeText(prix.membres)}
                                    statusColor={getPrixTypeColor(prix.membres)}
                                    hoverEffect={false}
                                    image={prix.image_url}
                                    externalLink={prix.lien_externe}
                                    currentLanguage={i18n.language}
                                >
                                    <div className="mt-4 space-y-3">
                                        {/* Organisme */}
                                        {prix.organisme && (
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium">{t('organisme')}:</span>{' '}
                                                {prix.organisme}
                                            </p>
                                        )}
                                        {/* Membres avec rôles */}
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">{t('awarded_to')}:</span>{' '}
                                            {prix.membres && prix.membres.length > 0
                                                ? prix.membres.map(m => `${m.prenom} ${m.nom}${m.role ? ` (${m.role})` : ''}`).join(', ')
                                                : t('no_member')
                                            }
                                        </p>
                                        {/* Date d'obtention */}
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">{t('date_awarded')}:</span>{' '}
                                            {new Date(prix.date_obtention).toLocaleDateString( 'fr-FR' , {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric'
                                            })}
                                        </p>
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
                                    {searchTerm || selectedType !== 'all' 
                                        ? t('no_prix_found') 
                                        : t('no_prix_available')}
                                </h3>
                                <p className="text-muted-foreground">
                                    {searchTerm || selectedType !== 'all'
                                        ? t('try_changing_search_criteria')
                                        : t('no_prix_available_message')}
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    );
} 