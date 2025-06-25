import api from '@/lib/api';
import { 
  ActivityReport, 
  ActivityReportFormData, 
  ActivityReportsResponse,
  getAvailableYears,
  filterReportsBySearch,
  sortReports,
  pdfUrl
} from '@/types/ActivityReportsSettings';

/**
 * Service API pour les rapports d'activité
 * Centralise toutes les opérations CRUD et utilitaires pour les Activity Reports
 */

interface ActivityReportsApiResponse {
  data?: ActivityReport[] | ActivityReportsResponse;
  message?: string;
}

export const activityReportsApi = {
  /**
   * Récupérer tous les rapports d'activité
   */
  async getAll(): Promise<ActivityReport[]> {
    try {
      const response = await api.get<ActivityReport[] | ActivityReportsResponse>('/activity-reports');
      return Array.isArray(response.data) 
        ? response.data 
        : (response.data as ActivityReportsResponse)?.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      throw new Error('Impossible de récupérer les rapports d\'activité');
    }
  },

  /**
   * Récupérer un rapport d'activité par ID
   */
  async getById(id: number): Promise<ActivityReport> {
    try {
      const response = await api.get<ActivityReport>(`/activity-reports/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du rapport ${id}:`, error);
      throw new Error('Impossible de récupérer le rapport d\'activité');
    }
  },

  /**
   * Créer un nouveau rapport d'activité
   */
  async create(data: ActivityReportFormData): Promise<ActivityReport> {
    try {
      const formData = new FormData();
      formData.append('report_date', data.report_date);
      
      if (data.pdf) {
        formData.append('pdf_path', data.pdf);
      }

      const response = await api.post<ActivityReport>('/activity-reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du rapport:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un rapport d'activité
   */
  async update(id: number, data: ActivityReportFormData): Promise<ActivityReport> {
    try {
      const formData = new FormData();
      formData.append('report_date', data.report_date);
      formData.append('_method', 'PUT');
      
      if (data.pdf) {
        formData.append('pdf_path', data.pdf);
      }

      const response = await api.post<ActivityReport>(`/activity-reports/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du rapport ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer un rapport d'activité
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/activity-reports/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du rapport ${id}:`, error);
      throw new Error('Impossible de supprimer le rapport d\'activité');
    }
  },

  /**
   * Obtenir l'URL du PDF
   */
  getPdfUrl(id: number): string {
    return pdfUrl(id);
  },

  /**
   * Obtenir l'URL de téléchargement du PDF
   */
  getDownloadUrl(id: number): string {
    return `${pdfUrl(id)}?download=1`;
  },

  /**
   * Filtrer et trier les rapports
   */
  processReports: {
    getAvailableYears,
    filterBySearch: filterReportsBySearch,
    sort: sortReports,
    
    /**
     * Filtrer par année
     */
    filterByYear(reports: ActivityReport[], year: string): ActivityReport[] {
      if (year === 'all') return reports;
      return reports.filter(report => 
        new Date(report.report_date).getFullYear().toString() === year
      );
    },

    /**
     * Regrouper par année
     */
    groupByYear(reports: ActivityReport[]): { year: number; reports: ActivityReport[] }[] {
      const grouped: { [year: number]: ActivityReport[] } = {};
      
      reports.forEach(report => {
        const year = new Date(report.report_date).getFullYear();
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(report);
      });

      return Object.entries(grouped)
        .map(([year, items]) => ({
          year: Number(year),
          reports: items.sort((a, b) => 
            new Date(b.report_date).getTime() - new Date(a.report_date).getTime()
          )
        }))
        .sort((a, b) => b.year - a.year);
    },

    /**
     * Obtenir les statistiques
     */
    getStats(reports: ActivityReport[]) {
      const currentYear = new Date().getFullYear();
      const availableYears = getAvailableYears(reports);
      
      return {
        total: reports.length,
        currentYear: reports.filter(r => 
          new Date(r.report_date).getFullYear() === currentYear
        ).length,
        yearsCovered: availableYears.length,
        latestYear: reports.length > 0 
          ? new Date(Math.max(...reports.map(r => new Date(r.report_date).getTime()))).getFullYear()
          : null
      };
    }
  }
};

export default activityReportsApi; 