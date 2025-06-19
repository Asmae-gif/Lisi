import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Mail, MessageSquare, Eye, LucideIcon } from "lucide-react";
import { contactAPI, ContactMessage } from "@/services/api";
import MessageItem from "@/components/MessageItem";
import { Tabs, TabsContent } from "@/components/ui/tabs";


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

  const StatsCard = ({
    title,
    value,
    icon: Icon,
  }: {
    title: string;
    value: [number, string];
    icon: LucideIcon;
  }) => {
    return (
      <Card className="transition-all hover:shadow-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
          <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{value[0]} {value[1]}</div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Messages</h1>
          
            </div>
          </div>
        </div>
      </div> 
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <TabsContent value="contact" className="h-full mt-0">
                  <div className="h-full flex flex-col space-y-4">
                    {/* Filters - Fixed height */}
                    <Card className="flex-none">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <CardTitle className="text-lg">Contact</CardTitle>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <div className="relative flex-1 sm:flex-none sm:w-64">
                              <Input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Filter className="h-4 w-4 text-gray-400" />
                              <Select value={filter} onValueChange={(value: 'all' | 'read' | 'unread') => setFilter(value)}>
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Tous les messages</SelectItem>
                                  <SelectItem value="unread">Non lus</SelectItem>
                                  <SelectItem value="read">Lus</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Messages List */}
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Chargement des messages...</p>
                      </div>
                    ) : error ? (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <p className="text-gray-600">
                            Impossible de charger les messages. Affichage des données de démonstration.
                          </p>
                          <p className="text-red-500 mt-2">Erreur: {error.message}</p>
                        </CardContent>
                      </Card>
                    ) : filteredMessages.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Aucun message trouvé.</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Messages bruts: {messages.length} | Messages traités: {processedMessages.length} | Messages filtrés: {filteredMessages.length}
                          </p>
                        </CardContent>
                      </Card>
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
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDashboard;