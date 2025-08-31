<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'critique', label: 'Critique' },
				{ value: 'partiel', label: 'Partiel' },
				{ value: 'externe', label: 'Externe' },
				{ value: 'absent', label: 'Absent' }
			]
		},
		{
			key: 'niveau_automatisation',
			label: "Niveau d'automatisation",
			type: 'select',
			options: [
				{ value: 'manuel', label: 'Manuel' },
				{ value: 'semi-automatique', label: 'Semi-automatique' },
				{ value: 'automatique', label: 'Automatique' },
				{ value: 'externe', label: 'Externe' },
				{ value: 'inexistant', label: 'Inexistant' }
			]
		},
		{
			key: 'frequence_utilisation',
			label: "Fréquence d'utilisation",
			type: 'select',
			options: [
				{ value: 'quotidienne', label: 'Quotidienne' },
				{ value: 'hebdomadaire', label: 'Hebdomadaire' },
				{ value: 'mensuelle', label: 'Mensuelle' },
				{ value: 'ponctuelle', label: 'Ponctuelle' }
			]
		},
		{ key: 'flux', label: 'Flux', type: 'tags' },
		{ key: 'donnees', label: 'Données', type: 'tags' },
		{ key: 'utilisateurs', label: 'Utilisateurs', type: 'tags' },
		{ key: 'sites', label: 'Sites', type: 'tags' },
		{ key: 'description', label: 'Description', type: 'textarea' }
	];

	const displayFields = ['nom', 'statut', 'niveau_automatisation', 'frequence_utilisation'];
</script>

<svelte:head>
	<title>Fonctions - Administration</title>
</svelte:head>

<CrudPage
	data={data.fonctions || []}
	entityType="fonctions"
	entityLabel="Fonctions"
	entityIcon="🔧"
	{fields}
	{displayFields}
/>
