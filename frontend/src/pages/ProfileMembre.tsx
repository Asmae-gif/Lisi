"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import axiosClient from "@/services/axiosClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X, Linkedin, Globe, GraduationCap, Mail } from "lucide-react"
import type { Membre, User, Role, Axe } from '../types/membre'
import { updateMemberProfile } from '../services/api'
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios'

interface MemberProfile extends Omit<Membre, 'photo' | 'axe_id'> {
  google_id: string;
  photo: string;
  axe_ids: number[];
  position?: string;
  user: User | null;
  is_comite: boolean;
}

interface ApiUser extends Omit<User, 'roles'> {
  roles: Role[];
  membre: Omit<MemberProfile, 'axe_ids'> & { axe_ids: number[] };
}



const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4">Chargement du profil...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center text-red-500">
      <p>{error}</p>
      <Button onClick={onRetry} className="mt-4">
        Réessayer
      </Button>
    </div>
  </div>
);

const ProfileHeader = ({ isEditing, onEdit, onSave, onCancel }: {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) => (
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        {!isEditing ? (
      <Button onClick={onEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
        <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Annuler
            </Button>
          </div>
        )}
      </div>
);

const ProfileCard = ({ profile,  axes }: {
  profile: MemberProfile;
  isEditing: boolean;
  onInputChange: (field: keyof MemberProfile, value: unknown) => void;
  axes: { id: number; nom: string }[];
}) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardHeader>
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
        {(profile.photo_url || (typeof profile.photo === 'string' && profile.photo)) ? (
          <img
            src={profile.photo_url || (typeof profile.photo === 'string' ? profile.photo : undefined)}
            alt={`${profile.prenom} ${profile.nom}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl">
              {profile.prenom?.[0]}{profile.nom?.[0]}
            </span>
          </div>
        )}
      </div>
      <CardTitle className="text-xl text-center">
        {profile.prenom} {profile.nom}
      </CardTitle>
      <div className="text-center space-y-2">
        {profile.position && (
          <p className="text-gray-600 font-medium">{profile.position || '-'}</p>
        )}
        {profile.statut && (
          <p className="text-gray-600">{profile.statut}</p>
        )}
        {profile.grade && (
          <p className="text-gray-600">{profile.grade}</p>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {profile.researchgate && (
            <a
              href={profile.researchgate}
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          {profile.google_scholar && (
            <a
              href={profile.google_scholar}
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GraduationCap className="w-4 h-4" />
            </a>
          )}
        </div>
        <div className="text-center">
          <Label className="text-sm font-medium block mb-2">Axes de recherche</Label>
          <p className="text-sm text-gray-600">
            {profile.axe_ids.length > 0
              ? axes.filter(a => profile.axe_ids.includes(a.id)).map(a => a.nom).join(', ')
              : '-'}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const InformationForm = ({ profile, editedProfile, isEditing, onInputChange, axes }: {
  profile: MemberProfile;
  editedProfile: MemberProfile;
  isEditing: boolean;
  onInputChange: (field: keyof MemberProfile, value: unknown) => void;
  axes: { id: number; nom: string }[];
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom *</Label>
          {isEditing ? (
            <Input
              id="prenom"
              value={editedProfile.prenom ?? ''}
              onChange={(e) => onInputChange('prenom', e.target.value)}
              required
            />
          ) : (
            <p className="text-gray-700">{profile.prenom}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nom">Nom *</Label>
          {isEditing ? (
            <Input
              id="nom"
              value={editedProfile.nom ?? ''}
              onChange={(e) => onInputChange('nom', e.target.value)}
              required
            />
          ) : (
            <p className="text-gray-700">{profile.nom}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        {isEditing ? (
          <Input
            id="email"
            type="email"
            value={editedProfile.email ?? ''}
            onChange={(e) => onInputChange('email', e.target.value)}
            required
          />
        ) : (
          <p className="text-gray-700">{profile.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="grade">statut</Label>
        {isEditing ? (
          <Input
            id="statut"
            value={editedProfile.statut ?? ''}
            onChange={(e) => onInputChange('statut', e.target.value)}
          />
        ) : (
          <p className="text-gray-700">{profile.statut || '-'}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        {isEditing ? (
          <Input
            value={editedProfile.position || ''}
            onChange={(e) => onInputChange('position', e.target.value)}
          />
        ) : (
          <p className="text-gray-700">
            {profile.position || '-'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="grade">Grade</Label>
        {isEditing ? (
          <Input
            id="grade"
            value={editedProfile.grade ?? ''}
            onChange={(e) => onInputChange('grade', e.target.value)}
          />
        ) : (
          <p className="text-gray-700">{profile.grade || '-'}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="biographie">Biographie</Label>
        {isEditing ? (
          <Textarea
            id="biographie"
            value={editedProfile.biographie ?? ''}
            onChange={(e) => onInputChange('biographie', e.target.value)}
            rows={4}
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{profile.biographie || '-'}</p>
        )}
      </div>

      {isEditing && (
        <>
          <div className="space-y-2">
            <Label>Axes de recherche</Label>
            <div className="grid grid-cols-2 gap-2">
              {axes.map(axe => (
                <label key={axe.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editedProfile.axe_ids.includes(axe.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        onInputChange('axe_ids', [...editedProfile.axe_ids, axe.id]);
                      } else {
                        onInputChange('axe_ids', editedProfile.axe_ids.filter(id => id !== axe.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{axe.nom}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Réseaux sociaux et académiques</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={editedProfile.linkedin || ''}
                  onChange={(e) => onInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/votre-profil"
                />
              </div>
              <div>
                <Label htmlFor="researchgate">ResearchGate</Label>
                <Input
                  id="researchgate"
                  value={editedProfile.researchgate || ''}
                  onChange={(e) => onInputChange('researchgate', e.target.value)}
                  placeholder="https://researchgate.net/profile/votre-profil"
                />
              </div>
              <div>
                <Label htmlFor="google_scholar">Google Scholar</Label>
                <Input
                  id="google_scholar"
                  value={editedProfile.google_scholar || ''}
                  onChange={(e) => onInputChange('google_scholar', e.target.value)}
                  placeholder="https://scholar.google.com/citations"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function MonProfil() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [axes, setAxes] = useState<{ id: number; nom: string }[]>([]);
  const [profile, setProfile] = useState<MemberProfile>({
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    photo: '',
    photo_url: '',
    statut: '',
    position: '',
    biographie: '',
    slug: '',
    google_id: '',
    axe_ids: [],
    linkedin: '',
    researchgate: '',
    google_scholar: '',
    grade: '',
    created_at: '',
    user: null,
    is_comite: false,
  });
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    if (user) {
      fetchProfile();
      fetchAxes();
    }
  }, [user, authLoading, navigate]);

  const fetchAxes = async () => {
    try {
      const { data } = await axiosClient.get('/api/axes');
      console.log('Réponse brute de /api/axes:', data);

      let axesData = [];
      if (Array.isArray(data)) {
        axesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        axesData = data.data;
      }

      console.log('Données des axes avant transformation:', axesData);

      const formattedAxes = axesData.map((axe: Axe) => {
        console.log('Axe individuel:', axe);
        return {
          id: axe.id,
          nom: axe.nom || axe.title || axe.slug || 'Axe sans nom'
        };
      });

      console.log('Axes formatés:', formattedAxes);
      setAxes(formattedAxes);
    } catch (err) {
      console.error('Erreur détaillée lors du chargement des axes:', err);
      if (err instanceof Error) {
        console.error('Message d\'erreur:', err.message);
      }
      setAxes([]);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log("Envoi de la requête GET /api/user");
      const { data } = await axiosClient.get<{
        user: ApiUser;
      }>('/api/user');
      
      console.log("Réponse brute reçue:", data);
      
      if (!data) {
        console.error("Aucune donnée reçue du serveur");
        throw new Error("Aucune donnée reçue du serveur");
      }

      if (!data.user) {
        console.error("Données utilisateur manquantes:", data);
        throw new Error("Données utilisateur manquantes");
      }

      if (!data.user.membre) {
        console.error("Données membre manquantes:", data.user);
        throw new Error("Données membre manquantes");
      }

      // Validation des champs obligatoires
      const requiredFields = ['id', 'nom', 'prenom'];
      const missingFields = requiredFields.filter(field => !data.user.membre[field as keyof typeof data.user.membre]);
      
      if (missingFields.length > 0) {
        console.error('Champs obligatoires manquants:', missingFields);
        throw new Error(`Champs obligatoires manquants: ${missingFields.join(', ')}`);
      }

      // Créer un objet User valide
      const userObject: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        email_verified_at: data.user.email_verified_at,
        is_blocked: data.user.is_blocked,
        is_approved: data.user.is_approved,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
        roles: data.user.roles,
        membre: null // On évite la récursion infinie
      };

      const fullProfile: MemberProfile = {
        ...data.user.membre,
        email: data.user.email,
        google_id: data.user.id.toString(),
        axe_ids: data.user.membre.axe_ids || [],
        user: userObject,
        is_comite: false,
      };
      
      console.log('Profil complet formaté:', fullProfile);
      setProfile(fullProfile);
      setEditedProfile(fullProfile);
      setError(null);
    } catch (error) {
      console.error("Erreur détaillée lors du chargement du profil:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Votre session a expiré. Veuillez vous reconnecter.");
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else if (error.response?.status === 419) {
          setError("Session expirée. Veuillez rafraîchir la page.");
        } else if (error.response?.status === 404) {
          setError("Profil non trouvé.");
        } else if (error.response?.status === 500) {
          setError("Erreur serveur. Veuillez réessayer plus tard.");
        } else {
          setError(error.response?.data?.message || "Une erreur est survenue lors du chargement du profil.");
        }
      } else {
        setError(error instanceof Error ? error.message : "Une erreur inattendue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    try {
      setLoading(true);
      setError(null);

      if (!editedProfile.nom || !editedProfile.prenom || !editedProfile.email) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: "Veuillez remplir tous les champs obligatoires",
        });
        return;
      }

      const generateSlug = (nom: string, prenom: string) => {
        return `${prenom.toLowerCase()}-${nom.toLowerCase()}`
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      };

      const payload = {
        nom: (editedProfile.nom ?? '').trim(),
        prenom: (editedProfile.prenom ?? '').trim(),
        email: (editedProfile.email ?? '').trim(),
        statut: editedProfile.statut ?? '',
        position: editedProfile.position ?? '',
        biographie: (editedProfile.biographie ?? '').trim(),
        linkedin: (editedProfile.linkedin ?? '').trim(),
        researchgate: (editedProfile.researchgate ?? '').trim(),
        google_scholar: (editedProfile.google_scholar ?? '').trim(),
        grade: (editedProfile.grade ?? '').trim(),
        slug: generateSlug(editedProfile.nom, editedProfile.prenom),
        axe_ids: editedProfile.axe_ids,
        google_id: editedProfile.google_id,
        photo: editedProfile.photo,
        user: editedProfile.user,
        is_comite: editedProfile.is_comite,
      };

      const result = await updateMemberProfile(editedProfile.id, payload);
      
      if (result.success && result.data) {
        const completeProfile: MemberProfile = {
          ...editedProfile,
          ...result.data,
          photo: typeof result.data.photo === 'string' ? result.data.photo : '',
          axe_ids: result.data.axe_ids || editedProfile.axe_ids,
          google_id: editedProfile.google_id,
          user: editedProfile.user,
          is_comite: editedProfile.is_comite,
        };
        
        setProfile(completeProfile);
        setEditedProfile(completeProfile);
        setIsEditing(false);
        
        toast({
          title: "Succès",
          description: "Votre profil a été mis à jour avec succès",
        });
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (err) {
      console.error('Erreur détaillée lors de la mise à jour:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil';
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof MemberProfile, value: unknown) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchProfile} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <ProfileHeader
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <ProfileCard
            profile={profile}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            axes={axes}
          />
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations détaillées</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Modifiez vos informations personnelles et professionnelles"
                  : "Vos informations personnelles et professionnelles"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InformationForm
                profile={profile}
                editedProfile={editedProfile}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                axes={axes}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
