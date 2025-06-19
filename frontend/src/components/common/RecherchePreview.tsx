import React from 'react';
import { RechercheSettings } from '@/types/rechercheSettings';
import { ArrowRight, Target, Users, BookOpen, Globe, Award, Microscope, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecherchePreviewProps {
  settings: RechercheSettings;
  className?: string;
}

const RecherchePreview: React.FC<RecherchePreviewProps> = ({ settings, className = "" }) => {
  // Étapes du processus dynamiques
  const dynamicSteps = [
    {
      number: 1,
      title: settings.processus_recherche_etapes_1_titre || 'Problématique',
      description: settings.processus_recherche_etapes_1_description || 'Identification des défis scientifiques',
      icon: Target
    },
    {
      number: 2,
      title: settings.processus_recherche_etapes_2_titre || 'Objectifs',
      description: settings.processus_recherche_etapes_2_description || 'Définition claire des buts à atteindre',
      icon: Target
    },
    {
      number: 3,
      title: settings.processus_recherche_etapes_3_titre || 'Approche',
      description: settings.processus_recherche_etapes_3_description || 'Développement de méthodologies adaptées',
      icon: Target
    },
    {
      number: 4,
      title: settings.processus_recherche_etapes_4_titre || 'Expérimentation',
      description: settings.processus_recherche_etapes_4_description || 'Tests et validation des hypothèses',
      icon: Target
    },
    {
      number: 5,
      title: settings.processus_recherche_etapes_5_titre || 'Résultats',
      description: settings.processus_recherche_etapes_5_description || 'Publication et valorisation des découvertes',
      icon: Target
    }
  ];

  return (
    <div className={`bg-white ${className}`}>
      {/* Section Domaines d'Excellence */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {settings.nos_domaines_titre || "Nos Domaines d'Excellence"}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {settings.nos_domaines_texte_intro || "Découvrez nos domaines d'expertise et nos axes de recherche stratégiques."}
            </p>
          </div>

          {settings.nos_domaines_image && (
            <div className="mb-8">
              <img 
                src={settings.nos_domaines_image}
                alt="Domaines d'excellence"
                className="w-full h-48 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* Section Axes Stratégiques */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {settings.axes_strategiques_titre || "Nos Axes Stratégiques"}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {settings.axes_strategiques_description || "Nos axes de recherche sont organisés autour de thématiques clés qui répondent aux défis technologiques contemporains."}
            </p>
          </div>

          {/* Grille des axes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Microscope, title: "Intelligence Artificielle", color: "from-blue-500 to-blue-600" },
              { icon: Target, title: "Analyse des Données", color: "from-purple-500 to-purple-600" },
              { icon: Users, title: "Interaction Homme-Machine", color: "from-green-500 to-green-600" },
              { icon: Zap, title: "Robotique", color: "from-orange-500 to-orange-600" },
              { icon: Shield, title: "Cybersécurité", color: "from-red-500 to-red-600" },
              { icon: Globe, title: "Télécommunications", color: "from-indigo-500 to-indigo-600" },
            ].map((axe, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${axe.color} text-white mb-4`}>
                  <axe.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{axe.title}</h3>
                <p className="text-gray-600 text-sm">
                  Recherche avancée dans le domaine de {axe.title.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Analyse Détaillée */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {settings.analyse_detaillee_titre || "Analyse Détaillée par Axe"}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Approfondissez votre compréhension de nos domaines de recherche
            </p>
          </div>

          {/* Contenu de l'analyse détaillée */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <p className="text-gray-600 text-center">
              Contenu détaillé de l'analyse par axe sera affiché ici
            </p>
          </div>
        </div>
      </section>

      {/* Section Processus de Recherche */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {settings.processus_recherche_titre || "Processus de Recherche"}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {settings.processus_recherche_texte || "Notre approche méthodologique suit un processus rigoureux en plusieurs étapes."}
            </p>
          </div>

          {/* Étapes du processus */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {dynamicSteps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{step.title}</h3>
                  <p className="text-gray-600 text-xs">{step.description}</p>
                </div>
                
                {/* Flèche entre les étapes */}
                {index < dynamicSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecherchePreview; 