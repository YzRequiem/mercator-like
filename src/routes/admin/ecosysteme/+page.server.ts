import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/apiClient';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);
		const response = await apiClient.getEcosysteme();
		if (response.success) {
			return {
				ecosysteme: response.data
			};
		} else {
			return {
				ecosysteme: [],
				error: response.error
			};
		}
	} catch (error) {
		console.error("Erreur lors du chargement de l'écosystème:", error);
		return {
			ecosysteme: [],
			error: 'Erreur lors du chargement des données'
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const ecosystemeData = {
			id: data.get('nom')?.toString().toLowerCase().replace(/\s+/g, '-') || '',
			nom: data.get('nom') as string,
			type: data.get('type') as string,
			relation: data.get('relation') as string
		};

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.createEcosysteme(ecosystemeData);
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
		const ecosystemeData = {
			nom: data.get('nom') as string,
			type: data.get('type') as string,
			relation: data.get('relation') as string
		};

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.updateEcosysteme(id, ecosystemeData);
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
			const response = await apiClient.deleteEcosysteme(id);
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
