// Configuration partagée pour la navigation et les langues
export const languages = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'ar', flag: '🇸🇦', name: 'Arabic' }
];

export const navigationItems = [
  { key: 'index', path: '/index', label: 'Accueil' },
  { key: 'axes-recherche', path: '/axes-recherche', label: 'research' },
  { key: 'membres', path: '/membres', label: 'Membres' },
  { 
    key: 'resources', 
    path: '#', 
    label: 'resources',
    hasDropdown: true,
    dropdownItems: [
      { key: 'projects', path: '/projects', label: 'projects' },
      { key: 'prix-distinctions', path: '/prix-distinctions', label: 'prix-distinctions' },
      { key: 'partenaires', path: '/partenaires', label: 'partners' },
      { key: 'galerie', path: '/galerie', label: 'gallery' },
      { key: 'rapports-activite', path: '/rapports-activite', label: 'activity-reports' }
    ]
  },
  { key: 'publications', path: '/publications', label: 'publications' },
  { key: 'contact', path: '/contact', label: 'contact' }
]; 