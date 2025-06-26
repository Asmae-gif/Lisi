import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  TrendingUp, 
  BarChart3,
  Calendar,
  Activity,
  Bot
} from 'lucide-react';
import axios from 'axios';

interface ChatbotStats {
  total_sessions: number;
  total_interactions: number;
  avg_session_duration: number;
  avg_messages_per_session: number;
  popular_questions: Array<{
    user_message: string;
    count: number;
  }>;
  daily_stats: Array<{
    date: string;
    interactions: number;
    sessions: number;
  }>;
}

const ChatbotAnalytics: React.FC = () => {
  const [stats, setStats] = useState<ChatbotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/chatbot/stats');
      setStats(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Error fetching chatbot stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchStats}>Réessayer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-gray-600">Aucune donnée disponible</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics du Chatbot</h1>
          <p className="text-gray-600 mt-2">
            Statistiques et analyses des interactions avec l'assistant virtuel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-blue-600" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Assistant IA
          </Badge>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_sessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Sessions uniques du chatbot
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interactions Totales</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_interactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Messages échangés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avg_session_duration}s</div>
            <p className="text-xs text-muted-foreground">
              Par session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages/Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avg_messages_per_session}</div>
            <p className="text-xs text-muted-foreground">
              En moyenne
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Questions populaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Questions les Plus Populaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.popular_questions.length > 0 ? (
            <div className="space-y-3">
              {stats.popular_questions.map((question, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {question.user_message.length > 100 
                        ? question.user_message.substring(0, 100) + '...'
                        : question.user_message
                      }
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {question.count} fois
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune question populaire pour le moment
            </p>
          )}
        </CardContent>
      </Card>

      {/* Statistiques quotidiennes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Activité des 7 Derniers Jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.daily_stats.length > 0 ? (
            <div className="space-y-3">
              {stats.daily_stats.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {day.interactions} interactions
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          {day.sessions} sessions
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {day.sessions > 0 ? Math.round(day.interactions / day.sessions) : 0} msg/session
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune activité récente
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={fetchStats} variant="outline">
          Actualiser les Données
        </Button>
      </div>
    </div>
  );
};

export default ChatbotAnalytics; 