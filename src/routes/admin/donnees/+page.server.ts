import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createApiClient } from '$lib/apiClient';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);
		const response = await apiClient.getDonnees();

		if (response.success && response.data) {
			return {
				donnees: response.data
			};
		} else {
			throw new Error(response.error || 'Erreur lors du chargement des données');
		}
	} catch (error) {
		console.error('Erreur lors du chargement des données:', error);
		return {
			donnees: []
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const donneeData = {
			nom: data.get('nom') as string,
			description: data.get('description') as string,
			type: data.get('type') as string,
			source: data.get('source') as string,
			format: data.get('format') as string,
			classification: data.get('classification') as string,
			proprietaire: data.get('proprietaire') as string
		};

		// Validation
		if (!donneeData.nom || !donneeData.type) {
			return fail(400, { message: 'Le nom et le type sont requis' });
		}

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.createDonnee(donneeData);

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
		const donneeData = {
			nom: data.get('nom') as string,
			description: data.get('description') as string,
			type: data.get('type') as string,
			source: data.get('source') as string,
			format: data.get('format') as string,
			classification: data.get('classification') as string,
			proprietaire: data.get('proprietaire') as string
		};

		// Validation
		if (!id || !donneeData.nom || !donneeData.type) {
			return fail(400, { message: 'ID, nom et type sont requis' });
		}

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.updateDonnee(id, donneeData);

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
			const response = await apiClient.deleteDonnee(id);

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
