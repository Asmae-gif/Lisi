import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/components/contexts/AuthContext'; 
import { RegisterData } from '@/types/auth';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import AuthLayout from '@/components/layout/AuthLayout'; 



const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
    statut: 'permanent',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showpassword_confirmation, setShowpassword_confirmation] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      setSuccess("Inscription réussie ! Votre compte doit être validé par un administrateur avant de pouvoir vous connecter.");
      setError("");
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        password_confirmation: '',
        statut: 'permanent',
      });
      // Optionnel : ne pas rediriger immédiatement
      // navigate('/login');
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Demande d'inscription</CardTitle>
          <CardDescription className="text-center">Cet espace est réservé aux membres du laboratoire. Une validation par un administrateur est requise avant l'accès.</CardDescription>
        </CardHeader>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nom" className="text-sm font-medium">Nom</Label>
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="nom"
                  name="nom"
                  type="text"   
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>  
              <div className="grid gap-2">      
              <Label htmlFor="prenom">Prénom</Label>
       
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showpassword_confirmation ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowpassword_confirmation(!showpassword_confirmation)}
                >
                  {showpassword_confirmation ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="statut">Statut *</Label>
              <div className="relative">
              <select
                id="statut"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded"
                required
              >
                <option value="permanent">Permanent</option>
                <option value="doctorant">Doctorant</option>
                <option value="associé">Associé</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-[#3ea666] hover:bg-green-700 text-white" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer le compte"}
            </Button>

            <div className="text-center text-sm">
              Déjà un compte ?{" "}
              <Link to="/auth/login" className="text-[#3ea666] hover:underline hover:text-lisiGold">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
    </AuthLayout>
  );
};

export default Register; 

