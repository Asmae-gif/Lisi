// Interface pour les entités partagée
export interface Entity {
  id: number;
  name?: string;
  title?: string;
  title_fr?: string;
  name_fr?:string;
  nom_fr?:string;
  titre_publication_fr:string;
  titre_fr:string;
  // Champs spécifiques
  titre_publication?: string;
  titre_projet?: string;
  nom_partenaire?: string;
  nom_prix?: string;
  nom?: string;
}

// Types d'entités avec libellés pour les formulaires
export const galleriesableTypesWithOptions = [
  { value: "projet", label: "projet" },
  { value: "Partenariats", label: "Partenariat" },
  { value: "Axes de recherche", label: "Axe de recherche" },
  { value: "Publications", label: "Publication" },
  { value: "Prix de distinction", label: "Prix de distinction" }
];

// Simple tableau des types d'entités
export const galleriesableTypes = galleriesableTypesWithOptions.map(t => t.value);

/**
 * Obtient le nom d'affichage d'une entité en fonction de son type et de son ID.
 * @param type Le type de l'entité (ex: 'Publications').
 * @param id L'ID de l'entité.
 * @param entities Un enregistrement de listes d'entités où chercher.
 * @returns Le nom de l'entité ou son ID si non trouvé.
 */
export const getEntityName = (
  type: string, 
  id: number,
  entities: Record<string, Entity[]>
): string => {
  const entityList = entities[type] || [];
  const entity = entityList.find(e => e.id === id);
  if (entity) {
    // Gérer les différents formats selon le type d'entité
    switch (type) {
      case 'Publications':
        return entity.titre_publication_fr  || `ID: ${id}`;
      case 'projet':
        return entity.name_fr || `ID: ${id}`;
      case 'Partenariats':
        return entity.nom_fr || `ID: ${id}`;
      case 'Axes de recherche':
        return entity.title_fr || `ID: ${id}`;
      case 'Prix de distinction':
        return entity.title_fr || `ID: ${id}`;
      default:
        return entity.title_fr || `ID: ${id}`;
    }
  }
  return `ID: ${id}`;
}; 