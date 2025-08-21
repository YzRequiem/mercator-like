// Client API TypeScript pour l'application Mercator-like
// Ce fichier fournit des fonctions typées pour toutes les opérations CRUD

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface ApiListResponse<T> {
	success: boolean;
	data?: T[];
	error?: string;
}

// Types pour les entités (simplifiés pour le client)
export interface Etablissement {
	id: string;
	nom: string;
	code: string;
	adresse?: string;
	statut?: string;
	surface?: string;
	collaborateurs?: string;
	activites?: string[];
	equipements?: string[];
	risques?: string[];
	statut_operationnel?: string;
}

export interface Processus {
	id: string;
	nom: string;
	sous_processus?: any[];
	sousProcessus?: any[]; // Alias pour compatibilité frontend
}

export interface Acteur {
	id: string;
	nom: string;
	site?: string;
	role?: string;
}

export interface Application {
	id: string;
	nom: string;
	type?: string;
	domaine?: string;
	criticite?: string;
	statut?: string;
	users?: string;
	sites?: string[];
	conformite?: string;
	version?: string;
	editeur?: string;
	cout_annuel?: number;
	date_mise_en_service?: string;
	risques?: string[];
	fonctionnalites?: string[];
}

export interface Infrastructure {
	id: string;
	nom: string;
	type?: string;
	localisation?: string;
	statut?: string;
	capacite?: string;
	utilisation?: string;
	redondance?: string;
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
	risques?: string[];
}

export interface Incident {
	id: string;
	nom: string;
	impact?: string;
	date?: string;
	statut?: string;
	description?: string;
	duree?: string;
	cout_estime?: number;
	cause?: string;
	mesures_correctives?: string[];
}

export interface Fonction {
	id: string;
	nom: string;
	description?: string;
	flux?: string[];
	donnees?: string[];
	statut?: string;
	niveau_automatisation?: string;
	frequence_utilisation?: string;
	utilisateurs?: string[];
	sites?: string[];
}

export interface Donnee {
	id: string;
	nom: string;
	source?: string;
	qualite?: string;
	volume?: string;
	frequence_maj?: string;
	proprietaire?: string;
	sensibilite?: string;
	retention?: string;
	format?: string;
	taille_estimee?: string;
}

export interface Ecosysteme {
	id: string;
	nom: string;
	type?: string;
	relation?: string;
}

export interface Securite {
	id: string;
	niveau?: string;
	score_global?: number;
	derniere_evaluation?: string;
	mesures?: any[];
	manques?: any[];
	incidents_total?: number;
	incidents_critiques?: number;
	incidents_majeurs?: number;
}

