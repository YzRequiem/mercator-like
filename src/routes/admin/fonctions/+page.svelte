<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'description', label: 'Description', type: 'textarea' },
		{
			key: 'domaine',
			label: 'Domaine',
			type: 'select',
			options: [
				{ value: 'metier', label: 'Métier' },
				{ value: 'support', label: 'Support' },
				{ value: 'technique', label: 'Technique' },
				{ value: 'management', label: 'Management' }
			]
		},
		{ key: 'processus', label: 'Processus', type: 'text' },
		{ key: 'responsable', label: 'Responsable', type: 'text' },
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'actif', label: 'Actif' },
				{ value: 'inactif', label: 'Inactif' },
				{ value: 'obsolete', label: 'Obsolète' }
			]
		}
	];

	const displayFields = ['nom', 'domaine', 'statut', 'processus', 'responsable'];
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
