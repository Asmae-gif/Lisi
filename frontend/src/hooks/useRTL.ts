import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook personnalisé pour gérer la configuration RTL (Right-to-Left)
 * Configure automatiquement la direction du document et du body en fonction de la langue
 */
export const useRTL = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Configuration du document HTML
    if (isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.body.dir = 'rtl';
      document.body.lang = 'ar';
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = i18n.language;
      document.body.dir = 'ltr';
      document.body.lang = i18n.language;
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    // Nettoyage
    return () => {
      document.body.classList.remove('rtl', 'ltr');
    };
  }, [i18n.language, isRTL]);

  return {
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left',
    language: i18n.language,
    // Fonctions utilitaires pour les classes CSS
    getDirectionClass: () => isRTL ? 'rtl' : 'ltr',
    getTextAlignClass: () => isRTL ? 'text-right' : 'text-left',
    getFlexDirectionClass: () => isRTL ? 'flex-row-reverse' : 'flex-row',
    getMarginClass: (side: 'left' | 'right', size: string) => {
      if (side === 'left') {
        return isRTL ? `mr-${size}` : `ml-${size}`;
      } else {
        return isRTL ? `ml-${size}` : `mr-${size}`;
      }
    },
    getPaddingClass: (side: 'left' | 'right', size: string) => {
      if (side === 'left') {
        return isRTL ? `pr-${size}` : `pl-${size}`;
      } else {
        return isRTL ? `pl-${size}` : `pr-${size}`;
      }
    }
  };
}; 