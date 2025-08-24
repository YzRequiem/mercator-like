# 🗺️ Mercator-like - API CRUD

Application de cartographie d'entreprise avec API REST complète, construite avec SvelteKit et Turso.

## 🚀 Fonctionnalités

- **API REST complète** : CRUD pour 11 entités métier
- **Base de données cloud** : Turso (libSQL) pour la persistance
- **Client TypeScript** : SDK typé pour faciliter l'intégration
- **Interface de test** : Composants Svelte pour tester l'API
- **Documentation automatique** : Endpoint `/api` avec documentation complète

## 📊 Entités gérées

| Entité         | Endpoint              | Description              |
| -------------- | --------------------- | ------------------------ |
| Établissements | `/api/etablissements` | Sites et bureaux         |
| Processus      | `/api/processus`      | Processus métier         |
| Acteurs        | `/api/acteurs`        | Parties prenantes        |
| Applications   | `/api/applications`   | Applications logicielles |
| Infrastructure | `/api/infrastructure` | Équipements IT           |
| Incidents      | `/api/incidents`      | Incidents de sécurité    |
| Fonctions      | `/api/fonctions`      | Fonctions métier         |
| Données        | `/api/donnees`        | Actifs de données        |
| Écosystème     | `/api/ecosysteme`     | Partenaires externes     |
| Sécurité       | `/api/securite`       | Métriques de sécurité    |

## 🛠️ Installation

1. **Cloner le repository**

```bash
git clone <repository-url>
cd mercator-like
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer l'environnement**

```bash
cp .env.example .env
# Modifier .env avec vos credentials Turso
```

4. **Démarrer le serveur de développement**

```bash
pnpm dev
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` avec :

```env
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your_auth_token_here
PUBLIC_API_BASE_URL=http://localhost:5173/api
```

### Base de données Turso

1. Créez un compte sur [turso.tech](https://turso.tech/)
2. Créez une nouvelle base de données
3. Récupérez l'URL et le token d'authentification
4. Configurez les variables d'environnement

## 📡 API Reference

### Endpoints disponibles

Tous les endpoints suivent le pattern REST standard :

- `GET /api/{resource}` : Liste tous les éléments
- `POST /api/{resource}` : Crée un nouvel élément
- `GET /api/{resource}/{id}` : Récupère un élément spécifique
- `PUT /api/{resource}/{id}` : Met à jour un élément
- `DELETE /api/{resource}/{id}` : Supprime un élément

### Format des réponses

```typescript
// Succès
{
  "success": true,
  "data": {...} | [...]
}

// Erreur
{
  "success": false,
  "error": "Message d'erreur"
}
```

### Utilisation du client TypeScript

```typescript
import { apiClient } from '$lib/apiClient';

// Récupérer tous les établissements
const response = await apiClient.getEtablissements();
if (response.success) {
	console.log(response.data);
}

// Créer un nouvel établissement
await apiClient.createEtablissement({
	nom: 'Nouvel établissement',
	code: 'NEW001',
	adresse: '123 Rue Example'
});
```

## 🧪 Tests

### Interface de test

Accédez à `/test` pour une interface complète de test de l'API.

### Script de test automatisé

```bash
node test-api.js [base-url]
```

### Tests manuels avec curl

```bash
# Tester la documentation
curl http://localhost:5173/api

# Lister les établissements
curl http://localhost:5173/api/etablissements

# Créer un établissement
curl -X POST http://localhost:5173/api/etablissements \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","code":"TEST001"}'
```

## 📁 Structure du projet

```
src/
├── lib/
│   ├── database.ts          # Client Turso et types
│   ├── apiClient.ts         # Client API TypeScript
│   └── components/
│       ├── EtablissementsManager.svelte
│       └── ApiTester.svelte
├── routes/
│   ├── api/                 # Endpoints API REST
│   │   ├── +server.ts       # Documentation API
│   │   ├── etablissements/
│   │   ├── processus/
│   │   └── ...
│   ├── test/
│   │   └── +page.svelte     # Interface de test
│   └── +page.svelte         # Page d'accueil
└── app.html
```

## 🔒 Sécurité

- Validation des données entrantes
- Gestion d'erreurs robuste
- Variables d'environnement pour les secrets
- Requêtes SQL préparées via libSQL

## 🚀 Déploiement

### Build de production

```bash
pnpm build
```

### Prévisualisation

```bash
pnpm preview
```

### Déploiement

Le projet peut être déployé sur :

- Vercel
- Netlify
- Cloudflare Pages
- Node.js servers

Consultez la [documentation SvelteKit](https://kit.svelte.dev/docs/adapters) pour les adaptateurs.

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- Documentation API : `/api`
- Interface de test : `/test`
- Issues GitHub : [Créer un issue](https://github.com/your-repo/issues)
