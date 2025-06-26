import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { StatsCard } from "@/components/common";
import { useState, useEffect } from 'react';
import { dashboardService, PublicationStats, MemberStats } from '@/services/dashboardService';

const COLORS = ['#437a49', '#C2A060', '#C74C4B']; // jaune, bleu, rose

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].name === 'count' ? 'Publications' : 'Projets'}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function DashboardCharts() {
  const [memberStats, setMemberStats] = useState<MemberStats>({
    Permanents: 0,
    Associés: 0,
    Doctorants: 0
  });

  const [publicationsData, setPublicationsData] = useState<PublicationStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les données en parallèle
        const [memberStatsData, publicationsData] = await Promise.all([
          dashboardService.getMemberStats(),
          dashboardService.getPublicationsByYear()
        ]);

        setMemberStats(memberStatsData);
        setPublicationsData(publicationsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Données pour le graphique en camembert basées sur les vraies statistiques
  const pieData = [
    { name: 'Permanents', value: memberStats.Permanents },
    { name: 'Associés', value: memberStats.Associés },
    { name: 'Doctorants', value: memberStats.Doctorants },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg border p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-[300px] bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-background rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Publications par année</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={publicationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Répartition des membres</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={50}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-around mt-4 text-sm text-gray-600">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
              <span>{item.name} ({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 