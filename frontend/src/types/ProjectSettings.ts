export interface ProjectSettings {
    id?: number;
    projet_titre_fr?: string;
    projet_sous_titre_fr?: string;
    projet_titre_en?: string;
    projet_sous_titre_en?: string;
    projet_titre_ar?: string;
    projet_sous_titre_ar?: string;
    projet_image?: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: ProjectSettings;
}

export interface Section {
    title: string;
    fields: { key: string; label: string; type: "text" | "file" }[];
}

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
    projet_titre_fr: "Nos Projets de Recherche",
    projet_sous_titre_fr: "Explorez les projets innovants que nous développons pour faire avancer la science et la technologie",
    projet_titre_en: "Our Research Projects",
    projet_sous_titre_en: "Explore our innovative projects through which we strive to advance science and technolog",
    projet_titre_ar: "مشاريعنا البحثية",
    projet_sous_titre_ar: "استكشف مشاريعنا المبتكرة التي نسعى من خلالها إلى تطوير العلوم والتكنولوجيا",
    projet_image: undefined,
}; 