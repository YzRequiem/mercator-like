import { writable, derived } from 'svelte/store';
import {
	dataService,
	type MetierData,
	type FonctionnelData,
	type ApplicatifData,
	type TechniqueData
} from './dataService.js';

// Stores pour chaque couche de données
export const metierStore = writable<MetierData>(dataService.getMetierData());
export const fonctionnelStore = writable<FonctionnelData>(dataService.getFonctionnelData());
export const applicatifStore = writable<ApplicatifData>(dataService.getApplicatifData());
export const techniqueStore = writable<TechniqueData>(dataService.getTechniqueData());

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
			(total, etab) => total + etab.collaborateurs,
			0
		)
	})
);

// Actions pour mettre à jour les données
export const dataActions = {
	// Actions pour la couche métier
	updateMetier: (newData: Partial<MetierData>) => {
		metierStore.update((current) => ({ ...current, ...newData }));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	addEtablissement: (etablissement: any) => {
		metierStore.update((current) => ({
			...current,
			etablissements: [...current.etablissements, etablissement]
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	updateEtablissement: (id: string, etablissement: any) => {
		metierStore.update((current) => ({
			...current,
			etablissements: current.etablissements.map((e) =>
				e.id === id ? { ...e, ...etablissement } : e
			)
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	deleteEtablissement: (id: string) => {
		metierStore.update((current) => ({
			...current,
			etablissements: current.etablissements.filter((e) => e.id !== id)
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	// Actions pour les acteurs
	addActeur: (acteur: any) => {
		metierStore.update((current) => ({
			...current,
			acteurs: [...current.acteurs, acteur]
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	updateActeur: (id: string, acteur: any) => {
		metierStore.update((current) => ({
			...current,
			acteurs: current.acteurs.map((a) => (a.id === id ? { ...a, ...acteur } : a))
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	deleteActeur: (id: string) => {
		metierStore.update((current) => ({
			...current,
			acteurs: current.acteurs.filter((a) => a.id !== id)
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	// Actions pour les applications
	addApplication: (application: any) => {
		applicatifStore.update((current) => ({
			...current,
			applications: [...current.applications, application]
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	updateApplication: (id: string, application: any) => {
		applicatifStore.update((current) => ({
			...current,
			applications: current.applications.map((a) => (a.id === id ? { ...a, ...application } : a))
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	deleteApplication: (id: string) => {
		applicatifStore.update((current) => ({
			...current,
			applications: current.applications.filter((a) => a.id !== id)
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	// Actions pour les incidents
	addIncident: (incident: any) => {
		techniqueStore.update((current) => ({
			...current,
			incidents: [...current.incidents, incident]
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	updateIncident: (id: string, incident: any) => {
		techniqueStore.update((current) => ({
			...current,
			incidents: current.incidents.map((i) => (i.id === id ? { ...i, ...incident } : i))
		}));
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
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
	reloadData: () => {
		metierStore.set(dataService.getMetierData());
		fonctionnelStore.set(dataService.getFonctionnelData());
		applicatifStore.set(dataService.getApplicatifData());
		techniqueStore.set(dataService.getTechniqueData());
		appState.update((state) => ({ ...state, lastUpdate: new Date() }));
	},

	// Action pour sauvegarder
	saveData: async () => {
		appState.update((state) => ({ ...state, isLoading: true }));
		try {
			const success = await dataService.sauvegarder();
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
	search: (query: string) => {
		searchStore.update((state) => ({ ...state, query, isSearching: true }));

		// Simulation d'une recherche asynchrone
		setTimeout(() => {
			const results = dataService.rechercher(query);
			searchStore.update((state) => ({ ...state, results, isSearching: false }));
		}, 300);
	},

	clearSearch: () => {
		searchStore.set({ query: '', results: [], isSearching: false });
	}
};
