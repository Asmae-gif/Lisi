# Guide des Relations - Projets, Financements et Incubations

## 📋 Structure des relations

### Tables principales
- **`projects`** : Table principale des projets (utilisée par le frontend)
- **`projet_finances`** : Détails des financements (liée à `projects`)
- **`projet_incubes`** : Détails des incubations (liée à `projects`)

### Relations
```
projects (1) ←→ (N) projet_finances
projects (1) ←→ (N) projet_incubes
```

## 🔗 Modèles et relations

### Modèle `Project`
```php
class Project extends Model
{
    public function finances()
    {
        return $this->hasMany(ProjetFinance::class);
    }

    public function incubations()
    {
        return $this->hasMany(ProjetIncube::class);
    }
}
```

### Modèle `ProjetFinance`
```php
class ProjetFinance extends Model
{
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
```

### Modèle `ProjetIncube`
```php
class ProjetIncube extends Model
{
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
```

## 🚀 API Endpoints

### Financements
- `GET /api/projet-finances` - Liste tous les financements
- `POST /api/projet-finances` - Créer un financement
- `GET /api/projet-finances/{id}` - Détails d'un financement
- `PUT /api/projet-finances/{id}` - Modifier un financement
- `DELETE /api/projet-finances/{id}` - Supprimer un financement
- `GET /api/projects/{projectId}/finances` - Financements d'un projet

### Incubations
- `GET /api/projet-incubes` - Liste toutes les incubations
- `POST /api/projet-incubes` - Créer une incubation
- `GET /api/projet-incubes/{id}` - Détails d'une incubation
- `PUT /api/projet-incubes/{id}` - Modifier une incubation
- `DELETE /api/projet-incubes/{id}` - Supprimer une incubation
- `GET /api/projects/{projectId}/incubes` - Incubations d'un projet

## 📝 Exemples d'utilisation

### Créer un projet avec financement
```php
// 1. Créer le projet
$project = Project::create([
    'name' => 'Mon Projet',
    'description' => 'Description du projet',
    'type_projet' => 'finance',
    'date_debut' => '2024-01-01',
    'date_fin' => '2024-12-31',
    'status' => 'en_cours'
]);

// 2. Ajouter un financement
$finance = ProjetFinance::create([
    'project_id' => $project->id,
    'financeur' => 'Banque XYZ',
    'montant' => 50000.00,
    'type_financement' => 'Prêt',
    'date_financement' => '2024-01-15'
]);
```

### Créer un projet avec incubation
```php
// 1. Créer le projet
$project = Project::create([
    'name' => 'Mon Projet Incubé',
    'description' => 'Description du projet',
    'type_projet' => 'incube',
    'date_debut' => '2024-01-01',
    'date_fin' => '2024-12-31',
    'status' => 'en_cours'
]);

// 2. Ajouter une incubation
$incube = ProjetIncube::create([
    'project_id' => $project->id,
    'incubateur' => 'Incubateur ABC',
    'lieu_incubation' => 'Paris',
    'accompagnateur' => 'Jean Dupont',
    'date_entree' => '2024-01-15'
]);
```

### Récupérer un projet avec ses relations
```php
// Projet avec financements
$project = Project::with('finances')->find(1);

// Projet avec incubations
$project = Project::with('incubations')->find(1);

// Projet avec toutes les relations
$project = Project::with(['finances', 'incubations'])->find(1);
```

## 🎯 Frontend Components

### Composants créés
- `ProjectFinanceForm.tsx` - Formulaire pour gérer les financements
- `ProjectIncubeForm.tsx` - Formulaire pour gérer les incubations

### Utilisation dans le frontend
```typescript
// Récupérer les financements d'un projet
const finances = await api.get(`/projects/${projectId}/finances`);

// Récupérer les incubations d'un projet
const incubes = await api.get(`/projects/${projectId}/incubes`);

// Créer un financement
const finance = await api.post('/projet-finances', {
    project_id: projectId,
    financeur: 'Banque XYZ',
    montant: 50000,
    type_financement: 'Prêt',
    date_financement: '2024-01-15'
});
```

## 🔧 Validation

### Financements
- `project_id` : requis, doit exister dans `projects`
- `financeur` : requis, max 255 caractères
- `montant` : requis, numérique, minimum 0
- `type_financement` : requis, max 255 caractères
- `date_financement` : optionnel, format date

### Incubations
- `project_id` : requis, doit exister dans `projects`
- `incubateur` : requis, max 255 caractères
- `lieu_incubation` : optionnel, max 255 caractères
- `accompagnateur` : optionnel, max 255 caractères
- `date_entree` : optionnel, format date

## ✅ Migrations exécutées

- ✅ `2025_06_12_220256_create_projet_finances_table.php` - Table financements
- ✅ `2025_06_12_220318_create_projet_incubes_table.php` - Table incubations

## 🚀 Prochaines étapes

1. **Frontend** : Intégrer les formulaires de financement et incubation
2. **Interface** : Ajouter des onglets pour les détails selon le type de projet
3. **Validation** : Ajouter des validations côté frontend
4. **Tests** : Créer des tests pour les nouvelles fonctionnalités 