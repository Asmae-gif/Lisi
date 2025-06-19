import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardRecentActivityProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardRecentActivity({ className, ...props }: DashboardRecentActivityProps) {
  const recentActivities = [
    {
      type: "publication",
      title: "Nouvelle publication scientifique",
      description: "Article publié dans la revue Nature",
      date: "Il y a 2 heures"
    },
    {
      type: "projet",
      title: "Mise à jour du projet IA",
      description: "Nouvelle phase de développement",
      date: "Il y a 5 heures"
    },
    {
      type: "membre",
      title: "Nouveau membre",
      description: "Dr. Sarah Martin a rejoint l'équipe",
      date: "Il y a 1 jour"
    },
    {
      type: "evenement",
      title: "Conférence à venir",
      description: "Intelligence Artificielle et Société",
      date: "Dans 3 jours"
    }
  ]

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
        <CardDescription>
          Les dernières activités du laboratoire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="relative mt-1 flex h-2 w-2">
                <div className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75"></div>
                <div className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
