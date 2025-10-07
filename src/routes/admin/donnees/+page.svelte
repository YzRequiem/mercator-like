<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';
	import { Database } from 'lucide-svelte';

	export let data: PageData;

	// Créer les options pour le sélecteur de propriétaire à partir des acteurs
	const proprietaireOptions = (data.acteurs || []).map((acteur) => ({
		value: acteur.nom,
		label: acteur.nom
	}));

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'source', label: 'Source', type: 'text' },
		{
			key: 'qualite',
			label: 'Qualité',
			type: 'select',
			options: [
				{ value: 'Très faible', label: 'Très faible' },
				{ value: 'Faible', label: 'Faible' },
				{ value: 'Moyenne', label: 'Moyenne' },
				{ value: 'Bonne', label: 'Bonne' },
				{ value: 'Très bonne', label: 'Très bonne' }
			]
		},
		{
			key: 'volume',
			label: 'Volume',
			type: 'select',
			options: [
				{ value: 'Très faible', label: 'Très faible' },
				{ value: 'Faible', label: 'Faible' },
				{ value: 'Moyen', label: 'Moyen' },
				{ value: 'Élevé', label: 'Élevé' },
				{ value: 'Très élevé', label: 'Très élevé' }
			]
		},
		{
			key: 'frequence_maj',
			label: 'Fréquence de mise à jour',
			type: 'select',
			options: [
				{ value: 'En temps réel', label: 'En temps réel' },
				{ value: 'Quotidienne', label: 'Quotidienne' },
				{ value: 'Hebdomadaire', label: 'Hebdomadaire' },
				{ value: 'Mensuelle', label: 'Mensuelle' },
				{ value: 'Annuelle', label: 'Annuelle' },
				{ value: 'Ponctuelle', label: 'Ponctuelle' }
			]
		},
		{
			key: 'proprietaire',
			label: 'Propriétaire',
			type: 'select',
			options: proprietaireOptions
		},
		{
			key: 'sensibilite',
			label: 'Sensibilité',
			type: 'select',
			options: [
				{ value: 'Public', label: 'Public' },
				{ value: 'Interne', label: 'Interne' },
				{ value: 'Confidentiel', label: 'Confidentiel' },
				{ value: 'Secret', label: 'Secret' }
			]
		},
		{ key: 'retention', label: 'Durée de rétention', type: 'text' },
		{ key: 'format', label: 'Format', type: 'text' },
		{ key: 'taille_estimee', label: 'Taille estimée', type: 'text' }
	];

	const displayFields = ['nom', 'source', 'qualite', 'volume', 'proprietaire', 'sensibilite'];
</script>

<svelte:head>
	<title>Données - Administration</title>
</svelte:head>

<CrudPage
	data={data.donnees || []}
	entityType="donnees"
	entityLabel="Données"
	entityIcon={Database}
	{fields}
	{displayFields}
/>
