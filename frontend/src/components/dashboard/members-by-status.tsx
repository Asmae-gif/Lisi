import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import api from '@/lib/axios';

interface Membre {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  statut: string;
  grade?: string;
  photo?: string;
  created_at: string;
}

interface MembersByStatusProps {
  className?: string;
}

export function MembersByStatus({ className }: MembersByStatusProps) {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['permanent']);

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const response = await api.get('/api/admin/membres');
        const membresData = response.data.data?.membres || response.data || [];
        setMembres(membresData);
      } catch (error) {
        console.error('Erreur lors de la récupération des membres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembres();
  }, []);

  const membersByCategory = React.useMemo(() => {
    const categories = [
      {
        id: 'permanent',
        title: 'Membres Permanents',
        color: 'bg-green-100 text-green-800',
        members: membres.filter(m => m.statut?.toLowerCase() === 'permanent')
      },
      {
        id: 'associe',
        title: 'Membres Associés',
        color: 'bg-blue-100 text-blue-800',
        members: membres.filter(m => m.statut?.toLowerCase() === 'associés')
      },
      {
        id: 'doctorant',
        title: 'Doctorants',
        color: 'bg-orange-100 text-orange-800',
        members: membres.filter(m => m.statut?.toLowerCase() === 'doctorants')
      }
    ];

    return categories.filter(category => category.members.length > 0);
  }, [membres]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Membres par statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Membres par statut
          <Badge variant="secondary" className="ml-auto">
            {membres.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {membersByCategory.map((category) => (
            <div key={category.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge className={category.color}>
                    {category.members.length}
                  </Badge>
                  <span className="font-medium">{category.title}</span>
                </div>
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {expandedCategories.includes(category.id) && (
                <div className="border-t bg-gray-50">
                  <div className="p-4 space-y-3">
                    {category.members.map((membre) => (
                      <div key={membre.id} className="flex items-center gap-3 p-2 rounded-lg bg-white">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={membre.photo} />
                          <AvatarFallback className="text-xs">
                            {membre.prenom[0]}{membre.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {membre.prenom} {membre.nom}
                          </p>
                          {membre.grade && (
                            <p className="text-xs text-gray-500 truncate">
                              {membre.grade}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 