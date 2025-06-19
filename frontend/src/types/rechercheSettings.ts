export interface RechercheSettings {
  id?: number;
  nos_domaines_titre?: string;
  nos_domaines_texte_intro?: string;
  nos_domaines_image?: string;
  axes_strategiques_titre?: string;
  axes_strategiques_description?: string;
  analyse_detaillee_titre?: string;
  processus_recherche_titre?: string;
  processus_recherche_texte?: string;
  processus_recherche_etapes_1_titre?: string;
  processus_recherche_etapes_1_description?: string;
  processus_recherche_etapes_2_titre?: string;
  processus_recherche_etapes_2_description?: string;
  processus_recherche_etapes_3_titre?: string;
  processus_recherche_etapes_3_description?: string;
  processus_recherche_etapes_4_titre?: string;
  processus_recherche_etapes_4_description?: string;
  processus_recherche_etapes_5_titre?: string;
  processus_recherche_etapes_5_description?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: RechercheSettings;
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

// Valeurs par défaut pour les paramètres
export const DEFAULT_RECHERCHE_SETTINGS: RechercheSettings = {
  nos_domaines_titre: "Nos Domaines d'Excellence",
  nos_domaines_texte_intro: "Découvrez nos domaines d'expertise et nos axes de recherche stratégiques.",
  axes_strategiques_titre: "Nos Axes Stratégiques",
  axes_strategiques_description: "Nos axes de recherche sont organisés autour de thématiques clés qui répondent aux défis technologiques contemporains.",
  analyse_detaillee_titre: "Analyse Détaillée par Axe",
  processus_recherche_titre: "Processus de Recherche",
  processus_recherche_texte: "Notre approche méthodologique suit un processus rigoureux en plusieurs étapes.",
  processus_recherche_etapes_1_titre: "Problématique",
  processus_recherche_etapes_1_description: "Identification des défis scientifiques",
  processus_recherche_etapes_2_titre: "Objectifs",
  processus_recherche_etapes_2_description: "Définition claire des buts à atteindre",
  processus_recherche_etapes_3_titre: "Approche",
  processus_recherche_etapes_3_description: "Développement de méthodologies adaptées",
  processus_recherche_etapes_4_titre: "Expérimentation",
  processus_recherche_etapes_4_description: "Tests et validation des hypothèses",
  processus_recherche_etapes_5_titre: "Résultats",
  processus_recherche_etapes_5_description: "Publication et valorisation des découvertes",
};

// Configuration des étapes du processus
export const PROCESSUS_ETAPES = [
  { number: 1, title: 'Problématique', description: 'Identification des défis scientifiques' },
  { number: 2, title: 'Objectifs', description: 'Définition claire des buts à atteindre' },
  { number: 3, title: 'Approche', description: 'Développement de méthodologies adaptées' },
  { number: 4, title: 'Expérimentation', description: 'Tests et validation des hypothèses' },
  { number: 5, title: 'Résultats', description: 'Publication et valorisation des découvertes' },
]; 