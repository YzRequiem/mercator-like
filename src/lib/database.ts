import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';

// Fonction pour initialiser et obtenir le client Turso libSQL
function getClient() {
	const databaseUrl = env.TURSO_DATABASE_URL;
	const authToken = env.TURSO_AUTH_TOKEN;

	if (!databaseUrl || !authToken) {
		throw new Error('TURSO_DATABASE_URL et TURSO_AUTH_TOKEN doivent être définis dans .env');
	}

	return createClient({
		url: databaseUrl,
		authToken: authToken
	});
}

// Instance du client (créée à la demande)
let client: ReturnType<typeof createClient> | null = null;

export function getDb() {
	if (!client) {
		client = getClient();
	}
	return client;
}

// Types pour les tables de base de données
export interface DbEtablissement {
	id: string;
	nom: string;
	code: string;
	adresse: string;
	statut: string;
	surface: string;
	collaborateurs: string;
	activites: string; // JSON string
	equipements: string; // JSON string
	risques: string; // JSON string
	statut_operationnel: string;
	created_at?: string;
	updated_at?: string;
}

export interface DbProcessus {
	id: string;
	nom: string;
	sous_processus: string; // JSON string
	created_at?: string;
	updated_at?: string;
}

export interface DbActeur {
	id: string;
	nom: string;
	site: string;
	role: string;
	created_at?: string;
	updated_at?: string;
}

export interface DbEcosysteme {
	id: string;
	nom: string;
	type: string;
	relation: string;
	created_at?: string;
	updated_at?: string;
}

export interface DbFonction {
	id: string;
	nom: string;
	description: string;
	flux: string; // JSON string
	donnees: string; // JSON string
	statut: string;
	niveau_automatisation?: string;
	frequence_utilisation?: string;
	utilisateurs?: string; // JSON string
	sites?: string; // JSON string
	created_at?: string;
	updated_at?: string;
}

export interface DbApplication {
	id: string;
	nom: string;
	type: string;
	domaine: string;
	criticite: string;
	statut: string;
	users: string;
	sites: string; // JSON string
	conformite: string;
	version?: string;
	editeur?: string;
	cout_annuel?: number;
	date_mise_en_service?: string;
	risques: string; // JSON string
	fonctionnalites?: string; // JSON string
	created_at?: string;
	updated_at?: string;
}

export interface DbDonnee {
	id: string;
	nom: string;
	source: string;
	qualite: string;
	volume: string;
	frequence_maj?: string;
	proprietaire?: string;
	sensibilite?: string;
	retention?: string;
	format?: string;
	taille_estimee?: string;
	created_at?: string;
	updated_at?: string;
}

export interface DbInfrastructure {
	id: string;
	nom: string;
	type: string;
	localisation: string;
	statut: string;
	capacite?: string;
	utilisation?: string;
	redondance: string;
	modele?: string;
	date_installation?: string;
	garantie?: string;
	cout_acquisition?: number;
	maintenance?: string;
	bande_passante?: string;
	disponibilite?: string;
	fournisseur?: string;
	cout_mensuel?: number;
	sla?: string;
	nombre?: string;
	os?: string;
	age_moyen?: string;
	cout_total?: number;
	risques: string; // JSON string
	created_at?: string;
	updated_at?: string;
}

export interface DbIncident {
	id: string;
	nom: string;
	impact: string;
	date: string;
	statut: string;
	description?: string;
	duree?: string;
	cout_estime?: number;
	cause?: string;
	mesures_correctives?: string; // JSON string
	created_at?: string;
	updated_at?: string;
}

export interface DbSecurite {
	id: string;
	niveau: string;
	score_global?: number;
	derniere_evaluation?: string;
	mesures: string; // JSON string
	manques: string; // JSON string
	incidents_total: number;
	incidents_critiques?: number;
	incidents_majeurs?: number;
	created_at?: string;
	updated_at?: string;
}

// Fonctions utilitaires pour la conversion JSON
export const dbHelpers = {
	// Convertir un objet en string JSON pour la DB
	toJsonString: (obj: any): string => JSON.stringify(obj),

	// Convertir une string JSON de la DB en objet
	fromJsonString: <T>(str: string | null): T | null => {
		if (!str) return null;
		try {
			return JSON.parse(str) as T;
		} catch {
			return null;
		}
	},

	// Convertir un array en string JSON pour la DB
	arrayToJsonString: (arr: string[]): string => JSON.stringify(arr),

	// Convertir une string JSON de la DB en array
	jsonStringToArray: (str: string | null): string[] => {
		const result = dbHelpers.fromJsonString<string[]>(str);
		return result || [];
	}
};
