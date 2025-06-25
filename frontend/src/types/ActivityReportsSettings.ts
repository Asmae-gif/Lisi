// Types partagés pour Activity Reports
export interface ActivityReport {
  id: number;
  report_date: string;
  pdf_path: string;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityReportFormData {
  report_date: string;
  pdf: File | null;
}

export interface ActivityReportsResponse {
  data?: ActivityReport[];
}

export interface YearGroup {
  year: number;
  reports: ActivityReport[];
}

export interface Column {
  key: keyof ActivityReport;
  label: string;
  render?: (value: unknown, item?: ActivityReport) => React.ReactNode;
}

export interface ActivityReportsSettings {
  id?: number;
  // Section Hero - Français
  activity_reports_titre_fr: string;
  activity_reports_sous_titre_fr: string;
  activity_reports_description_fr: string;
  
  // Section Hero - English
  activity_reports_titre_en: string;
  activity_reports_sous_titre_en: string;
  activity_reports_description_en: string;
  
  // Section Hero - العربية
  activity_reports_titre_ar: string;
  activity_reports_sous_titre_ar: string;
  activity_reports_description_ar: string;
  
  // Image
  activity_reports_image: string;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: ActivityReportsSettings;
}

export interface Section {
  title: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'file';
  }>;
}

export const DEFAULT_ACTIVITY_REPORTS_SETTINGS: ActivityReportsSettings = {
  // Français
  activity_reports_titre_fr: "Rapports d'Activité",
  activity_reports_sous_titre_fr: "Découvrez les rapports d'activité annuels de notre laboratoire",
  activity_reports_description_fr: "Le rapport d'activité du laboratoire présente une sélection des résultats scientifiques des recherches menées, le plus souvent en collaboration avec les universités, les organismes de recherche, les grandes écoles, les entreprises et les institutions de recherche étrangères.",
  
  // English
  activity_reports_titre_en: "Activity Reports",
  activity_reports_sous_titre_en: "Discover our laboratory's annual activity reports",
  activity_reports_description_en: "The laboratory activity report presents a selection of scientific results from research conducted, most often in collaboration with universities, research organizations, grandes écoles, companies and foreign research institutions.",
  
  // العربية
  activity_reports_titre_ar: "تقارير النشاط",
  activity_reports_sous_titre_ar: "اكتشف التقارير السنوية لنشاط مختبرنا",
  activity_reports_description_ar: "يقدم تقرير نشاط المختبر مجموعة مختارة من النتائج العلمية للأبحاث المنجزة، غالباً بالتعاون مع الجامعات ومؤسسات البحث والمدارس العليا والشركات ومؤسسات البحث الأجنبية.",
  
  // Image
  activity_reports_image: ""
};

// Fonctions utilitaires partagées
export const pdfUrl = (id: number) => `/api/activity-reports/${id}`;

export const getAvailableYears = (reports: ActivityReport[]): number[] => {
  return [...new Set(reports.map(report => 
    new Date(report.report_date).getFullYear()
  ))].sort((a, b) => b - a);
};

export const filterReportsBySearch = (reports: ActivityReport[], searchTerm: string): ActivityReport[] => {
  if (!searchTerm.trim()) return reports;
  const query = searchTerm.toLowerCase();
  return reports.filter(report => {
    const reportYear = new Date(report.report_date).getFullYear().toString();
    const reportDate = new Date(report.report_date).toLocaleDateString('fr-FR');
    return reportDate.includes(query) || reportYear.includes(query);
  });
};

export const sortReports = (reports: ActivityReport[], sortOrder: 'asc' | 'desc'): ActivityReport[] => {
  return [...reports].sort((a, b) => {
    const dateA = new Date(a.report_date);
    const dateB = new Date(b.report_date);
    return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });
}; 