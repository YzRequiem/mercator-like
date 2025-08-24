<!-- Dashboard d'administration avec statistiques -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/apiClient';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let stats = {
		etablissements: 0,
		processus: 0,
		acteurs: 0,
		applications: 0,
		infrastructure: 0,
		incidents: 0,
		fonctions: 0,
		donnees: 0,
		ecosysteme: 0
	};

	let loading = true;
	let error = '';

	// Cartes de statistiques avec icônes et couleurs
	const statCards = [
		{
			key: 'etablissements',
			label: 'Établissements',
			icon: '🏢',
			color: 'from-blue-500 to-blue-600',
			description: 'Sites et localisations'
		},
		{
			key: 'processus',
			label: 'Processus',
			icon: '⚙️',
			color: 'from-green-500 to-green-600',
			description: 'Processus métier'
		},
		{
			key: 'acteurs',
			label: 'Acteurs',
			icon: '👥',
			color: 'from-purple-500 to-purple-600',
			description: 'Utilisateurs et rôles'
		},
		{
			key: 'applications',
			label: 'Applications',
			icon: '💻',
			color: 'from-indigo-500 to-indigo-600',
			description: 'Logiciels et systèmes'
		},
		{
			key: 'infrastructure',
			label: 'Infrastructure',
			icon: '🏗️',
			color: 'from-orange-500 to-orange-600',
			description: 'Équipements techniques'
		},
		{
			key: 'incidents',
			label: 'Incidents',
			icon: '⚠️',
			color: 'from-red-500 to-red-600',
			description: 'Problèmes et pannes'
		},
		{
			key: 'fonctions',
			label: 'Fonctions',
			icon: '🔧',
			color: 'from-cyan-500 to-cyan-600',
			description: 'Fonctionnalités système'
		},
		{
			key: 'donnees',
			label: 'Données',
			icon: '📊',
			color: 'from-teal-500 to-teal-600',
			description: 'Données et informations'
		},
		{
			key: 'ecosysteme',
			label: 'Écosystème',
			icon: '🌐',
			color: 'from-pink-500 to-pink-600',
			description: 'Partenaires et relations'
		}
	];

	onMount(async () => {
		await loadStats();
	});

	async function loadStats() {
		loading = true;
		error = '';

		try {
			// Charger toutes les statistiques en parallèle
			const promises = [
				apiClient.getEtablissements(),
				apiClient.getProcessus(),
				apiClient.getActeurs(),
				apiClient.getApplications(),
				apiClient.getInfrastructure(),
				apiClient.getIncidents(),
				apiClient.getFonctions(),
				apiClient.getDonnees(),
				apiClient.getEcosysteme()
			];

			const results = await Promise.all(promises);
			const keys = [
				'etablissements',
				'processus',
				'acteurs',
				'applications',
				'infrastructure',
				'incidents',
				'fonctions',
				'donnees',
				'ecosysteme'
			];

			results.forEach((result, index) => {
				if (result.success && result.data) {
					stats[keys[index] as keyof typeof stats] = result.data.length;
				}
			});
		} catch (e) {
			error = `Erreur lors du chargement: ${e}`;
			console.error('Erreur:', e);
		} finally {
			loading = false;
		}
	}

	// Calculer le total des entrées
	$: totalEntries = Object.values(stats).reduce((sum, count) => sum + count, 0);
</script>

