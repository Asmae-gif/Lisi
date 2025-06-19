export interface ContactSettings {
    id?: number;
    contact_titre?: string;
    contact_sous_titre?: string;
    contact_image?: string;
    contact_titre2?:string;
    contact_adresse?: string;
    contact_email?: string;
    contact_telephone?: string;
  }
  
  export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
    contact_titre: "Contactez-nous",
    contact_sous_titre: "Nous sommes à votre disposition pour répondre à vos questions, discuter de collaborations ou explorer de nouvelles opportunités de recherche.",
    contact_titre2: "Informations de Contact",
    contact_adresse: "123 Rue de la Recherche, 75000 Paris, France",
    contact_email: "contact@example.com",
    contact_telephone: "+33 1 23 45 67 89",
  }
  
  export interface ApiResponse {
    success?: boolean;
    message?: string;
    data?: ContactSettings;
  }
  
  export interface Field {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'file';
    placeholder?: string;
  }
  
  export interface Section {
    title: string;
    fields: Field[];
  } 