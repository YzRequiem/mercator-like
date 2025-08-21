<!-- Page de test et démo de l'API CRUD -->
<script lang="ts">
	import EtablissementsManager from '$lib/components/EtablissementsManager.svelte';
	import ApiTester from '$lib/components/ApiTester.svelte';

	let currentView = 'tester';

	const views = [
		{ id: 'tester', label: 'Testeur API', icon: '🔧' },
		{ id: 'etablissements', label: 'Gestion Établissements', icon: '🏢' },
		{ id: 'documentation', label: 'Documentation', icon: '📚' }
	];

	function showDocumentation() {
		window.open('/api', '_blank');
	}
</script>

<svelte:head>
	<title>Mercator-like - API CRUD</title>
</svelte:head>

<main>
	<header>
		<h1>🗺️ Mercator-like - API CRUD</h1>
		<p>Application de cartographie d'entreprise avec API complète</p>
	</header>

	<nav class="tab-navigation">
		{#each views as view}
			<button
				class="tab-button {currentView === view.id ? 'active' : ''}"
				on:click={() => (currentView = view.id)}
			>
				<span class="tab-icon">{view.icon}</span>
				{view.label}
			</button>
		{/each}

		<button class="tab-button external" on:click={showDocumentation}>
			<span class="tab-icon">🔗</span>
			Voir API en direct
		</button>
	</nav>

	<div class="content">
		{#if currentView === 'tester'}
			<div class="view-header">
				<h2>🔧 Testeur d'API</h2>
				<p>Vérifiez que tous vos endpoints CRUD fonctionnent correctement</p>
			</div>
			<ApiTester />
		{:else if currentView === 'etablissements'}
			<div class="view-header">
				<h2>🏢 Gestion des Établissements</h2>
				<p>Exemple d'interface CRUD utilisant l'API</p>
			</div>
			<EtablissementsManager />
		{:else if currentView === 'documentation'}
			<div class="view-header">
				<h2>📚 Documentation API</h2>
			</div>

			<div class="documentation">
				<div class="doc-section">
					<h3>🎯 Endpoints disponibles</h3>
					<div class="endpoints-grid">
						<div class="endpoint-card">
							<h4>Établissements</h4>
							<code>GET/POST /api/etablissements</code>
							<code>GET/PUT/DELETE /api/etablissements/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Processus</h4>
							<code>GET/POST /api/processus</code>
							<code>GET/PUT/DELETE /api/processus/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Acteurs</h4>
							<code>GET/POST /api/acteurs</code>
							<code>GET/PUT/DELETE /api/acteurs/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Applications</h4>
							<code>GET/POST /api/applications</code>
							<code>GET/PUT/DELETE /api/applications/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Infrastructure</h4>
							<code>GET/POST /api/infrastructure</code>
							<code>GET/PUT/DELETE /api/infrastructure/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Incidents</h4>
							<code>GET/POST /api/incidents</code>
							<code>GET/PUT/DELETE /api/incidents/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Fonctions</h4>
							<code>GET/POST /api/fonctions</code>
							<code>GET/PUT/DELETE /api/fonctions/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Données</h4>
							<code>GET/POST /api/donnees</code>
							<code>GET/PUT/DELETE /api/donnees/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Écosystème</h4>
							<code>GET/POST /api/ecosysteme</code>
							<code>GET/PUT/DELETE /api/ecosysteme/[id]</code>
						</div>

						<div class="endpoint-card">
							<h4>Sécurité</h4>
							<code>GET/PUT /api/securite</code>
						</div>
					</div>
				</div>

				<div class="doc-section">
					<h3>🔧 Utilisation du client TypeScript</h3>
					<pre><code
							>import {'{'}apiClient{'}'} from '$lib/apiClient';

// Récupérer tous les établissements
const response = await apiClient.getEtablissements();
if (response.success) {'{'}
    console.log(response.data);
{'}'}

// Créer un nouvel établissement
const newEtab = await apiClient.createEtablissement({'{'}
    nom: 'Nouvel établissement',
    code: 'NEW001',
    adresse: '123 Rue Example'
{'}'});

// Modifier un établissement
const updated = await apiClient.updateEtablissement('id', {'{'}
    nom: 'Nom modifié'
{'}'});

// Supprimer un établissement
await apiClient.deleteEtablissement('id');</code
						></pre>
				</div>

				<div class="doc-section">
					<h3>📊 Format des réponses</h3>
					<pre><code
							>// Réponse pour une liste d'éléments
{'{'}
    "success": true,
    "data": [
        {'{'}
            "id": "1",
            "nom": "Établissement 1",
            // ... autres propriétés
        {'}'},
        // ... autres éléments
    ]
{'}'}

// Réponse pour un élément unique
{'{'}
    "success": true,
    "data": {'{'}
        "id": "1",
        "nom": "Établissement 1",
        // ... autres propriétés
    {'}'}
{'}'}

// Réponse d'erreur
{'{'}
    "success": false,
    "error": "Message d'erreur"
{'}'}</code
						></pre>
				</div>

				<div class="doc-section">
					<h3>🌐 Base de données</h3>
					<div class="database-info">
						<p><strong>Type:</strong> Turso (libSQL)</p>
						<p><strong>Connexion:</strong> Cloud via TURSO_DATABASE_URL</p>
						<p><strong>Tables:</strong> 11 entités avec support JSON pour données complexes</p>
						<p><strong>Migration:</strong> Données migrées depuis JSON vers base de données</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #f5f7fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	main {
		min-height: 100vh;
	}

	header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 30px 20px;
		text-align: center;
	}

	header h1 {
		margin: 0 0 10px 0;
		font-size: 2.5rem;
		font-weight: 700;
	}

	header p {
		margin: 0;
		opacity: 0.9;
		font-size: 1.1rem;
	}

	.tab-navigation {
		display: flex;
		background: white;
		border-bottom: 1px solid #ddd;
		padding: 0 20px;
		gap: 5px;
		overflow-x: auto;
	}

	.tab-button {
		background: none;
		border: none;
		padding: 15px 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #666;
		border-bottom: 3px solid transparent;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.tab-button:hover {
		color: #333;
		background: #f8f9fa;
	}

	.tab-button.active {
		color: #667eea;
		border-bottom-color: #667eea;
		background: #f8f9fa;
	}

	.tab-button.external {
		color: #28a745;
		margin-left: auto;
	}

	.tab-button.external:hover {
		color: #1e7e34;
	}

	.tab-icon {
		font-size: 16px;
	}

	.content {
		padding: 0;
	}

	.view-header {
		background: white;
		padding: 30px 20px;
		border-bottom: 1px solid #eee;
		text-align: center;
	}

	.view-header h2 {
		margin: 0 0 10px 0;
		color: #333;
		font-size: 2rem;
	}

	.view-header p {
		margin: 0;
		color: #666;
		font-size: 1.1rem;
	}

	.documentation {
		max-width: 1000px;
		margin: 0 auto;
		padding: 20px;
	}

	.doc-section {
		background: white;
		margin-bottom: 30px;
		border-radius: 8px;
		padding: 25px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.doc-section h3 {
		margin: 0 0 20px 0;
		color: #333;
		font-size: 1.5rem;
	}

	.endpoints-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 15px;
	}

	.endpoint-card {
		background: #f8f9fa;
		padding: 15px;
		border-radius: 6px;
		border-left: 4px solid #667eea;
	}

	.endpoint-card h4 {
		margin: 0 0 10px 0;
		color: #333;
		font-size: 1.1rem;
	}

	.endpoint-card code {
		display: block;
		font-size: 12px;
		color: #666;
		margin: 5px 0;
		font-family: 'SF Mono', Consolas, monospace;
	}

	pre {
		background: #f8f9fa;
		padding: 20px;
		border-radius: 6px;
		overflow-x: auto;
		border-left: 4px solid #667eea;
	}

	pre code {
		font-family: 'SF Mono', Consolas, monospace;
		font-size: 13px;
		line-height: 1.6;
		color: #333;
	}

	.database-info {
		background: #f8f9fa;
		padding: 20px;
		border-radius: 6px;
		border-left: 4px solid #28a745;
	}

	.database-info p {
		margin: 8px 0;
		color: #333;
	}

	.database-info strong {
		color: #28a745;
	}
</style>
