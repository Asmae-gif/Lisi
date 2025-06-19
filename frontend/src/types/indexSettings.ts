// Interfaces pour les structures de données réutilisables
export interface MissionPillar {
  title: string;
  description: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
}

export interface ResearchDomain {
  name: string;
  icon: string;
  description: string;
}

export interface NewsItem {
  date: string;
  title: string;
  category: string;
}

// Interface pour le contenu multilingue
export interface MultilingualContent {
  fr: string;
  ar: string;
  en: string;
}

// Interface pour les paramètres multilingues
export interface IndexSettings {
  id?: number;
  // Hero Section - Multilingue
  hero_titre_principal_fr?: string;
  hero_titre_principal_ar?: string;
  hero_titre_principal_en?: string;
  hero_sous_titre_fr?: string;
  hero_sous_titre_ar?: string;
  hero_sous_titre_en?: string;
  hero_image_side?: string;
  
  // Mission Section - Multilingue
  mission_titre_fr?: string;
  mission_titre_ar?: string;
  mission_titre_en?: string;
  mission_sous_titre_fr?: string;
  mission_sous_titre_ar?: string;
  mission_sous_titre_en?: string;
  mission_description_fr?: string;
  mission_description_ar?: string;
  mission_description_en?: string;
  mission_texte_1_fr?: string;
  mission_texte_1_ar?: string;
  mission_texte_1_en?: string;
  mission_texte_2_fr?: string;
  mission_texte_2_ar?: string;
  mission_texte_2_en?: string;
  mission_image?: string;
  pilier_valeur1_titre_fr?:string;
  pilier_valeur1_description_fr?:string;
  pilier_valeur1_titre_ar?:string;
  pilier_valeur1_description_ar?:string;
  pilier_valeur1_titre_en?:string;
  pilier_valeur1_description_en?:string;
  pilier_valeur2_titre_fr?:string;
  pilier_valeur2_description_fr?:string;
  pilier_valeur2_titre_ar?:string;
  pilier_valeur2_description_ar?:string;
  pilier_valeur2_titre_en?:string;
  pilier_valeur2_description_en?:string;
  pilier_valeur3_titre_fr?:string;
  pilier_valeur3_description_fr?:string;
  pilier_valeur3_titre_ar?:string;
  pilier_valeur3_description_ar?:string;
  pilier_valeur3_titre_en?:string;
  pilier_valeur3_description_en?:string;
  pilier_valeur4_titre_fr?:string;
  pilier_valeur4_description_fr?:string;
  pilier_valeur4_titre_ar?:string;
  pilier_valeur4_description_ar?:string;
  pilier_valeur4_titre_en?:string;
  pilier_valeur4_description_en?:string;
  
  //Mot du directeur Section - Multilingue
  mot_directeur_titre_fr?:string;
  mot_directeur_titre_ar?:string;
  mot_directeur_titre_en?:string;
  mot_directeur_description_fr?:string;
  mot_directeur_description_ar?:string;
  mot_directeur_description_en?:string;
  mot_directeur_image?:string;

  // Actualités Section - Multilingue
  actualites_titre_fr?: string;
  actualites_titre_ar?: string;
  actualites_titre_en?: string;
  actualites_description_fr?: string;
  actualites_description_ar?: string;
  actualites_description_en?: string;
  
  // Domaines Section - Multilingue
  domaines_titre_fr?: string;
  domaines_titre_ar?: string;
  domaines_titre_en?: string;
  domaines_sous_titre_fr?: string;
  domaines_sous_titre_ar?: string;
  domaines_sous_titre_en?: string;
  domaines_description_fr?: string;
  domaines_description_ar?: string;
  domaines_description_en?: string;
  domaines_texte_final_fr?: string;
  domaines_texte_final_ar?: string;
  domaines_texte_final_en?: string;
  
