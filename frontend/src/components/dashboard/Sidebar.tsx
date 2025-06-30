import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Settings, Contact, Image, Building2, FolderKanban, Award, User } from 'lucide-react';
import Header from './Header';

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Tableau de bord' },
    { path: '/dashboard/parametres', icon: Settings, label: 'Paramètres' },
    { path: '/dashboard/membres', icon: Users, label: 'Membres' },
    { path: '/dashboard/axes', icon: FileText, label: 'Axes' },
    { path: '/dashboard/projets', icon: FolderKanban, label: 'Projets' },
    { path: '/dashboard/publications', icon: FileText, label: 'Publications' },
    { path: '/dashboard/prix-distinctions', icon: Award, label: 'Prix et Distinctions' },
    { path: '/dashboard/partenaires', icon: Building2, label: 'Partenaires' },
    { path: '/dashboard/mot-directeur', icon: User, label: 'Mot du Directeur' },
    { path: '/dashboard/contact', icon: Contact, label: 'Contact' },
    { path: '/dashboard/gallery', icon: Image, label: 'Galerie' },
    { path: '/dashboard/activity-reports', icon: FileText, label: 'Activités' },
  ];

  return (
    
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r-2 border-lisiGold flex flex-col">
      {/* Header fixe */}
    
      <div className="p-6 flex-shrink-0">
        <img src="/images/logofr.png" alt="Logo LISI" className="h-10 mb-4" />
        
      </div>
      
      {/* Navigation avec scroll */}
      <nav className="flex-1 overflow-y-auto">
        <div className="py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-lisiDark hover:bg-lisiGold/10 transition-colors duration-200 ${
                  isActive ? 'bg-lisiGold/20 border-l-4 border-lisiGreen' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3 text-lisiGold flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Footer optionnel pour plus d'espace */}
      <div className="p-4 flex-shrink-0 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2025 LISI
        </div>
      </div>
    </aside>
  );
} 