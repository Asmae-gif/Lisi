import { useEffect, useState, useMemo } from 'react';
import { projectApi } from '../services/projectApi';
import ContentCard from '@/components/common/ContentCard';
import ContentGrid from '@/components/common/ContentGrid';
import FilterBar from '@/components/common/FilterBar';
import { useTranslation } from 'react-i18next';
import { Project } from '@/types/project';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { buildImageUrl } from '@/utils/imageUtils';
import { ProjectSettings } from '@/types/ProjectSettings';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { t, i18n } = useTranslation('project');
  const { settings, loading: settingsLoading, error: settingsError } = useProjectSettings();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getAll();
      setProjects(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(t('error_loading_projects'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getLocalizedField = (
    settings: ProjectSettings,
    baseKey: string,
    lang: string,
    fallback: string
  ) => {
    return settings?.[`${baseKey}_${lang}`] || settings?.[`${baseKey}_fr`] || fallback;
  };

  const mapStatusToKey = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'en cours': return 'status_in_progress';
      case 'terminé': return 'status_finished';
      case 'en attente': return 'status_pending';
      case 'annulé': return 'status_cancelled';
      default: return 'status_not_defined';
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'en cours': return 'bg-blue-100 text-blue-800';
      case 'terminé': return 'bg-green-100 text-green-800';
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOptions = useMemo(() => {
    const statuses = [...new Set(projects.map(p => p.status || 'Non défini'))];
    return statuses.map(status => ({
      value: status.toLowerCase(),
      label: status,
      count: projects.filter(p => (p.status || 'Non défini').toLowerCase() === status.toLowerCase()).length
    }));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const titles = [project.name_fr, project.name_en, project.name_ar].map(t => t || '');
      const descriptions = [project.description_fr, project.description_en, project.description_ar].map(d => d || '');
      const matchesSearch = [...titles, ...descriptions].some(text =>
        text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = selectedStatus === 'all' || (project.status || '').toLowerCase() === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, selectedStatus]);

  const getProjectTitle = (project: Project) => {
    switch (i18n.language) {
      case 'fr': return project.name_fr || project.name || t('title_not_defined');
      case 'en': return project.name_en || project.name || t('title_not_defined_en');
      case 'ar': return project.name_ar || project.name || t('title_not_defined_ar');
      default: return project.name || t('title_not_defined');
    }
  };

  const getProjectDescription = (project: Project) => {
    switch (i18n.language) {
      case 'fr': return project.description_fr || project.description || t('description_not_available');
      case 'en': return project.description_en || project.description || t('description_not_available_en');
      case 'ar': return project.description_ar || project.description || t('description_not_available_ar');
      default: return project.description || t('description_not_available');
    }
  };

  const heroTitle = getLocalizedField(settings, 'projet_titre', i18n.language, t('project_hero_title_default'));
  const heroSubtitle = getLocalizedField(settings, 'projet_sous_titre', i18n.language, t('project_hero_subtitle_default'));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section
        className="bg-gradient-to-br from-green-50 to-indigo-100 py-16"
        style={settings.projet_image ? {
          backgroundImage: `url(${buildImageUrl(settings.projet_image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{heroTitle}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{heroSubtitle}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 px-4">
          <FilterBar
            searchPlaceholder={t('search_project_placeholder')}
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
                            <div className="flex items-center rtl:space-x-reverse space-x-3">
                                <div className="p-2 bg-indigo-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-indigo-600" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{t('total_projects')}</p>
                                    <p className="text-2xl font-bold text-indigo-900">{projects.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center rtl:space-x-reverse space-x-3">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-green-600" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{t('financed_projects')}</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {projects.filter(p => p.type_projet === 'finance').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                            <div className="flex items-center rtl:space-x-reverse space-x-3">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-purple-600" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{t('incubated_projects')}</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {projects.filter(p => p.type_projet === 'incube').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                            <div className="flex items-center rtl:space-x-reverse space-x-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-600" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{t('in_progress_projects')}</p>
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
                                title={getProjectTitle(project)}
                                description={getProjectDescription(project)}
                                subtitle={`${t('project_type_label')}: ${project.type_projet === 'finance' ? t('financed_project_type') : t('incubated_project_type')}`}
                                date={project.created_at}
                                status={project.status || 'Non défini'}
                                statusColor={getStatusColor(project.status)}
                                hoverEffect={true}
                                link={`/projets/${project.id}`}
                                className="group"
                                currentLanguage={i18n.language}
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
                                            {project.type_projet === 'finance' ? t('financed_project_type') : t('incubated_project_type')}
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
                                                    <span className="text-muted-foreground">{t('start_date')}:</span>
                                                    <span className="font-medium">{new Date(project.date_debut).toLocaleDateString( 'fr-FR')}</span>
                                                </div>
                                            )}
                                            {project.date_fin && (
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-muted-foreground">{t('end_date')}:</span>
                                                    <span className="font-medium">{new Date(project.date_fin).toLocaleDateString( 'fr-FR')}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Informations supplémentaires */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">{t('status')}:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                {t(project.status || 'not_defined')}
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
                                    ? t('no_project_found') 
                                    : t('no_project_available')}
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm || selectedStatus !== 'all'
                                    ? t('try_changing_search_criteria')
                                    : t('no_project_available_message')}
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