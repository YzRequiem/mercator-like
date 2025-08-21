import metierData from '../data/metier.json';
import fonctionnelData from '../data/fonctionnel.json';
import applicatifData from '../data/applicatif.json';
import techniqueData from '../data/technique.json';

// Types pour les données
export interface SousProcessus {
	id: string;
	nom: string;
	acteurs: string[];
	sites: string[];
	description?: string;
}

export interface Processus {
	id: string;
	nom: string;
	sousProcessus: SousProcessus[];
}

export interface Acteur {
	id: string;
	nom: string;
	site: string;
	role: string;
	email?: string;
	statut: string;
}

export interface Ecosysteme {
	id: string;
	nom: string;
	type: string;
	relation: string;
	importance?: string;
	volume?: string;
}

export interface Etablissement {
	id: string;
	nom: string;
	code: string;
	adresse: string;
	ville?: string;
	codePostal?: string;
	statut: string;
	surface: string;
	collaborateurs: number;
	dateOuverture?: string;
	activites: string[];
	equipements: string[];
	risques: string[];
	statut_operationnel: string;
}

export interface Fonction {
	id: string;
	nom: string;
	description: string;
	flux: string[];
	donnees: string[];
	statut: string;
	niveau_automatisation?: string;
	frequence_utilisation?: string;
	utilisateurs?: string[];
	sites?: string[];
}

export interface Application {
	id: string;
	nom: string;
	type: string;
	domaine: string;
	criticite: string;
	statut: string;
	users: string;
	sites: string[];
	conformite: string;
	version?: string;
	editeur?: string;
	cout_annuel?: number;
	date_mise_en_service?: string;
	risques: string[];
	fonctionnalites?: string[];
}

export interface Donnee {
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
}

export interface Infrastructure {
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
	risques: string[];
}

export interface Incident {
	id: string;
	nom: string;
	impact: string;
	date: string;
	statut: string;
	description?: string;
	duree?: string;
	cout_estime?: number;
	cause?: string;
	mesures_correctives?: string[];
}

export interface Securite {
	niveau: string;
	score_global?: number;
	derniere_evaluation?: string;
	mesures: Array<{
		nom: string;
		statut: string;
		efficacite: string;
	}>;
	manques: Array<{
		nom: string;
		priorite: string;
		cout_estime: number;
	}>;
	incidents_total: number;
	incidents_critiques?: number;
	incidents_majeurs?: number;
	incidents?: number; // Alias pour incidents_total pour compatibilité
}

// Interface pour les données complètes
export interface MetierData {
	processus: Processus[];
	acteurs: Acteur[];
	ecosysteme: Ecosysteme[];
	etablissements: Etablissement[];
}

export interface FonctionnelData {
	fonctions: Fonction[];
}

export interface ApplicatifData {
	applications: Application[];
	donnees: Donnee[];
}

export interface TechniqueData {
	infrastructure: Infrastructure[];
	incidents: Incident[];
	securite: Securite;
}

// Service de gestion des données
export class DataService {
	private static instance: DataService;

	private metier: MetierData = metierData;
	private fonctionnel: FonctionnelData = fonctionnelData;
	private applicatif: ApplicatifData = applicatifData;
	private technique: TechniqueData = techniqueData;

	private constructor() {}

	public static getInstance(): DataService {
		if (!DataService.instance) {
			DataService.instance = new DataService();
		}
		return DataService.instance;
	}

	// Méthodes de lecture
	getMetierData(): MetierData {
		return this.metier;
	}

	getFonctionnelData(): FonctionnelData {
		return this.fonctionnel;
	}

	getApplicatifData(): ApplicatifData {
		return this.applicatif;
	}

	getTechniqueData(): TechniqueData {
		return this.technique;
	}

	// Méthodes pour la couche métier
	getProcessus(): Processus[] {
		return this.metier.processus;
	}

	getActeurs(): Acteur[] {
		return this.metier.acteurs;
	}

