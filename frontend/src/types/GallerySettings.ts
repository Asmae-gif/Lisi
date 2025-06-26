export interface GallerySettings {
  id?: number;
  galerie_titre_fr: string;
  galerie_sous_titre_fr: string;
  galerie_titre_en: string;
  galerie_sous_titre_en: string;
  galerie_titre_ar: string;
  galerie_sous_titre_ar: string;
  galerie_image: string;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: GallerySettings;
}

export interface Section {
  title: string;
  fields: {
    key: keyof GallerySettings;
    label: string;
    type: 'text' | 'textarea' | 'file';
  }[];
}

export const DEFAULT_GALLERY_SETTINGS: GallerySettings = {
  galerie_titre_fr: 'Galerie',
  galerie_sous_titre_fr: 'Découvrez nos installations, projets et moments marquants à travers cette collection d\'images',
  galerie_titre_en: 'Gallery',
  galerie_sous_titre_en: 'Explore our research environment, flagship projects, and highlights through this curated gallery.',
  galerie_titre_ar: 'معرض الصور',
  galerie_sous_titre_ar: 'تعرف على مرافق المختبر، ومشاريعه، ومحطاته المميزة من خلال هذه المجموعة من الصور التوثيقي',
  galerie_image: '/images/hero.png',
}; 