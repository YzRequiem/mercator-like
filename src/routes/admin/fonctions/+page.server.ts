import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/apiClient';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);

		const response = await apiClient.getFonctions();
		if (response.success) {
			return {
				fonctions: response.data
			};
		} else {
			return {
				fonctions: [],
				error: response.error
			};
		}
	} catch (error) {
		console.error('Erreur lors du chargement des fonctions:', error);
		return {
			fonctions: [],
			error: 'Erreur lors du chargement des données'
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const fonctionData = {
			nom: data.get('nom') as string,
			description: (data.get('description') as string) || '',
			flux: data.get('flux') ? JSON.parse(data.get('flux') as string) : [],
			donnees: data.get('donnees') ? JSON.parse(data.get('donnees') as string) : [],
			statut: (data.get('statut') as string) || '',
			niveau_automatisation: (data.get('niveau_automatisation') as string) || '',
			frequence_utilisation: (data.get('frequence_utilisation') as string) || '',
			utilisateurs: data.get('utilisateurs') ? JSON.parse(data.get('utilisateurs') as string) : [],
			sites: data.get('sites') ? JSON.parse(data.get('sites') as string) : []
		};

		// Validation
		if (!fonctionData.nom) {
			return fail(400, { message: 'Le nom est requis' });
		}

		try {
			const apiClient = createApiClient(fetch);

			const response = await apiClient.createFonction(fonctionData);
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { message: response.error || 'Erreur lors de la création' });
			}
		} catch (error) {
			console.error('Erreur lors de la création:', error);
			return fail(500, { message: 'Erreur serveur lors de la création' });
		}
	},

	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const fonctionData = {
			nom: data.get('nom') as string,
			description: (data.get('description') as string) || '',
			flux: data.get('flux') ? JSON.parse(data.get('flux') as string) : [],
			donnees: data.get('donnees') ? JSON.parse(data.get('donnees') as string) : [],
			statut: (data.get('statut') as string) || '',
			niveau_automatisation: (data.get('niveau_automatisation') as string) || '',
			frequence_utilisation: (data.get('frequence_utilisation') as string) || '',
			utilisateurs: data.get('utilisateurs') ? JSON.parse(data.get('utilisateurs') as string) : [],
			sites: data.get('sites') ? JSON.parse(data.get('sites') as string) : []
		};

		// Validation
		if (!id || !fonctionData.nom) {
			return fail(400, { message: 'ID et nom sont requis' });
		}

		try {
			const apiClient = createApiClient(fetch);

			const response = await apiClient.updateFonction(id, fonctionData);
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { message: response.error || 'Erreur lors de la modification' });
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour:', error);
			return fail(500, { message: 'Erreur serveur lors de la modification' });
		}
	},

	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) {
			return fail(400, { message: 'ID requis pour la suppression' });
		}

		try {
			const apiClient = createApiClient(fetch);

			const response = await apiClient.deleteFonction(id);
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { message: response.error || 'Erreur lors de la suppression' });
			}
		} catch (error) {
			console.error('Erreur lors de la suppression:', error);
			return fail(500, { message: 'Erreur serveur lors de la suppression' });
		}
	}
};
