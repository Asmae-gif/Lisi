import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FolderKanban, Calendar } from "lucide-react";
import { StatsCard } from "@/components/common";

/**
 * Composant de cartes de statistiques du tableau de bord
 * Affiche les statistiques principales du laboratoire avec des icônes et des valeurs
 */
export const DashboardCards = React.memo(() => {
  // Optimisation avec useMemo pour les données des cartes
  const statsData = useMemo(() => [
    {
      title: "Membres Actifs",
      value: 45,
      icon: Users,
      variant: "default" as const,
      subtitle: "+2 ce mois"
    },
    {
      title: "Publications",
      value: 128,
      icon: BookOpen,
      variant: "success" as const,
      subtitle: "+4 ce mois"
    },
    {
      title: "Projets en cours",
      value: 12,
      icon: FolderKanban,
      variant: "warning" as const,
      subtitle: "+1 ce mois"
    },
    {
      title: "Événements à venir",
      value: 3,
      icon: Calendar,
      variant: "default" as const,
      subtitle: "Pour le mois prochain"
    }
  ], []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          variant={stat.variant}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
});

DashboardCards.displayName = 'DashboardCards';
