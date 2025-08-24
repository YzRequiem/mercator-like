<script lang="ts">
	import { onMount } from 'svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let isLoading = true;
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

	onMount(async () => {
		try {
			const response = await fetch('/api/stats');
			if (response.ok) {
				const data = await response.json();
				if (data.success && data.stats) {
					stats = data.stats;
				}
			}
		} catch (error) {
			console.error('Erreur lors du chargement des statistiques:', error);
		} finally {
			isLoading = false;
		}
	});

	const adminModules = [
		{
			title: 'Établissements',
			description: 'Gestion des sites et implantations',
			icon: '🏢',
			path: '/admin/etablissements',
			count: stats.etablissements,
			color: 'blue'
		},
		{
			title: 'Processus',
			description: 'Processus métier et procédures',
			icon: '⚙️',
			path: '/admin/processus',
			count: stats.processus,
			color: 'green'
		},
		{
			title: 'Acteurs',
			description: 'Personnes et rôles',
			icon: '👥',
			path: '/admin/acteurs',
			count: stats.acteurs,
			color: 'purple'
		},
		{
			title: 'Applications',
			description: 'Applications et logiciels',
			icon: '💻',
			path: '/admin/applications',
			count: stats.applications,
			color: 'orange'
		},
		{
			title: 'Infrastructure',
			description: 'Matériel et infrastructure IT',
			icon: '🏗️',
			path: '/admin/infrastructure',
			count: stats.infrastructure,
			color: 'red'
		},
		{
			title: 'Incidents',
			description: 'Gestion des incidents',
			icon: '⚠️',
			path: '/admin/incidents',
			count: stats.incidents,
			color: 'yellow'
		},
		{
			title: 'Fonctions',
			description: 'Fonctions métier',
			icon: '🔧',
			path: '/admin/fonctions',
			count: stats.fonctions,
			color: 'teal'
		},
		{
			title: 'Données',
			description: 'Gestion des données',
			icon: '📊',
			path: '/admin/donnees',
			count: stats.donnees,
			color: 'indigo'
		},
		{
			title: 'Écosystème',
			description: "Vue d'ensemble du système",
			icon: '🌐',
			path: '/admin/ecosysteme',
			count: stats.ecosysteme,
			color: 'pink'
		}
	];
</script>

<svelte:head>
	<title>Administration - Mercator-like</title>
</svelte:head>

<div class="dashboard">
	<div class="dashboard-header">
		<h1>🗺️ Tableau de bord administrateur</h1>
		<p>Bienvenue dans l'interface d'administration de Mercator-like</p>
	</div>

	{#if isLoading}
		<div class="loading-container">
			<LoadingSpinner />
			<p>Chargement des statistiques...</p>
		</div>
	{:else}
		<div class="stats-grid">
			{#each adminModules as module}
				<a href={module.path} class="stat-card {module.color}" data-sveltekit-preload-data="hover">
					<div class="stat-icon">{module.icon}</div>
					<div class="stat-content">
						<h3>{module.title}</h3>
						<p>{module.description}</p>
						<div class="stat-number">{module.count}</div>
					</div>
					<div class="stat-arrow">→</div>
				</a>
			{/each}
		</div>

		<div class="quick-actions">
			<h2>Actions rapides</h2>
			<div class="actions-grid">
				<button class="action-btn" on:click={() => window.open('/api', '_blank')}>
					<span>🔗</span>
					Documentation API
				</button>
				<a href="/migrate" class="action-btn">
					<span>🚀</span>
					Migration de données
				</a>
				<a href="/diagnostic" class="action-btn">
					<span>🔍</span>
					Diagnostic système
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.dashboard {
		max-width: 1200px;
		margin: 0 auto;
	}

	.dashboard-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.dashboard-header h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	.dashboard-header p {
		font-size: 1.1rem;
		color: #666;
		margin: 0;
	}

	.loading-container {
		text-align: center;
		padding: 3rem;
	}

	.loading-container p {
		margin-top: 1rem;
		color: #666;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.stat-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		border-left: 4px solid var(--accent-color);
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.stat-icon {
		font-size: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background: var(--accent-color);
		border-radius: 50%;
		color: white;
		flex-shrink: 0;
	}

	.stat-content {
		flex: 1;
	}

	.stat-content h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1.25rem;
		color: #333;
	}

	.stat-content p {
		margin: 0 0 0.5rem 0;
		color: #666;
		font-size: 0.9rem;
	}

	.stat-number {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--accent-color);
	}

	.stat-arrow {
		font-size: 1.5rem;
		color: #ccc;
		flex-shrink: 0;
	}

	/* Couleurs pour chaque module */
	.stat-card.blue {
		--accent-color: #3b82f6;
	}
	.stat-card.green {
		--accent-color: #10b981;
	}
	.stat-card.purple {
		--accent-color: #8b5cf6;
	}
	.stat-card.orange {
		--accent-color: #f59e0b;
	}
	.stat-card.red {
		--accent-color: #ef4444;
	}
	.stat-card.yellow {
		--accent-color: #eab308;
	}
	.stat-card.teal {
		--accent-color: #14b8a6;
	}
	.stat-card.indigo {
		--accent-color: #6366f1;
	}
	.stat-card.pink {
		--accent-color: #ec4899;
	}

	.quick-actions {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.quick-actions h2 {
		margin: 0 0 1.5rem 0;
		color: #333;
		font-size: 1.5rem;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 8px;
		text-decoration: none;
		color: #333;
		font-weight: 500;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.action-btn:hover {
		background: #e9ecef;
		transform: translateY(-1px);
	}

	.action-btn span {
		font-size: 1.2rem;
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.stat-card {
			padding: 1rem;
		}

		.dashboard-header h1 {
			font-size: 2rem;
		}

		.actions-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
