import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLogoConfig } from '@/config/logos';
import { navigationItems, languages } from '@/config/navigation';
import Logo from '@/components/ui/Logo';
import { useContactSettings } from '@/hooks/useContactSettings';
// Types
interface Language {
  code: string;
  flag: string;
  name: string;
}

interface NavigationItem {
  key: string;
  path: string;
  label: string;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
}

const Footer = () => {
  const { t, i18n } = useTranslation('header');
  const { t: tContact } = useTranslation('contact');
  const location = useLocation();
  const logoConfig = getLogoConfig(i18n.language);
  const { settings: contactSettings, loading: contactLoading } = useContactSettings();

  const handleLogoError = (e) => {
    if (i18n.language === 'ar') {
      e.currentTarget.src = "/images/logoen.png";
    }
  };

  return (
    <footer className="bg-[#437a49] border-t py-10 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between mb-12 items-center gap-8">
          <Link to="/" className="flex items-center space-x-4 logo-container">
            <Logo currentLanguage={i18n.language} getLogoConfig={getLogoConfig} onError={handleLogoError} />
          </Link>
          <nav className="flex flex-wrap gap-6 justify-center md:justify-start">
            {navigationItems.map((item) => (
              item.hasDropdown && item.dropdownItems ? (
                <div key={item.key}>
      <h4 className="text-lg font-medium mb-6 text-white">{t(item.label)}</h4>
      <ul className="space-y-3">
        {item.hasDropdown && item.dropdownItems ? (
          item.dropdownItems.map((dropdownItem) => (
            <li key={dropdownItem.key}>
              <Link
                to={dropdownItem.path}
                className="text-white/80 hover:text-white text-base transition-colors"
              >
                {t(dropdownItem.label)}
              </Link>
            </li>
          ))
        ) : (
          <li>
            <Link
              to={item.path}
              className="text-white/80 hover:text-white text-base transition-colors"
            >
              {t(item.label)}
            </Link>
          </li>
        )}
      </ul>
    </div>
              ) : (
                <Link
                  key={item.key}
                  to={item.path}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {t(item.label)}
                </Link>
              )
            ))}
          </nav>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-b border-white/10">
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            {contactLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-1/2"></div>
              </div>
            ) : contactSettings ? (
              <>
                {contactSettings[`contact_adresse_${i18n.language}` as keyof typeof contactSettings] && (
                  <p className="text-white/80 mb-2">
                    <strong>{tContact('Adresse')}:</strong> {contactSettings[`contact_adresse_${i18n.language}` as keyof typeof contactSettings]}
                  </p>
                )}
                {contactSettings.contact_telephone && (
                  <p className="text-white/80 mb-2">
                    <strong>{tContact('Téléphone')}:</strong> {contactSettings.contact_telephone}
                  </p>
                )}
                {contactSettings.contact_email && (
                  <p className="text-white/80">
                    <strong>{tContact('Email')}:</strong> {contactSettings.contact_email}
                  </p>
                )}
              </>
            ) : (
              <p className="text-white/60">Informations de contact non disponibles</p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a href="#" aria-label="LinkedIn" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-amber-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-amber-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-amber-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-amber-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Newsletter</h4>
            <p className="text-white/80 mb-4">Inscrivez-vous pour recevoir nos dernières actualités</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Votre email" 
                required 
                className="flex-grow px-4 py-2 bg-white/10 border border-white/20 rounded-l-md text-white focus:outline-none focus:border-amber-500"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-r-md transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            <p>&copy; 2025 LISI - Laboratoire d'Informatique et de Systèmes Intelligents. Tous droits réservés.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Mentions légales</a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Politique de confidentialité</a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Plan du site</a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Accessibilité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer;
