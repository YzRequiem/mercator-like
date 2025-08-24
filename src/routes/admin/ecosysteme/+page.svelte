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
				{ value: 'interne', label: 'Interne' },
				{ value: 'externe', label: 'Externe' },
				{ value: 'partenaire', label: 'Partenaire' },
				{ value: 'fournisseur', label: 'Fournisseur' }
			]
		},
		{ key: 'domaine', label: 'Domaine', type: 'text' },
		{ key: 'responsable', label: 'Responsable', type: 'text' },
		{ key: 'partenaires', label: 'Partenaires', type: 'textarea' },
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'actif', label: 'Actif' },
				{ value: 'inactif', label: 'Inactif' },
				{ value: 'en_cours', label: 'En cours' },
				{ value: 'suspendu', label: 'Suspendu' }
			]
		}
	];

	const displayFields = ['nom', 'type', 'statut', 'domaine', 'responsable'];
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