	getEcosysteme(): Ecosysteme[] {
		return this.metier.ecosysteme;
	}

	getEtablissements(): Etablissement[] {
		return this.metier.etablissements;
	}

	// Méthodes CRUD pour les établissements (exemple)
	addEtablissement(etablissement: Etablissement): void {
		this.metier.etablissements.push(etablissement);
	}

	updateEtablissement(id: string, etablissement: Partial<Etablissement>): boolean {
		const index = this.metier.etablissements.findIndex((e) => e.id === id);
		if (index !== -1) {
			this.metier.etablissements[index] = {
				...this.metier.etablissements[index],
				...etablissement
			};
			return true;
		}
		return false;
	}

	deleteEtablissement(id: string): boolean {
		const index = this.metier.etablissements.findIndex((e) => e.id === id);
		if (index !== -1) {
			this.metier.etablissements.splice(index, 1);
			return true;
		}
		return false;
	}

	// Méthodes CRUD pour les acteurs
	addActeur(acteur: Acteur): void {
		this.metier.acteurs.push(acteur);
	}

	updateActeur(id: string, acteur: Partial<Acteur>): boolean {
		const index = this.metier.acteurs.findIndex((a) => a.id === id);
		if (index !== -1) {
			this.metier.acteurs[index] = { ...this.metier.acteurs[index], ...acteur };
			return true;
		}
		return false;
	}

	deleteActeur(id: string): boolean {
		const index = this.metier.acteurs.findIndex((a) => a.id === id);
		if (index !== -1) {
			this.metier.acteurs.splice(index, 1);
			return true;
		}
		return false;
	}

	// Méthodes CRUD pour les applications
	addApplication(application: Application): void {
		this.applicatif.applications.push(application);
	}

	updateApplication(id: string, application: Partial<Application>): boolean {
		const index = this.applicatif.applications.findIndex((a) => a.id === id);
		if (index !== -1) {
			this.applicatif.applications[index] = {
				...this.applicatif.applications[index],
				...application
			};
			return true;
		}
		return false;
	}

	deleteApplication(id: string): boolean {
		const index = this.applicatif.applications.findIndex((a) => a.id === id);
		if (index !== -1) {
			this.applicatif.applications.splice(index, 1);
			return true;
		}
		return false;
	}

	// Méthodes utilitaires
	getStatistiques() {
		return {
			etablissements: this.metier.etablissements.length,
			acteurs: this.metier.acteurs.length,
			processus: this.metier.processus.length,
			applications: this.applicatif.applications.length,
			incidents: this.technique.incidents.length,
			fonctions: this.fonctionnel.fonctions.length,
			risques_critiques: this.technique.incidents.filter((i) => i.impact === 'Critique').length
		};
	}

	// Méthode de recherche
	rechercher(terme: string) {
		const resultats: any[] = [];

		// Recherche dans les acteurs
		this.metier.acteurs.forEach((acteur) => {
			if (
				acteur.nom.toLowerCase().includes(terme.toLowerCase()) ||
				acteur.role.toLowerCase().includes(terme.toLowerCase())
			) {
				resultats.push({ type: 'acteur', data: acteur });
			}
		});

		// Recherche dans les applications
		this.applicatif.applications.forEach((app) => {
			if (
				app.nom.toLowerCase().includes(terme.toLowerCase()) ||
				app.domaine.toLowerCase().includes(terme.toLowerCase())
			) {
				resultats.push({ type: 'application', data: app });
			}
		});

		return resultats;
	}

	// Méthode pour sauvegarder (à implémenter selon le backend choisi)
	async sauvegarder(): Promise<boolean> {
		try {
			// TODO: Implémenter la sauvegarde vers fichier ou API
			console.log('Sauvegarde des données...');
			return true;
		} catch (error) {
			console.error('Erreur lors de la sauvegarde:', error);
			return false;
		}
	}
}

// Export du singleton
export const dataService = DataService.getInstance();
