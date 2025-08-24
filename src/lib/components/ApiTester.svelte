<!-- Composant de test pour l'API CRUD -->
<script lang="ts">
	import { apiClient } from '$lib/apiClient';

	let testResults: { [key: string]: any } = {};
	let testing = false;
	let currentTest = '';

	const endpoints = [
		'etablissements',
		'processus',
		'acteurs',
		'applications',
		'infrastructure',
		'incidents',
		'fonctions',
		'donnees',
		'ecosysteme',
		'securite'
	];

	async function testEndpoint(endpoint: string) {
		currentTest = endpoint;
		testResults[endpoint] = { status: 'testing' };

		try {
			// Test GET all
			const getResponse = await fetch(`/api/${endpoint}`);
			const getData = await getResponse.json();

			testResults[endpoint] = {
				status: getResponse.ok ? 'success' : 'error',
				get: {
					status: getResponse.status,
					success: getData.success,
					dataCount: getData.data?.length || 0,
					error: getData.error
				}
			};

			// Si on a des données, tester GET by ID
			if (getData.success && getData.data && getData.data.length > 0) {
				const firstItem = getData.data[0];
				const getByIdResponse = await fetch(`/api/${endpoint}/${firstItem.id}`);
				const getByIdData = await getByIdResponse.json();

				testResults[endpoint].getById = {
					status: getByIdResponse.status,
					success: getByIdData.success,
					found: !!getByIdData.data,
					error: getByIdData.error
				};
			}
		} catch (error) {
			testResults[endpoint] = {
				status: 'error',
				error: error instanceof Error ? error.message : 'Erreur inconnue'
			};
		}

		currentTest = '';
	}

	async function testAllEndpoints() {
		testing = true;
		testResults = {};

		for (const endpoint of endpoints) {
			await testEndpoint(endpoint);
			// Petite pause entre les tests
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		testing = false;
	}

	async function testApiDocumentation() {
		currentTest = 'documentation';
		testResults.documentation = { status: 'testing' };

		try {
			const response = await fetch('/api');
			const data = await response.json();

			testResults.documentation = {
				status: response.ok ? 'success' : 'error',
				status_code: response.status,
				success: data.success,
				endpoints_count: data.data?.endpoints?.length || 0,
				error: data.error
			};
		} catch (error) {
			testResults.documentation = {
				status: 'error',
				error: error instanceof Error ? error.message : 'Erreur inconnue'
			};
		}

		currentTest = '';
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'success':
				return '#28a745';
			case 'error':
				return '#dc3545';
			case 'testing':
				return '#ffc107';
			default:
				return '#6c757d';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'success':
				return '✅';
			case 'error':
				return '❌';
			case 'testing':
				return '⏳';
			default:
				return '⚪';
		}
	}
</script>

