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
			required: true,
			options: [
				{ value: 'serveur', label: 'Serveur' },
				{ value: 'reseau', label: 'Réseau' },
				{ value: 'stockage', label: 'Stockage' },
				{ value: 'securite', label: 'Sécurité' }
			]
		},
		{ key: 'description', label: 'Description', type: 'textarea' },
		{ key: 'localisation', label: 'Localisation', type: 'text' },
		{ key: 'responsable', label: 'Responsable', type: 'text' },
		{ key: 'dateInstallation', label: "Date d'installation", type: 'date' },
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'operationnel', label: 'Opérationnel' },
				{ value: 'maintenance', label: 'En maintenance' },
				{ value: 'arret', label: "À l'arrêt" },
				{ value: 'obsolete', label: 'Obsolète' }
			]
		}
	];

	const displayFields = ['nom', 'type', 'localisation', 'responsable', 'statut'];
</script>

<svelte:head>
	<title>Infrastructure - Administration</title>
</svelte:head>

<CrudPage
	data={data.infrastructure || []}
	entityType="infrastructure"
	entityLabel="Infrastructure"
	entityIcon="🏗️"
	{fields}
	{displayFields}
/>