  // Statistiques (nombres)
  nbr_membres?: string;
  nbr_publications?: string;
  nbr_projets?: string;
  nbr_locaux?: string;
  
  // Champs de compatibilité (pour l'ancien système)
  hero_titre_principal?: string;
  hero_sous_titre?: string;
  mission_titre?: string;
  mission_sous_titre?: string;
  mission_description?: string;
  mission_texte_1?: string;
  mission_texte_2?: string;
  actualites_titre?: string;
  actualites_sous_titre?: string;
  domaines_titre?: string;
  domaines_sous_titre?: string;
  domaines_description?: string;
  domaines_texte_final?: string;
  
  stats_chercheurs?: string;
  stats_publications?: string;
  stats_projets?: string;
  stats_partenaires?: string;
  chiffres_cles?: string;
  pilier_innovation_titre?: string;
  pilier_innovation_description?: string;
  pilier_formation_titre?: string;
  pilier_formation_description?: string;
  pilier_impact_titre?: string;
  pilier_impact_description?: string;
  pilier_partenariats_titre?: string;
  pilier_partenariats_description?: string;
  domaine_ia_titre?: string;
  domaine_ia_description?: string;
  domaine_donnees_titre?: string;
  domaine_donnees_description?: string;
  domaine_cognition_titre?: string;
  domaine_cognition_description?: string;
  domaine_robotique_titre?: string;
  domaine_robotique_description?: string;
  domaine_cybersecurite_titre?: string;
  domaine_cybersecurite_description?: string;
  domaine_vision_titre?: string;
  domaine_vision_description?: string;
  domaine_telecom_titre?: string;
  domaine_telecom_description?: string;
  domaine_techniques_titre?: string;
  domaine_techniques_description?: string;
  [key: string]: string | number | undefined;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: IndexSettings;
}

export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'number' | 'email' | 'url';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  accept?: string;
}

export interface Section {
  title: string;
  fields: Field[];
  description?: string;
}

// Constantes réutilisables pour les icônes et couleurs
export const ICONS = {
  HANDSHAKE: 'Handshake',
  LIGHTBULB: 'Lightbulb',
  TARGET: 'Target',
  USERS: 'Users',
  GLOBE: 'Globe',
  AWARD: 'Award',
  MICROSCOPE: 'Microscope',
  ZAP: 'Zap',
  SHIELD: 'Shield',
  BOOK_OPEN: 'BookOpen',
  ARROW_RIGHT: 'ArrowRight',
  CHEVRON_RIGHT: 'ChevronRight'
} as const;

export const COLORS = {
  BLUE: 'from-blue-500 to-blue-600',
  PURPLE: 'from-purple-500 to-purple-600',
  GREEN: 'from-green-500 to-green-600',
  ORANGE: 'from-orange-500 to-orange-600'
} as const;

// Données statiques réutilisables
export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    date: "15 Mai 2024",
    title: "Signature d'un partenariat stratégique avec l'Institut National de Recherche en IA",
    category: "Partenariat"
  },
  {
    date: "8 Mai 2024",
    title: "Publication de notre étude sur l'apprentissage automatique dans la revue Science",
    category: "Publication"
  },
  {
    date: "28 Avril 2024",
    title: "Conférence internationale sur l'IA éthique : inscriptions ouvertes",
    category: "Événement"
  }
];

