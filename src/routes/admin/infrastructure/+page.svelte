<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'type', label: 'Type', type: 'text' },
		{ key: 'localisation', label: 'Localisation', type: 'text' },
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'Opérationnel', label: 'Opérationnel' },
				{ value: 'En maintenance', label: 'En maintenance' },
				{ value: 'Hors service', label: 'Hors service' },
				{ value: 'En attente', label: 'En attente' }
			]
		},
		{ key: 'capacite', label: 'Capacité', type: 'text' },
		{ key: 'utilisation', label: 'Utilisation', type: 'text' },
		{
			key: 'redondance',
			label: 'Redondance',
			type: 'select',
			options: [
				{ value: 'Aucune', label: 'Aucune' },
				{ value: 'Partielle', label: 'Partielle' },
				{ value: 'Complète', label: 'Complète' }
			]
		},
		{ key: 'modele', label: 'Modèle', type: 'text' },
		{ key: 'date_installation', label: "Date d'installation", type: 'date' },
		{
			key: 'garantie',
			label: 'Garantie',
			type: 'select',
			options: [
				{ value: 'Active', label: 'Active' },
				{ value: 'Expirée', label: 'Expirée' },
				{ value: 'N/A', label: 'N/A' }
			]
		},
		{ key: 'cout_acquisition', label: "Coût d'acquisition", type: 'number' },
		{ key: 'maintenance', label: 'Maintenance', type: 'text' },
		{ key: 'bande_passante', label: 'Bande passante', type: 'text' },
		{ key: 'disponibilite', label: 'Disponibilité', type: 'text' },
		{ key: 'fournisseur', label: 'Fournisseur', type: 'text' },
		{ key: 'cout_mensuel', label: 'Coût mensuel', type: 'number' },
		{ key: 'sla', label: 'SLA', type: 'text' },
		{ key: 'nombre', label: 'Nombre', type: 'text' },
		{ key: 'os', label: "Système d'exploitation", type: 'text' },
		{ key: 'age_moyen', label: 'Âge moyen', type: 'text' },
		{ key: 'cout_total', label: 'Coût total', type: 'number' },
		{ key: 'risques', label: 'Risques', type: 'tags' }
	];

	const displayFields = ['nom', 'type', 'localisation', 'statut', 'modele', 'garantie'];
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
