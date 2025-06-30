import { useEffect, useState, useMemo, useCallback } from "react";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { StatsCard } from "@/components/common";
import { getUsers, getMembres } from "@/services/userService";
import { dashboardService, RecentActivity } from "@/services/dashboardService";
import RecentActivities from "@/components/dashboard/recent-activities";
import { MembersByStatus } from "@/components/dashboard/members-by-status";
import { Users, BookOpen, FolderKanban } from "lucide-react";

// Ajout du typage pour la réponse de l'API
type StatsResponse = {
  membres: number;
  publications: number;
  projets: number;
  membres_ce_mois: number;
  publications_ce_mois: number;
  projets_ce_mois: number;
};

/**
 * Page principale du tableau de bord
 * Affiche les statistiques, graphiques et activités récentes du laboratoire
 */
const Dashboard = () => {
  const [stats, setStats] = useState<StatsResponse>({
    membres: 0,
    publications: 0,
    projets: 0,
    membres_ce_mois: 0,
    publications_ce_mois: 0,
    projets_ce_mois: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour formater le sous-titre avec la variation
  const formatSubtitle = (count: number) => {
    if (count === 0) return "Aucun ajout ce mois";
    if (count === 1) return "+1 ce mois";
    return `+${count} ce mois`;
  };

  // Optimisation avec useMemo pour les données de statistiques
  const statsCards = useMemo(() => [
    { 
      label: "Membres", 
      value: stats.membres, 
      icon: Users, 
      variant: "default" as const,
      subtitle: formatSubtitle(stats.membres_ce_mois)
    },
    { 
      label: "Publications", 
      value: stats.publications, 
      icon: BookOpen, 
      variant: "success" as const,
      subtitle: formatSubtitle(stats.publications_ce_mois)
    },
    { 
      label: "Projets", 
      value: stats.projets, 
      icon: FolderKanban, 
      variant: "warning" as const,
      subtitle: formatSubtitle(stats.projets_ce_mois)
    },
  ], [stats]);

  // Optimisation avec useCallback pour le chargement des données
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupérer toutes les données en parallèle
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStatsWithVariations(),
        dashboardService.getRecentActivities()
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimisation avec useCallback pour la vérification d'authentification
  const checkAuthAndLoad = useCallback(async () => {
    try {
      await Promise.all([getUsers(), getMembres()]);
      await loadDashboardData();
    } catch (err) {
      console.error("Utilisateur non authentifié :", err);
      window.location.href = "/login";
    }
  }, [loadDashboardData]);

  useEffect(() => {
    checkAuthAndLoad();
  }, [checkAuthAndLoad]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-lisiGreen mb-2">Tableau de bord</h1>
          <p className="text-lisiGold">Bienvenue sur le tableau de bord du laboratoire LISI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background rounded-lg border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>

        <div className="animate-pulse">
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-lisiGreen mb-2">Tableau de bord</h1>
        <p className="text-lisiGold">Bienvenue sur le tableau de bord du laboratoire LISI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat) => (
          <StatsCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivities activities={recentActivities} />

        <div className="bg-background rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Prochains événements</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">15</p>
                <p className="text-xs text-muted-foreground">MAI</p>
              </div>
              <div>
                <p className="font-medium">Conférence LISI 2024</p>
                <p className="text-sm text-muted-foreground">Présentation des derniers travaux</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">22</p>
                <p className="text-xs text-muted-foreground">MAI</p>
              </div>
              <div>
                <p className="font-medium">Séminaire de recherche</p>
                <p className="text-sm text-muted-foreground">Nouvelles avancées en IA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
