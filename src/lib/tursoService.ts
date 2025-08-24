import { getDb } from './database.js';
import type {
	DbEtablissement,
	DbProcessus,
	DbActeur,
	DbEcosysteme,
	DbFonction,
	DbApplication,
	DbDonnee,
	DbInfrastructure,
	DbIncident,
	DbSecurite
} from './database.js';

// Service pour les établissements
export async function getEtablissements(): Promise<DbEtablissement[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM etablissements ORDER BY nom');
	return result.rows as unknown as DbEtablissement[];
}

export async function getEtablissement(id: string): Promise<DbEtablissement | null> {
	const db = getDb();
	const result = await db.execute({
		sql: 'SELECT * FROM etablissements WHERE id = ?',
		args: [id]
	});
	return (result.rows[0] as unknown as DbEtablissement) || null;
}

// Service pour les processus
export async function getProcessus(): Promise<DbProcessus[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM processus ORDER BY nom');
	return result.rows as unknown as DbProcessus[];
}

// Service pour les acteurs
export async function getActeurs(): Promise<DbActeur[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM acteurs ORDER BY nom');
	return result.rows as unknown as DbActeur[];
}

// Service pour l'écosystème
export async function getEcosysteme(): Promise<DbEcosysteme[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM ecosysteme ORDER BY nom');
	return result.rows as unknown as DbEcosysteme[];
}

// Service pour les fonctions
export async function getFonctions(): Promise<DbFonction[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM fonctions ORDER BY nom');
	return result.rows as unknown as DbFonction[];
}

// Service pour les applications
export async function getApplications(): Promise<DbApplication[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM applications ORDER BY nom');
	return result.rows as unknown as DbApplication[];
}

// Service pour les données
export async function getDonnees(): Promise<DbDonnee[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM donnees ORDER BY nom');
	return result.rows as unknown as DbDonnee[];
}

// Service pour l'infrastructure
export async function getInfrastructure(): Promise<DbInfrastructure[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM infrastructure ORDER BY nom');
	return result.rows as unknown as DbInfrastructure[];
}

// Service pour les incidents
export async function getIncidents(): Promise<DbIncident[]> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM incidents ORDER BY date DESC');
	return result.rows as unknown as DbIncident[];
}

// Service pour la sécurité
export async function getSecurite(): Promise<DbSecurite | null> {
	const db = getDb();
	const result = await db.execute('SELECT * FROM securite WHERE id = ?', ['global']);
	return (result.rows[0] as unknown as DbSecurite) || null;
}

// Fonctions utilitaires pour les statistiques
export async function getStatistiques() {
	const db = getDb();

	// Compter les différents éléments
	const [
		etablissementsCount,
		processusCount,
		acteursCount,
		applicationsCount,
		infrastructureCount,
		incidentsCount
	] = await Promise.all([
		db.execute('SELECT COUNT(*) as count FROM etablissements'),
		db.execute('SELECT COUNT(*) as count FROM processus'),
		db.execute('SELECT COUNT(*) as count FROM acteurs'),
		db.execute('SELECT COUNT(*) as count FROM applications'),
		db.execute('SELECT COUNT(*) as count FROM infrastructure'),
		db.execute('SELECT COUNT(*) as count FROM incidents')
	]);

	// Incidents critiques (impact "Critique")
	const incidentsCritiques = await db.execute(
		'SELECT COUNT(*) as count FROM incidents WHERE impact = ?',
		['Critique']
	);

	return {
		etablissements: Number((etablissementsCount.rows[0] as any)?.count || 0),
		processus: Number((processusCount.rows[0] as any)?.count || 0),
		acteurs: Number((acteursCount.rows[0] as any)?.count || 0),
		applications: Number((applicationsCount.rows[0] as any)?.count || 0),
		infrastructure: Number((infrastructureCount.rows[0] as any)?.count || 0),
		incidents: Number((incidentsCount.rows[0] as any)?.count || 0),
		incidentsCritiques: Number((incidentsCritiques.rows[0] as any)?.count || 0)
	};
}

// Fonction pour vérifier si la base de données est initialisée
export async function isDatabaseInitialized(): Promise<boolean> {
	try {
		const db = getDb();
		await db.execute('SELECT COUNT(*) FROM etablissements LIMIT 1');
		return true;
	} catch (error) {
		return false;
	}
}
