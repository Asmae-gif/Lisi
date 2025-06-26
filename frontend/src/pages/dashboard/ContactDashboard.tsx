import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Mail, MessageSquare, Eye, LucideIcon } from "lucide-react";
import { contactAPI, ContactMessage } from "@/services/api";
import MessageItem from "@/components/MessageItem";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

const ContactDashboard = () => {
  const [page] = useState(1);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  interface PaginatedResponse<T> {
    data: T[];
    total: number;
    current_page: number;
    last_page: number;
  }
  
  const { data: messagesData, isLoading, error } = useQuery<PaginatedResponse<ContactMessage>>({
    queryKey: ['contactMessages', page],
    queryFn: async () => {
      const response = await contactAPI.getMessages(page, 10);
      return response.data;
    },
    staleTime: 30000,
  });

  // Gestion de la structure paginée de Laravel avec vérification de type
  const messages = messagesData?.data ?? [];
  
  // Ajouter la propriété is_read manquante aux messages
  const processedMessages = messages.map(message => ({
    ...message,
    is_read: message.is_read !== undefined ? message.is_read : false,
    subject: message.subject || 'Sans sujet' // Ajouter un sujet par défaut si manquant
  }));

  const [activeTab, setActiveTab] = useState("contact")

  const filteredMessages = processedMessages.filter(message => {
    const matchesFilter = filter === 'all' || 
      (filter === 'read' && message.is_read) || 
      (filter === 'unread' && !message.is_read);
    
    const matchesSearch = searchTerm === '' || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Statistiques pour les cartes
  const statsCards = [
    {
      title: "Total",
      value: processedMessages.length,
      icon: MessageSquare,
      iconColor: "text-blue-600"
    },
    {
      title: "Non lus",
      value: processedMessages.filter(m => !m.is_read).length,
      icon: Mail,
      iconColor: "text-red-600"
    },
    {
      title: "Lus",
      value: processedMessages.filter(m => m.is_read).length,
      icon: Eye,
      iconColor: "text-green-600"
    },
    {
      title: "Cette semaine",
      value: processedMessages.filter(m => {
        const messageDate = new Date(m.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return messageDate >= weekAgo;
      }).length,
      icon: MessageSquare,
      iconColor: "text-orange-600"
    }
  ];

  // Options de filtre
  const filterOptions = [
    { value: "all", label: "Tous les messages" },
    { value: "unread", label: "Non lus" },
    { value: "read", label: "Lus" }
  ];

  return (
    <DashboardPageLayout
      title="Messages de contact"
      description="Gérez les messages reçus via le formulaire de contact"
      icon={MessageSquare}
      iconColor="text-blue-600"
      showSearch={true}
      searchPlaceholder="Rechercher par nom, email ou sujet..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showFilter={true}
      filterOptions={filterOptions}
      filterValue={filter}
      onFilterChange={(value) => setFilter(value as 'all' | 'read' | 'unread')}
      statsCards={statsCards}
      showStats={true}
    >
      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Liste des messages ({filteredMessages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Chargement des messages...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Impossible de charger les messages. Affichage des données de démonstration.
              </p>
              <p className="text-red-500 mt-2">Erreur: {error.message}</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun message trouvé.</p>
              <p className="text-sm text-gray-500 mt-2">
                Messages bruts: {messages.length} | Messages traités: {processedMessages.length} | Messages filtrés: {filteredMessages.length}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <MessageItem key={message.id} message={{
                  ...message,
                  updated_at: message.updated_at || message.created_at
                }} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardPageLayout>
  )
}

export default ContactDashboard;