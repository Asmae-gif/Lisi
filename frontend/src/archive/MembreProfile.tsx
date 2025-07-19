"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getMembre } from '@/services/api';
import type { Membre } from '@/types/membre';
import { Mail, Linkedin, ArrowLeft, Globe, BookOpen, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserAvatar from '@/components/common/UserAvatar';

export default function MembreProfile() {
  const { id } = useParams<{ id: string }>();
  const [membre, setMembre] = useState<Membre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      console.error('ID du membre manquant');
      setError("ID du membre manquant");
      setLoading(false);
      return;
    }

    const loadMembre = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Chargement du membre avec ID:', id);
        const membreData = await getMembre(parseInt(id));
        console.log('Données du membre reçues:', membreData);
        
        if (!membreData) {
          throw new Error('Aucune donnée reçue du serveur');
        }
        
        setMembre(membreData.data);
      } catch (e) {
        console.error('Erreur détaillée:', e);
        setError(e instanceof Error ? e.message : "Impossible de charger le membre");
      } finally {
        setLoading(false);
      }
    };

    loadMembre();
  }, [id]);

  // Log pour déboguer l'état du membre
  useEffect(() => {
    console.log('État actuel du membre:', membre);
  }, [membre]);

  // Correction : accès aux vraies données du membre
  const m = membre;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/equipe" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux équipes
          </Link>
        </div>
      </div>
    );
  }

  if (!m) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Membre non trouvé</p>
          <Link to="/equipe" className="text-indigo-600 hover:underline">
            Retour aux équipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link 
          to="/equipe" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux équipes
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Colonne de gauche - Photo et informations principales */}
          <div className="md:col-span-1 space-y-4">
            {/* Photo et informations de base */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <UserAvatar
                      src={typeof m.photo === 'string' ? m.photo : m.photo_url}
                      alt={`${m.prenom} ${m.nom}`}
                      fallback={`${m.prenom} ${m.nom}`}
                      size="2xl"
                      className="mx-auto"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {m.prenom} {m.nom}
                  </h3>
                  {m.statut && <Badge className="mt-2">{m.statut}</Badge>}
                  {m.grade && <p className="text-sm text-gray-600 mt-1">{m.grade}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Informations de contact */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </h4>
                <div className="space-y-2 text-sm">
                  {m.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={`mailto:${m.email}`} className="text-blue-600 hover:text-blue-800">
                        {m.email}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Liens académiques */}
            {(m.linkedin || m.google_scholar || m.researchgate) && (
              <Card className="mb-4">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Liens utiles</h4>
                  <div className="space-y-3">
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="w-5 h-5 mr-2" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {m.google_scholar && (
                      <a
                        href={m.google_scholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <BookOpen className="w-5 h-5 mr-2" />
                        <span>Google Scholar</span>
                      </a>
                    )}
                    {m.researchgate && (
                      <a
                        href={m.researchgate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        <span>Researchgate</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonnes de droite - Informations détaillées */}
          <div className="md:col-span-2 space-y-6">
            {/* Biographie */}
            {m.biographie && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Biographie</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {m.biographie}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 