<div class="dashboard">
	<div class="dashboard-header">
		<div class="header-content">
			<h1>Tableau de bord administrateur</h1>
			<p>Vue d'ensemble de toutes les données de votre système d'information</p>
		</div>
		<div class="header-stats">
			<div class="total-badge">
				<span class="total-number">{totalEntries}</span>
				<span class="total-label">Entrées totales</span>
			</div>
		</div>
	</div>

	{#if error}
		<div class="error-message">
			❌ {error}
		</div>
	{/if}

	{#if loading}
		<div class="loading-container">
			<LoadingSpinner />
			<p>Chargement des statistiques...</p>
		</div>
	{:else}
		<div class="stats-grid">
			{#each statCards as card (card.key)}
				<div class="stat-card">
					<div class="card-background bg-gradient-to-br {card.color}"></div>
					<div class="card-content">
						<div class="card-header">
							<span class="card-icon">{card.icon}</span>
							<span class="card-count">{stats[card.key as keyof typeof stats]}</span>
						</div>
						<div class="card-body">
							<h3 class="card-title">{card.label}</h3>
							<p class="card-description">{card.description}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="quick-actions">
			<div class="section-header">
				<h2>Actions rapides</h2>
				<p>Accès direct aux fonctionnalités principales</p>
			</div>
			<div class="actions-grid">
				<div class="action-card">
					<div class="action-icon">🔧</div>
					<h3>Testeur API</h3>
					<p>Tester tous les endpoints CRUD</p>
				</div>
				<div class="action-card">
					<div class="action-icon">📊</div>
					<h3>Gestion des données</h3>
					<p>CRUD complet pour toutes les entités</p>
				</div>
				<div class="action-card">
					<div class="action-icon">📚</div>
					<h3>Documentation</h3>
					<p>Guide d'utilisation de l'API</p>
				</div>
				<div class="action-card">
					<div class="action-icon">🔄</div>
					<h3>Migration</h3>
					<p>Outils de migration des données</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.dashboard {
		background: #f8fafc;
		min-height: 100vh;
		padding: 30px;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 40px;
		flex-wrap: wrap;
		gap: 20px;
	}

	.header-content h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1e293b;
		margin: 0 0 8px 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.header-content p {
		font-size: 1.1rem;
		color: #64748b;
		margin: 0;
	}

	.total-badge {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20px 30px;
		border-radius: 16px;
		text-align: center;
		color: white;
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
	}

	.total-number {
		display: block;
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
	}

	.total-label {
		display: block;
		font-size: 0.9rem;
		opacity: 0.9;
		margin-top: 4px;
	}

	.error-message {
		background: #fee2e2;
		color: #dc2626;
		padding: 16px;
		border-radius: 8px;
		margin-bottom: 30px;
		border-left: 4px solid #dc2626;
	}

	.loading-container {
		text-align: center;
		padding: 60px 40px;
		color: #64748b;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
		margin-bottom: 50px;
	}

	.stat-card {
		position: relative;
		background: white;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		transition: all 0.3s ease;
		border: 1px solid #e2e8f0;
	}

	.stat-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
	}

	.card-background {
		position: absolute;
		top: 0;
		right: 0;
		width: 80px;
		height: 80px;
		opacity: 0.1;
		border-radius: 0 16px 0 100%;
	}

	.card-content {
		position: relative;
		padding: 24px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.card-icon {
		font-size: 2rem;
	}

	.card-count {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1e293b;
	}

	.card-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: #334155;
		margin: 0 0 6px 0;
	}

	.card-description {
		font-size: 0.9rem;
		color: #64748b;
		margin: 0;
		line-height: 1.4;
	}

	.quick-actions {
		background: white;
		border-radius: 16px;
		padding: 30px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		border: 1px solid #e2e8f0;
	}

	.section-header {
		margin-bottom: 30px;
	}

	.section-header h2 {
		font-size: 1.8rem;
		font-weight: 700;
		color: #1e293b;
		margin: 0 0 8px 0;
	}

	.section-header p {
		color: #64748b;
		margin: 0;
		font-size: 1rem;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
	}

	.action-card {
		background: #f8fafc;
		padding: 24px;
		border-radius: 12px;
		text-align: center;
		transition: all 0.3s ease;
		border: 1px solid #e2e8f0;
		cursor: pointer;
	}

	.action-card:hover {
		background: #f1f5f9;
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.action-icon {
		font-size: 2.5rem;
		margin-bottom: 12px;
	}

	.action-card h3 {
		font-size: 1.1rem;
		font-weight: 600;
		color: #334155;
		margin: 0 0 8px 0;
	}

	.action-card p {
		font-size: 0.9rem;
		color: #64748b;
		margin: 0;
		line-height: 1.4;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.dashboard {
			padding: 20px;
		}

		.dashboard-header {
			flex-direction: column;
			text-align: center;
		}

		.header-content h1 {
			font-size: 2rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.actions-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}
</style>