// Classe client pour les API
export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = '/api') {
		this.baseUrl = baseUrl;
	}

	private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				headers: {
					'Content-Type': 'application/json',
					...options?.headers
				},
				...options
			});

			const data = await response.json();
			return data;
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Erreur de réseau'
			};
		}
	}

	// Méthodes génériques CRUD
	async getAll<T>(resource: string): Promise<ApiListResponse<T>> {
		return this.request<T[]>(`/${resource}`);
	}

	async getById<T>(resource: string, id: string): Promise<ApiResponse<T>> {
		return this.request<T>(`/${resource}/${id}`);
	}

	async create<T>(resource: string, data: Partial<T>): Promise<ApiResponse<T>> {
		return this.request<T>(`/${resource}`, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async update<T>(resource: string, id: string, data: Partial<T>): Promise<ApiResponse<T>> {
		return this.request<T>(`/${resource}/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	async delete(resource: string, id: string): Promise<ApiResponse<void>> {
		return this.request<void>(`/${resource}/${id}`, {
			method: 'DELETE'
		});
	}

	// Méthodes spécifiques pour chaque entité

	// Établissements
	async getEtablissements(): Promise<ApiListResponse<Etablissement>> {
		return this.getAll<Etablissement>('etablissements');
	}

	async getEtablissement(id: string): Promise<ApiResponse<Etablissement>> {
		return this.getById<Etablissement>('etablissements', id);
	}

	async createEtablissement(data: Partial<Etablissement>): Promise<ApiResponse<Etablissement>> {
		return this.create<Etablissement>('etablissements', data);
	}

	async updateEtablissement(
		id: string,
		data: Partial<Etablissement>
	): Promise<ApiResponse<Etablissement>> {
		return this.update<Etablissement>('etablissements', id, data);
	}

	async deleteEtablissement(id: string): Promise<ApiResponse<void>> {
		return this.delete('etablissements', id);
	}

	// Processus
	async getProcessus(): Promise<ApiListResponse<Processus>> {
		const response = await this.getAll<Processus>('processus');

		// Transformation pour ajouter sousProcessus en alias de sous_processus
		if (response.success && response.data) {
			response.data = response.data.map((processus) => ({
				...processus,
				sousProcessus: processus.sous_processus || []
			}));
		}

		return response;
	}

	async getProcessusById(id: string): Promise<ApiResponse<Processus>> {
		return this.getById<Processus>('processus', id);
	}

	async createProcessus(data: Partial<Processus>): Promise<ApiResponse<Processus>> {
		return this.create<Processus>('processus', data);
	}

	async updateProcessus(id: string, data: Partial<Processus>): Promise<ApiResponse<Processus>> {
		return this.update<Processus>('processus', id, data);
	}

	async deleteProcessus(id: string): Promise<ApiResponse<void>> {
		return this.delete('processus', id);
	}

	// Acteurs
	async getActeurs(): Promise<ApiListResponse<Acteur>> {
		return this.getAll<Acteur>('acteurs');
	}

	async getActeur(id: string): Promise<ApiResponse<Acteur>> {
		return this.getById<Acteur>('acteurs', id);
	}

	async createActeur(data: Partial<Acteur>): Promise<ApiResponse<Acteur>> {
		return this.create<Acteur>('acteurs', data);
	}

	async updateActeur(id: string, data: Partial<Acteur>): Promise<ApiResponse<Acteur>> {
		return this.update<Acteur>('acteurs', id, data);
	}

	async deleteActeur(id: string): Promise<ApiResponse<void>> {
		return this.delete('acteurs', id);
	}

	// Applications
	async getApplications(): Promise<ApiListResponse<Application>> {
		return this.getAll<Application>('applications');
	}

	async getApplication(id: string): Promise<ApiResponse<Application>> {
		return this.getById<Application>('applications', id);
	}

	async createApplication(data: Partial<Application>): Promise<ApiResponse<Application>> {
		return this.create<Application>('applications', data);
	}

	async updateApplication(
		id: string,
		data: Partial<Application>
	): Promise<ApiResponse<Application>> {
		return this.update<Application>('applications', id, data);
	}

	async deleteApplication(id: string): Promise<ApiResponse<void>> {
		return this.delete('applications', id);
	}

	// Infrastructure
	async getInfrastructure(): Promise<ApiListResponse<Infrastructure>> {
		return this.getAll<Infrastructure>('infrastructure');
	}

	async getInfrastructureById(id: string): Promise<ApiResponse<Infrastructure>> {
		return this.getById<Infrastructure>('infrastructure', id);
	}

	async createInfrastructure(data: Partial<Infrastructure>): Promise<ApiResponse<Infrastructure>> {
		return this.create<Infrastructure>('infrastructure', data);
	}

	async updateInfrastructure(
		id: string,
		data: Partial<Infrastructure>
	): Promise<ApiResponse<Infrastructure>> {
		return this.update<Infrastructure>('infrastructure', id, data);
	}

	async deleteInfrastructure(id: string): Promise<ApiResponse<void>> {
		return this.delete('infrastructure', id);
	}

	// Incidents
	async getIncidents(filters?: {
		impact?: string;
		statut?: string;
	}): Promise<ApiListResponse<Incident>> {
		let endpoint = '/incidents';
		if (filters) {
			const params = new URLSearchParams();
			if (filters.impact) params.append('impact', filters.impact);
			if (filters.statut) params.append('statut', filters.statut);
			if (params.toString()) endpoint += `?${params.toString()}`;
		}
		return this.request<Incident[]>(endpoint);
	}

	async getIncident(id: string): Promise<ApiResponse<Incident>> {
		return this.getById<Incident>('incidents', id);
	}

	async createIncident(data: Partial<Incident>): Promise<ApiResponse<Incident>> {
		return this.create<Incident>('incidents', data);
	}

	async updateIncident(id: string, data: Partial<Incident>): Promise<ApiResponse<Incident>> {
		return this.update<Incident>('incidents', id, data);
	}

	async deleteIncident(id: string): Promise<ApiResponse<void>> {
		return this.delete('incidents', id);
	}

	// Fonctions
	async getFonctions(): Promise<ApiListResponse<Fonction>> {
		return this.getAll<Fonction>('fonctions');
	}

	async getFonction(id: string): Promise<ApiResponse<Fonction>> {
		return this.getById<Fonction>('fonctions', id);
	}

	async createFonction(data: Partial<Fonction>): Promise<ApiResponse<Fonction>> {
		return this.create<Fonction>('fonctions', data);
	}

	async updateFonction(id: string, data: Partial<Fonction>): Promise<ApiResponse<Fonction>> {
		return this.update<Fonction>('fonctions', id, data);
	}

	async deleteFonction(id: string): Promise<ApiResponse<void>> {
		return this.delete('fonctions', id);
	}

	// Données
	async getDonnees(): Promise<ApiListResponse<Donnee>> {
		return this.getAll<Donnee>('donnees');
	}

	async getDonnee(id: string): Promise<ApiResponse<Donnee>> {
		return this.getById<Donnee>('donnees', id);
	}

	async createDonnee(data: Partial<Donnee>): Promise<ApiResponse<Donnee>> {
		return this.create<Donnee>('donnees', data);
	}

	async updateDonnee(id: string, data: Partial<Donnee>): Promise<ApiResponse<Donnee>> {
		return this.update<Donnee>('donnees', id, data);
	}

	async deleteDonnee(id: string): Promise<ApiResponse<void>> {
		return this.delete('donnees', id);
	}

	// Écosystème
	async getEcosysteme(): Promise<ApiListResponse<Ecosysteme>> {
		return this.getAll<Ecosysteme>('ecosysteme');
	}

	async getEcosystemeById(id: string): Promise<ApiResponse<Ecosysteme>> {
		return this.getById<Ecosysteme>('ecosysteme', id);
	}

	async createEcosysteme(data: Partial<Ecosysteme>): Promise<ApiResponse<Ecosysteme>> {
		return this.create<Ecosysteme>('ecosysteme', data);
	}

	async updateEcosysteme(id: string, data: Partial<Ecosysteme>): Promise<ApiResponse<Ecosysteme>> {
		return this.update<Ecosysteme>('ecosysteme', id, data);
	}

	async deleteEcosysteme(id: string): Promise<ApiResponse<void>> {
		return this.delete('ecosysteme', id);
	}

	// Sécurité
	async getSecurite(): Promise<ApiResponse<Securite>> {
		return this.request<Securite>('/securite');
	}

	async updateSecurite(data: Partial<Securite>): Promise<ApiResponse<Securite>> {
		return this.request<Securite>('/securite', {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	// Statistiques
	async getStats(): Promise<ApiResponse<any>> {
		return this.request<any>('/stats');
	}
}

// Instance par défaut du client API
export const apiClient = new ApiClient();
