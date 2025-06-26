import React from 'react';
import { RecentActivity } from '@/services/dashboardService';
import { BookOpen, Users, FolderKanban, Clock } from 'lucide-react';

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  // Fonction pour formater le temps écoulé
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "À l'instant";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  // Fonction pour obtenir l'icône selon le type d'activité
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'publication':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'membre':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'projet':
        return <FolderKanban className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Fonction pour obtenir la couleur de fond selon le type d'activité
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'publication':
        return 'bg-blue-100 border-blue-200';
      case 'membre':
        return 'bg-green-100 border-green-200';
      case 'projet':
        return 'bg-orange-100 border-orange-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-background rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Activités récentes</h2>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune activité récente</p>
          <p className="text-sm text-muted-foreground mt-2">
            Les nouvelles activités apparaîtront ici
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">Activités récentes</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-4 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(activity.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Affichage des {activities.length} dernières activités
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivities; 