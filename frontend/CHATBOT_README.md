# 🤖 Système de Chatbot LISI

## Vue d'ensemble

Le système de chatbot du Laboratoire LISI est un assistant virtuel intelligent qui aide les visiteurs à comprendre et naviguer sur le site web. Il offre une traçabilité complète des interactions pour analyser les besoins des utilisateurs.

## 🚀 Fonctionnalités

### Interface Utilisateur
- **Bouton flottant** : Icône de chat visible sur toutes les pages
- **Interface moderne** : Design responsive avec animations fluides
- **Actions rapides** : Boutons prédéfinis pour les questions fréquentes
- **Indicateur de frappe** : Animation pendant que le bot "réfléchit"
- **Historique des messages** : Conservation de la conversation

### Intelligence Artificielle
- **Réponses contextuelles** : Compréhension des questions en français
- **Mots-clés intelligents** : Reconnaissance de différents types de questions
- **Réponses personnalisées** : Informations spécifiques au laboratoire LISI
- **Fallback intelligent** : Réponses par défaut pour les questions non reconnues

### Traçabilité et Analytics
- **Sessions utilisateur** : Suivi des conversations individuelles
- **Interactions détaillées** : Enregistrement de chaque message
- **Métriques de performance** : Temps de réponse, durée des sessions
- **Questions populaires** : Analyse des sujets les plus demandés
- **Statistiques quotidiennes** : Activité par jour

## 📊 Données Collectées

### Informations de Session
- ID de session unique
- Durée de la session
- Nombre total de messages
- URL de la page
- User-Agent du navigateur
- Horodatage de début/fin

### Interactions Utilisateur
- Message de l'utilisateur
- Réponse du bot
- Type d'interaction (message, action rapide, début de session)
- Temps de réponse
- Horodatage

## 🛠️ Architecture Technique

### Frontend (React + TypeScript)
```
frontend/src/components/
├── Chatbot.tsx              # Composant principal du chatbot
└── ChatbotAnalytics.ts      # Système de traçabilité
```

### Backend (Laravel + PHP)
```
backend/
├── app/Http/Controllers/Api/
│   └── ChatbotAnalyticsController.php  # Gestion des analytics
├── database/migrations/
│   ├── create_chatbot_interactions_table.php
│   └── create_chatbot_sessions_table.php
└── routes/api.php           # Routes API
```

### Base de Données
- **chatbot_interactions** : Stockage des messages et interactions
- **chatbot_sessions** : Informations sur les sessions utilisateur

## 📈 Dashboard d'Analytics

### Page d'Administration
- **URL** : `/dashboard/chatbot-analytics`
- **Accès** : Administrateurs uniquement
- **Fonctionnalités** :
  - Statistiques générales (sessions, interactions, durée moyenne)
  - Questions les plus populaires
  - Activité des 7 derniers jours
  - Actualisation en temps réel

### Métriques Disponibles
- Nombre total de sessions
- Nombre total d'interactions
- Durée moyenne des sessions
- Nombre moyen de messages par session
- Top 10 des questions les plus posées
- Activité quotidienne

## 🔧 Configuration

### Variables d'Environnement
Aucune configuration spéciale requise. Le système utilise :
- Les routes API existantes
- L'authentification Laravel Sanctum
- Les permissions d'administrateur

### Personnalisation des Réponses
Les réponses du bot sont définies dans `Chatbot.tsx` dans la fonction `generateBotResponse()` :

```typescript
const generateBotResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('laboratoire')) {
    return 'Le Laboratoire LISI est un centre de recherche...';
  }
  // Ajoutez d'autres conditions ici
};
```

## 🚀 Déploiement

### 1. Migrations de Base de Données
```bash
cd backend
php artisan migrate
```

### 2. Vérification des Routes
Les routes suivantes doivent être disponibles :
- `POST /api/chatbot/analytics`
- `POST /api/chatbot/session-summary`
- `GET /api/chatbot/stats` (admin uniquement)

### 3. Test du Système
1. Ouvrir le site web
2. Cliquer sur l'icône de chat (coin inférieur droit)
3. Tester quelques interactions
4. Vérifier les analytics dans le dashboard admin

## 📋 Questions Supportées

Le chatbot peut répondre aux questions suivantes :

### Informations Générales
- **Laboratoire LISI** : Description et mission
- **Qui êtes-vous** : Présentation de l'assistant
- **Bonjour/Salut** : Accueil personnalisé

### Contenu du Site
- **Projets** : Activités de recherche et développement
- **Publications** : Articles scientifiques et travaux
- **Membres/Équipe** : Composition de l'équipe
- **Prix et Distinctions** : Récompenses reçues
- **Galerie** : Photos et événements
- **Partenaires** : Collaborations

### Contact et Navigation
- **Contact** : Informations de contact
- **Adresse** : Localisation du laboratoire
- **Merci** : Réponse de politesse

## 🔒 Sécurité et Confidentialité

### Protection des Données
- Les données sont stockées localement
- Aucune information personnelle sensible n'est collectée
- Les sessions sont anonymisées
- Conformité RGPD

### Accès aux Analytics
- Réservé aux administrateurs
- Authentification requise
- Logs d'accès disponibles

## 🐛 Dépannage

### Problèmes Courants

1. **Chatbot ne s'affiche pas**
   - Vérifier que le composant est importé dans `App.tsx`
   - Contrôler les erreurs JavaScript dans la console

2. **Analytics ne fonctionnent pas**
   - Vérifier les migrations de base de données
   - Contrôler les logs Laravel
   - Tester les routes API

3. **Erreurs de build**
   - Vérifier les imports TypeScript
   - Contrôler les dépendances

### Logs et Debugging
- **Frontend** : Console du navigateur
- **Backend** : `storage/logs/laravel.log`
- **Base de données** : Vérifier les tables `chatbot_*`

## 🔮 Évolutions Futures

### Fonctionnalités Prévues
- **Intégration IA avancée** : OpenAI, Claude, etc.
- **Multilinguisme** : Support arabe et anglais
- **Chat en temps réel** : WebSockets
- **Export des données** : CSV, PDF
- **Notifications** : Alertes pour les admins

### Améliorations Techniques
- **Cache intelligent** : Réponses fréquentes
- **Machine Learning** : Amélioration des réponses
- **API externe** : Intégration avec d'autres services
- **Mobile** : Application dédiée

## 📞 Support

Pour toute question ou problème :
1. Consulter ce README
2. Vérifier les logs d'erreur
3. Contacter l'équipe de développement

---

**Développé pour le Laboratoire LISI**  
*Assistant virtuel intelligent pour une meilleure expérience utilisateur* 