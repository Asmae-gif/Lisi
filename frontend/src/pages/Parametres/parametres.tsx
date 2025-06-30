import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Search, 
  Users, 
  Contact, 
  Settings, 
  FileText, 
  Image, 
  Globe,
  Database
} from "lucide-react";

const parametresPages = [
  { 
    path: '/dashboard/settings-index', 
    name: 'Paramètres d\'accueil',
    description: 'Configuration du titre, sous-titre, mission et statistiques de la page d\'accueil',
    icon: Home,
    color: 'bg-blue-500'
  },
  { 
    path: '/dashboard/settings-recherche', 
    name: 'Paramètres de recherche',
    description: 'Configuration des domaines de recherche, axes stratégiques et processus',
    icon: Search,
    color: 'bg-green-500'
  },
  { 
    path: '/dashboard/settings-membres', 
    name: 'Paramètres de Nos Membres',
    description: 'Configuration des titres et images de la page équipe/membres',
    icon: Users,
    color: 'bg-purple-500'
  },
  { 
    path: '/dashboard/settings-contact', 
    name: 'Paramètres de contact',
    description: 'Configuration des informations de contact et localisation',
    icon: Contact,
    color: 'bg-orange-500'
  },
  { 
    path: '/dashboard/settings-publications', 
    name: 'Paramètres des publications',
    description: 'Configuration des titres et descriptions de la section publications',
    icon: FileText,
    color: 'bg-red-500'
  },
  { 
    path: '/dashboard/settings-galerie', 
    name: 'Paramètres de la galerie',
    description: 'Configuration des images et médias de la galerie',
    icon: Image,
    color: 'bg-pink-500'
  },
  { 
    path: '/dashboard/settings-projet', 
    name: 'Paramètres de projet',
    description: 'Configuration des paramètres de projet',
    icon: Database,
    color: 'bg-gray-500'
  },
  { 
    path: '/dashboard/settings-prix-distinctions', 
    name: 'Paramètres des prix et distinctions',
    description: 'Configuration des titres et descriptions de la section prix et distinctions',
    icon: Globe,
    color: 'bg-indigo-500'
  },
  { 
    path: '/dashboard/settings-partenaires', 
    name: 'Paramètres des partenaires',
    description: 'Configuration des titres et descriptions de la section partenaires',
    icon: Globe,
    color: 'bg-indigo-500'
  },
  { 
    path: '/dashboard/settings-activity-reports', 
    name: 'Paramètres des rapports d\'activités',
    description: 'Configuration des titres et descriptions de la section rapports d\'activités',
    icon: FileText,
    color: 'bg-indigo-500'
  }
];

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-[#3f7949] mr-3" />
            <h1 className="text-3xl font-bold text-[#3f7949]">Centre de Paramètres</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gérez tous les paramètres de votre application. Sélectionnez une catégorie pour accéder aux paramètres spécifiques.
          </p>
        </div>

        {/* Grille des paramètres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parametresPages.map((page, index) => {
            const IconComponent = page.icon;
            return (
              <Card
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#3f7949] hover:bg-[#f8faf8] group"
                onClick={() => navigate(page.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${page.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {index + 1}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#3f7949] transition-colors duration-300">
                    {page.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {page.description}
                  </p>
                  <div className="mt-4 flex items-center text-[#3f7949] text-sm font-medium">
                    <span>Accéder aux paramètres</span>
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
