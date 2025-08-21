// Service API qui remplace le dataService JSON par des appels vers l'API REST
import { apiClient } from './apiClient.js';
import type {
	Etablissement,
	Processus,
	Acteur,
	Ecosysteme,
	Fonction,
	Application,
	Donnee,
	Infrastructure,
	Incident,
	Securite
} from './apiClient.js';

// Interfaces pour les données structurées (compatibles avec l'ancien dataService)
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

// Service API moderne qui remplace l'ancien dataService
export class ApiDataService {
	private static instance: ApiDataService;

	// Cache pour éviter trop de requêtes
	private cache: {
		metier?: MetierData;
		fonctionnel?: FonctionnelData;
		applicatif?: ApplicatifData;
		technique?: TechniqueData;
		lastUpdate?: Date;
	} = {};

	private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	private constructor() {}

	public static getInstance(): ApiDataService {
		if (!ApiDataService.instance) {
			ApiDataService.instance = new ApiDataService();
		}
		return ApiDataService.instance;
	}

	// Vérifie si le cache est valide
	private isCacheValid(): boolean {
		if (!this.cache.lastUpdate) return false;
		return Date.now() - this.cache.lastUpdate.getTime() < this.CACHE_DURATION;
	}

	// Invalide le cache
	public invalidateCache(): void {
		this.cache = {};
	}

	// Méthodes de lecture avec cache
	async getMetierData(): Promise<MetierData> {
		if (this.cache.metier && this.isCacheValid()) {
			return this.cache.metier;
		}

		const [processusRes, acteursRes, ecosystemeRes, etablissementsRes] = await Promise.all([
			apiClient.getProcessus(),
			apiClient.getActeurs(),
			apiClient.getEcosysteme(),
			apiClient.getEtablissements()
		]);

		const metierData: MetierData = {
			processus: processusRes.success ? processusRes.data! : [],
			acteurs: acteursRes.success ? acteursRes.data! : [],
			ecosysteme: ecosystemeRes.success ? ecosystemeRes.data! : [],
			etablissements: etablissementsRes.success ? etablissementsRes.data! : []
		};

		this.cache.metier = metierData;
		this.cache.lastUpdate = new Date();
		return metierData;
	}

	async getFonctionnelData(): Promise<FonctionnelData> {
		if (this.cache.fonctionnel && this.isCacheValid()) {
			return this.cache.fonctionnel;
		}

		const fonctionsRes = await apiClient.getFonctions();

		const fonctionnelData: FonctionnelData = {
			fonctions: fonctionsRes.success ? fonctionsRes.data! : []
		};

		this.cache.fonctionnel = fonctionnelData;
		this.cache.lastUpdate = new Date();
		return fonctionnelData;
	}

	async getApplicatifData(): Promise<ApplicatifData> {
		if (this.cache.applicatif && this.isCacheValid()) {
			return this.cache.applicatif;
		}

		const [applicationsRes, donneesRes] = await Promise.all([
			apiClient.getApplications(),
			apiClient.getDonnees()
		]);

		const applicatifData: ApplicatifData = {
			applications: applicationsRes.success ? applicationsRes.data! : [],
			donnees: donneesRes.success ? donneesRes.data! : []
		};

		this.cache.applicatif = applicatifData;
		this.cache.lastUpdate = new Date();
		return applicatifData;
	}

	async getTechniqueData(): Promise<TechniqueData> {
		if (this.cache.technique && this.isCacheValid()) {
			return this.cache.technique;
		}

		const [infrastructureRes, incidentsRes, securiteRes] = await Promise.all([
			apiClient.getInfrastructure(),
			apiClient.getIncidents(),
			apiClient.getSecurite()
		]);

		// Securite par défaut si pas trouvée
		const securiteDefault: Securite = {
			id: 'global',
			niveau: 'Moyen',
			score_global: 65,
			derniere_evaluation: new Date().toISOString().split('T')[0],
			mesures: [],
			manques: [],
			incidents_total: 0,
			incidents_critiques: 0,
			incidents_majeurs: 0
		};

		const techniqueData: TechniqueData = {
			infrastructure: infrastructureRes.success ? infrastructureRes.data! : [],
			incidents: incidentsRes.success ? incidentsRes.data! : [],
			securite: securiteRes.success ? securiteRes.data! : securiteDefault
		};

		this.cache.technique = techniqueData;
		this.cache.lastUpdate = new Date();
		return techniqueData;
	}

	// Méthodes d'accès direct (compatibilité avec l'ancien API)
	async getProcessus(): Promise<Processus[]> {
		const data = await this.getMetierData();
		return data.processus;
	}

	async getActeurs(): Promise<Acteur[]> {
		const data = await this.getMetierData();
		return data.acteurs;
	}

	async getEcosysteme(): Promise<Ecosysteme[]> {
		const data = await this.getMetierData();
		return data.ecosysteme;
	}