export const DEFAULT_MISSION_PILLARS: IndexSettings[] = [
  {
    pilier_valeur1_titre_fr: "Innovation",
    pilier_valeur1_description_fr: "Recherche scientifique innovante et interdisciplinaire",
    pilier_valeur1_titre_ar: "الابتكار",
    pilier_valeur1_description_ar: "بحث علمي مبتكر ومتعدد التخصصات",
    pilier_valeur1_titre_en: "Innovation",
    pilier_valeur1_description_en: "Innovative and interdisciplinary scientific research ",
    icon: ICONS.LIGHTBULB,
    color: COLORS.BLUE
  },
  {
    pilier_valeur2_titre_fr: "Formation",
    pilier_valeur2_description_fr: "Formation des futurs chercheurs et experts",
    pilier_valeur2_titre_ar: "التعليم",
    pilier_valeur2_description_ar: "تعليم المستقبلين الباحثين والخبراء",
    pilier_valeur2_titre_en: "Formation",
    pilier_valeur2_description_en: "Training of future researchers and experts",
    icon: ICONS.USERS,
    color: COLORS.PURPLE
  },
  {
    pilier_valeur3_titre_fr: "Impact",
    pilier_valeur3_description_fr: "Recherche à fort impact socio-économique",
    pilier_valeur3_titre_ar: "التأثير",
    pilier_valeur3_description_ar: "البحث العلمي المتأثر بالاقتصاد والمجتمع",
    pilier_valeur3_titre_en: "Impact",
    pilier_valeur3_description_en: "Scientific research with high socio-economic impact",
    icon: ICONS.GLOBE,
    color: COLORS.GREEN
  },
  {
    pilier_valeur4_titre_fr: "Partenariats",
    pilier_valeur4_description_fr: "Renforcement des partenariats nationaux et internationaux",
    pilier_valeur4_titre_ar: "الشراكات",
    pilier_valeur4_description_ar: "تعزيز الشراكات الوطنية والدولية",
    pilier_valeur4_titre_en: "Partnerships",
    pilier_valeur4_description_en: "Strengthening national and international partnerships",
    icon: ICONS.HANDSHAKE,
    color: COLORS.ORANGE
  }
];

export const DEFAULT_RESEARCH_DOMAINS: ResearchDomain[] = [
  {
    name: "Intelligence Artificielle et Apprentissage Automatique",
    icon: ICONS.MICROSCOPE,
    description: "Développement d'algorithmes d'IA avancés"
  },
  {
    name: "Analyse des Données et Systèmes d'Information",
    icon: ICONS.TARGET,
    description: "Traitement et analyse de données complexes"
  },
  {
    name: "Cognition, Perception et Interaction Homme-Machine",
    icon: ICONS.USERS,
    description: "Interface intuitive entre humain et machine"
  },
  {
    name: "Robotique et Systèmes Autonomes",
    icon: ICONS.ZAP,
    description: "Systèmes robotiques intelligents et autonomes"
  },
  {
    name: "Cybersécurité et Systèmes de Protection",
    icon: ICONS.SHIELD,
    description: "Protection des systèmes informatiques"
  },
  {
    name: "Vision par Ordinateur et Intelligence Visuelle",
    icon: ICONS.GLOBE,
    description: "Traitement et analyse d'images intelligentes"
  },
  {
    name: "Télécommunications et Hyperfréquences",
    icon: ICONS.AWARD,
    description: "Communications avancées et technologies RF"
  },
  {
    name: "Techniques Avancées & Transmission",
    icon: ICONS.BOOK_OPEN,
    description: "Technologies de transmission innovantes"
  }
];

