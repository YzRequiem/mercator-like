<!-- Conteneur global pour les notifications toast -->
<script lang="ts">
	import { toastStore, toastActions } from '$lib/toastStore';
	import Toast from './Toast.svelte';

	$: toasts = $toastStore;
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
	{#each toasts as toast (toast.id)}
		<Toast
			type={toast.type}
			message={toast.message}
			duration={toast.duration || 3000}
			on:close={() => toastActions.remove(toast.id)}
		/>
	{/each}
</div>
