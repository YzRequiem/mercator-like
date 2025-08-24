<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'code', label: 'Code', type: 'text', required: true },
		{ key: 'adresse', label: 'Adresse', type: 'text' },
		{ key: 'statut', label: 'Statut', type: 'text' },
		{ key: 'surface', label: 'Surface', type: 'text' },
		{ key: 'collaborateurs', label: 'Collaborateurs', type: 'text' },
		{ key: 'statut_operationnel', label: 'Statut opérationnel', type: 'text' }
	];

	const displayFields = ['nom', 'code', 'adresse', 'statut'];
</script>

<CrudPage
	data={data.etablissements}
	entityType="etablissements"
	entityLabel="Établissements"
	entityIcon="🏢"
	{fields}
	{displayFields}
/>
