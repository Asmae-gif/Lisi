import React from 'react';
import { Globe, Moon, Search, Sun, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import { useTheme } from "../../lib/theme";
import { Notifications } from "./Notifications";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";


export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };


  return (
    <header className="flex items-center bg-white border-b-2 border-lisiGold p-4 shadow">
     

      <img src="/logo-lisi.png" alt="Logo LISI" className="h-12 mr-4" />
      <div>
        <h1 className="text-lisiGreen font-bold text-2xl">LISI</h1>
        <span className="text-lisiGold text-sm block">Laboratoire d'Informatique et de Systèmes Intelligents</span>
      </div>
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Changer le thème"
        >
          {theme === "light" ? (
            <Moon size={20} className="text-muted-foreground" />
          ) : (
            <Sun size={20} className="text-muted-foreground" />
          )}
        </button>
        <Notifications />
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center border-2 border-[hsl(var(--secondary))]">
              <User size={20} className="text-white" />
            </div>
            <span className="text-base font-medium text-[hsl(var(--primary))]">Admin</span>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg border py-2 z-50 animate-fade-in animate-slide-in">
              <a href="/profile" className="block px-4 py-2 text-sm hover:bg-[hsl(var(--muted))] transition-colors">Mon Profil</a>
              <a href="/parametres" className="block px-4 py-2 text-sm hover:bg-[hsl(var(--muted))] transition-colors">Paramètres</a>
              <hr className="my-1" />
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[hsl(var(--muted))] transition-colors">Déconnexion</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 