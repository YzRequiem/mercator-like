<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'type', label: 'Type', type: 'text', required: true },
		{ key: 'version', label: 'Version', type: 'text' },
		{ key: 'editeur', label: 'Éditeur', type: 'text' },
		{ key: 'url', label: 'URL', type: 'url' },
		{ key: 'description', label: 'Description', type: 'textarea' },
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'actif', label: 'Actif' },
				{ value: 'inactif', label: 'Inactif' },
				{ value: 'maintenance', label: 'En maintenance' }
			]
		}
	];

	const displayFields = ['nom', 'type', 'version', 'editeur', 'statut'];
</script>

<svelte:head>
	<title>Applications - Administration</title>
</svelte:head>

<CrudPage
	data={data.applications || []}
	entityType="applications"
	entityLabel="Applications"
	entityIcon="💻"
	{fields}
	{displayFields}
/>
