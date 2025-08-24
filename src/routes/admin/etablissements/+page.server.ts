import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createApiClient } from '$lib/apiClient';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);

		const response = await apiClient.getEtablissements();

		if (response.success && response.data) {
			return {
				etablissements: response.data
			};
		} else {
			throw new Error(response.error || 'Erreur lors du chargement des établissements');
		}
	} catch (error) {
		console.error('Erreur lors du chargement des établissements:', error);
		return {
			etablissements: []
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const etablissementData = {
			nom: data.get('nom') as string,
			code: data.get('code') as string,
			adresse: data.get('adresse') as string,
			statut: data.get('statut') as string,
			surface: data.get('surface') as string,
			collaborateurs: data.get('collaborateurs') as string,
			statut_operationnel: data.get('statut_operationnel') as string
		};

		// Validation
		if (!etablissementData.nom || !etablissementData.code) {
			return fail(400, { message: 'Le nom et le code sont requis' });
		}

		try {
			const apiClient = createApiClient(fetch);

			const response = await apiClient.createEtablissement(etablissementData);

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
		const etablissementData = {
			nom: data.get('nom') as string,
			code: data.get('code') as string,
			adresse: data.get('adresse') as string,
			statut: data.get('statut') as string,
			surface: data.get('surface') as string,
			collaborateurs: data.get('collaborateurs') as string,
			statut_operationnel: data.get('statut_operationnel') as string
		};

		// Validation
		if (!id || !etablissementData.nom || !etablissementData.code) {
			return fail(400, { message: 'ID, nom et code sont requis' });
		}

		try {
			const apiClient = createApiClient(fetch);

			const response = await apiClient.updateEtablissement(id, etablissementData);

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

			const response = await apiClient.deleteEtablissement(id);

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
