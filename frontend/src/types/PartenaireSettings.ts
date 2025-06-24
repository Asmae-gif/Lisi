import { Section } from './common';

export interface PartenaireSettings {
    id?: number;
    partenaire_titre_fr: string;
    partenaire_titre_en: string;
    partenaire_titre_ar: string;
    partenaire_sous_titre_fr: string;
    partenaire_sous_titre_en: string;
    partenaire_sous_titre_ar: string;
    partenaire_heading_fr: string;
    partenaire_heading_en: string;
    partenaire_heading_ar: string;
    partenaire_description_fr: string;
    partenaire_description_en: string;
    partenaire_description_ar: string;
    partenaire_image: string;
    [key: string]: string | number | undefined;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: PartenaireSettings;
}

export const DEFAULT_PARTENAIRE_SETTINGS: PartenaireSettings = {
    partenaire_titre_fr: "Nos Partenaires",
    partenaire_titre_en: "Our Partners",
    partenaire_titre_ar: "شركاؤنا",
    partenaire_sous_titre_fr: "Nous collaborons avec des institutions académiques prestigieuses et des entreprises innovantes pour faire avancer la recherche et développer des solutions technologiques de pointe.",
    partenaire_sous_titre_en: "We collaborate with prestigious academic institutions and innovative companies to advance research and develop cutting-edge technological solutions",
    partenaire_sous_titre_ar: "نتعاون مع مؤسسات أكاديمية مرموقة وشركات مبتكرة لدفع عجلة البحث وتطوير حلول تكنولوجية متقدمة",
    partenaire_heading_fr: "Collaborations d'Excellence",
    partenaire_heading_en: "Excellence Collaborations",
    partenaire_heading_ar: "شراكات متميزة",
    partenaire_description_fr: "Notre réseau de partenaires comprend des institutions académiques de renommée mondiale, des centres de recherche innovants et des entreprises technologiques de pointe. Ces collaborations nous permettent de mener des projets ambitieux et de contribuer significativement à l'avancement des connaissances scientifiques.",
    partenaire_description_en: "Our partner network includes world-renowned academic institutions, innovative research centers, and leading-edge technology companies. These collaborations enable us to carry out ambitious projects and make significant contributions to the advancement of scientific knowledge.",
    partenaire_description_ar: "يشمل شركاؤنا مؤسسات أكاديمية مشهورة عالميًا، ومراكز أبحاث مبتكرة، وشركات تكنولوجية رائدة. تتيح لنا هذه الشراكات تنفيذ مشاريع طموحة والمساهمة بشكل كبير في تطوير المعرفة العلمية.",
    partenaire_image: "/images/hero.png"
}; 