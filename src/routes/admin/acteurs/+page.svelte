<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';
	import { Users } from 'lucide-svelte';

	export let data: PageData;

	// Préparer les options pour les sites
	const sitesOptions =
		data.etablissements?.map((etablissement) => ({
			value: etablissement.nom,
			label: etablissement.nom
		})) || [];

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'site', label: 'Site', type: 'select', options: sitesOptions },
		{ key: 'role', label: 'Rôle', type: 'text' }
	];

	const displayFields = ['nom', 'site', 'role'];

	const referenceData = {
		etablissements: data.etablissements || []
	};
</script>

<CrudPage
	data={data.acteurs}
	entityType="acteurs"
	entityLabel="Acteurs"
	entityIcon={Users}
	{fields}
	{displayFields}
	{referenceData}
/>
