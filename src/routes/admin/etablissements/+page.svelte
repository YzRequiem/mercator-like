<script lang="ts">
	import type { PageData } from './$types';
	import CrudPage from '$lib/components/CrudPage.svelte';
	import { Building2 } from 'lucide-svelte';

	export let data: PageData;

	const fields = [
		{ key: 'nom', label: 'Nom', type: 'text', required: true },
		{ key: 'code', label: 'Code', type: 'text', required: true },
		{ key: 'adresse', label: 'Adresse', type: 'text' },
		{ key: 'statut', label: 'Statut', type: 'text' },
		{ key: 'surface', label: 'Surface', type: 'text' },
		{ key: 'collaborateurs', label: 'Collaborateurs', type: 'text' },
		{
			key: 'statut_operationnel',
			label: 'Statut opérationnel',
			type: 'select',
			options: [
				{ value: 'actif', label: 'Actif' },
				{ value: 'inactif', label: 'Inactif' }
			],
			required: true
		},
		{
			key: 'activites',
			label: 'Activités',
			type: 'tags',
			placeholder: 'Ajouter une activité...'
		},
		{
			key: 'equipements',
			label: 'Équipements',
			type: 'tags',
			placeholder: 'Ajouter un équipement...'
		},
		{
			key: 'risques',
			label: 'Risques',
			type: 'tags',
			placeholder: 'Ajouter un risque...'
		}
	];

	const displayFields = ['nom', 'code', 'statut', 'statut_operationnel', 'activites'];
</script>

<CrudPage
	data={data.etablissements}
	entityType="etablissements"
	entityLabel="Établissements"
	entityIcon={Building2}
	{fields}
	{displayFields}
/>
