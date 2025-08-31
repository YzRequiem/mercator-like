import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createApiClient } from '$lib/apiClient';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);
		const [acteursResponse, etablissementsResponse] = await Promise.all([
			apiClient.getActeurs(),
			apiClient.getEtablissements()
		]);

		if (acteursResponse.success && acteursResponse.data) {
			return {
				acteurs: acteursResponse.data,
				etablissements: etablissementsResponse.success ? etablissementsResponse.data : []
			};
		} else {
			throw new Error(acteursResponse.error || 'Erreur lors du chargement des acteurs');
		}
	} catch (error) {
		console.error('Erreur lors du chargement des acteurs:', error);
		return {
			acteurs: [],
			etablissements: []
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const acteurData = {
			nom: data.get('nom') as string,
			site: data.get('site') as string,
			role: data.get('role') as string
		};

		// Validation
		if (!acteurData.nom) {
			return fail(400, { message: 'Le nom est requis' });
		}

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.createActeur(acteurData);

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
		const acteurData = {
			nom: data.get('nom') as string,
			site: data.get('site') as string,
			role: data.get('role') as string
		};

		// Validation
		if (!id || !acteurData.nom) {
			return fail(400, { message: 'ID et nom sont requis' });
		}

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.updateActeur(id, acteurData);

			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { message: response.error || 'Erreur lors de la modification' });
			}
		} catch (error) {
			console.error('Erreur lors de la modification:', error);
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
			const response = await apiClient.deleteActeur(id);

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
