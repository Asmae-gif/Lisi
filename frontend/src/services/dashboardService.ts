import axiosClient from './axiosClient';

export interface Publication {
  id: number;
  titre: string;
  date_publication: string;
  created_at: string;
  updated_at: string;
}

export interface RecentActivity {
  id: number;
  type: 'publication' | 'membre' | 'projet';
  title: string;
  description: string;
  created_at: string;
}

export interface MemberStats {
  Permanents: number;
  Associés: number;
  Doctorants: number;
}

export interface PublicationStats {
  year: string;
  count: number;
}

export const dashboardService = {
  // Récupérer les publications par année
  async getPublicationsByYear(): Promise<PublicationStats[]> {
    try {
      const response = await axiosClient.get('/api/publications');
      const publications = response.data.data || response.data || [];
      
      // Grouper les publications par année
      const yearCounts: { [key: string]: number } = {};
      
      publications.forEach((pub: Publication) => {
        const year = new Date(pub.date_publication || pub.created_at).getFullYear().toString();
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      });
      
      // Convertir en format pour le graphique
      const currentYear = new Date().getFullYear();
      const result: PublicationStats[] = [];
      
      // Inclure les 5 dernières années
      for (let i = currentYear - 4; i <= currentYear; i++) {
        const yearStr = i.toString();
        result.push({
          year: yearStr,
          count: yearCounts[yearStr] || 0
        });
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des publications par année:', error);
      return [];
    }
  },

  // Récupérer les activités récentes
  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const [publicationsRes, membresRes, projetsRes] = await Promise.all([
        axiosClient.get('/api/publications'),
        axiosClient.get('/api/admin/membres'),
        axiosClient.get('/api/projects')
      ]);

      const publications = publicationsRes.data.data || publicationsRes.data || [];
      const membres = membresRes.data.data?.membres || membresRes.data || [];
      const projets = projetsRes.data.data || projetsRes.data || [];

      const activities: RecentActivity[] = [];

      // Ajouter les publications récentes
      publications.slice(0, 3).forEach((pub: Publication) => {
        activities.push({
          id: pub.id,
          type: 'publication',
          title: 'Nouvelle publication',
          description: pub.titre,
          created_at: pub.created_at
        });
      });

      // Ajouter les nouveaux membres récents
      membres.slice(0, 2).forEach((membre: any) => {
        activities.push({
          id: membre.id,
          type: 'membre',
          title: 'Nouveau membre',
          description: `${membre.prenom} ${membre.nom} a rejoint l'équipe`,
          created_at: membre.created_at
        });
      });

      // Ajouter les projets récents
      projets.slice(0, 2).forEach((projet: any) => {
        activities.push({
          id: projet.id,
          type: 'projet',
          title: 'Projet mis à jour',
          description: projet.titre || projet.title,
          created_at: projet.updated_at || projet.created_at
        });
      });

      // Trier par date de création (plus récent en premier)
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return activities.slice(0, 5);
    } catch (error) {
      console.error('Erreur lors de la récupération des activités récentes:', error);
      return [];
    }
  },

  // Récupérer les statistiques des membres
  async getMemberStats(): Promise<MemberStats> {
    try {
      const response = await axiosClient.get('/api/admin/membres');
      const membres = response.data.data?.membres || response.data || [];
      
      const stats = {
        Permanents: 0,
        Associés: 0,
        Doctorants: 0
      };

      membres.forEach((membre: any) => {
        const statut = membre.statut?.toLowerCase();
        if (statut === 'permanent') {
          stats.Permanents++;
        } else if (statut === 'associés') {
          stats.Associés++;
        } else if (statut === 'doctorants') {
          stats.Doctorants++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des membres:', error);
      return { Permanents: 0, Associés: 0, Doctorants: 0 };
    }
  },

  // Récupérer les statistiques générales avec variations
  async getStatsWithVariations() {
    try {
      const [statsRes, publicationsRes, membresRes, projetsRes] = await Promise.all([
        axiosClient.get('/api/stats'),
        axiosClient.get('/api/publications'),
        axiosClient.get('/api/admin/membres'),
        axiosClient.get('/api/projects')
      ]);

      const stats = statsRes.data;
      const publications = publicationsRes.data.data || publicationsRes.data || [];
      const membres = membresRes.data.data?.membres || membresRes.data || [];
      const projets = projetsRes.data.data || projetsRes.data || [];

      // Calculer les ajouts de ce mois
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const membresCeMois = membres.filter((membre: any) => {
        const createdAt = new Date(membre.created_at);
        return createdAt >= startOfMonth;
      }).length;

      const publicationsCeMois = publications.filter((pub: Publication) => {
        const createdAt = new Date(pub.created_at);
        return createdAt >= startOfMonth;
      }).length;

      const projetsCeMois = projets.filter((projet: any) => {
        const createdAt = new Date(projet.created_at);
        return createdAt >= startOfMonth;
      }).length;

      return {
        ...stats,
        membres_ce_mois: membresCeMois,
        publications_ce_mois: publicationsCeMois,
        projets_ce_mois: projetsCeMois
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        membres: 0,
        publications: 0,
        projets: 0,
        membres_ce_mois: 0,
        publications_ce_mois: 0,
        projets_ce_mois: 0
      };
    }
  }
}; 