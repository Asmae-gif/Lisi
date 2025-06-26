export interface PublicationSettings {
    id?: number;
    page: string;
    // Champs pour le français
    publications_titre_fr?: string;
    publications_sous_titre_fr?: string;
    // Champs pour l'anglais
    publications_titre_en?: string;
    publications_sous_titre_en?: string;
    // Champs pour l'arabe
    publications_titre_ar?: string;
    publications_sous_titre_ar?: string;
    // Image de couverture
    publications_image?: string;
    created_at?: string;
    updated_at?: string;
}


export interface ApiResponse {
    success?: boolean;
    message?: string;
    data?: PublicationSettings;
  }
  
  export interface Field {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'file' | 'number' | 'email' | 'url' | 'location';
    placeholder?: string;
    required?: boolean;
  }
  
  export interface Section {
    title: string;
    fields: Field[];
  }

  export const DEFAULT_PUBLICATIONS_SETTINGS: PublicationSettings = {
    page:'Publications',
    publications_titre_fr: 'Publications Scientifiques',
    publications_titre_en: 'Scientific Publications',
    publications_titre_ar: 'المنشورات العلمية',
    publications_sous_titre_fr: 'Nos publications reflètent l’excellence de notre recherche et notre contribution au développement des connaissances scientifiques. Découvrez nos travaux dans des revues internationales, conférences et autres supports scientifiques.',
    publications_sous_titre_en: 'Our publications reflect the excellence of our research and our contribution to the advancement of scientific knowledge. Explore our work published in international journals, conferences, and other scientific media.',
    publications_sous_titre_ar: 'تعكس منشوراتنا تميز أبحاثنا ومساهمتنا في تطوير المعرفة العلمية. اكتشف أعمالنا المنشورة في المجلات الدولية والمؤتمرات وغيرها من الوسائط العلمية.',
    publications_image: '/images/hero.png'
  };