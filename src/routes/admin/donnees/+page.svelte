<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'description', label: 'Description', type: 'textarea' },
		{
			key: 'type',
			label: 'Type',
			type: 'select',
			options: [
				{ value: 'reference', label: 'Référence' },
				{ value: 'transactionnel', label: 'Transactionnel' },
				{ value: 'analytique', label: 'Analytique' },
				{ value: 'historique', label: 'Historique' }
			]
		},
		{ key: 'source', label: 'Source', type: 'text' },
		{
			key: 'format',
			label: 'Format',
			type: 'select',
			options: [
				{ value: 'sql', label: 'SQL' },
				{ value: 'xml', label: 'XML' },
				{ value: 'json', label: 'JSON' },
				{ value: 'csv', label: 'CSV' },
				{ value: 'excel', label: 'Excel' }
			]
		},
		{ key: 'proprietaire', label: 'Propriétaire', type: 'text' },
		{
			key: 'confidentialite',
			label: 'Confidentialité',
			type: 'select',
			options: [
				{ value: 'public', label: 'Public' },
				{ value: 'interne', label: 'Interne' },
				{ value: 'confidentiel', label: 'Confidentiel' },
				{ value: 'secret', label: 'Secret' }
			]
		},
		{ key: 'dateCreation', label: 'Date de création', type: 'date' }
	];

	const displayFields = ['nom', 'type', 'format', 'proprietaire', 'confidentialite'];
</script>

<svelte:head>
	<title>Données - Administration</title>
</svelte:head>

<CrudPage
	data={data.donnees || []}
	entityType="donnees"
	entityLabel="Données"
	entityIcon="📊"
	{fields}
	{displayFields}
/>