<div class="api-tester">
	<h2>Testeur d'API CRUD</h2>

	<div class="test-actions">
		<button on:click={testAllEndpoints} disabled={testing} class="btn-primary">
			{testing ? 'Test en cours...' : 'Tester tous les endpoints'}
		</button>

		<button on:click={testApiDocumentation} disabled={testing} class="btn-secondary">
			Tester la documentation API
		</button>
	</div>

	{#if currentTest}
		<div class="current-test">
			<p>Test en cours: <strong>{currentTest}</strong></p>
		</div>
	{/if}

	<div class="test-results">
		{#if testResults.documentation}
			<div class="test-result">
				<div class="test-header">
					<span class="status-icon">{getStatusIcon(testResults.documentation.status)}</span>
					<h3>Documentation API</h3>
					<span class="status" style="color: {getStatusColor(testResults.documentation.status)}">
						{testResults.documentation.status}
					</span>
				</div>

				<div class="test-details">
					<p><strong>Status Code:</strong> {testResults.documentation.status_code}</p>
					<p><strong>Success:</strong> {testResults.documentation.success}</p>
					<p><strong>Endpoints disponibles:</strong> {testResults.documentation.endpoints_count}</p>
					{#if testResults.documentation.error}
						<p class="error"><strong>Erreur:</strong> {testResults.documentation.error}</p>
					{/if}
				</div>
			</div>
		{/if}

		{#each endpoints as endpoint}
			{#if testResults[endpoint]}
				<div class="test-result">
					<div class="test-header">
						<span class="status-icon">{getStatusIcon(testResults[endpoint].status)}</span>
						<h3>{endpoint}</h3>
						<span class="status" style="color: {getStatusColor(testResults[endpoint].status)}">
							{testResults[endpoint].status}
						</span>
					</div>

					<div class="test-details">
						{#if testResults[endpoint].get}
							<div class="test-method">
								<h4>GET /{endpoint}</h4>
								<p><strong>Status:</strong> {testResults[endpoint].get.status}</p>
								<p><strong>Success:</strong> {testResults[endpoint].get.success}</p>
								<p><strong>Nombre d'éléments:</strong> {testResults[endpoint].get.dataCount}</p>
								{#if testResults[endpoint].get.error}
									<p class="error"><strong>Erreur:</strong> {testResults[endpoint].get.error}</p>
								{/if}
							</div>
						{/if}

						{#if testResults[endpoint].getById}
							<div class="test-method">
								<h4>GET /{endpoint}/{'{id}'}</h4>
								<p><strong>Status:</strong> {testResults[endpoint].getById.status}</p>
								<p><strong>Success:</strong> {testResults[endpoint].getById.success}</p>
								<p><strong>Élément trouvé:</strong> {testResults[endpoint].getById.found}</p>
								{#if testResults[endpoint].getById.error}
									<p class="error">
										<strong>Erreur:</strong>
										{testResults[endpoint].getById.error}
									</p>
								{/if}
							</div>
						{/if}

						{#if testResults[endpoint].error}
							<p class="error"><strong>Erreur générale:</strong> {testResults[endpoint].error}</p>
						{/if}
					</div>
				</div>
			{:else}
				<div class="test-result pending">
					<div class="test-header">
						<span class="status-icon">⚪</span>
						<h3>{endpoint}</h3>
						<span class="status" style="color: #6c757d">En attente</span>
					</div>
				</div>
			{/if}
		{/each}
	</div>

	{#if Object.keys(testResults).length > 0}
		<div class="test-summary">
			<h3>Résumé des tests</h3>
			<div class="summary-stats">
				<div class="stat">
					<span class="stat-value">
						{Object.values(testResults).filter((r) => r.status === 'success').length}
					</span>
					<span class="stat-label">Succès</span>
				</div>
				<div class="stat">
					<span class="stat-value">
						{Object.values(testResults).filter((r) => r.status === 'error').length}
					</span>
					<span class="stat-label">Erreurs</span>
				</div>
				<div class="stat">
					<span class="stat-value">
						{Object.values(testResults).filter((r) => r.status === 'testing').length}
					</span>
					<span class="stat-label">En cours</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.api-tester {
		padding: 20px;
		max-width: 1000px;
		margin: 0 auto;
	}

	.test-actions {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	.btn-primary {
		background: #007bff;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-primary:hover:not(:disabled) {
		background: #0056b3;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #545b62;
	}

	.btn-primary:disabled,
	.btn-secondary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.current-test {
		background: #fff3cd;
		border: 1px solid #ffeaa7;
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 20px;
	}

	.test-results {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.test-result {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.test-result.pending {
		opacity: 0.6;
	}

	.test-header {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 15px;
		background: #f8f9fa;
		border-bottom: 1px solid #ddd;
	}

	.status-icon {
		font-size: 18px;
	}

	.test-header h3 {
		margin: 0;
		flex: 1;
		font-size: 16px;
	}

	.status {
		font-weight: bold;
		text-transform: uppercase;
		font-size: 12px;
	}

	.test-details {
		padding: 15px;
	}

	.test-method {
		margin-bottom: 15px;
		padding: 10px;
		background: #f8f9fa;
		border-radius: 4px;
	}

	.test-method h4 {
		margin: 0 0 8px 0;
		font-size: 14px;
		color: #495057;
		font-family: monospace;
	}

	.test-method p {
		margin: 4px 0;
		font-size: 13px;
	}

	.error {
		color: #dc3545;
	}

	.test-summary {
		margin-top: 30px;
		padding: 20px;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.summary-stats {
		display: flex;
		gap: 30px;
		justify-content: center;
		margin-top: 15px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	.stat-value {
		font-size: 24px;
		font-weight: bold;
		color: #495057;
	}

	.stat-label {
		font-size: 12px;
		color: #6c757d;
		text-transform: uppercase;
	}
</style>
