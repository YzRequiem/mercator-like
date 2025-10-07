<!-- Page de diagnostique pour tester la connexion API -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/apiClient';
	import {
		Search,
		CheckCircle2,
		XCircle,
		Clock,
		BarChart3,
		AlertTriangle,
		ArrowLeft
	} from 'lucide-svelte';

	let testResults: { [key: string]: any } = {};
	let isLoading = false;

	const endpoints = [
		{ name: 'Établissements', key: 'etablissements', method: 'getEtablissements' },
		{ name: 'Processus', key: 'processus', method: 'getProcessus' },
		{ name: 'Acteurs', key: 'acteurs', method: 'getActeurs' },
		{ name: 'Applications', key: 'applications', method: 'getApplications' },
		{ name: 'Infrastructure', key: 'infrastructure', method: 'getInfrastructure' },
		{ name: 'Incidents', key: 'incidents', method: 'getIncidents' },
		{ name: 'Fonctions', key: 'fonctions', method: 'getFonctions' },
		{ name: 'Données', key: 'donnees', method: 'getDonnees' },
		{ name: 'Écosystème', key: 'ecosysteme', method: 'getEcosysteme' },
		{ name: 'Sécurité', key: 'securite', method: 'getSecurite' }
	];

	async function runDiagnostic() {
		isLoading = true;
		testResults = {};

		console.log('🔍 Diagnostic de connexion API...');

		for (const endpoint of endpoints) {
			console.log(`Testing ${endpoint.name}...`);

			try {
				const result = await (apiClient as any)[endpoint.method]();

				testResults[endpoint.key] = {
					status: result.success ? 'success' : 'error',
					data: result.data,
					error: result.error,
					count: Array.isArray(result.data) ? result.data.length : result.data ? 1 : 0
				};
			} catch (error) {
				testResults[endpoint.key] = {
					status: 'error',
					error: error instanceof Error ? error.message : 'Erreur inconnue',
					count: 0
				};
			}

			// Force reactivity
			testResults = { ...testResults };
		}

		isLoading = false;
		console.log('✅ Diagnostic terminé');
	}

	onMount(() => {
		runDiagnostic();
	});

	function getStatusColor(status: string) {
		switch (status) {
			case 'success':
				return 'text-green-600 bg-green-50';
			case 'error':
				return 'text-red-600 bg-red-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	}
</script>

<svelte:head>
	<title>Diagnostic API - Mercator</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-4xl px-4">
		<div class="mb-8">
			<div class="mb-2 flex items-center gap-3">
				<Search size={28} class="text-blue-600" />
				<h1 class="text-3xl font-bold text-gray-900">Diagnostic API</h1>
			</div>
			<p class="text-gray-600">Vérification de la connectivité et des données de l'API REST</p>
		</div>

		<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">État des endpoints</h2>
				<button
					on:click={runDiagnostic}
					disabled={isLoading}
					class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{isLoading ? 'Test en cours...' : 'Relancer les tests'}
				</button>
			</div>

			{#if isLoading}
				<div class="py-8 text-center">
					<div
						class="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"
					></div>
					<p class="mt-2 text-gray-600">Test des endpoints en cours...</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each endpoints as endpoint}
						{@const result = testResults[endpoint.key]}
						<div
							class="rounded-lg border p-4 {result ? getStatusColor(result.status) : 'bg-gray-50'}"
						>
							<div class="mb-2 flex items-center justify-between">
								<h3 class="font-medium">{endpoint.name}</h3>
								<span class="text-xl">
									{#if result}
										{#if result.status === 'success'}
											<CheckCircle2 size={20} class="text-green-600" />
										{:else if result.status === 'error'}
											<XCircle size={20} class="text-red-600" />
										{:else}
											<Clock size={20} class="text-gray-600" />
										{/if}
									{:else}
										<Clock size={20} class="text-gray-400" />
									{/if}
								</span>
							</div>

							{#if result}
								<div class="space-y-1 text-sm">
									<p><strong>Statut:</strong> {result.status}</p>
									<p><strong>Éléments:</strong> {result.count}</p>
									{#if result.error}
										<p class="text-red-600"><strong>Erreur:</strong> {result.error}</p>
									{/if}
								</div>
							{:else}
								<p class="text-sm text-gray-500">En attente...</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if Object.keys(testResults).length > 0}
			<div class="rounded-lg bg-white p-6 shadow-md">
				<div class="mb-4 flex items-center gap-2">
					<BarChart3 size={20} class="text-blue-600" />
					<h2 class="text-xl font-semibold">Résumé</h2>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">
							{Object.values(testResults).filter((r) => r.status === 'success').length}
						</div>
						<div class="text-sm text-gray-600">Endpoints fonctionnels</div>
					</div>

					<div class="text-center">
						<div class="text-2xl font-bold text-red-600">
							{Object.values(testResults).filter((r) => r.status === 'error').length}
						</div>
						<div class="text-sm text-gray-600">Endpoints en erreur</div>
					</div>

					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">
							{Object.values(testResults).reduce((sum, r) => sum + (r.count || 0), 0)}
						</div>
						<div class="text-sm text-gray-600">Total des données</div>
					</div>
				</div>

				{#if Object.values(testResults).some((r) => r.status === 'error')}
					<div class="mt-6 rounded-md border border-red-200 bg-red-50 p-4">
						<div class="mb-2 flex items-center gap-2">
							<AlertTriangle size={18} class="text-red-800" />
							<h3 class="font-medium text-red-800">Problèmes détectés</h3>
						</div>
						<ul class="space-y-1 text-sm text-red-700">
							{#each Object.entries(testResults) as [key, result]}
								{#if result.status === 'error'}
									<li>• {endpoints.find((e) => e.key === key)?.name}: {result.error}</li>
								{/if}
							{/each}
						</ul>

						<div class="mt-4 text-sm text-red-700">
							<p><strong>Solutions possibles:</strong></p>
							<ul class="mt-1 list-inside list-disc space-y-1">
								<li>Vérifiez que les variables d'environnement Turso sont configurées</li>
								<li>Assurez-vous que la base de données est initialisée</li>
								<li>Vérifiez la connectivité réseau</li>
							</ul>
						</div>
					</div>
				{/if}

				{#if Object.values(testResults).every((r) => r.status === 'success')}
					<div class="mt-6 rounded-md border border-green-200 bg-green-50 p-4">
						<div class="flex items-center gap-2">
							<CheckCircle2 size={18} class="text-green-800" />
							<h3 class="font-medium text-green-800">Tout fonctionne parfaitement !</h3>
						</div>
						<p class="mt-1 text-sm text-green-700">
							Votre API est opérationnelle et toutes les données sont accessibles.
						</p>
					</div>
				{/if}
			</div>
		{/if}

		<div class="mt-6 text-center">
			<a
				href="/"
				class="inline-flex items-center gap-2 text-blue-600 underline hover:text-blue-800"
			>
				<ArrowLeft size={16} />
				Retour à l'application principale
			</a>
		</div>
	</div>
</div>
