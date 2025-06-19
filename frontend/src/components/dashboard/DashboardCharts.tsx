import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const publicationsData = [
  { year: 2018, value: 18 },
  { year: 2019, value: 22 },
  { year: 2020, value: 25 },
  { year: 2021, value: 29 },
  { year: 2022, value: 32 },
  { year: 2023, value: 36 },
  { year: 2024, value: 15 },
];

const projetsData = [
  { domaine: 'IA', value: 8 },
  { domaine: 'Sécurité', value: 4 },
  { domaine: 'Big Data', value: 5 },
  { domaine: 'IoT', value: 2 },
];

export function DashboardCharts() {
  return (
    <div>
      <h2 className="font-bold text-xl mb-4">Statistiques</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={publicationsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" name="Publications" stroke="#15803d" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
      <h3 className="font-bold text-lg mt-8 mb-4">Projets par domaine</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={projetsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="domaine" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Projets" fill="#15803d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 