<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'site', label: 'Site', type: 'text' },
		{ key: 'role', label: 'Rôle', type: 'text' }
	];

	const displayFields = ['nom', 'site', 'role'];
</script>

<CrudPage
	data={data.acteurs}
	entityType="acteurs"
	entityLabel="Acteurs"
	entityIcon="👥"
	{fields}
	{displayFields}
/>
