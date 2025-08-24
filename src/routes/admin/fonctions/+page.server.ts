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
			description: data.get('description') as string,
			domaine: data.get('domaine') as string,
			processus: data.get('processus') as string,
			responsable: data.get('responsable') as string,
			statut: data.get('statut') as string
		};

		try {
			const apiClient = createApiClient(fetch);

			const response = await apiClient.createFonction(fonctionData);
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { error: response.error });
			}
		} catch (error) {
			console.error('Erreur lors de la création:', error);
			return fail(500, { error: 'Erreur interne du serveur' });
		}
	},

	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const fonctionData = {
			nom: data.get('nom') as string,
			description: data.get('description') as string,
			domaine: data.get('domaine') as string,
			processus: data.get('processus') as string,
			responsable: data.get('responsable') as string,
			statut: data.get('statut') as string
		};

		try {
			const apiClient = createApiClient(fetch);

			const response = await apiClient.updateFonction(id, fonctionData);
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { error: response.error });
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour:', error);
			return fail(500, { error: 'Erreur interne du serveur' });
		}
	},

	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		try {
			const apiClient = createApiClient(fetch);

			const response = await apiClient.deleteFonction(id);
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { error: response.error });
			}
		} catch (error) {
			console.error('Erreur lors de la suppression:', error);
			return fail(500, { error: 'Erreur interne du serveur' });
		}
	}
};
