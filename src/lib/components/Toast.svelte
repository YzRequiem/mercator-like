<!-- Composant de notification toast -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
	export let message: string = '';
	export let duration: number = 3000; // valeur par défaut (cohérente avec le store)
	let remaining = duration;
	let interval: any;
	let startTime: number;
	let progress = 100; // pour une éventuelle barre de progression
	let hovering = false;

	const dispatch = createEventDispatcher();

	function close() {
		clearInterval(interval);
		dispatch('close');
	}

	function tick() {
		const elapsed = performance.now() - startTime;
		remaining = duration - elapsed;
		progress = Math.max(0, (remaining / duration) * 100);
		if (remaining <= 0) {
			close();
		}
	}

	onMount(() => {
		startTime = performance.now();
		// Rafraîchissement fluide (60fps) mais léger – on pourrait réduire si nécessaire
		interval = setInterval(() => {
			if (!hovering) tick();
		}, 100);
		return () => clearInterval(interval);
	});

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

{#if message}
	<div
		class="toast-item"
		in:fly={{ x: 300, duration: 250 }}
		out:fade={{ duration: 200 }}
		role="alert"
		on:mouseenter={() => (hovering = true)}
		on:mouseleave={() => (hovering = false)}
	>
		<div
			class="flex items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg {getTypeStyles(
				type
			)}"
		>
			<span class="mt-0.5 text-lg leading-none">{getIcon(type)}</span>
			<div class="flex-1">
				<p class="text-sm leading-snug font-medium">{message}</p>
				<div class="mt-2 h-1 w-full overflow-hidden rounded bg-black/10">
					<div
						class="linear h-full bg-current transition-[width] duration-100"
						style={`width:${progress}%`}
					></div>
				</div>
			</div>
			<button
				on:click={close}
				class="-mr-2 ml-2 rounded px-2 text-lg font-bold opacity-60 transition hover:bg-black/5 hover:opacity-100"
				aria-label="Fermer la notification"
			>
				×
			</button>
		</div>
	</div>
{/if}

<style>
	.toast-item {
		max-width: 24rem;
		width: 100%;
	}
</style>
