import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createApiClient } from '$lib/apiClient';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);
		const [processusResponse, acteursResponse, etablissementsResponse] = await Promise.all([
			apiClient.getProcessus(),
			apiClient.getActeurs(),
			apiClient.getEtablissements()
		]);

		if (processusResponse.success && processusResponse.data) {
			return {
				processus: processusResponse.data,
				acteurs: acteursResponse.success ? acteursResponse.data : [],
				etablissements: etablissementsResponse.success ? etablissementsResponse.data : []
			};
		} else {
			throw new Error(processusResponse.error || 'Erreur lors du chargement des processus');
		}
	} catch (error) {
		console.error('Erreur lors du chargement des processus:', error);
		return {
			processus: [],
			acteurs: [],
			etablissements: []
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const processusData = {
			nom: data.get('nom') as string,
			sous_processus: data.get('sous_processus')
				? JSON.parse(data.get('sous_processus') as string)
				: []
		};

		// Validation
		if (!processusData.nom) {
			return fail(400, { message: 'Le nom est requis' });
		}

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.createProcessus(processusData);

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
		const processusData = {
			nom: data.get('nom') as string,
			sous_processus: data.get('sous_processus')
				? JSON.parse(data.get('sous_processus') as string)
				: []
		};

		// Validation
		if (!id || !processusData.nom) {
			return fail(400, { message: 'ID et nom sont requis' });
		}

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.updateProcessus(id, processusData);

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
			const response = await apiClient.deleteProcessus(id);

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
