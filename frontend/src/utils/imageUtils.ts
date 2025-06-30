/**
 * Utilitaires pour la gestion des images
 */

/**
 * Interface pour les variables d'environnement
 */
export interface ImageConfig {
  apiBaseUrl?: string;
  defaultFallbackUrl?: string;
}

/**
 * Construit une URL complète pour une image
 * @param path - Chemin relatif de l'image
 * @param config - Configuration optionnelle avec les variables d'environnement
 * @returns URL complète de l'image
 */
export const buildImageUrl = (
  path: string | null | undefined, 
  config?: ImageConfig
): string => {
  if (!path) {
    return config?.defaultFallbackUrl || 'https://via.placeholder.com/400x300?text=Image+non+disponible';
  }
  
  if (path.startsWith('/') || path.startsWith('http')) {
    return path;
  }
  
  const baseUrl = config?.apiBaseUrl || 'http://localhost:8000';
  return `${baseUrl}/storage/${path}`;
};

/**
 * Version wrapper qui utilise les variables d'environnement par défaut
 * @param path - Chemin relatif de l'image
 * @returns URL complète de l'image
 */
export const buildImageUrlWithDefaults = (path: string | null | undefined): string => {
  return buildImageUrl(path);
};

/**
 * Vérifie si une image existe
 * @param imageUrl - URL de l'image
 * @returns Promise<boolean>
 */
export const checkImageExists = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Valide si une URL est une URL d'image valide
 * @param url - URL à valider
 * @returns boolean
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const pathname = urlObj.pathname.toLowerCase();
    
    // Vérifier si l'URL se termine par une extension d'image
    const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext));
    
    // Vérifier si l'URL contient des mots-clés d'image
    const hasImageKeywords = /image|img|logo|icon|photo/.test(pathname);
    
    return hasImageExtension || hasImageKeywords;
  } catch {
    return false;
  }
};

/**
 * Génère une URL d'image de fallback pour un partenaire
 * @param partenaireName - Nom du partenaire
 * @param width - Largeur de l'image (défaut: 300)
 * @param height - Hauteur de l'image (défaut: 150)
 * @returns URL d'image de fallback
 */
export const generateFallbackLogo = (partenaireName: string, width: number = 300, height: number = 150): string => {
  const colors = [
    'FF6B35', // Orange INWI
    '2563EB', // Bleu
    '059669', // Vert
    '7C3AED', // Violet
    'DC2626', // Rouge
    'EA580C', // Orange
    '0891B2', // Cyan
    '4F46E5', // Indigo
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const encodedName = encodeURIComponent(partenaireName);
  
  return `https://via.placeholder.com/${width}x${height}/${randomColor}/FFFFFF?text=${encodedName}`;
};

/**
 * Gère l'erreur de chargement d'image avec fallback automatique
 * @param event - Événement d'erreur
 * @param fallbackUrl - URL de fallback personnalisée
 * @param partenaireName - Nom du partenaire pour générer un fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>, 
  fallbackUrl?: string,
  partenaireName?: string
) => {
  const img = event.target as HTMLImageElement;
  
  if (fallbackUrl) {
    img.src = fallbackUrl;
  } else if (partenaireName) {
    img.src = generateFallbackLogo(partenaireName);
  } else {
    img.src = DEFAULT_IMAGE_FALLBACK;
  }
};

/**
 * URL de fallback pour les images (image simple et fiable)
 */
export const DEFAULT_IMAGE_FALLBACK = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";

/**
 * Utilise le proxy backend pour servir une image externe
 * @param imageUrl - URL de l'image externe
 * @returns URL du proxy
 */
export const getProxiedImageUrl = (imageUrl: string): string => {
  const baseUrl = 'http://localhost:8000';
  const encodedUrl = encodeURIComponent(imageUrl);
  return `${baseUrl}/api/proxy-image?url=${encodedUrl}`;
};

/**
 * Construit une URL d'image avec fallback automatique
 * @param imageUrl - URL de l'image
 * @param fallbackText - Texte pour le fallback
 * @returns URL d'image avec gestion d'erreur
 */
export const getSafeImageUrl = (imageUrl: string | null | undefined, fallbackText: string = 'Logo'): string => {
  if (!imageUrl) {
    return generateFallbackLogo(fallbackText);
  }
  
  // Si c'est déjà une URL de placeholder, la retourner directement
  if (imageUrl.includes('via.placeholder.com')) {
    return imageUrl;
  }
  
  // Pour les autres URLs, utiliser le proxy
  return getProxiedImageUrl(imageUrl);
}; 