import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, CheckCircle, MapPin, Phone, Mail } from "lucide-react";
import { contactAPI, ContactFormData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from "@/services/axiosClient";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { buildImageUrl } from '@/utils/imageUtils';

// Interface pour les paramètres de contact
interface ContactSettings {
  contact_titre?: string;
  contact_sous_titre?: string;
  contact_titre2?: string;
  contact_adresse?: string;
  contact_telephone?: string;
  contact_email?: string;
  [key: string]: string | undefined;
}

/**
 * Composant de page Contact
 * Affiche un formulaire de contact avec les informations de l'organisation
 */
const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [settings, setSettings] = useState<ContactSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des données de configuration
  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsRes] = await Promise.all([
        axiosClient.get('/api/pages/contact/settings', {
          headers: { 'Accept': 'application/json' }
        }),
      ]);

      // Log détaillé des données reçues
      console.log('=== Données reçues ===');
      console.log('Settings:', settingsRes.data);

      // Vérifier et traiter les paramètres
      if (settingsRes.data && typeof settingsRes.data === 'object') {
        // Vérifier si les données sont dans un sous-objet data
        const settingsData = settingsRes.data.data || settingsRes.data;
        console.log('Données settings à utiliser:', settingsData);
        setSettings(settingsData);
      } else {
        console.error('Format de données invalide pour les paramètres:', settingsRes.data);
      }
    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: contactAPI.sendMessage,
    onSuccess: () => {
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message envoyé !",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons bientôt.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs du formulaire.",
        variant: "destructive",
      });
      return;
    }
    sendMessageMutation.mutate(formData);
  };

  // Affichage de l'état de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSkeleton type="grid" rows={3} />
        </div>
        <Footer />
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button onClick={loadData} className="mt-4">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Message envoyé !</CardTitle>
            <CardDescription>
              Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setIsSubmitted(false)} 
              variant="outline" 
              className="w-full"
            >
              Envoyer un autre message
            </Button>
            <Link to="/">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <section 
        className="bg-gradient-to-br from-green-50 to-indigo-100 py-16"
        style={settings['contact_image'] ? {
          backgroundImage: `url(${buildImageUrl(settings['contact_image'])})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
      {/* Contact Form */}
      
    
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {settings['contact_titre'] || "Contactez-nous"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {settings['contact_sous_titre'] || "Nous sommes à votre disposition pour répondre à vos questions, discuter de collaborations ou explorer de nouvelles opportunités de recherche."}
              </p>
            </div>
          </div>
        </section>

        {/* Informations de contact et formulaire */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Informations de contact */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {settings['contact_titre2'] || "Informations de Contact"}
                </h2>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Adresse</h3>
                      <p className="text-gray-600">
                        {settings['contact_adresse'] || (
                          <>
                            <span className="block">123 Avenue de la Recherche</span>
                            <span className="block">Bâtiment Sciences et Technologies</span>
                            <span className="block">75000 Paris, France</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléphone</h3>
                      <p className="text-gray-600">
                        {settings['contact_telephone'] || (
                          <>
                            <span className="block">+33 1 23 45 67 89</span>
                            <span className="block">+33 1 23 45 67 90 (Fax)</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600">
                        {settings['contact_email'] || (
                          <>
                            <span className="block">contact@laboratoire.fr</span>
                            <span className="block">direction@laboratoire.fr</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carte */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Carte interactive (à intégrer)</p>
                  </div>
                </div>
              </div>

              {/* Formulaire de contact */}
              <div>
                <div className="bg-gray-50 rounded-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Envoyez-nous un message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet 
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email 
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="votre.email@exemple.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet 
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Sujet de votre message"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>          
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message 
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre message..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Envoyer le message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
     
      <Footer />
    </div>
  );
};

export default Contact;