import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/apiClient';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);
		const response = await apiClient.getApplications();
		if (response.success) {
			return {
				applications: response.data
			};
		} else {
			return {
				applications: [],
				error: response.error
			};
		}
	} catch (error) {
		console.error('Erreur lors du chargement des applications:', error);
		return {
			applications: [],
			error: 'Erreur lors du chargement des données'
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const applicationData = {
			nom: data.get('nom') as string,
			type: data.get('type') as string,
			version: data.get('version') as string,
			editeur: data.get('editeur') as string,
			url: data.get('url') as string,
			description: data.get('description') as string,
			statut: data.get('statut') as string
		};

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.createApplication(applicationData);
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
		const applicationData = {
			nom: data.get('nom') as string,
			type: data.get('type') as string,
			version: data.get('version') as string,
			editeur: data.get('editeur') as string,
			url: data.get('url') as string,
			description: data.get('description') as string,
			statut: data.get('statut') as string
		};

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.updateApplication(id, applicationData);
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
			const response = await apiClient.deleteApplication(id);
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
