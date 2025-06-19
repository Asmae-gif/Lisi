import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react"
import type { Membre, MemberCategory } from '../types/membre';
import { useMembresSettings } from '../hooks/useMembresSettings';
import { useNavigate } from "react-router-dom"
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown, Mail, ExternalLink } from "lucide-react"
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { membresApi } from '../services/api';
import { buildImageUrl } from '@/utils/imageUtils';
import { useTranslation } from 'react-i18next';

const Membres: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<Membre | null>(null);
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Membre>('nom');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  const { settings, loading: settingsLoading, error: settingsError } = useMembresSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const { i18n, t } = useTranslation('membres');

  // Fonction pour obtenir le titre et sous-titre selon la langue actuelle
  const getLocalizedContent = useCallback(() => {
    const currentLang = i18n.language;
    let title = '';
    let subtitle = '';

    switch (currentLang) {
      case 'en':
        title = settings.membres_titre_en || settings.membres_titre_fr || 'Our Members';
        subtitle = settings.membres_sous_titre_en || settings.membres_sous_titre_fr || 'Discover the team of researchers, teachers and PhD students who make up our laboratory';
        break;
      case 'ar':
        title = settings.membres_titre_ar || settings.membres_titre_fr || 'أعضاءنا';
        subtitle = settings.membres_sous_titre_ar || settings.membres_sous_titre_fr || 'اكتشف فريق الباحثين والمعلمين وطلاب الدكتوراه الذين يشكلون مختبرنا';
        break;
      default: // fr
        title = settings.membres_titre_fr || 'Nos Membres';
        subtitle = settings.membres_sous_titre_fr || 'Découvrez l\'équipe de chercheurs, d\'enseignants et de doctorants qui composent notre laboratoire';
        break;
    }

    return { title, subtitle };
  }, [settings, i18n.language]);

  const { title, subtitle } = getLocalizedContent();

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

  const loadMembres = useCallback(async () => {
    try {
      setLoading(true);
      const response = await membresApi.getAll();
      if (response.success && response.data) {
        setMembres(response.data);
      } else {
        setError(t('error_loading'));
      }
    } catch (err) {
      console.error('Erreur lors du chargement des membres:', err);
      setError(t('error_loading'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadMembres();
  }, [loadMembres]);

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
          return statut.includes('permanent') || statut.includes('enseignant') || statut.includes('chercheur');
        })
      },
      {
        id: 'associe',
        title: t('associate_members'),
        members: sortedMembers.filter(m => {
          const statut = m.statut?.toLowerCase() || '';
          return statut.includes('associé') || statut.includes('associe') || statut.includes('collaborateur');
        })
      },
      {
        id: 'doctorant',
        title: t('phd_students'),
        members: sortedMembers.filter(m => {
          const statut = m.statut?.toLowerCase() || '';
          return statut.includes('doctorant') || statut.includes('thèse') || statut.includes('these');
        })
      },
      {
        id: 'autre',
        title: t('other_members'),
        members: sortedMembers.filter(m => {
          const statut = m.statut?.toLowerCase() || '';
          return !statut.includes('permanent') && 
                 !statut.includes('enseignant') &&
                 !statut.includes('chercheur') &&
                 !statut.includes('associé') && 
                 !statut.includes('associe') &&
                 !statut.includes('collaborateur') &&
                 !statut.includes('doctorant') &&
                 !statut.includes('thèse') &&
                 !statut.includes('these') &&
                 statut === '';
        })
      },
    ];

    return categories.filter(category => category.members.length > 0);
  }, [sortedMembers, t]);

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton type="grid" rows={1} />
      </div>
    );
  }

  if (error || settingsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || settingsError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section 
        className="bg-gradient-to-br from-green-50 to-indigo-100 py-16"
        style={settings.membres_image ? {
          backgroundImage: `url(${buildImageUrl(settings.membres_image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="block">{title}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{t('search_member')}</h1>
        <div className="relative border border-green-500 rounded-md">
          <Input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 pl-3 py-2 w-full"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
        </div>
      </div>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {membersByCategory.length > 0 ? (
            <div className="space-y-8">
              {membersByCategory.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">
                      {category.title} ({category.members.length})
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-green-600 transition-transform duration-200 ${
                        openCategories.includes(category.id) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {openCategories.includes(category.id) && (
                    <div className="p-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSort("nom")}
                            >
                              <div className="flex items-center">
                                {t('name')}
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
                                {t('first_name')}
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
                                {t('email')}
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
                                <td className="text-green-600 hover:underline">
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
                                            <h6 className="font-medium text-gray-900 mb-2">{t('biography')}</h6>
                                            <p className="text-gray-600 leading-relaxed text-sm">
                                              {member.biographie}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div>
                                        <h6 className="font-medium text-gray-900 mb-3">{t('external_links')}</h6>
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
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">{t('no_members_found')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Membres;