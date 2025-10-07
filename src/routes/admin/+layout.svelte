<!-- Layout pour les pages d'administration -->
<script lang="ts">
	import { page } from '$app/stores';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import {
		LayoutDashboard,
		Building2,
		Workflow,
		Users,
		Monitor,
		Server,
		AlertTriangle,
		Wrench,
		Database,
		Globe,
		Home,
		Link
	} from 'lucide-svelte';

	const adminRoutes = [
		{ path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
		{ path: '/admin/etablissements', label: 'Établissements', icon: Building2 },
		{ path: '/admin/processus', label: 'Processus', icon: Workflow },
		{ path: '/admin/acteurs', label: 'Acteurs', icon: Users },
		{ path: '/admin/applications', label: 'Applications', icon: Monitor },
		{ path: '/admin/infrastructure', label: 'Infrastructure', icon: Server },
		{ path: '/admin/incidents', label: 'Incidents', icon: AlertTriangle },
		{ path: '/admin/fonctions', label: 'Fonctions', icon: Wrench },
		{ path: '/admin/donnees', label: 'Données', icon: Database },
		{ path: '/admin/ecosysteme', label: 'Écosystème', icon: Globe }
	];

	$: currentPath = $page.url.pathname;
	$: currentRoute = adminRoutes.find((route) => route.path === currentPath);

	function showDocumentation() {
		window.open('/api', '_blank');
	}
</script>

<svelte:head>
	<title>Mercator-like - {currentRoute?.label || 'Administration'}</title>
</svelte:head>

<main class="admin-layout">
	<header class="admin-header">
		<div class="header-content">
			<h1>Mercator-like - Administration</h1>
			<p>Gestion complète du système d'information</p>
		</div>
		<div class="header-actions">
			<a href="/" class="btn btn-primary">
				<Home size={18} />
				Accueil
			</a>
			<button class="btn btn-secondary" on:click={showDocumentation}>
				<Link size={18} />
				API Documentation
			</button>
		</div>
	</header>

	<nav class="admin-navigation">
		{#each adminRoutes as route}
			<a
				href={route.path}
				class="nav-link {currentPath === route.path ? 'active' : ''}"
				data-sveltekit-preload-data="hover"
			>
				<span class="nav-icon">
					<svelte:component this={route.icon} size={18} strokeWidth={2} />
				</span>
				<span class="nav-label">{route.label}</span>
			</a>
		{/each}
	</nav>

	<div class="admin-content">
		<slot />
	</div>

	<ToastContainer />
</main>

<style>
	:global(body) {
		margin: 0;
		background: #f5f7fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.admin-layout {
		min-height: 100vh;
	}

	.admin-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 20px 25px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 15px;
	}

	.header-content h1 {
		margin: 0 0 5px 0;
		font-size: 1.8rem;
		font-weight: 700;
	}

	.header-content p {
		margin: 0;
		opacity: 0.9;
		font-size: 1rem;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.btn {
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.btn-primary {
		background: rgba(255, 255, 255, 0.9);
		color: #667eea;
		border: 1px solid rgba(255, 255, 255, 0.9);
	}

	.btn-primary:hover {
		background: white;
		color: #667eea;
		transform: translateY(-1px);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.admin-navigation {
		background: white;
		border-bottom: 1px solid #eee;
		padding: 0 25px;
		display: flex;
		overflow-x: auto;
		gap: 2px;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 15px 20px;
		text-decoration: none;
		color: #666;
		border-bottom: 3px solid transparent;
		transition: all 0.2s ease;
		white-space: nowrap;
		font-size: 14px;
		font-weight: 500;
	}

	.nav-link:hover {
		color: #333;
		background: #f8f9fa;
	}

	.nav-link.active {
		color: #667eea;
		border-bottom-color: #667eea;
		background: #f8f9fa;
	}

	.nav-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.admin-content {
		flex: 1;
		padding: 25px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.admin-header {
			flex-direction: column;
			text-align: center;
		}

		.admin-navigation {
			padding: 0 15px;
		}

		.nav-link {
			padding: 12px 15px;
			font-size: 13px;
		}

		.admin-content {
			padding: 15px;
		}
	}
</style>
