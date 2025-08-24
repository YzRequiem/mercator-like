-- Tables pour la couche Métier
CREATE TABLE IF NOT EXISTS etablissements (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    code TEXT NOT NULL,
    adresse TEXT,
    statut TEXT,
    surface TEXT,
    collaborateurs TEXT,
    activites TEXT, -- JSON array of strings
    equipements TEXT, -- JSON array of strings
    risques TEXT, -- JSON array of strings
    statut_operationnel TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processus (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    sous_processus TEXT, -- JSON array of sous-processus objects
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
    flux TEXT, -- JSON array of strings
    donnees TEXT, -- JSON array of strings
    statut TEXT,
    niveau_automatisation TEXT,
    frequence_utilisation TEXT,
    utilisateurs TEXT, -- JSON array of strings
    sites TEXT, -- JSON array of strings
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
    sites TEXT, -- JSON array of strings
    conformite TEXT,
    version TEXT,
    editeur TEXT,
    cout_annuel REAL,
    date_mise_en_service TEXT,
    risques TEXT, -- JSON array of strings
    fonctionnalites TEXT, -- JSON array of strings
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
    risques TEXT, -- JSON array of strings
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
    mesures_correctives TEXT, -- JSON array of strings
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS securite (
    id TEXT PRIMARY KEY DEFAULT 'global',
    niveau TEXT,
    score_global REAL,
    derniere_evaluation TEXT,
    mesures TEXT, -- JSON array of mesure objects
    manques TEXT, -- JSON array of manque objects
    incidents_total INTEGER,
    incidents_critiques INTEGER,
    incidents_majeurs INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_etablissements_code ON etablissements(code);
CREATE INDEX IF NOT EXISTS idx_acteurs_site ON acteurs(site);
CREATE INDEX IF NOT EXISTS idx_applications_criticite ON applications(criticite);
CREATE INDEX IF NOT EXISTS idx_incidents_statut ON incidents(statut);
CREATE INDEX IF NOT EXISTS idx_incidents_impact ON incidents(impact);
CREATE INDEX IF NOT EXISTS idx_infrastructure_statut ON infrastructure(statut);
CREATE INDEX IF NOT EXISTS idx_infrastructure_type ON infrastructure(type);
