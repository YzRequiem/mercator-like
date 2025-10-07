<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';
	import { Workflow } from 'lucide-svelte';

	export let data: PageData;

	// Préparer les options pour les sélecteurs
	const acteursOptions =
		data.acteurs?.map((acteur) => ({
			value: acteur.nom,
			label: acteur.nom
		})) || [];

	const etablissementsOptions =
		data.etablissements?.map((etablissement) => ({
			value: etablissement.nom,
			label: etablissement.nom
		})) || [];

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{
			key: 'sous_processus',
			label: 'Sous-processus',
			type: 'sub-objects',
			subFields: [
				{ key: 'nom', label: 'Nom', type: 'text' },
				{ key: 'acteurs', label: 'Acteurs', type: 'select-tags', options: acteursOptions },
				{ key: 'sites', label: 'Sites', type: 'select-tags', options: etablissementsOptions },
				{ key: 'description', label: 'Description', type: 'textarea' }
			]
		}
	];

	const displayFields = ['nom', 'sous_processus'];

	const referenceData = {
		acteurs: data.acteurs || [],
		etablissements: data.etablissements || []
	};
</script>

<CrudPage
	data={data.processus}
	entityType="processus"
	entityLabel="Processus"
	entityIcon={Workflow}
	{fields}
	{displayFields}
	{referenceData}
/>
