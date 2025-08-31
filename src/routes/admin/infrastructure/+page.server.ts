import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/apiClient';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiClient = createApiClient(fetch);
		const response = await apiClient.getInfrastructure();
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
			localisation: data.get('localisation') as string,
			statut: data.get('statut') as string,
			capacite: data.get('capacite') as string,
			utilisation: data.get('utilisation') as string,
			redondance: data.get('redondance') as string,
			modele: data.get('modele') as string,
			date_installation: data.get('date_installation') as string,
			garantie: data.get('garantie') as string,
			cout_acquisition: data.get('cout_acquisition')
				? Number(data.get('cout_acquisition'))
				: undefined,
			maintenance: data.get('maintenance') as string,
			bande_passante: data.get('bande_passante') as string,
			disponibilite: data.get('disponibilite') as string,
			fournisseur: data.get('fournisseur') as string,
			cout_mensuel: data.get('cout_mensuel') ? Number(data.get('cout_mensuel')) : undefined,
			sla: data.get('sla') as string,
			nombre: data.get('nombre') as string,
			os: data.get('os') as string,
			age_moyen: data.get('age_moyen') as string,
			cout_total: data.get('cout_total') ? Number(data.get('cout_total')) : undefined,
			risques: data.get('risques') ? JSON.parse(data.get('risques') as string) : []
		};

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.createInfrastructure(infrastructureData);
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
			localisation: data.get('localisation') as string,
			statut: data.get('statut') as string,
			capacite: data.get('capacite') as string,
			utilisation: data.get('utilisation') as string,
			redondance: data.get('redondance') as string,
			modele: data.get('modele') as string,
			date_installation: data.get('date_installation') as string,
			garantie: data.get('garantie') as string,
			cout_acquisition: data.get('cout_acquisition')
				? Number(data.get('cout_acquisition'))
				: undefined,
			maintenance: data.get('maintenance') as string,
			bande_passante: data.get('bande_passante') as string,
			disponibilite: data.get('disponibilite') as string,
			fournisseur: data.get('fournisseur') as string,
			cout_mensuel: data.get('cout_mensuel') ? Number(data.get('cout_mensuel')) : undefined,
			sla: data.get('sla') as string,
			nombre: data.get('nombre') as string,
			os: data.get('os') as string,
			age_moyen: data.get('age_moyen') as string,
			cout_total: data.get('cout_total') ? Number(data.get('cout_total')) : undefined,
			risques: data.get('risques') ? JSON.parse(data.get('risques') as string) : []
		};

		try {
			const apiClient = createApiClient(fetch);
			const response = await apiClient.updateInfrastructure(id, infrastructureData);
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
			const response = await apiClient.deleteInfrastructure(id);
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
