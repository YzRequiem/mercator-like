import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/apiClient';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);
		const [applicationsResponse, processusResponse, acteursResponse, etablissementsResponse] =
			await Promise.all([
				apiClient.getApplications(),
				apiClient.getProcessus(),
				apiClient.getActeurs(),
				apiClient.getEtablissements()
			]);

		if (applicationsResponse.success) {
			return {
				applications: applicationsResponse.data || [],
				processus: processusResponse.success ? processusResponse.data || [] : [],
				acteurs: acteursResponse.success ? acteursResponse.data || [] : [],
				etablissements: etablissementsResponse.success ? etablissementsResponse.data || [] : []
			};
		} else {
			return {
				applications: [],
				processus: [],
				acteurs: [],
				etablissements: [],
				error: applicationsResponse.error
			};
		}
	} catch (error) {
		console.error('Erreur lors du chargement des applications:', error);
		return {
			applications: [],
			processus: [],
			acteurs: [],
			etablissements: [],
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
			domaine: data.get('domaine') as string,
			criticite: data.get('criticite') as string,
			statut: data.get('statut') as string,
			users: data.get('users') as string,
			sites: JSON.parse((data.get('sites') as string) || '[]'),
			conformite: data.get('conformite') as string,
			version: data.get('version') as string,
			editeur: data.get('editeur') as string,
			cout_annuel: parseFloat((data.get('cout_annuel') as string) || '0') || undefined,
			date_mise_en_service: data.get('date_mise_en_service') as string,
			risques: JSON.parse((data.get('risques') as string) || '[]'),
			fonctionnalites: JSON.parse((data.get('fonctionnalites') as string) || '[]')
		};

		// Validation
		if (!applicationData.nom) {
			return fail(400, { message: 'Le nom est requis' });
		}

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.createApplication(applicationData);
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { message: response.error || 'Erreur lors de la création' });
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
			domaine: data.get('domaine') as string,
			criticite: data.get('criticite') as string,
			statut: data.get('statut') as string,
			users: data.get('users') as string,
			sites: JSON.parse((data.get('sites') as string) || '[]'),
			conformite: data.get('conformite') as string,
			version: data.get('version') as string,
			editeur: data.get('editeur') as string,
			cout_annuel: parseFloat((data.get('cout_annuel') as string) || '0') || undefined,
			date_mise_en_service: data.get('date_mise_en_service') as string,
			risques: JSON.parse((data.get('risques') as string) || '[]'),
			fonctionnalites: JSON.parse((data.get('fonctionnalites') as string) || '[]')
		};

		// Validation
		if (!id || !applicationData.nom) {
			return fail(400, { message: 'ID et nom sont requis' });
		}

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.updateApplication(id, applicationData);
			if (response.success) {
				return { success: true };
			} else {
				return fail(400, { message: response.error || 'Erreur lors de la mise à jour' });
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
