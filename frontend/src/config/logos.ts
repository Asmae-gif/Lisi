export const logoConfigs = {
  fr: {
    src: "/images/logofr.png",
    alt: "Logo LISI - Français"
  },
  en: {
    src: "/images/logoen.png",
    alt: "Logo LISI - English"
  },
  ar: {
    src: "/images/logoen.png",
    fallback: "/images/lisi-logo.png",
    alt: "Logo LISI - العربية"
  }
};

export const getLogoConfig = (language: string) => {
  return logoConfigs[language as keyof typeof logoConfigs] || logoConfigs.fr;
}; 