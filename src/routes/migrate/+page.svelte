<script lang="ts">
	let isLoading = false;
	let result: any = null;

	async function runMigration() {
		isLoading = true;
		result = null;

		try {
			const response = await fetch('/api/migrate-data', {
				method: 'POST'
			});
			result = await response.json();
		} catch (error) {
			result = {
				success: false,
				error: error instanceof Error ? error.message : 'Erreur inconnue'
			};
		}

		isLoading = false;
	}
</script>

<div class="mx-auto max-w-4xl p-8">
	<h1 class="mb-8 text-3xl font-bold">Migration Turso</h1>

	<div class="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
		<h2 class="mb-4 text-xl font-semibold">Migration des données vers Turso</h2>
		<p class="mb-4 text-gray-700">
			Cliquez sur le bouton ci-dessous pour migrer toutes les données JSON vers votre base de
			données Turso.
		</p>

		<button
			on:click={runMigration}
			disabled={isLoading}
			class="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isLoading}
				Migration en cours...
			{:else}
				Démarrer la migration
			{/if}
		</button>
	</div>

	{#if result}
		<div class="mt-8">
			{#if result.success}
				<div class="rounded-lg border border-green-200 bg-green-50 p-6">
					<h3 class="mb-2 text-lg font-semibold text-green-800">✓ Migration réussie !</h3>
					<p class="mb-4 text-green-700">{result.message}</p>

					{#if result.stats}
						<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
							<div class="rounded border bg-white p-3">
								<div class="text-sm text-gray-600">Établissements</div>
								<div class="text-lg font-semibold">{result.stats.etablissements}</div>
							</div>
							<div class="rounded border bg-white p-3">
								<div class="text-sm text-gray-600">Processus</div>
								<div class="text-lg font-semibold">{result.stats.processus}</div>
							</div>
							<div class="rounded border bg-white p-3">
								<div class="text-sm text-gray-600">Acteurs</div>
								<div class="text-lg font-semibold">{result.stats.acteurs}</div>
							</div>
							<div class="rounded border bg-white p-3">
								<div class="text-sm text-gray-600">Fonctions</div>
								<div class="text-lg font-semibold">{result.stats.fonctions}</div>
							</div>
							<div class="rounded border bg-white p-3">
								<div class="text-sm text-gray-600">Applications</div>
								<div class="text-lg font-semibold">{result.stats.applications}</div>
							</div>
							<div class="rounded border bg-white p-3">
								<div class="text-sm text-gray-600">Infrastructure</div>
								<div class="text-lg font-semibold">{result.stats.infrastructure}</div>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<div class="rounded-lg border border-red-200 bg-red-50 p-6">
					<h3 class="mb-2 text-lg font-semibold text-red-800">✗ Erreur de migration</h3>
					<p class="text-red-700">{result.error}</p>
				</div>
			{/if}
		</div>
	{/if}

	<div class="mt-8">
		<a href="/" class="text-blue-600 hover:text-blue-800">← Retour au tableau de bord</a>
	</div>
</div>
