import React, { useState, useEffect, useCallback, useMemo } from "react"
import type { Membre, MemberCategory } from '@/types/membre';
import { useNavigate } from "react-router-dom"
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, Mail, ExternalLink, Search, Users } from "lucide-react"
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Input } from "@/components/ui/input"
import { membresApi } from '@/services/api';
import { buildImageUrlWithDefaults } from '@/utils/imageUtils';
import { useTranslation } from 'react-i18next';
import PageContent from '@/components/common/PageContent';
import api from '@/lib/api';

interface MembresSettings {
  membres_titre_fr?: string;
  membres_sous_titre_fr?: string;
  membres_titre_en?: string;
  membres_sous_titre_en?: string;
  membres_titre_ar?: string;
  membres_sous_titre_ar?: string;
  membres_image?: string;
}

const Membres: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<Membre | null>(null);
  const [membres, setMembres] = useState<Membre[]>([]);
  const [settings, setSettings] = useState<MembresSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Membre>('nom');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { i18n, t } = useTranslation('membres');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Charger les membres et les settings en parallèle
      const [membresResponse, settingsResponse] = await Promise.all([
        membresApi.getAll(),
        api.get('/pages/membres/settings')
      ]);
      
      if (membresResponse.success && membresResponse.data) {
        setMembres(membresResponse.data);
      } else {
        setError(t('error_loading'));
      }
      
      // Gérer la nouvelle structure hiérarchique des paramètres
      const settingsData = settingsResponse.data?.data || settingsResponse.data || {};
      
      // Si les données sont dans une structure hiérarchique, les aplatir
      let flattenedSettings = {};
      const settingsDataTyped = settingsData as any;
      if (settingsDataTyped.fr || settingsDataTyped.en || settingsDataTyped.ar) {
        // Structure hiérarchique - aplatir
        Object.keys(settingsDataTyped).forEach(lang => {
          if (typeof settingsDataTyped[lang] === 'object') {
            Object.keys(settingsDataTyped[lang]).forEach(key => {
              flattenedSettings[`membres_${key}_${lang}`] = settingsDataTyped[lang][key];
            });
          }
        });
      } else {
        // Structure plate - utiliser directement
        flattenedSettings = settingsDataTyped;
      }
      
      setSettings(flattenedSettings);
      
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Récupérer les textes selon la langue actuelle
  const currentLanguage = i18n.language || 'fr';
  const getLocalizedText = (key: string, fallback: string) => {
    const settingKey = `membres_${key}_${currentLanguage}`;
    return settings[settingKey as keyof MembresSettings] || fallback;
  };

  const title = getLocalizedText('titre', 'Nos Membres');
  const subtitle = getLocalizedText('sous_titre', 'Découvrez l\'équipe de chercheurs, d\'enseignants et de doctorants qui composent notre laboratoire');

  const handleSort = (field: keyof Membre) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredMembersData = useMemo(() => {
    if (!searchQuery.trim()) {
      return membres;
    }
    const query = searchQuery.toLowerCase();
    return membres.filter(membre => 
      (membre.prenom?.toLowerCase().includes(query) || 
       membre.nom?.toLowerCase().includes(query))
    );
  }, [membres, searchQuery]);

  const sortedMembers = useMemo(() => {
    return [...filteredMembersData].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredMembersData, sortField, sortDirection]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setSelectedMember(null);
  };

  const handleMemberClick = (member: Membre) => {
    setSelectedMember(selectedMember?.id === member.id ? null : member);
  };

  const handleMembreClick = useCallback((membreId: number) => {
    navigate(`/membres/${membreId}`);
  }, [navigate]);

  const membersByCategory = useMemo(() => {
    const categories: MemberCategory[] = [
      {
        id: 'permanent',
        title: t('permanent_members'),
        members: sortedMembers.filter(m => {
          const statut = m.statut?.toLowerCase() || '';
          return statut === 'permanent';
        })
      },
      {
        id: 'associe',
        title: t('associate_members'),
        members: sortedMembers.filter(m => {
          const statut = m.statut?.toLowerCase() || '';
          return statut === 'associés';
        })
      },
      {
        id: 'doctorant',
        title: t('phd_students'),
        members: sortedMembers.filter(m => {
          const statut = m.statut?.toLowerCase() || '';
          return statut === 'doctorants';
        })
      },
      {
        id: 'autre',
        title: t('other_members'),
        members: sortedMembers.filter(m => {
          const statut = m.statut?.toLowerCase() || '';
          return statut !== 'permanent' && statut !== 'associés' && statut !== 'doctorants' && statut !== '';
        })
      },
    ];

    return categories.filter(category => category.members.length > 0);
  }, [sortedMembers, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton type="grid" rows={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <PageContent
        hero
        title={title}
        subtitle={subtitle}
        backgroundImage={settings?.membres_image ? buildImageUrlWithDefaults(settings.membres_image) : undefined}
      >
        <></>
      </PageContent>

      {/* Search Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-green-600" />
            {t('search_member', 'Rechercher un membre')}
          </h2>
          <div className="relative border border-green-500 rounded-md">
            <Input
              type="text"
              placeholder={t('search_placeholder', 'Rechercher par nom ou prénom...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-3 py-2 w-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Members by Category */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-green-600" />
              Membres par catégorie
            </h2>
            <div className="text-sm text-gray-500">
              {membres.length} membre{membres.length > 1 ? 's' : ''} au total
            </div>
          </div>

          {membersByCategory.length > 0 ? (
            <div className="space-y-6">
              {membersByCategory.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden border-l-4 border-l-green-500">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {category.title}
                      </h3>
                      <span className="text-gray-600">
                        {category.members.length} membre{category.members.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-green-600 transition-transform duration-200 ${
                        openCategories.includes(category.id) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {openCategories.includes(category.id) && (
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("nom")}
                              >
                                <div className="flex items-center">
                                  {t('name', 'Nom')}
                                  {sortField === "nom" && (
                                    <ChevronDown 
                                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                        sortDirection === "asc" ? '' : 'rotate-180'
                                      }`} 
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("prenom")}
                              >
                                <div className="flex items-center">
                                  {t('first_name', 'Prénom')}
                                  {sortField === "prenom" && (
                                    <ChevronDown 
                                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                        sortDirection === "asc" ? '' : 'rotate-180'
                                      }`} 
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("email")}
                              >
                                <div className="flex items-center">
                                  {t('email', 'Email')}
                                  {sortField === "email" && (
                                    <ChevronDown 
                                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                        sortDirection === "asc" ? '' : 'rotate-180'
                                      }`} 
                                    />
                                  )}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {category.members.map((member) => (
                              <React.Fragment key={member.id}>
                                <tr 
                                  className="hover:bg-gray-50 cursor-pointer"
                                  onClick={() => handleMemberClick(member)}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {member.nom}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {member.prenom}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 hover:underline">
                                    {member.email}
                                  </td>
                                </tr>
                                {selectedMember?.id === member.id && (
                                  <tr>
                                    <td colSpan={3} className="px-6 py-4">
                                      <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                        <h5 className="font-semibold text-gray-900 mb-4 text-lg">
                                          {member.prenom} {member.nom}
                                        </h5>
                                        
                                        <div className="mb-6">
                                          <div className="flex items-center text-gray-600 mb-4">
                                            <Mail className="w-4 h-4 mr-2" />
                                            <span>{member.email }</span>
                                          </div>
                                          
                                          {member.biographie && (
                                            <div className="mb-4">
                                              <h6 className="font-medium text-gray-900 mb-2">{t('biography', 'Biographie')}</h6>
                                              <p className="text-gray-600 leading-relaxed text-sm">
                                                {member.biographie}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div>
                                          <h6 className="font-medium text-gray-900 mb-3">{t('external_links', 'Liens externes')}</h6>
                                          <div className="flex flex-wrap gap-2">
                                            {member.linkedin && (
                                              <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                              >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                LinkedIn
                                              </a>
                                            )}
                                            {member.researchgate && (
                                              <a
                                                href={member.researchgate}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                              >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                ResearchGate
                                              </a>
                                            )}
                                            {member.google_scholar && (
                                              <a
                                                href={member.google_scholar}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                              >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Google Scholar
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun membre disponible
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Aucun membre ne correspond à votre recherche.' : 'Aucun membre n\'est encore disponible.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Membres;