<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'titre', label: 'Titre', type: 'text', required: true },
		{ key: 'description', label: 'Description', type: 'textarea', required: true },
		{
			key: 'gravite',
			label: 'Gravité',
			type: 'select',
			required: true,
			options: [
				{ value: 'critique', label: 'Critique' },
				{ value: 'majeure', label: 'Majeure' },
				{ value: 'moyenne', label: 'Moyenne' },
				{ value: 'mineure', label: 'Mineure' }
			]
		},
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'ouvert', label: 'Ouvert' },
				{ value: 'en_cours', label: 'En cours' },
				{ value: 'resolu', label: 'Résolu' },
				{ value: 'ferme', label: 'Fermé' }
			]
		},
		{ key: 'dateOuverture', label: "Date d'ouverture", type: 'datetime-local' },
		{ key: 'dateFermeture', label: 'Date de fermeture', type: 'datetime-local' },
		{ key: 'responsable', label: 'Responsable', type: 'text' },
		{ key: 'resolution', label: 'Résolution', type: 'textarea' }
	];

	const displayFields = ['titre', 'gravite', 'statut', 'dateOuverture', 'responsable'];
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
