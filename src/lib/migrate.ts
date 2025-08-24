import { getDb } from './database.js';

// Script SQL de création des tables
const createTablesSQL = `
-- Tables pour la couche Métier
CREATE TABLE IF NOT EXISTS etablissements (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    code TEXT NOT NULL,
    adresse TEXT,
    statut TEXT,
    surface TEXT,
    collaborateurs TEXT,
    activites TEXT,
    equipements TEXT,
    risques TEXT,
    statut_operationnel TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processus (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    sous_processus TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS acteurs (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    site TEXT,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ecosysteme (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    type TEXT,
    relation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tables pour la couche Fonctionnelle
CREATE TABLE IF NOT EXISTS fonctions (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    flux TEXT,
    donnees TEXT,
    statut TEXT,
    niveau_automatisation TEXT,
    frequence_utilisation TEXT,
    utilisateurs TEXT,
    sites TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tables pour la couche Applicative
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    type TEXT,
    domaine TEXT,
    criticite TEXT,
    statut TEXT,
    users TEXT,
    sites TEXT,
    conformite TEXT,
    version TEXT,
    editeur TEXT,
    cout_annuel REAL,
    date_mise_en_service TEXT,
    risques TEXT,
    fonctionnalites TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donnees (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    source TEXT,
    qualite TEXT,
    volume TEXT,
    frequence_maj TEXT,
    proprietaire TEXT,
    sensibilite TEXT,
    retention TEXT,
    format TEXT,
    taille_estimee TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tables pour la couche Technique
CREATE TABLE IF NOT EXISTS infrastructure (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    type TEXT,
    localisation TEXT,
    statut TEXT,
    capacite TEXT,
    utilisation TEXT,
    redondance TEXT,
    modele TEXT,
    date_installation TEXT,
    garantie TEXT,
    cout_acquisition REAL,
    maintenance TEXT,
    bande_passante TEXT,
    disponibilite TEXT,
    fournisseur TEXT,
    cout_mensuel REAL,
    sla TEXT,
    nombre TEXT,
    os TEXT,
    age_moyen TEXT,
    cout_total REAL,
    risques TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    impact TEXT,
    date TEXT,
    statut TEXT,
    description TEXT,
    duree TEXT,
    cout_estime REAL,
    cause TEXT,
    mesures_correctives TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS securite (
    id TEXT PRIMARY KEY DEFAULT 'global',
    niveau TEXT,
    score_global REAL,
    derniere_evaluation TEXT,
    mesures TEXT,
    manques TEXT,
    incidents_total INTEGER,
    incidents_critiques INTEGER,
    incidents_majeurs INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

export async function initializeDatabase() {
	console.log('Initialisation de la base de données...');

	const db = getDb();

	// Diviser et exécuter chaque commande SQL
	const statements = createTablesSQL
		.split(';')
		.map((stmt: string) => stmt.trim())
		.filter((stmt: string) => stmt.length > 0);

	for (const statement of statements) {
		try {
			await db.execute(statement);
			console.log(`✓ Table créée: ${statement.substring(0, 50).replace(/\s+/g, ' ')}...`);
		} catch (error) {
			console.error(`✗ Erreur lors de l'exécution: ${statement.substring(0, 50)}...`, error);
		}
	}

	console.log('✓ Tables créées avec succès');
	return true;
}

// Fonction utilitaire pour tester la connexion
export async function testConnection() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT 1 as test');
		console.log('✓ Connexion à la base de données réussie');
		return result;
	} catch (error) {
		console.error('✗ Erreur de connexion à la base de données:', error);
		throw error;
	}
}
