# Interface d'Administration CRUD - Mercator-like

## Vue d'ensemble

L'interface d'administration de Mercator-like offre une solution complète de gestion CRUD (Create, Read, Update, Delete) pour toutes les entités de votre système d'information.

## Fonctionnalités principales

### 🏠 Tableau de bord

- Vue d'ensemble avec statistiques en temps réel
- Compteurs pour chaque type d'entité
- Actions rapides vers les principales fonctionnalités
- Design moderne et responsive

### 🗂️ Gestion complète des entités

L'interface permet de gérer **9 types d'entités** :

1. **🏢 Établissements** - Sites et localisations
2. **⚙️ Processus** - Processus métier
3. **👥 Acteurs** - Utilisateurs et rôles
4. **💻 Applications** - Logiciels et systèmes
5. **🏗️ Infrastructure** - Équipements techniques
6. **⚠️ Incidents** - Problèmes et pannes
7. **🔧 Fonctions** - Fonctionnalités système
8. **📊 Données** - Données et informations
9. **🌐 Écosystème** - Partenaires et relations

### ✨ Fonctionnalités CRUD

Pour chaque entité, vous pouvez :

- **Créer** de nouvelles entrées avec formulaires dynamiques
- **Lire** et afficher les données dans des tableaux triables
- **Modifier** les entrées existantes
- **Supprimer** des entrées avec confirmation
- **Rechercher** dans les données en temps réel
- **Trier** par colonnes
- **Filtrer** les résultats

### 🔧 Outils d'administration

- **Testeur API** - Interface pour tester tous les endpoints
- **Documentation** - Guide complet de l'API
- **Migration** - Outils de migration des données

## Technologies utilisées

- **Frontend** : Svelte/SvelteKit
- **Base de données** : Turso (libSQL)
- **API** : RESTful avec endpoints complets
- **Styling** : CSS moderne avec Flexbox/Grid
- **Notifications** : Système de toast intégré

## Structure des composants

```
src/lib/components/
├── CrudManager.svelte      # Composant CRUD générique
├── AdminDashboard.svelte   # Tableau de bord principal
├── ApiTester.svelte        # Testeur d'API
├── LoadingSpinner.svelte   # Indicateur de chargement
├── ToastContainer.svelte   # Notifications
└── Toast.svelte           # Toast individuel
```

## Utilisation

1. **Accéder à l'interface** : `/admin`
2. **Naviguer** entre les différentes entités via les onglets
3. **Créer** : Bouton "Nouveau" + formulaire modal
4. **Modifier** : Icône crayon sur chaque ligne
5. **Supprimer** : Icône corbeille avec confirmation
6. **Rechercher** : Zone de recherche en temps réel

## API REST

Chaque entité dispose d'endpoints complets :

```
GET    /api/{entité}      # Liste toutes les entrées
POST   /api/{entité}      # Crée une nouvelle entrée
GET    /api/{entité}/[id] # Récupère une entrée spécifique
PUT    /api/{entité}/[id] # Met à jour une entrée
DELETE /api/{entité}/[id] # Supprime une entrée
```

## Sécurité et validation

- Validation côté client avec messages d'erreur
- Champs obligatoires marqués visuellement
- Confirmation pour les suppressions
- Gestion d'erreurs robuste avec notifications

## Responsive design

- Interface adaptée mobile/tablette/desktop
- Grilles responsives
- Navigation optimisée pour tous les écrans
- Modales adaptatives

## Accessibilité

- Navigation au clavier
- Rôles ARIA appropriés
- Contrastes respectés
- Labels explicites

---

Cette interface d'administration offre une solution complète et moderne pour la gestion de votre système d'information Mercator-like.