// Valeurs par défaut pour les paramètres multilingues
export const DEFAULT_INDEX_SETTINGS: IndexSettings = {
  // Hero Section - Multilingue
  hero_titre_principal_fr: "Laboratoire d'Informatique et de Systèmes Intelligents",
  hero_titre_principal_ar: "مختبر المعلوماتية والأنظمة الذكية",
  hero_titre_principal_en: "Laboratory of Computer Science and Intelligent Systems",
  hero_sous_titre_fr: "Le LISI repousse les frontières de l'informatique appliquée aux enjeux sociétaux et industriels de demain",
  hero_sous_titre_ar: "يدمج مختبر LISI المعلوماتية مع تخصصات أخرى للابتكار والاستجابة للتحديات العلمية والمجتمعية في الغد",
  hero_sous_titre_en: "LISI combines computer science with other disciplines to innovate and respond to tomorrow's scientific and societal challenges",
  
  // Mission Section - Multilingue
  mission_titre_fr: "Au cœur de l'innovation technologique",
  mission_titre_ar: "في قلب الابتكار التكنولوجي",
  mission_titre_en: "At the heart of technological innovation",
  mission_sous_titre_fr: "NOTRE MISSION",
  mission_sous_titre_ar: "مهمتنا",
  mission_sous_titre_en: "OUR MISSION",
  mission_description_fr: "Le LISI promeut une recherche scientifique innovante, interdisciplinaire et à fort impact socio-économique",
  mission_description_ar: "يعزز مختبر LISI البحث العلمي المبتكر والمتعدد التخصصات وذو التأثير الاجتماعي والاقتصادي العالي",
  mission_description_en: "LISI promotes innovative, interdisciplinary scientific research with high socio-economic impact",
  mission_texte_1_fr: "Notre laboratoire se distingue par son approche multidisciplinaire qui combine expertise technique et vision stratégique. Nous développons des solutions innovantes qui répondent aux défis technologiques actuels tout en anticipant les besoins futurs.",
  mission_texte_1_ar: "يتميز مختبرنا بمنهجيته متعددة التخصصات التي تجمع بين الخبرة التقنية والرؤية الاستراتيجية. نطور حلول مبتكرة تستجيب للتحديات التكنولوجية الحالية مع توقع الاحتياجات المستقبلية.",
  mission_texte_1_en: "Our laboratory stands out for its multidisciplinary approach that combines technical expertise and strategic vision. We develop innovative solutions that respond to current technological challenges while anticipating future needs.",
  mission_texte_2_fr: "Grâce à nos partenariats avec l'industrie et le monde académique, nous créons un écosystème dynamique favorisant l'innovation et le transfert de technologies vers la société.",
  mission_texte_2_ar: "من خلال شراكاتنا مع الصناعة والعالم الأكاديمي، نخلق نظامًا بيئيًا ديناميكيًا يعزز الابتكار ونقل التكنولوجيا إلى المجتمع.",
  mission_texte_2_en: "Through our partnerships with industry and academia, we create a dynamic ecosystem fostering innovation and technology transfer to society.",
  
  // Actualités Section - Multilingue
  actualites_titre_fr: "Actualités du laboratoire",
  actualites_titre_ar: "أخبار المختبر",
  actualites_titre_en: "Laboratory News",
  actualites_description_fr: "Découvrez les dernières actualités et événements du laboratoire",
  actualites_description_ar: "اكتشف أحدث الأخبار والأحداث في المختبر",
  actualites_description_en: "Discover the latest news and events from the laboratory",
  
  // Domaines Section - Multilingue
  domaines_titre_fr: "Domaines de recherche",
  domaines_titre_ar: "مجالات البحث",
  domaines_titre_en: "Research Areas",
  domaines_sous_titre_fr: "NOS EXPERTISES",
  domaines_sous_titre_ar: "خبراتنا",
  domaines_sous_titre_en: "OUR EXPERTISE",
  domaines_description_fr: "Nos domaines de recherche couvrent les technologies les plus avancées",
  domaines_description_ar: "تغطي مجالات بحثنا أحدث التقنيات",
  domaines_description_en: "Our research areas cover the most advanced technologies",
  domaines_texte_final_fr: "Ces domaines représentent notre expertise et notre vision pour l'avenir",
  domaines_texte_final_ar: "تمثل هذه المجالات خبرتنا ورؤيتنا للمستقبل",
  domaines_texte_final_en: "These areas represent our expertise and vision for the future",
  
  // Statistiques (nombres)
  nbr_membres: "30+",
  nbr_publications: "40+",
  nbr_projets: "15+",
  nbr_locaux: "3+",
  
  // Images
  mission_image: "/api/placeholder/600/400",
  hero_image_side: "/api/placeholder/500/400",
  
  // Champs de compatibilité (pour l'ancien système)
  hero_titre_principal: "Laboratoire d'Informatique et de Systèmes Intelligents",
  hero_sous_titre: "Le LISI repousse les frontières de l'informatique appliquée aux enjeux sociétaux et industriels de demain",
  chiffres_cles: "CHIFFRES CLÉS",
  actualites_sous_titre: "DERNIÈRES NOUVELLES",
  mission_titre: "Au cœur de l'innovation technologique",
  mission_sous_titre: "NOTRE MISSION",
  mission_description: "Le LISI promeut une recherche scientifique innovante, interdisciplinaire et à fort impact socio-économique",
  mission_texte_1: "Notre laboratoire se distingue par son approche multidisciplinaire qui combine expertise technique et vision stratégique. Nous développons des solutions innovantes qui répondent aux défis technologiques actuels tout en anticipant les besoins futurs.",
  mission_texte_2: "Grâce à nos partenariats avec l'industrie et le monde académique, nous créons un écosystème dynamique favorisant l'innovation et le transfert de technologies vers la société.",
  actualites_titre: "Actualités du laboratoire",
  domaines_titre: "Domaines de recherche",
  domaines_sous_titre: "NOS EXPERTISES",
  domaines_description: "Le Laboratoire d'Informatique et de Systèmes Intelligents (LISI) articule ses activités autour de huit axes de recherche complémentaires qui façonnent l'avenir technologique.",
  domaines_texte_final: "Ces domaines d'expertise permettent au LISI de répondre aux grands défis technologiques contemporains et de former les futurs experts en informatique et systèmes intelligents.",
  pilier_valeur1_titre_fr: DEFAULT_MISSION_PILLARS[0].pilier_valeur1_titre_fr,
  pilier_valeur1_description_fr: DEFAULT_MISSION_PILLARS[0].pilier_valeur1_description_fr,
  pilier_valeur2_titre_fr: DEFAULT_MISSION_PILLARS[1].pilier_valeur2_titre_fr,
  pilier_valeur2_description_fr: DEFAULT_MISSION_PILLARS[1].pilier_valeur2_description_fr,
  pilier_valeur3_titre_fr: DEFAULT_MISSION_PILLARS[2].pilier_valeur3_titre_fr,
  pilier_valeur3_description_fr: DEFAULT_MISSION_PILLARS[2].pilier_valeur3_description_fr,
  pilier_valeur4_titre_fr: DEFAULT_MISSION_PILLARS[3].pilier_valeur4_titre_fr,
  pilier_valeur4_description_fr: DEFAULT_MISSION_PILLARS[3].pilier_valeur4_description_fr,
  pilier_valeur1_titre_ar: DEFAULT_MISSION_PILLARS[0].pilier_valeur1_titre_ar,
  pilier_valeur1_description_ar: DEFAULT_MISSION_PILLARS[0].pilier_valeur1_description_ar,
  pilier_valeur1_titre_en: DEFAULT_MISSION_PILLARS[0].pilier_valeur1_titre_en,
  pilier_valeur1_description_en: DEFAULT_MISSION_PILLARS[0].pilier_valeur1_description_en,
  pilier_valeur2_titre_ar: DEFAULT_MISSION_PILLARS[1].pilier_valeur2_titre_ar,
  pilier_valeur2_description_ar: DEFAULT_MISSION_PILLARS[1].pilier_valeur2_description_ar,
  pilier_valeur2_titre_en: DEFAULT_MISSION_PILLARS[1].pilier_valeur2_titre_en,
  pilier_valeur2_description_en: DEFAULT_MISSION_PILLARS[1].pilier_valeur2_description_en,
  pilier_valeur3_titre_ar: DEFAULT_MISSION_PILLARS[2].pilier_valeur3_titre_ar,
  pilier_valeur3_description_ar: DEFAULT_MISSION_PILLARS[2].pilier_valeur3_description_ar,
  pilier_valeur3_titre_en: DEFAULT_MISSION_PILLARS[2].pilier_valeur3_titre_en,
  pilier_valeur3_description_en: DEFAULT_MISSION_PILLARS[2].pilier_valeur3_description_en,
  pilier_valeur4_titre_ar: DEFAULT_MISSION_PILLARS[3].pilier_valeur4_titre_ar,
  pilier_valeur4_description_ar: DEFAULT_MISSION_PILLARS[3].pilier_valeur4_description_ar,
  pilier_valeur4_titre_en: DEFAULT_MISSION_PILLARS[3].pilier_valeur4_titre_en,
  pilier_valeur4_description_en: DEFAULT_MISSION_PILLARS[3].pilier_valeur4_description_en,
  mot_directeur_titre_fr: "Mot du directeur",
  mot_directeur_titre_ar: "موضوع المدير",
  mot_directeur_titre_en: "Director's Message",
  mot_directeur_description_fr: "Le LISI est un laboratoire de recherche en informatique et en systèmes intelligents, qui se concentre sur la recherche fondamentale et appliquée dans ces domaines.",
  mot_directeur_description_ar: " يجسد مختبرنا التميز العلمي والابتكار التكنولوجي. نحن ملتزمون بدفع حدود المعرفة وتكوين الجيل القادم من الباحثين. تُمكننا مقاربتنا متعددة التخصصات من مواجهة التحديات المعقدة لعصرنا بإبداع وصرامة.",
  mot_directeur_description_en: " Our laboratory embodies scientific excellence and technological innovation. We are committed to pushing the boundaries of knowledge while training the next generation of researchers. Our multidisciplinary approach enables us to address the complex challenges of our time with creativity and rigor",
  domaine_ia_titre: DEFAULT_RESEARCH_DOMAINS[0].name,
  domaine_ia_description: DEFAULT_RESEARCH_DOMAINS[0].description,
  domaine_donnees_titre: DEFAULT_RESEARCH_DOMAINS[1].name,
  domaine_donnees_description: DEFAULT_RESEARCH_DOMAINS[1].description,
  domaine_cognition_titre: DEFAULT_RESEARCH_DOMAINS[2].name,
  domaine_cognition_description: DEFAULT_RESEARCH_DOMAINS[2].description,
  domaine_robotique_titre: DEFAULT_RESEARCH_DOMAINS[3].name,
  domaine_robotique_description: DEFAULT_RESEARCH_DOMAINS[3].description,
  domaine_cybersecurite_titre: DEFAULT_RESEARCH_DOMAINS[4].name,
  domaine_cybersecurite_description: DEFAULT_RESEARCH_DOMAINS[4].description,
  domaine_vision_titre: DEFAULT_RESEARCH_DOMAINS[5].name,
  domaine_vision_description: DEFAULT_RESEARCH_DOMAINS[5].description,
  domaine_telecom_titre: DEFAULT_RESEARCH_DOMAINS[6].name,
  domaine_telecom_description: DEFAULT_RESEARCH_DOMAINS[6].description,
  domaine_techniques_titre: DEFAULT_RESEARCH_DOMAINS[7].name,
  domaine_techniques_description: DEFAULT_RESEARCH_DOMAINS[7].description,
};

