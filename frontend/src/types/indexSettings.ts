export interface LanguageSettings {
  // Hero Section
  hero_titre_principal1: string;
  hero_titre_principal2: string;
  hero_sous_titre: string;

  // Mission Section
  mission_titre: string;
  mission_sous_titre: string;
  mission_description: string;
  mission_texte_1: string;
  mission_texte_2: string;


  // Piliers de la mission
  pilier_valeur1_titre: string;
  pilier_valeur1_description: string;
  pilier_valeur2_titre: string;
  pilier_valeur2_description: string;
  pilier_valeur3_titre: string;
  pilier_valeur3_description: string;
  pilier_valeur4_titre: string;
  pilier_valeur4_description: string;

  // Mot du directeur
  mot_directeur_titre: string;
  mot_directeur_description: string;

  // Actualités Section
  actualites_titre: string;
  actualites_sous_titre: string;

  // Domaines Section
  domaines_titre: string;
  domaines_sous_titre: string;
  domaines_description: string;
  domaines_texte_final: string;
 
}

export interface IndexSettings {
  id?: number;
  
  // Champs non-traduisibles
  mission_image?: string;
  hero_image_side?: string;
  mot_directeur_image?: string;
  
  nbr_membres?: string;
  nbr_publications?: string;
  nbr_projets?: string;
  nbr_locaux?: string;

  // Contenu par langue
  fr: LanguageSettings;
  ar: LanguageSettings;
  en: LanguageSettings;
  
  [key: string]: LanguageSettings | string | number | undefined;
}


// --- VALEURS PAR DÉFAUT ---

const DEFAULT_FRENCH_SETTINGS: LanguageSettings = {
  hero_titre_principal1: "Laboratoire d'Informatique et",
  hero_titre_principal2:"de Systèmes Intelligents",
  hero_sous_titre: "Le LISI repousse les frontières de l’informatique pour relever les défis scientifiques, sociétaux et industriels de demain",
  mission_titre: "Au cœur de l'innovation technologique",
  mission_sous_titre: "NOTRE MISSION",
  mission_description: "Le LISI promeut une recherche scientifique innovante, interdisciplinaire et à fort impact socio-économique.",
  mission_texte_1: "Le Laboratoire d’Informatique et de Systèmes Intelligents (LISI) a pour mission de promouvoir une recherche scientifique de haut niveau, d’assurer l’encadrement des doctorants, et de contribuer activement à la formation par la recherche.",
  mission_texte_2: "Le LISI se distingue par une approche pluridisciplinaire et stratégique, alliant excellence scientifique et ouverture sur les enjeux actuels.",
  pilier_valeur1_titre: "Innovation",
  pilier_valeur1_description: "Recherche scientifique innovante et interdisciplinaire.",
  pilier_valeur2_titre: "Formation",
  pilier_valeur2_description: "Encadrement de doctorants et implication dans la formation.",
  pilier_valeur3_titre: "Impact",
  pilier_valeur3_description: "Recherche à fort impact socio-économique.",
  pilier_valeur4_titre: "Partenariats",
  pilier_valeur4_description: "Renforcement des partenariats nationaux et internationaux.",
  mot_directeur_titre: "Mot du directeur",
  mot_directeur_description: "Le LISI est un laboratoire de recherche pluridisciplinaire en informatique, dédié à l’innovation scientifique et à l’étude des systèmes intelligents.",
  actualites_titre: "Actualités du laboratoire",
  actualites_sous_titre: "DERNIÈRES NOUVELLES",
  domaines_titre: "Domaines de recherche",
  domaines_sous_titre: "NOS EXPERTISES",
  domaines_description: "Nos domaines de recherche couvrent les technologies les plus avancées",
  domaines_texte_final: "Ces domaines représentent notre expertise et notre vision pour l'avenir"
   
   
};

