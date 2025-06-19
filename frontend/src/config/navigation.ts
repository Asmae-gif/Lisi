// Configuration partagée pour la navigation et les langues
export const languages = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'ar', flag: '🇸🇦', name: 'Arabic' }
];

export const navigationItems = [
  { key: 'index', path: '/index', label: 'Accueil' },
  { key: 'research', path: '/recherche', label: 'research' },
  { key: 'membres', path: '/membres', label: 'Membres' },
  { 
    key: 'resources', 
    path: '#', 
    label: 'resources',
    hasDropdown: true,
    dropdownItems: [
      { key: 'projects', path: '/projects', label: 'Projets' },
      { key: 'publications', path: '/publications', label: 'Publications' },
      { key: 'prix-distinctions', path: '/prix-distinctions', label: 'Prix et Distinctions' },
      { key: 'partenaires', path: '/partenaires', label: 'Partenaires' },
      { key: 'gallery', path: '/gallerie', label: 'gallery' },
      { key: 'equipes', path: '/equipes', label: 'equipes' }
    ]
  },
  { key: 'contact', path: '/contact', label: 'contact' }
]; 