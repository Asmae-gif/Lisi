import { useEffect, useState, useMemo, useCallback } from "react";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { StatsCard } from "@/components/common";
import axiosClient from "@/services/axiosClient";
import { getUsers, getMembres } from "@/services/userService";
import { Users, BookOpen, FolderKanban } from "lucide-react";

// Ajout du typage pour la réponse de l'API
type StatsResponse = {
  membres: number;
  publications: number;
  projets: number;
};

/**
 * Page principale du tableau de bord
 * Affiche les statistiques, graphiques et activités récentes du laboratoire
 */
const Dashboard = () => {
  const [stats, setStats] = useState<StatsResponse>({
    membres: 0,
    publications: 0,
    projets: 0
  });

  // Optimisation avec useMemo pour les données de statistiques
  const statsCards = useMemo(() => [
    { 
      label: "Membres", 
      value: stats.membres, 
      icon: Users, 
      variant: "default" as const,
      subtitle: "+2 ce mois"
    },
    { 
      label: "Publications", 
      value: stats.publications, 
      icon: BookOpen, 
      variant: "success" as const,
      subtitle: "+4 ce mois"
    },
    { 
      label: "Projets", 
      value: stats.projets, 
      icon: FolderKanban, 
      variant: "warning" as const,
      subtitle: "+1 ce mois"
    },
  ], [stats]);

  // Optimisation avec useMemo pour les activités récentes
  const recentActivities = useMemo(() => [
    { title: "Nouvelle publication", description: "Publication d'un article dans IEEE", time: "Il y a 2 heures" },
    { title: "Nouveau membre", description: "Dr. Sarah Martin a rejoint l'équipe", time: "Il y a 5 heures" },
    { title: "Projet mis à jour", description: "Mise à jour du projet IA Distribuée", time: "Il y a 1 jour" },
  ], []);

  // Optimisation avec useCallback pour le chargement des statistiques
  const loadStats = useCallback(async () => {
    try {
      const response = await axiosClient.get<StatsResponse>('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }, []);

  // Optimisation avec useCallback pour la vérification d'authentification
  const checkAuthAndLoad = useCallback(async () => {
    try {
      await axiosClient.get("/sanctum/csrf-cookie");
      await axiosClient.get("/api/user");
      await Promise.all([getUsers(), getMembres()]);
    } catch (err) {
      console.error("Utilisateur non authentifié :", err);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    checkAuthAndLoad();
  }, [checkAuthAndLoad]);

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
        <div className="bg-background rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Activités récentes</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] mt-2"></div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Prochains événements</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">15</p>
                <p className="text-xs text-muted-foreground">MAI</p>
              </div>
              <div>
                <p className="font-medium">Conférence sur l'IA</p>
                <p className="text-sm text-muted-foreground">Marrakech, Maroc</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">20</p>
                <p className="text-xs text-muted-foreground">MAI</p>
              </div>
              <div>
                <p className="font-medium">Workshop Big Data</p>
                <p className="text-sm text-muted-foreground">En ligne</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
