<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{
			key: 'type',
			label: 'Type',
			type: 'select',
			options: [
				{ value: 'Client', label: 'Client' },
				{ value: 'Fournisseur', label: 'Fournisseur' },
				{ value: 'Prestataire', label: 'Prestataire' },
				{ value: 'Partenaire', label: 'Partenaire' },
				{ value: 'Organisme', label: 'Organisme' }
			]
		},
		{ key: 'relation', label: 'Relation', type: 'text', required: true }
	];

	const displayFields = ['nom', 'type', 'relation'];
</script>

<svelte:head>
	<title>Écosystème - Administration</title>
</svelte:head>

<CrudPage
	data={data.ecosysteme || []}
	entityType="ecosysteme"
	entityLabel="Écosystème"
	entityIcon="🌐"
	{fields}
	{displayFields}
/>
