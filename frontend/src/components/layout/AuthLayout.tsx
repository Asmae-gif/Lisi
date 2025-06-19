import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLogoConfig } from '@/config/logos';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { i18n } = useTranslation();
  const logoConfig = getLogoConfig(i18n.language);

  const handleLogoError = (e) => {
    if (i18n.language === 'ar') {
      e.currentTarget.src = "/images/logoen.png";
    }
  };

  return (
    <div className="bg-white shadow-lg sticky top-0 z-50 min-h-screen flex flex-col">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
        <Link to="/">
          <img
            src={logoConfig.src}
            alt={logoConfig.alt}
            className="w-32"
            onError={handleLogoError}
          />
        </Link>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="pt-8 px-6 py-4 mb-4 md:mb-0 text-sm text-gray-500">
        <p>&copy; 2025 LISI - Laboratoire d'Informatique et de Systèmes Intelligents.</p>
      </footer>
    </div>
  );
}