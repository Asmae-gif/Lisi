import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from '@/components/layout/AuthLayout'; 
import { AxiosError } from "axios";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import GoogleLoginButton from "@/components/common/GoogleLoginButton";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // On utilise 'any' pour userData car la réponse peut contenir redirect_url (backend Laravel)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userData: any = await login({ email, password });

      // Utilise la redirection du backend si elle existe
      if (userData.redirect_url) {
        window.location.href = userData.redirect_url;
        return;
      }
      // Sinon, logique de fallback
      const role = userData.user && userData.user.roles && Array.isArray(userData.user.roles) && userData.user.roles.length > 0
  ? userData.user.roles[0]?.name
  : undefined;


      if (role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (role === 'membre' || role === 'member' || role === 'user') {
        navigate('/profile', { replace: true });
      } else {
        setError("Vous n'avez pas l'autorisation d'accéder à cette application.");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response && err.response.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError((err as Error).message || 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
    
  };

  return (
 <AuthLayout>
 
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Espace Admin & Membre</CardTitle>
          <CardDescription className="text-center">Accès réservé aux membres validés et aux administrateurs.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Adresse email"
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Link to="/auth/forgot-password" className="text-sm text-[#3ea666] hover:underline hover:text-lisiGold">
                Mot de passe oublié ?
              </Link>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3ea666] hover:bg-green-700 text-white"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Ou continuer avec
                </span>
              </div>
            </div>
            <GoogleLoginButton />
            <div className="text-center text-sm">
              Pas encore de compte ?{" "}
              <Link to="/Register" className="text-[#3ea666] hover:underline hover:text-lisiGold">
                S'inscrire
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
   </AuthLayout>
   
  );
} 