// Fonctions utilitaires pour transformer les données
export const createMissionPillarsFromSettings = (settings: IndexSettings): MissionPillar[] => {
  const pillars = [
    { 
      titleKey: 'pilier_valeur1_titre', 
      descKey: 'pilier_valeur1_description',
      icon: ICONS.LIGHTBULB,
      color: COLORS.BLUE,
      defaultIndex: 0
    },
    { 
      titleKey: 'pilier_valeur2_titre', 
      descKey: 'pilier_valeur2_description',
      icon: ICONS.USERS,
      color: COLORS.PURPLE,
      defaultIndex: 1
    },
    { 
      titleKey: 'pilier_valeur3_titre', 
      descKey: 'pilier_valeur3_description',
      icon: ICONS.GLOBE,
      color: COLORS.GREEN,
      defaultIndex: 2
    },
    { 
      titleKey: 'pilier_valeur4_titre', 
      descKey: 'pilier_valeur4_description',
      icon: ICONS.HANDSHAKE,
      color: COLORS.ORANGE,
      defaultIndex: 3
    }
  ];

  return pillars.map(pillar => ({
    title: String(settings[pillar.titleKey] || DEFAULT_MISSION_PILLARS[pillar.defaultIndex][`${pillar.titleKey}_fr`]),
    description: String(settings[pillar.descKey] || DEFAULT_MISSION_PILLARS[pillar.defaultIndex][`${pillar.descKey}_fr`]),
    titleKey: pillar.titleKey,
    descriptionKey: pillar.descKey,
    icon: pillar.icon,
    color: pillar.color
  }));
};

