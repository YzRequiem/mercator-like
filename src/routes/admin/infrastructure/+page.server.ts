import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/apiClient';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);const response = await apiClient.getInfrastructure();
		if (response.success) {
			return {
				infrastructure: response.data
			};
		} else {
			return {
				infrastructure: [],
				error: response.error
			};
		}
	} catch (error) {
		console.error("Erreur lors du chargement de l'infrastructure:", error);
		return {
			infrastructure: [],
			error: 'Erreur lors du chargement des données'
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const infrastructureData = {
			nom: data.get('nom') as string,
			type: data.get('type') as string,
			description: data.get('description') as string,
			localisation: data.get('localisation') as string,
			responsable: data.get('responsable') as string,
			statut: data.get('statut') as string,
			dateInstallation: data.get('dateInstallation') as string
		};

		try {
			const apiClient = createApiClient(fetch);const response = await apiClient.createInfrastructure(infrastructureData);
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
		const infrastructureData = {
			nom: data.get('nom') as string,
			type: data.get('type') as string,
			description: data.get('description') as string,
			localisation: data.get('localisation') as string,
			responsable: data.get('responsable') as string,
			statut: data.get('statut') as string,
			dateInstallation: data.get('dateInstallation') as string
		};

		try {
			const apiClient = createApiClient(fetch);const response = await apiClient.updateInfrastructure(id, infrastructureData);
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
			const apiClient = createApiClient(fetch);const response = await apiClient.deleteInfrastructure(id);
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

