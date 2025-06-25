import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { activityReportsApi } from '@/services/activityReportsApi';
import { 
  ActivityReport, 
  ActivityReportFormData 
} from '@/types/ActivityReportsSettings';

interface UseActivityReportsOptions {
  autoFetch?: boolean;
  searchTerm?: string;
  filterYear?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseActivityReportsReturn {
  // État
  reports: ActivityReport[];
  isLoading: boolean;
  error: string | null;
  
  // Données traitées
  filteredReports: ActivityReport[];
  availableYears: number[];
  reportsByYear: { year: number; reports: ActivityReport[] }[];
  stats: {
    total: number;
    currentYear: number;
    yearsCovered: number;
    latestYear: number | null;
  };
  
  // Actions CRUD
  fetchReports: () => Promise<void>;
  createReport: (data: ActivityReportFormData) => Promise<ActivityReport>;
  updateReport: (id: number, data: ActivityReportFormData) => Promise<ActivityReport>;
  deleteReport: (id: number) => Promise<void>;
  
  // Actions utilitaires
  refreshReports: () => Promise<void>;
  handleView: (report: ActivityReport) => void;
  handleDownload: (report: ActivityReport) => void;
}

/**
 * Hook personnalisé pour gérer les rapports d'activité
 * Centralise toute la logique métier des Activity Reports
 */
export function useActivityReports(options: UseActivityReportsOptions = {}): UseActivityReportsReturn {
  const {
    autoFetch = true,
    searchTerm = '',
    filterYear = 'all',
    sortOrder = 'desc'
  } = options;

  // État local
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  /**
   * Récupérer tous les rapports
   */
  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await activityReportsApi.getAll();
      setReports(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Créer un nouveau rapport
   */
  const createReport = useCallback(async (data: ActivityReportFormData): Promise<ActivityReport> => {
    try {
      setIsLoading(true);
      
      const newReport = await activityReportsApi.create(data);
      
      // Mettre à jour la liste locale
      setReports(prev => [...prev, newReport]);
      
      toast({
        title: "Succès",
        description: "Rapport d'activité ajouté avec succès",
      });
      
      return newReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Mettre à jour un rapport
   */
  const updateReport = useCallback(async (id: number, data: ActivityReportFormData): Promise<ActivityReport> => {
    try {
      setIsLoading(true);
      
      const updatedReport = await activityReportsApi.update(id, data);
      
      // Mettre à jour la liste locale
      setReports(prev => prev.map(report => 
        report.id === id ? updatedReport : report
      ));
      
      toast({
        title: "Succès",
        description: "Rapport d'activité modifié avec succès",
      });
      
      return updatedReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Supprimer un rapport
   */
  const deleteReport = useCallback(async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      
      await activityReportsApi.delete(id);
      
      // Mettre à jour la liste locale
      setReports(prev => prev.filter(report => report.id !== id));
      
      toast({
        title: "Succès",
        description: "Rapport d'activité supprimé avec succès",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Actualiser les rapports
   */
  const refreshReports = useCallback(async () => {
    await fetchReports();
  }, [fetchReports]);

  /**
   * Ouvrir un PDF pour visualisation
   */
  const handleView = useCallback((report: ActivityReport) => {
    window.open(activityReportsApi.getPdfUrl(report.id), '_blank');
  }, []);

  /**
   * Télécharger un PDF
   */
  const handleDownload = useCallback((report: ActivityReport) => {
    const link = document.createElement('a');
    link.href = activityReportsApi.getDownloadUrl(report.id);
    link.download = `rapport-${new Date(report.report_date).getFullYear()}.pdf`;
    link.click();
  }, []);

  // Données calculées avec useMemo pour optimiser les performances
  const availableYears = useMemo(() => {
    return activityReportsApi.processReports.getAvailableYears(reports);
  }, [reports]);

  const filteredReports = useMemo(() => {
    let filtered = activityReportsApi.processReports.filterBySearch(reports, searchTerm);
    filtered = activityReportsApi.processReports.filterByYear(filtered, filterYear);
    return activityReportsApi.processReports.sort(filtered, sortOrder);
  }, [reports, searchTerm, filterYear, sortOrder]);

  const reportsByYear = useMemo(() => {
    return activityReportsApi.processReports.groupByYear(filteredReports);
  }, [filteredReports]);

  const stats = useMemo(() => {
    return activityReportsApi.processReports.getStats(reports);
  }, [reports]);

  // Chargement automatique
  useEffect(() => {
    if (autoFetch) {
      fetchReports();
    }
  }, [autoFetch, fetchReports]);

  return {
    // État
    reports,
    isLoading,
    error,
    
    // Données traitées
    filteredReports,
    availableYears,
    reportsByYear,
    stats,
    
    // Actions CRUD
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
    
    // Actions utilitaires
    refreshReports,
    handleView,
    handleDownload,
  };
} 