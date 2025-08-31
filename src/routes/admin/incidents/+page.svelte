<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: "Nom de l'incident", type: 'text', required: true },
		{
			key: 'impact',
			label: 'Impact',
			type: 'select',
			required: true,
			options: [
				{ value: 'Critique', label: 'Critique' },
				{ value: 'Majeur', label: 'Majeur' },
				{ value: 'Moyen', label: 'Moyen' },
				{ value: 'Mineur', label: 'Mineur' }
			]
		},
		{ key: 'date', label: "Date de l'incident", type: 'date' },
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'Ouvert', label: 'Ouvert' },
				{ value: 'En cours', label: 'En cours' },
				{ value: 'Résolu', label: 'Résolu' },
				{ value: 'Contenu', label: 'Contenu' },
				{ value: 'Non résolu', label: 'Non résolu' },
				{ value: 'Fermé', label: 'Fermé' }
			]
		},
		{ key: 'duree', label: 'Durée', type: 'text' },
		{ key: 'cout_estime', label: 'Coût estimé (€)', type: 'number' },
		{ key: 'description', label: 'Description', type: 'textarea' },
		{ key: 'cause', label: 'Cause', type: 'textarea' },
		{ key: 'mesures_correctives', label: 'Mesures correctives', type: 'tags' }
	];

	const displayFields = ['nom', 'impact', 'statut', 'date', 'duree', 'cout_estime'];
</script>

<svelte:head>
	<title>Incidents - Administration</title>
</svelte:head>

<CrudPage
	data={data.incidents || []}
	entityType="incidents"
	entityLabel="Incidents"
	entityIcon="⚠️"
	{fields}
	{displayFields}
/>
