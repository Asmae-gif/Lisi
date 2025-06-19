# Guide des Migrations - Projets Incube et Finance

## 📋 Structure des tables

### 1. Table principale : `projects` (avec type_projet enum)
```sql
CREATE TABLE projects (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    type_projet ENUM('finance', 'incube') DEFAULT 'finance',
    date_debut DATE NULL,
    date_fin DATE NULL,
    status ENUM('en_attente', 'en_cours', 'suspendu', 'termine', 'annule', 'publie', 'archive', 'rejete') DEFAULT 'en_attente',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 2. Table alternative : `projets` (avec tables liées)
```sql
CREATE TABLE projets (
    id BIGINT PRIMARY KEY,
    titre_projet VARCHAR(255),
    description_projet TEXT,
    date_debut DATE,
    date_fin DATE NULL,
    statut_projet VARCHAR(255),
    type_projet ENUM('finance', 'incube') DEFAULT 'finance',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 3. Table des financements : `projet_finances`
```sql
CREATE TABLE projet_finances (
    id BIGINT PRIMARY KEY,
    projet_id BIGINT,
    financeur VARCHAR(255),
    montant DECIMAL(12,2),
    type_financement VARCHAR(255),
    date_financement DATE NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (projet_id) REFERENCES projets(id) ON DELETE CASCADE
);
```

### 4. Table des incubations : `projet_incubes`
```sql
CREATE TABLE projet_incubes (
    id BIGINT PRIMARY KEY,
    projet_id BIGINT,
    incubateur VARCHAR(255),
    lieu_incubation VARCHAR(255) NULL,
    accompagnateur VARCHAR(255) NULL,
    date_entree DATE NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (projet_id) REFERENCES projets(id) ON DELETE CASCADE
);
```

## 🔗 Relations entre les modèles

### Modèle `Projet`
```php
class Projet extends Model
{
    // Relations
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
    // Relation
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }
}
```

### Modèle `ProjetIncube`
```php
class ProjetIncube extends Model
{
    // Relation
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }
}
```

## 📝 Utilisation

### Créer un projet avec financement
```php
$projet = Projet::create([
    'titre_projet' => 'Mon Projet',
    'description_projet' => 'Description du projet',
    'date_debut' => '2024-01-01',
    'date_fin' => '2024-12-31',
    'statut_projet' => 'en_cours',
    'type_projet' => 'finance'
]);

$financement = ProjetFinance::create([
    'projet_id' => $projet->id,
    'financeur' => 'Banque XYZ',
    'montant' => 50000.00,
    'type_financement' => 'Prêt',
    'date_financement' => '2024-01-15'
]);
```

### Créer un projet avec incubation
```php
$projet = Projet::create([
    'titre_projet' => 'Mon Projet Incubé',
    'description_projet' => 'Description du projet',
    'date_debut' => '2024-01-01',
    'date_fin' => '2024-12-31',
    'statut_projet' => 'en_cours',
    'type_projet' => 'incube'
]);

$incubation = ProjetIncube::create([
    'projet_id' => $projet->id,
    'incubateur' => 'Incubateur ABC',
    'lieu_incubation' => 'Paris',
    'accompagnateur' => 'Jean Dupont',
    'date_entree' => '2024-01-15'
]);
```

### Récupérer un projet avec ses relations
```php
// Projet avec financements
$projet = Projet::with('finances')->find(1);

// Projet avec incubations
$projet = Projet::with('incubations')->find(1);

// Projet avec toutes les relations
$projet = Projet::with(['finances', 'incubations'])->find(1);
```

## 🎯 Systèmes disponibles

### Système 1 : Table `projects` (utilisé par le frontend actuel)
- Utilise le champ `type_projet` enum
- Gère les dates directement dans la table principale
- Plus simple pour les projets basiques

### Système 2 : Table `projets` + tables liées
- Permet des informations détaillées sur les financements
- Permet des informations détaillées sur les incubations
- Plus flexible pour les projets complexes

## ✅ Migrations exécutées

- ✅ `2024_03_19_create_projects_table.php` - Table projects
- ✅ `2024_05_11_192247_create_projets_table.php` - Table projets
- ✅ `2025_06_12_175146_add_type_projet_to_projects_table.php` - Type projet pour projects
- ✅ `2025_06_12_175351_add_type_projet_to_projets_table.php` - Type projet pour projets
- ✅ `2025_06_12_210823_add_dates_to_projects_table.php` - Dates pour projects
- ✅ `2025_06_12_220256_create_projet_finances_table.php` - Table financements
- ✅ `2025_06_12_220318_create_projet_incubes_table.php` - Table incubations

## 🚀 Prochaines étapes

1. **Frontend** : Adapter l'interface pour utiliser le système approprié
2. **API** : Créer des endpoints pour gérer les financements et incubations
3. **Validation** : Ajouter des règles de validation appropriées
4. **Tests** : Créer des tests pour vérifier le bon fonctionnement 