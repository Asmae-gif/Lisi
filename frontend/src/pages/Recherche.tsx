// src/pages/Recherche.tsx
import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { axesApi } from '../services/api';
import axiosClient from "@/services/axiosClient";
import { Axe } from '@/types/axe';
import { RechercheSettings } from '@/types/rechercheSettings';
import {
  Card, CardHeader, CardTitle, CardContent
} from '../components/ui/card';
import { buildImageUrl } from '@/utils/imageUtils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import TabNavigation from '@/components/common/TabNavigation';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import AxeCard from '@/components/common/AxeCard';

/**
 * Composant de page Recherche
 * Affiche les axes de recherche avec leurs détails et le processus de recherche
 */

const Recherche: React.FC = () => {
  const [axes, setAxes] = useState<Axe[]>([]);
  const [active, setActive] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<RechercheSettings>({});

  // Optimisation avec useCallback pour le chargement des données
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [settingsRes, axesRes] = await Promise.all([
        axiosClient.get('/api/pages/recherche/settings', {
          headers: { 'Accept': 'application/json' }
        }),
        axesApi.getAxes()
      ])
      
      // Vérifier et traiter les paramètres
      if (settingsRes.data && typeof settingsRes.data === 'object') {
        // Vérifier si les données sont dans un sous-objet data
        const settingsData = settingsRes.data.data || settingsRes.data
        if (import.meta.env.DEV) {
          console.log('Données settings à utiliser:', settingsData)
        }
        setSettings(settingsData)
      } else {
        console.error('Format de données invalide pour les paramètres:', settingsRes.data)
      }

      // Vérifier et traiter les axes
      const axesData = Array.isArray(axesRes) ? axesRes : (Array.isArray((axesRes as { data: unknown[] })?.data) ? (axesRes as { data: unknown[] }).data : [])
      if (Array.isArray(axesData)) {
        if (import.meta.env.DEV) {
          console.log('Données axes à utiliser:', axesData)
        }
        setAxes(axesData as Axe[])
        if (axesData.length) setActive((axesData[0] as Axe).slug)
      } else {
        console.error('Format de données invalide pour les axes:', axesRes)
      }
    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err)
      setError((err as Error).message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Optimisation avec useMemo pour les cartes des domaines
  const domainCards = useMemo(() => {
    return axes.map((axe) => {
      return (
        <AxeCard 
          key={axe.id} 
          axe={axe} 
          variant="detailed"
          onClick={() => setActive(axe.slug)}
          className={active === axe.slug ? 'ring-2 ring-primary' : ''}
        />
      );
    });
  }, [axes, active]);

  // Optimisation avec useMemo pour les onglets de contenu détaillé
  const tabItems = useMemo(() => {
    return axes.map(a => {

      return {
        value: a.slug,
        label: a.title.split(' ')[0],
        content: (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{a.title}</h3>              
            </div>

            <Card>
              <CardHeader className="flex items-center justify-start gap-3 mb-6">
    
                <CardTitle className="text-lg">Problématique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-800 leading-relaxed text-lg whitespace-pre-line">{a.problematique}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center gap-3 mb-6">
            
                <CardTitle className="text-lg">Objectif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-800 leading-relaxed text-lg whitespace-pre-line">{a.objectif}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center gap-3 mb-6">
           
                <CardTitle className="text-lg">Approche</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-800 leading-relaxed text-lg whitespace-pre-line">{a.approche}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center gap-3 mb-6">
                
                <CardTitle className="text-lg">Résultats Attendus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-800 leading-relaxed text-lg whitespace-pre-line">{a.resultats_attendus}</p>
              </CardContent>
            </Card>
          </div>
        )
      };
    });
  }, [axes]);

  // Optimisation avec useMemo pour les étapes du processus
  const processSteps = useMemo(() => {
    return [
      { step: "1", title: "Problématique", desc: "Identification des défis scientifiques" },
      { step: "2", title: "Objectifs", desc: "Définition claire des buts à atteindre" },
      { step: "3", title: "Approche", desc: "Développement de méthodologies adaptées" },
      { step: "4", title: "Expérimentation", desc: "Tests et validation des hypothèses" },
      { step: "5", title: "Résultats", desc: "Publication et valorisation des découvertes" }
    ].map((item, index) => {
      // Utiliser les données des settings si disponibles
      const stepNumber = item.step
      const stepTitle = settings[`processus_recherche_etapes_${stepNumber}_titre`] || item.title
      const stepDesc = settings[`processus_recherche_etapes_${stepNumber}_description`] || item.desc
      
      return (
        <div key={index} className="text-center">
          <div className="w-16 h-16 bg-[#3ea666] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
            {stepNumber}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{stepTitle}</h3>
          <p className="text-gray-600 text-sm">{stepDesc}</p>
          {index < 4 && (
            <div className="hidden md:block mt-4">
              <div className="w-full h-0.5 bg-gray-300 relative">
                <div className="absolute right-0 top-0 w-2 h-2 bg-blue-600 rounded-full transform translate-x-1 -translate-y-0.75"></div>
              </div>
            </div>
          )}
        </div>
      )
    });
  }, [settings]);

  // Optimisation avec useCallback pour le changement d'onglet
  const handleTabChange = useCallback((value: string) => {
    setActive(value);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section 
        className="bg-gradient-to-br from-green-50 to-indigo-100 py-16"
        style={settings['nos_domaines_image'] ? {
          backgroundImage: `url(${buildImageUrl(settings['nos_domaines_image'])})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {settings['nos_domaines_titre'] || (
                <>
                  <span className="block">Nos Domaines</span>
                  <span className="block">d'Excellence</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {settings['nos_domaines_texte_intro'] || 
                "Découvrez nos axes de recherche stratégiques et les innovations que nous développons pour répondre aux défis technologiques de demain."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {settings['axes_strategiques_titre'] || "Nos Axes Stratégiques"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {settings['axes_strategiques_description'] || 
                "Chaque axe de recherche répond à des problématiques spécifiques avec des approches innovantes"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {domainCards}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
            {settings['analyse_detaillee_titre'] || "Analyse Détaillée par Axe"}
          </h2>

          <TabNavigation
            tabs={tabItems}
            activeTab={active}
            onTabChange={handleTabChange}
            tabsListClassName="grid w-full grid-cols-2 lg:grid-cols-5 mb-8"
            tabsTriggerClassName="text-xs lg:text-sm"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg">
              <Link to="/projets">Voir nos Projets</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/publications">Nos Publications</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {settings['processus_recherche_titre'] || "Processus de Recherche"}
            </h2>
            <p className="text-xl text-gray-600">
              {settings['processus_recherche_texte'] || 
                "De l'idée à l'innovation : notre méthode éprouvée"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Recherche;
