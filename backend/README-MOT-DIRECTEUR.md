# Guide d'utilisation - Mot du Directeur

## Problème résolu

L'erreur 500 lors de l'upload d'images dans le mot du directeur était causée par :
- La colonne `image` dans la base de données était limitée à 255 caractères
- Les images encodées en base64 peuvent être très longues (plusieurs milliers de caractères)

## Solution implémentée

### 1. Gestion des images
- Les images sont maintenant sauvegardées dans le dossier `storage/app/public/images/mot_directeur/`
- Seul le chemin de l'image est stocké dans la base de données (ex: `images/mot_directeur/mot_directeur_1234567890_abc123.jpg`)
- L'URL complète est accessible via l'attribut `image_url` du modèle

### 2. Gestion d'erreurs améliorée
- Toutes les méthodes du contrôleur sont maintenant protégées par des try-catch
- Les erreurs sont loggées pour faciliter le débogage
- Retour de réponses JSON cohérentes avec un champ `success`

### 3. Fonctionnalités ajoutées
- Suppression automatique des anciennes images lors de la mise à jour
- Génération de noms de fichiers uniques pour éviter les conflits
- Validation des images base64
- Nettoyage automatique lors de la suppression

## Utilisation

### Créer un mot du directeur avec image
```javascript
const formData = {
    titre: "Mon titre",
    contenu: "Mon contenu",
    nom_directeur: "Nom du directeur",
    poste: "Poste du directeur",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // Image encodée en base64
};

fetch('/api/mot-directeur', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
});
```

### Mettre à jour un mot du directeur
```javascript
const formData = {
    titre: "Nouveau titre",
    contenu: "Nouveau contenu",
    nom_directeur: "Nouveau nom",
    poste: "Nouveau poste",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." // Nouvelle image
};

fetch('/api/mot-directeur/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
});
```

### Récupérer un mot du directeur
```javascript
fetch('/api/mot-directeur')
    .then(response => response.json())
    .then(data => {
        console.log(data.data.image_url); // URL complète de l'image
        console.log(data.data.image); // Chemin relatif de l'image
    });
```

## Structure des réponses

### Succès
```json
{
    "success": true,
    "data": {
        "id": 1,
        "titre": "Mon titre",
        "contenu": "Mon contenu",
        "image": "images/mot_directeur/mot_directeur_1234567890_abc123.jpg",
        "image_url": "http://localhost:8000/storage/images/mot_directeur/mot_directeur_1234567890_abc123.jpg",
        "nom_directeur": "Nom du directeur",
        "poste": "Poste du directeur"
    },
    "message": "Mot du directeur créé avec succès"
}
```

### Erreur
```json
{
    "success": false,
    "message": "Erreur lors de la création du mot du directeur",
    "error": "Détails de l'erreur"
}
```

## Notes importantes

1. **Lien symbolique** : Assurez-vous que le lien symbolique est créé avec `php artisan storage:link`
2. **Permissions** : Le dossier `storage/app/public/images/mot_directeur/` doit être accessible en écriture
3. **Format d'image** : Les images doivent être encodées en base64 avec le préfixe `data:image/...`
4. **Taille d'image** : Évitez les images trop volumineuses (recommandé < 2MB)

## Dépannage

Si vous rencontrez encore des erreurs :
1. Vérifiez les logs Laravel : `storage/logs/laravel.log`
2. Assurez-vous que le dossier de stockage existe et est accessible
3. Vérifiez que le lien symbolique est créé correctement
4. Testez avec une image plus petite 