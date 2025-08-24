import { writable, derived } from 'svelte/store';
import {
	apiDataService,
	type MetierData,
	type FonctionnelData,
	type ApplicatifData,
	type TechniqueData
} from './apiDataService.js';
import { apiClient } from './apiClient.js';

// Stores pour chaque couche de données - initialisés vides et chargés de manière asynchrone
export const metierStore = writable<MetierData>({
	processus: [],
	acteurs: [],
	ecosysteme: [],
	etablissements: []
});
export const fonctionnelStore = writable<FonctionnelData>({ fonctions: [] });
export const applicatifStore = writable<ApplicatifData>({ applications: [], donnees: [] });
export const techniqueStore = writable<TechniqueData>({
	infrastructure: [],
	incidents: [],
	securite: {
		id: 'global',
		niveau: 'Moyen',
		score_global: 0,
		mesures: [],
		manques: [],
		incidents_total: 0
	}
});

// Store pour l'état de l'application
export const appState = writable({
	selectedLayer: 'metier',
	expandedItems: {} as Record<string, boolean>,
	selectedBlock: null as string | null,
	isLoading: false,
	lastUpdate: new Date()
});

// Store dérivé pour les statistiques
export const statistiques = derived(
	[metierStore, applicatifStore, techniqueStore, fonctionnelStore],
	([$metier, $applicatif, $technique, $fonctionnel]) => ({
		etablissements: $metier.etablissements.length,
		acteurs: $metier.acteurs.length,
		processus: $metier.processus.length,
		applications: $applicatif.applications.length,
		incidents: $technique.incidents.length,
		incidentsRecents: $technique.incidents.filter((i) => i.statut !== 'Résolu').length,
		incidentsCritiques: $technique.incidents.filter((i) => i.impact === 'Critique').length,
		fonctions: $fonctionnel.fonctions.length,
		risquesCritiques: [
			...$applicatif.applications.filter((a) => a.conformite === 'Non conforme'),
			...$technique.incidents.filter((i) => i.impact === 'Critique'),
			...$technique.infrastructure.filter((i) => i.statut === 'Défaillant')
		].length,
		collaborateursTotal: $metier.etablissements.reduce(
			(total, etab) =>
				total +
				(typeof etab.collaborateurs === 'number'
					? etab.collaborateurs
					: parseInt(etab.collaborateurs || '0')),
			0
		)
	})
);

// Actions pour mettre à jour les données
export const dataActions = {
	// Action pour changer de couche
	setLayer: (layer: string) => {
		appState.update((state) => ({ ...state, selectedLayer: layer }));
	},

	// Action pour basculer l'expansion d'un élément
	toggleExpansion: (itemId: string) => {
		appState.update((state) => ({
			...state,
			expandedItems: {
				...state.expandedItems,
				[itemId]: !state.expandedItems[itemId]
			}
		}));
	},

	// Action pour sélectionner un bloc
	selectBlock: (blockId: string | null) => {
		appState.update((state) => ({ ...state, selectedBlock: blockId }));
	},

	// Action pour charger toutes les données depuis l'API
	loadData: async () => {
		appState.update((state) => ({ ...state, isLoading: true }));
		try {
			const [metier, fonctionnel, applicatif, technique] = await Promise.all([
				apiDataService.getMetierData(),
				apiDataService.getFonctionnelData(),
				apiDataService.getApplicatifData(),
				apiDataService.getTechniqueData()
			]);

			metierStore.set(metier);
			fonctionnelStore.set(fonctionnel);
			applicatifStore.set(applicatif);
			techniqueStore.set(technique);

			appState.update((state) => ({ ...state, lastUpdate: new Date() }));
		} catch (error) {
			console.error('Erreur lors du chargement des données:', error);
		} finally {
			appState.update((state) => ({ ...state, isLoading: false }));
		}
	},

	// Actions pour les établissements
	addEtablissement: async (etablissement: any) => {
		const success = await apiDataService.addEtablissement(etablissement);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	updateEtablissement: async (id: string, etablissement: any) => {
		const success = await apiDataService.updateEtablissement(id, etablissement);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	deleteEtablissement: async (id: string) => {
		const success = await apiDataService.deleteEtablissement(id);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	// Actions pour les acteurs
	addActeur: async (acteur: any) => {
		const success = await apiDataService.addActeur(acteur);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	updateActeur: async (id: string, acteur: any) => {
		const success = await apiDataService.updateActeur(id, acteur);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	deleteActeur: async (id: string) => {
		const success = await apiDataService.deleteActeur(id);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	// Actions pour les applications
	addApplication: async (application: any) => {
		const success = await apiDataService.addApplication(application);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	updateApplication: async (id: string, application: any) => {
		const success = await apiDataService.updateApplication(id, application);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	deleteApplication: async (id: string) => {
		const success = await apiDataService.deleteApplication(id);
		if (success) {
			await dataActions.reloadData();
		}
		return success;
	},

	// Actions pour les incidents (via apiClient directement)
	addIncident: async (incident: any) => {
		const result = await apiClient.createIncident(incident);
		if (result.success) {
			await dataActions.reloadData();
		}
		return result.success;
	},

	updateIncident: async (id: string, incident: any) => {
		const result = await apiClient.updateIncident(id, incident);
		if (result.success) {
			await dataActions.reloadData();
		}
		return result.success;
	},

	// Actions pour l'état de l'application
	setSelectedLayer: (layer: string) => {
		appState.update((state) => ({ ...state, selectedLayer: layer }));
	},

	toggleExpanded: (key: string) => {
		appState.update((state) => ({
			...state,
			expandedItems: {
				...state.expandedItems,
				[key]: !state.expandedItems[key]
			}
		}));
	},

	setSelectedBlock: (blockId: string | null) => {
		appState.update((state) => ({
			...state,
			selectedBlock: state.selectedBlock === blockId ? null : blockId
		}));
	},

	setLoading: (loading: boolean) => {
		appState.update((state) => ({ ...state, isLoading: loading }));
	},

	// Action pour recharger toutes les données
	reloadData: async () => {
		apiDataService.invalidateCache();
		await dataActions.loadData();
	},

	// Action pour sauvegarder
	saveData: async () => {
		appState.update((state) => ({ ...state, isLoading: true }));
		try {
			const success = await apiDataService.sauvegarder();
			if (success) {
				appState.update((state) => ({ ...state, lastUpdate: new Date() }));
			}
			return success;
		} finally {
			appState.update((state) => ({ ...state, isLoading: false }));
		}
	}
};

// Store pour la recherche
export const searchStore = writable({
	query: '',
	results: [] as any[],
	isSearching: false
});

export const searchActions = {
	search: async (query: string) => {
		searchStore.update((state) => ({ ...state, query, isSearching: true }));

		try {
			const results = await apiDataService.rechercher(query);
			searchStore.update((state) => ({ ...state, results, isSearching: false }));
		} catch (error) {
			console.error('Erreur lors de la recherche:', error);
			searchStore.update((state) => ({ ...state, results: [], isSearching: false }));
		}
	},

	clearSearch: () => {
		searchStore.set({ query: '', results: [], isSearching: false });
	}
};
