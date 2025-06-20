import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useLaravelApi } from "./hooks/useLaravelApi";
import { Layout } from './components/dashboard/layout'
import { ThemeProvider } from './lib/theme'
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProfileMembre from "./pages/ProfileMembre";
import { AuthProvider } from './components/contexts/AuthContext';
import Dashboard from './pages/dashboard/Dashboard'
import MembersTable from './pages/dashboard/Membres/MembersTable'
import EquipesTable from './pages/dashboard/EquipesTable'
import AxesDashboard from './pages/dashboard/Axes/AxesDashboard'
import ProtectedRoute from './components/dashboard/ProtectedRoute';
import SettingsRecherche from "@/pages/Parametres/SettingsRecherche";
import SettingsMembres from "@/pages/Parametres/SettingsMembres";
import SettingsIndex from "./pages/dashboard/Parametres/SettingsIndex";
import Contact from "./pages/Contact";
import SettingsContact from "./pages/Parametres/SettingsContact";
import ContactDashboard from "./pages/dashboard/ContactDashboard";
import Gallery from "./pages/dashboard/Gallery";
import Gallerie from "./pages/Gallerie";
import Membres from "./pages/Membres";
import Recherche from "./pages/Recherche";
import Equipes from "./archive/Equipes.tsx";
import MembreProfile from "./archive/MembreProfile.tsx";
import Parametres from "./pages/Parametres/parametres.tsx";
import Publications from './pages/dashboard/Publications';
import PublicPublications from './pages/Publications';
import Projets from './pages/dashboard/Projets';
import Projects from './pages/Projects';
import PartenairesDashboard from './pages/dashboard/Partenaires';
import Partenaires from './pages/Partenaires';
import Histoire from './pages/dashboard/Histoire';
import PrixDistinctionsDashboard from './pages/dashboard/PrixDistinctions';
import PrixDistinctions from './pages/PrixDistinctions';
import TestPage from './pages/TestPage';

const queryClient = new QueryClient();

const AppContent = () => {
  const { ensureCsrf } = useLaravelApi();

  useEffect(() => {
    ensureCsrf().catch(console.error);
  }, [ensureCsrf]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Routes publiques */}
        <Route path="/" element={<Index />} />
        <Route path="/index" element={<Index />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/membres" element={<Membres />} />
        <Route path="/recherche" element={<Recherche />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/membres/:id" element={<MembreProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallerie" element={<Gallerie />} />
        <Route path="/equipes" element={<Equipes/>}/>
        <Route path="/projects" element={<Projects />} />
        <Route path="/publications" element={<PublicPublications />} />
        <Route path="/prix-distinctions" element={<PrixDistinctions />} />
        <Route path="/partenaires" element={<Partenaires />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfileMembre />
            </ProtectedRoute>
          } 
        />

        {/* 🛡️ Zone Dashboard protégée avec layout + thème */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <Layout />
              </ThemeProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="membres" element={<ProtectedRoute><MembersTable /></ProtectedRoute>} />
          <Route path="equipes" element={<ProtectedRoute><EquipesTable /></ProtectedRoute>} />
          <Route path="axes" element={<ProtectedRoute><AxesDashboard /></ProtectedRoute>} />
          <Route path="parametres" element={<ProtectedRoute><Parametres /></ProtectedRoute>} />
          <Route path="settings-recherche" element={<ProtectedRoute><SettingsRecherche /></ProtectedRoute>} />
          <Route path="settings-equipe" element={<ProtectedRoute><SettingsMembres /></ProtectedRoute>} />
          <Route path="settings-index" element={<ProtectedRoute><SettingsIndex /></ProtectedRoute>} />
          <Route path="settings-contact" element={<ProtectedRoute><SettingsContact /></ProtectedRoute>} />
          <Route path="contact" element={<ProtectedRoute><ContactDashboard /></ProtectedRoute>} />
          <Route path="gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="publications" element={<ProtectedRoute><Publications /></ProtectedRoute>} />
          <Route path="projets" element={<ProtectedRoute><Projets /></ProtectedRoute>} />
          <Route path="partenaires" element={<ProtectedRoute><PartenairesDashboard /></ProtectedRoute>} />
          <Route path="histoire" element={<ProtectedRoute><Histoire /></ProtectedRoute>} />
          <Route path="prix-distinctions" element={<ProtectedRoute><PrixDistinctionsDashboard /></ProtectedRoute>} />
         
        </Route>

        {/* ❌ Page non trouvée */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
    