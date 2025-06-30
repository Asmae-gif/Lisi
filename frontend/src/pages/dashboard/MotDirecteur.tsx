import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Save, X } from "lucide-react";

interface MotDirecteur {
  id?: number;
  titre: string;
  contenu: string;
  nom_directeur: string;
  poste: string;
  image?: string;
}

export default function MotDirecteur() {
  const [motDirecteur, setMotDirecteur] = useState<MotDirecteur | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Charger le mot du directeur
  const loadMotDirecteur = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mot-directeur', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMotDirecteur(data.data);
        } else {
          // Créer un mot du directeur par défaut
          setMotDirecteur({
            titre: "Mot du Directeur",
            contenu: "Notre laboratoire incarne l'excellence scientifique et l'innovation technologique. Nous nous engageons à repousser les frontières de la connaissance tout en formant la prochaine génération de chercheurs.",
            nom_directeur: "Prof. Dr. Ahmed Benali",
            poste: "Directeur du Laboratoire",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le mot du directeur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder le mot du directeur
  const saveMotDirecteur = async () => {
    if (!motDirecteur) return;

    try {
      setSaving(true);
      const url = motDirecteur.id ? `/api/mot-directeur/${motDirecteur.id}` : '/api/mot-directeur';
      const method = motDirecteur.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motDirecteur),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMotDirecteur(data.data);
          setIsEditing(false);
          toast({
            title: "Succès",
            description: "Mot du directeur sauvegardé avec succès",
          });
        }
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le mot du directeur",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadMotDirecteur();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <span className="text-gray-500">Chargement du mot du directeur...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="w-8 h-8 text-green-600" />
            Mot du Directeur
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez le message et les informations du directeur du laboratoire
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          ) : (
            <>
              <Button onClick={saveMotDirecteur} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  loadMotDirecteur(); // Recharger les données originales
                }} 
                variant="outline"
              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du directeur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom_directeur">Nom du directeur</Label>
              <Input
                id="nom_directeur"
                value={motDirecteur?.nom_directeur || ''}
                onChange={(e) => setMotDirecteur(prev => prev ? {...prev, nom_directeur: e.target.value} : null)}
                disabled={!isEditing}
                placeholder="Ex: Prof. Dr. Ahmed Benali"
              />
            </div>
            
            <div>
              <Label htmlFor="poste">Poste</Label>
              <Input
                id="poste"
                value={motDirecteur?.poste || ''}
                onChange={(e) => setMotDirecteur(prev => prev ? {...prev, poste: e.target.value} : null)}
                disabled={!isEditing}
                placeholder="Ex: Directeur du Laboratoire"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="titre">Titre du message</Label>
            <Input
              id="titre"
              value={motDirecteur?.titre || ''}
              onChange={(e) => setMotDirecteur(prev => prev ? {...prev, titre: e.target.value} : null)}
              disabled={!isEditing}
              placeholder="Ex: Mot du Directeur"
            />
          </div>

          <div>
            <Label htmlFor="contenu">Message du directeur</Label>
            <Textarea
              id="contenu"
              value={motDirecteur?.contenu || ''}
              onChange={(e) => setMotDirecteur(prev => prev ? {...prev, contenu: e.target.value} : null)}
              disabled={!isEditing}
              placeholder="Entrez le message du directeur..."
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      {/* Aperçu */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {motDirecteur?.titre || 'Mot du Directeur'}
            </h3>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">
                {motDirecteur?.contenu || 'Aucun contenu disponible'}
              </p>
            </div>
            
            <div className="border-l-4 border-green-600 pl-4">
              <div className="font-semibold text-gray-900">
                {motDirecteur?.nom_directeur || 'Nom du directeur'}
              </div>
              <div className="text-green-600 font-medium">
                {motDirecteur?.poste || 'Poste du directeur'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 