const DEFAULT_ARABIC_SETTINGS: LanguageSettings = {
  hero_titre_principal1: "مختبر المعلوماتية والأنظمة الذكية",
  hero_titre_principal2:"",
  hero_sous_titre: "يدفع مختبر LISI حدود المعلوماتية لمواجهة التحديات العلمية والمجتمعية والصناعية المستقبلية",
  mission_titre: "في قلب الابتكار التكنولوجي",
  mission_sous_titre: "مهمتنا",
  mission_description: "يعزز مختبر LISI البحث العلمي المبتكر والمتعدد التخصصات وذو التأثير الاجتماعي والاقتصادي العالي.",
  mission_texte_1: "مهمة مختبر المعلوماتية والأنظمة الذكية (LISI) هي تعزيز البحث العلمي عالي المستوى، وضمان إشراف طلاب الدكتوراه، والمساهمة بنشاط في التكوين من خلال البحث.",
  mission_texte_2: "يتميز مختبر LISI بنهج متعدد التخصصات واستراتيجي، يجمع بين التميز العلمي والانفتاح على التحديات الحالية.",
  pilier_valeur1_titre: "الابتكار",
  pilier_valeur1_description: "بحث علمي مبتكر ومتعدد التخصصات.",
  pilier_valeur2_titre: "التكوين",
  pilier_valeur2_description: "تأطير طلاب الدكتوراه والمشاركة في التكوين.",
  pilier_valeur3_titre: "التأثير",
  pilier_valeur3_description: "بحث ذو تأثير اجتماعي واقتصادي قوي.",
  pilier_valeur4_titre: "الشراكات",
  pilier_valeur4_description: "تعزيز الشراكات الوطنية والدولية.",
  mot_directeur_titre: "كلمة المدير",
  mot_directeur_description: "LISI هو مختبر أبحاث متعدد التخصصات في علوم الكمبيوتر، مكرس للابتكار العلمي ودراسة الأنظمة الذكية.",
  actualites_titre: "أخبار المختبر",
  actualites_sous_titre: "آخر الأخبار",
  domaines_titre: "مجالات البحث",
  domaines_sous_titre: "خبراتنا",
  domaines_description: "تغطي مجالات بحثنا أحدث التقنيات",
  domaines_texte_final: "تمثل هذه المجالات خبرتنا ورؤيتنا للمستقبل"
   
};

const DEFAULT_ENGLISH_SETTINGS: LanguageSettings = {
  hero_titre_principal1: "Laboratory of Computer",
  hero_titre_principal2: "Science and Smart Systems",
  hero_sous_titre: "LISI pushes the frontiers of computer science to address tomorrow’s scientific, societal, and industrial challenges.",
  mission_titre: "At the heart of technological innovation",
  mission_sous_titre: "OUR MISSION",
  mission_description: "LISI promotes innovative, interdisciplinary scientific research with a high socio-economic impact.",
  mission_texte_1: "The Laboratory of Computer Science and Intelligent Systems (LISI) aims to promote high-level scientific research, supervise doctoral students, and actively contribute to research-based training.",
  mission_texte_2: "LISI is distinguished by a multidisciplinary and strategic approach, combining scientific excellence and openness to current challenges.",
  pilier_valeur1_titre: "Innovation",
  pilier_valeur1_description: "Innovative and interdisciplinary scientific research.",
  pilier_valeur2_titre: "Training",
  pilier_valeur2_description: "Supervising doctoral students and involvement in training.",
  pilier_valeur3_titre: "Impact",
  pilier_valeur3_description: "Research with high socio-economic impact.",
  pilier_valeur4_titre: "Partnerships",
  pilier_valeur4_description: "Strengthening national and international partnerships.",
  mot_directeur_titre: "Director's Message",
  mot_directeur_description: "LISI is a multidisciplinary research laboratory in computer science, dedicated to scientific innovation and the study of intelligent systems.",
  actualites_titre: "Laboratory News",
  actualites_sous_titre: "LATEST NEWS",
  domaines_titre: "Research Areas",
  domaines_sous_titre: "OUR EXPERTISE",
  domaines_description: "Our research areas cover the most advanced technologies",
   domaines_texte_final: "These areas represent our expertise and vision for the future"
};

export const DEFAULT_INDEX_SETTINGS: IndexSettings = {
  // Champs non-traduisibles
  mission_image: "/images/mission.png",
  hero_image_side: "/images/hero_side.png",
  mot_directeur_image: "/images/directeur.jfif",
  
  nbr_membres: "30+",
  nbr_publications: "40+",
  nbr_projets: "15+",
  nbr_locaux: "3+",

  // Contenu par langue
  fr: DEFAULT_FRENCH_SETTINGS,
  ar: DEFAULT_ARABIC_SETTINGS,
  en: DEFAULT_ENGLISH_SETTINGS,
};

// --- CONFIGURATION ---

export const AVAILABLE_LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
] as const;

export type LanguageCode = typeof AVAILABLE_LANGUAGES[number]['code'];

// --- INTERFACES POUR LE FORMULAIRE ---

export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'number' | 'email' | 'url';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  accept?: string;
  section?: string;
}

export interface Section {
  title: string;
  fields: Field[];
  description?: string;
}