import React from 'react';

interface LogoProps {
  currentLanguage: string;
  getLogoConfig: (lang: string) => { src: string; alt: string };
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const Logo: React.FC<LogoProps> = ({ currentLanguage, getLogoConfig, onError }) => {
  const logoConfig = getLogoConfig(currentLanguage);
  return (
    <img
      src={logoConfig.src}
      alt={logoConfig.alt}
      className="h-16 w-auto logo-container footer-logo"
      onError={onError}
    />
  );
};

export default Logo; 