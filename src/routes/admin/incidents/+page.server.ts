import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/apiClient';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);const response = await apiClient.getIncidents();
		if (response.success) {
			return {
				incidents: response.data
			};
		} else {
			return {
				incidents: [],
				error: response.error
			};
		}
	} catch (error) {
		console.error('Erreur lors du chargement des incidents:', error);
		return {
			incidents: [],
			error: 'Erreur lors du chargement des données'
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const incidentData = {
			titre: data.get('titre') as string,
			description: data.get('description') as string,
			gravite: data.get('gravite') as string,
			statut: data.get('statut') as string,
			dateOuverture: data.get('dateOuverture') as string,
			dateFermeture: data.get('dateFermeture') as string,
			responsable: data.get('responsable') as string,
			resolution: data.get('resolution') as string
		};

		try {
			const apiClient = createApiClient(fetch);const response = await apiClient.createIncident(incidentData);
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
		const incidentData = {
			titre: data.get('titre') as string,
			description: data.get('description') as string,
			gravite: data.get('gravite') as string,
			statut: data.get('statut') as string,
			dateOuverture: data.get('dateOuverture') as string,
			dateFermeture: data.get('dateFermeture') as string,
			responsable: data.get('responsable') as string,
			resolution: data.get('resolution') as string
		};

		try {
			const apiClient = createApiClient(fetch);const response = await apiClient.updateIncident(id, incidentData);
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
			const apiClient = createApiClient(fetch);const response = await apiClient.deleteIncident(id);
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

