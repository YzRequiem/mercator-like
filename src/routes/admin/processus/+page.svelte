<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [{ key: 'nom', label: 'Nom', type: 'text', required: true }];

	const displayFields = ['nom'];
</script>

<CrudPage
	data={data.processus}
	entityType="processus"
	entityLabel="Processus"
	entityIcon="⚙️"
	{fields}
	{displayFields}
/>