	async getEtablissements(): Promise<Etablissement[]> {
		const data = await this.getMetierData();
		return data.etablissements;
	}

	async getFonctions(): Promise<Fonction[]> {
		const data = await this.getFonctionnelData();
		return data.fonctions;
	}

	async getApplications(): Promise<Application[]> {
		const data = await this.getApplicatifData();
		return data.applications;
	}

	async getDonnees(): Promise<Donnee[]> {
		const data = await this.getApplicatifData();
		return data.donnees;
	}

	async getInfrastructure(): Promise<Infrastructure[]> {
		const data = await this.getTechniqueData();
		return data.infrastructure;
	}

	async getIncidents(): Promise<Incident[]> {
		const data = await this.getTechniqueData();
		return data.incidents;
	}

	async getSecurite(): Promise<Securite> {
		const data = await this.getTechniqueData();
		return data.securite;
	}

	// Méthodes CRUD - délègue à l'apiClient
	async addEtablissement(etablissement: Partial<Etablissement>): Promise<boolean> {
		const result = await apiClient.createEtablissement(etablissement);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	async updateEtablissement(id: string, etablissement: Partial<Etablissement>): Promise<boolean> {
		const result = await apiClient.updateEtablissement(id, etablissement);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	async deleteEtablissement(id: string): Promise<boolean> {
		const result = await apiClient.deleteEtablissement(id);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	async addActeur(acteur: Partial<Acteur>): Promise<boolean> {
		const result = await apiClient.createActeur(acteur);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	async updateActeur(id: string, acteur: Partial<Acteur>): Promise<boolean> {
		const result = await apiClient.updateActeur(id, acteur);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	async deleteActeur(id: string): Promise<boolean> {
		const result = await apiClient.deleteActeur(id);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	async addApplication(application: Partial<Application>): Promise<boolean> {
		const result = await apiClient.createApplication(application);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	async updateApplication(id: string, application: Partial<Application>): Promise<boolean> {
		const result = await apiClient.updateApplication(id, application);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	async deleteApplication(id: string): Promise<boolean> {
		const result = await apiClient.deleteApplication(id);
		if (result.success) {
			this.invalidateCache();
		}
		return result.success;
	}

	// Statistiques calculées
	async getStatistiques() {
		const [metier, applicatif, technique, fonctionnel] = await Promise.all([
			this.getMetierData(),
			this.getApplicatifData(),
			this.getTechniqueData(),
			this.getFonctionnelData()
		]);

		return {
			etablissements: metier.etablissements.length,
			acteurs: metier.acteurs.length,
			processus: metier.processus.length,
			applications: applicatif.applications.length,
			incidents: technique.incidents.length,
			fonctions: fonctionnel.fonctions.length,
			risques_critiques: technique.incidents.filter((i) => i.impact === 'Critique').length,
			incidentsRecents: technique.incidents.filter((i) => i.statut !== 'Résolu').length,
			incidentsCritiques: technique.incidents.filter((i) => i.impact === 'Critique').length,
			risquesCritiques: [
				...applicatif.applications.filter((a) => a.conformite === 'Non conforme'),
				...technique.incidents.filter((i) => i.impact === 'Critique'),
				...technique.infrastructure.filter((i) => i.statut === 'Défaillant')
			].length,
			collaborateursTotal: metier.etablissements.reduce(
				(total, etab) =>
					total +
					(typeof etab.collaborateurs === 'number'
						? etab.collaborateurs
						: parseInt(etab.collaborateurs || '0')),
				0
			)
		};
	}

	// Recherche
	async rechercher(terme: string) {
		const [metier, applicatif] = await Promise.all([
			this.getMetierData(),
			this.getApplicatifData()
		]);

		const resultats: any[] = [];

		// Recherche dans les acteurs
		metier.acteurs.forEach((acteur) => {
			if (
				acteur.nom.toLowerCase().includes(terme.toLowerCase()) ||
				acteur.role?.toLowerCase().includes(terme.toLowerCase())
			) {
				resultats.push({ type: 'acteur', data: acteur });
			}
		});

		// Recherche dans les applications
		applicatif.applications.forEach((app) => {
			if (
				app.nom.toLowerCase().includes(terme.toLowerCase()) ||
				app.domaine?.toLowerCase().includes(terme.toLowerCase())
			) {
				resultats.push({ type: 'application', data: app });
			}
		});

		return resultats;
	}

	// Méthode pour sauvegarder (non nécessaire avec l'API)
	async sauvegarder(): Promise<boolean> {
		// Avec l'API, chaque modification est automatiquement sauvegardée
		return true;
	}
}

// Export du singleton
export const apiDataService = ApiDataService.getInstance();

// Rétrocompatibilité - export de l'instance comme dataService
export const dataService = apiDataService;
