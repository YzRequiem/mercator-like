import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/apiClient';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);
		const response = await apiClient.getIncidents();
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

		// Validation des champs requis
		const nom = data.get('nom') as string;
		const impact = data.get('impact') as string;

		if (!nom?.trim()) {
			return fail(400, { error: "Le nom de l'incident est requis" });
		}

		if (!impact?.trim()) {
			return fail(400, { error: "L'impact est requis" });
		}

		const incidentData = {
			nom: nom.trim(),
			impact: impact.trim(),
			date: (data.get('date') as string)?.trim() || undefined,
			statut: (data.get('statut') as string)?.trim() || undefined,
			description: (data.get('description') as string)?.trim() || undefined,
			duree: (data.get('duree') as string)?.trim() || undefined,
			cout_estime: data.get('cout_estime') ? Number(data.get('cout_estime')) : undefined,
			cause: (data.get('cause') as string)?.trim() || undefined,
			mesures_correctives: data.get('mesures_correctives')
				? JSON.parse(data.get('mesures_correctives') as string)
				: []
		};

		console.log('Creating incident with data:', incidentData); // Debug

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.createIncident(incidentData);
			console.log('API response:', response); // Debug
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { error: response.error || 'Erreur lors de la création' });
			}
		} catch (error) {
			console.error('Erreur lors de la création:', error);
			return fail(500, {
				error:
					'Erreur interne du serveur: ' +
					(error instanceof Error ? error.message : 'Erreur inconnue')
			});
		}
	},

	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		// Validation des champs requis
		const nom = data.get('nom') as string;
		const impact = data.get('impact') as string;

		if (!nom?.trim()) {
			return fail(400, { error: "Le nom de l'incident est requis" });
		}

		if (!impact?.trim()) {
			return fail(400, { error: "L'impact est requis" });
		}

		const incidentData = {
			nom: nom.trim(),
			impact: impact.trim(),
			date: (data.get('date') as string)?.trim() || undefined,
			statut: (data.get('statut') as string)?.trim() || undefined,
			description: (data.get('description') as string)?.trim() || undefined,
			duree: (data.get('duree') as string)?.trim() || undefined,
			cout_estime: data.get('cout_estime') ? Number(data.get('cout_estime')) : undefined,
			cause: (data.get('cause') as string)?.trim() || undefined,
			mesures_correctives: data.get('mesures_correctives')
				? JSON.parse(data.get('mesures_correctives') as string)
				: []
		};

		console.log('Updating incident with data:', incidentData); // Debug

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.updateIncident(id, incidentData);
			console.log('Update API response:', response); // Debug
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { error: response.error || 'Erreur lors de la mise à jour' });
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour:', error);
			return fail(500, {
				error:
					'Erreur interne du serveur: ' +
					(error instanceof Error ? error.message : 'Erreur inconnue')
			});
		}
	},

	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.deleteIncident(id);
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