export const createResearchDomainsFromSettings = (settings: IndexSettings): ResearchDomain[] => {
  const domains = [
    { titleKey: 'domaine_ia_titre', descKey: 'domaine_ia_description', icon: ICONS.MICROSCOPE },
    { titleKey: 'domaine_donnees_titre', descKey: 'domaine_donnees_description', icon: ICONS.TARGET },
    { titleKey: 'domaine_cognition_titre', descKey: 'domaine_cognition_description', icon: ICONS.USERS },
    { titleKey: 'domaine_robotique_titre', descKey: 'domaine_robotique_description', icon: ICONS.ZAP },
    { titleKey: 'domaine_cybersecurite_titre', descKey: 'domaine_cybersecurite_description', icon: ICONS.SHIELD },
    { titleKey: 'domaine_vision_titre', descKey: 'domaine_vision_description', icon: ICONS.GLOBE },
    { titleKey: 'domaine_telecom_titre', descKey: 'domaine_telecom_description', icon: ICONS.AWARD },
    { titleKey: 'domaine_techniques_titre', descKey: 'domaine_techniques_description', icon: ICONS.BOOK_OPEN }
  ];

  return domains.map((domain, index) => ({
    name: String(settings[domain.titleKey] || DEFAULT_RESEARCH_DOMAINS[index].name),
    icon: domain.icon,
    description: String(settings[domain.descKey] || DEFAULT_RESEARCH_DOMAINS[index].description)
  }));
};

