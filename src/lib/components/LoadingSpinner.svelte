<!-- Composant de chargement -->
<script lang="ts">
	export let isLoading = false;
	export let message = 'Chargement des données...';
</script>

{#if isLoading}
	<div class="loading-overlay">
		<div class="loading-content">
			<div class="spinner"></div>
			<p>{message}</p>
		</div>
	</div>
{/if}

<style>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 32px;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f4f6;
		border-top: 4px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	p {
		margin: 0;
		color: #6b7280;
		font-size: 14px;
	}
</style>
