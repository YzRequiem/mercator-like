import { json } from '@sveltejs/kit';

export async function GET() {
	const apiEndpoints = {
		info: {
			title: 'API Mercator-like',
			description: "API REST pour la gestion de l'architecture d'entreprise",
			version: '1.0.0'
		},
		endpoints: {
			'/api/stats': {
				GET: 'Récupérer les statistiques générales'
			},
			'/api/etablissements': {
				GET: 'Lister tous les établissements',
				POST: 'Créer un nouvel établissement'
			},
			'/api/etablissements/{id}': {
				GET: 'Récupérer un établissement par ID',
				PUT: 'Mettre à jour un établissement',
				DELETE: 'Supprimer un établissement'
			},
			'/api/processus': {
				GET: 'Lister tous les processus',
				POST: 'Créer un nouveau processus'
			},
			'/api/processus/{id}': {
				GET: 'Récupérer un processus par ID',
				PUT: 'Mettre à jour un processus',
				DELETE: 'Supprimer un processus'
			},
			'/api/acteurs': {
				GET: 'Lister tous les acteurs',
				POST: 'Créer un nouvel acteur'
			},
			'/api/acteurs/{id}': {
				GET: 'Récupérer un acteur par ID',
				PUT: 'Mettre à jour un acteur',
				DELETE: 'Supprimer un acteur'
			},
			'/api/ecosysteme': {
				GET: "Lister tous les éléments de l'écosystème",
				POST: "Créer un nouvel élément d'écosystème"
			},
			'/api/ecosysteme/{id}': {
				GET: "Récupérer un élément d'écosystème par ID",
				PUT: "Mettre à jour un élément d'écosystème",
				DELETE: "Supprimer un élément d'écosystème"
			},
			'/api/fonctions': {
				GET: 'Lister toutes les fonctions',
				POST: 'Créer une nouvelle fonction'
			},
			'/api/fonctions/{id}': {
				GET: 'Récupérer une fonction par ID',
				PUT: 'Mettre à jour une fonction',
				DELETE: 'Supprimer une fonction'
			},
			'/api/applications': {
				GET: 'Lister toutes les applications',
				POST: 'Créer une nouvelle application'
			},
			'/api/applications/{id}': {
				GET: 'Récupérer une application par ID',
				PUT: 'Mettre à jour une application',
				DELETE: 'Supprimer une application'
			},
			'/api/donnees': {
				GET: 'Lister toutes les données',
				POST: 'Créer une nouvelle donnée'
			},
			'/api/donnees/{id}': {
				GET: 'Récupérer une donnée par ID',
				PUT: 'Mettre à jour une donnée',
				DELETE: 'Supprimer une donnée'
			},
			'/api/infrastructure': {
				GET: "Lister toute l'infrastructure",
				POST: "Créer un nouvel élément d'infrastructure"
			},
			'/api/infrastructure/{id}': {
				GET: "Récupérer un élément d'infrastructure par ID",
				PUT: "Mettre à jour un élément d'infrastructure",
				DELETE: "Supprimer un élément d'infrastructure"
			},
			'/api/incidents': {
				GET: 'Lister tous les incidents (avec filtres optionnels: ?impact=...&statut=...)',
				POST: 'Créer un nouvel incident'
			},
			'/api/incidents/{id}': {
				GET: 'Récupérer un incident par ID',
				PUT: 'Mettre à jour un incident',
				DELETE: 'Supprimer un incident'
			},
			'/api/securite': {
				GET: 'Récupérer les données de sécurité globales',
				PUT: 'Mettre à jour les données de sécurité globales'
			},
			'/api/init-db': {
				GET: 'Initialiser la base de données (créer les tables)'
			},
			'/api/migrate-data': {
				POST: 'Migrer les données JSON vers la base de données'
			}
		},
		examples: {
			'Créer un établissement': {
				method: 'POST',
				url: '/api/etablissements',
				body: {
					id: 'etab-001',
					nom: 'Siège Social',
					code: 'SS',
					adresse: '123 Rue Example',
					statut: 'Actif',
					surface: '1000 m²',
					collaborateurs: '150',
					activites: ['Administration', 'Direction'],
					equipements: ['Serveurs', 'Réseau'],
					risques: ['Incendie', 'Inondation'],
					statut_operationnel: 'Opérationnel'
				}
			},
			'Filtrer les incidents': {
				method: 'GET',
				url: '/api/incidents?impact=Critique&statut=Ouvert',
				description: 'Récupérer tous les incidents critiques ouverts'
			}
		}
	};

	return json(apiEndpoints);
}
