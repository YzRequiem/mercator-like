<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';

	export let data: PageData;

	// Créer les options pour le sélecteur de domaine (processus)
	const domaineOptions = (data.processus || []).map((processus) => ({
		value: processus.nom,
		label: processus.nom
	}));

	// Créer les options pour le sélecteur d'utilisateurs (acteurs)
	const usersOptions = (data.acteurs || []).map((acteur) => ({
		value: acteur.nom,
		label: acteur.nom
	}));

	// Créer les options pour le sélecteur de sites (établissements)
	const sitesOptions = (data.etablissements || []).map((etablissement) => ({
		value: etablissement.nom,
		label: etablissement.nom
	}));

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'type', label: 'Type', type: 'text' },
		{
			key: 'domaine',
			label: 'Domaine (Processus)',
			type: 'select',
			options: domaineOptions
		},
		{
			key: 'criticite',
			label: 'Criticité',
			type: 'select',
			options: [
				{ value: 'Critique', label: 'Critique' },
				{ value: 'Haute', label: 'Haute' },
				{ value: 'Moyenne', label: 'Moyenne' },
				{ value: 'Faible', label: 'Faible' }
			]
		},
		{
			key: 'statut',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'En service', label: 'En service' },
				{ value: 'Hors service', label: 'Hors service' },
				{ value: 'En maintenance', label: 'En maintenance' },
				{ value: 'En développement', label: 'En développement' }
			]
		},
		{
			key: 'users',
			label: 'Utilisateurs (Acteurs)',
			type: 'select',
			options: usersOptions
		},
		{
			key: 'sites',
			label: 'Sites (Établissements)',
			type: 'select-tags',
			options: sitesOptions
		},
		{
			key: 'conformite',
			label: 'Conformité',
			type: 'select',
			options: [
				{ value: 'Conforme', label: 'Conforme' },
				{ value: 'Partielle', label: 'Partielle' },
				{ value: 'Non conforme', label: 'Non conforme' }
			]
		},
		{ key: 'version', label: 'Version', type: 'text' },
		{ key: 'editeur', label: 'Éditeur', type: 'text' },
		{ key: 'cout_annuel', label: 'Coût annuel', type: 'number' },
		{ key: 'date_mise_en_service', label: 'Date de mise en service', type: 'date' },
		{ key: 'risques', label: 'Risques', type: 'tags' },
		{ key: 'fonctionnalites', label: 'Fonctionnalités', type: 'tags' }
	];

	const displayFields = ['nom', 'type', 'domaine', 'criticite', 'statut', 'conformite'];
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