// Fonction utilitaire pour récupérer le contenu dans la langue actuelle
export const getMultilingualContent = (
  settings: IndexSettings, 
  baseKey: string, 
  currentLanguage: string,
  fallbackKey?: string
): string => {
  const languageKey = currentLanguage as 'fr' | 'ar' | 'en';
  const multilingualKey = `${baseKey}_${languageKey}`;
  
  // Essayer d'abord le contenu multilingue
  const multilingualContent = settings[multilingualKey] as string;
  if (multilingualContent) {
    return multilingualContent;
  }
  
  // Fallback vers l'ancien système (champ unique)
  const legacyContent = settings[baseKey] as string;
  if (legacyContent) {
    return legacyContent;
  }
  
  // Fallback vers la clé de traduction
  if (fallbackKey) {
    return fallbackKey;
  }
  
  return '';
};

// Fonction utilitaire pour fusionner les données API avec les valeurs par défaut
export const mergeSettingsWithDefaults = (
  apiData: Partial<IndexSettings> | null | undefined
): IndexSettings => {
  if (!apiData || typeof apiData !== 'object') {
    return DEFAULT_INDEX_SETTINGS;
  }
  
  return {
    ...DEFAULT_INDEX_SETTINGS,
    ...apiData
  };
};

// Fonction pour créer un objet de contenu multilingue
export const createMultilingualField = (
  fr: string = '',
  ar: string = '',
  en: string = ''
): MultilingualContent => ({
  fr,
  ar,
  en
}); 