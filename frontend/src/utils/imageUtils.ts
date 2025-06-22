/**
 * Utilitaires pour la gestion des images
 */

// URL de base de l'API (à ajuster selon votre configuration)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Construit une URL complète pour une image
 * @param path - Chemin relatif de l'image
 * @returns URL complète de l'image
 */
export const buildImageUrl = (path: string | null | undefined): string => {
  if (!path) {
    return 'https://via.placeholder.com/400x300?text=Image+non+disponible';
  }
  
  if (path.startsWith('/') || path.startsWith('http')) {
    return path;
  }
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${baseUrl}/storage/${path}`;
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
 * Gère l'erreur de chargement d'image
 * @param event - Événement d'erreur
 * @param fallbackUrl - URL de fallback
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) => {
  const img = event.target as HTMLImageElement;
  if (fallbackUrl) {
    img.src = fallbackUrl;
  } else {
    // Masquer l'image si pas de fallback
    img.style.display = 'none';
  }
};

/**
 * URL de fallback pour les images (image simple et fiable)
 */
export const DEFAULT_IMAGE_FALLBACK = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=="; 