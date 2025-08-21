<!-- Composant de notification toast -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
	export let message: string = '';
	export let duration: number = 5000;
	export let visible: boolean = false;

	const dispatch = createEventDispatcher();

	let timer: NodeJS.Timeout | null = null;

	$: if (visible && duration > 0) {
		// Nettoie le timer précédent si il existe
		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			visible = false;
			dispatch('close');
		}, duration);
	}

	// Nettoyage du timer quand visible devient false
	$: if (!visible && timer) {
		clearTimeout(timer);
		timer = null;
	}

	function getTypeStyles(type: string) {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			default:
				return 'bg-blue-50 border-blue-200 text-blue-800';
		}
	}

	function getIcon(type: string) {
		switch (type) {
			case 'success':
				return '✅';
			case 'error':
				return '❌';
			case 'warning':
				return '⚠️';
			default:
				return 'ℹ️';
		}
	}
</script>

{#if visible && message}
	<div class="fixed top-4 right-4 z-50 max-w-md" transition:fly={{ x: 300, duration: 300 }}>
		<div class="flex items-center gap-3 rounded-lg border p-4 shadow-lg {getTypeStyles(type)}">
			<span class="text-lg">{getIcon(type)}</span>
			<p class="flex-1 text-sm font-medium">{message}</p>
			<button
				on:click={() => {
					visible = false;
					dispatch('close');
				}}
				class="text-lg opacity-70 transition-opacity hover:opacity-100"
			>
				×
			</button>
		</div>
	</div>
{/if}
