<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ChevronDown,
		ChevronRight,
		Database,
		Server,
		Users,
		Building,
		AlertTriangle,
		Settings
	} from 'lucide-svelte';

	import {
		metierStore,
		fonctionnelStore,
		applicatifStore,
		techniqueStore,
		appState,
		statistiques,
		dataActions
	} from '$lib/stores';

	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	// Types pour les sous-processus
	interface SousProcessus {
		id: string;
		nom: string;
		acteurs: string[];
		sites: string[];
		description?: string;
	}

	// Utilisation des stores réactifs
	const state = $derived($appState);

	// Charger les données depuis l'API au démarrage
	onMount(async () => {
		await dataActions.loadData();
	});

	// Variables locales dérivées des stores
	// Utilisation de const (préférence ESLint prefer-const)
	const selectedLayer = $derived(state.selectedLayer);
	const expandedItems = $derived(state.expandedItems);
	const selectedBlock = $derived(state.selectedBlock);

	const layers = [
		{
			id: 'metier',
			name: 'Métier',
			color: 'bg-blue-500',
			description: 'Processus métier et organisation'
		},
		{
			id: 'fonctionnel',
			name: 'Fonctionnel',
			color: 'bg-green-500',
			description: "Fonctions et flux d'information"
		},
		{
			id: 'applicatif',
			name: 'Applicatif',
			color: 'bg-yellow-500',
			description: 'Applications et données'
		},
		{
			id: 'technique',
			name: 'Technique',
			color: 'bg-red-500',
			description: 'Infrastructure et technologies'
		}
	];

	// Fonctions utilisant les actions du store
	function toggleExpand(key: string) {
		dataActions.toggleExpanded(key);
	}

	function selectLayer(layerId: string) {
		dataActions.setSelectedLayer(layerId);
	}

	function selectBlock(blockId: string | null) {
		dataActions.setSelectedBlock(blockId);
	}

	function getStatusColor(statut: string) {
		switch (statut) {
			case 'critique':
			case 'Défaillant':
			case 'Non conforme':
			case 'Non résolu':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'partiel':
			case 'Instable':
			case 'Partielle':
			case 'Récurrent':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'externe':
			case 'Contenu':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'absent':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			case 'Opérationnel':
			case 'En service':
			case 'Conforme':
			case 'Résolu':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'faible':
			case 'très faible':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'moyenne':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'bonne':
				return 'bg-green-100 text-green-800 border-green-200';
			default:
				return 'bg-blue-100 text-blue-800 border-blue-200';
		}
	}

	function getCriticiteColor(criticite: string) {
		switch (criticite) {
			case 'Critique':
				return 'bg-red-500';
			case 'Haute':
				return 'bg-orange-500';
			case 'Moyenne':
				return 'bg-yellow-500';
			case 'Faible':
				return 'bg-green-500';
			default:
				return 'bg-gray-500';
		}
	}

	function getLayerGradient(color: string) {
		switch (color) {
			case 'bg-blue-500':
				return '#3b82f6, #1d4ed8, #1e40af';
			case 'bg-green-500':
				return '#10b981, #059669, #047857';
			case 'bg-yellow-500':
				return '#f59e0b, #d97706, #b45309';
			case 'bg-red-500':
				return '#ef4444, #dc2626, #b91c1c';
			default:
				return '#6b7280, #4b5563, #374151';
		}
	}

	function getLayerBorderGradient(color: string) {
		switch (color) {
			case 'bg-blue-500':
				return 'from-blue-400 to-blue-600';
			case 'bg-green-500':
				return 'from-green-400 to-green-600';
			case 'bg-yellow-500':
				return 'from-yellow-400 to-yellow-600';
			case 'bg-red-500':
				return 'from-red-400 to-red-600';
			default:
				return 'from-gray-400 to-gray-600';
		}
	}
</script>

<svelte:head>
	<title>Mercator SI - MEDILOG</title>
	<meta name="description" content="Cartographie du Système d'Information" />
</svelte:head>

<div class="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
	<!-- Composant de chargement -->
	<LoadingSpinner isLoading={state.isLoading} message="Chargement des données depuis l'API..." />

	<!-- Conteneur de notifications -->
	<ToastContainer />

	<!-- Header Mercator -->
	<div class="relative border-b border-gray-200/30 bg-white/80 shadow-2xl backdrop-blur-xl">
		<div
			class="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5"
		></div>
		<div class="relative px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div class="space-y-2">
					<h1
						class="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-4xl font-black tracking-tight text-transparent"
					>
						Mercator SI - MEDILOG
					</h1>
					<p class="font-medium text-gray-600">Cartographie du Système d'Information</p>
				</div>
				<div class="flex items-center gap-6">
					<!-- Liens de navigation -->
					<div class="flex items-center gap-4">
						<a
							href="/diagnostic"
							class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-blue-50/50 hover:text-blue-600"
						>
							<Settings size={16} />
							Diagnostic API
						</a>
						<a
							href="/admin"
							class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-green-50/50 hover:text-green-600"
						>
							<Database size={16} />
							Back admin
						</a>
					</div>

					<div class="text-right">
						<div class="flex items-center gap-2 text-sm font-bold text-gray-900">
							<Users size={16} class="text-blue-600" />
							220 collaborateurs
						</div>
						<div class="mt-1 flex items-center gap-2 text-sm text-gray-600">
							<Database size={14} class="text-indigo-500" />
							3 sites - 4000-6000 colis/jour
						</div>
					</div>
					<div class="relative">
						<div
							class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 opacity-75 blur-md"
						></div>
						<div
							class="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl"
						>
							<Building class="text-white drop-shadow-sm" size={32} />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Navigation des couches -->
		<div
			class="relative bg-gradient-to-r from-slate-50/80 via-white/50 to-slate-50/80 backdrop-blur-sm"
		>
			<div class="px-4 sm:px-6 lg:px-8">
				<div class="flex flex-wrap gap-1 lg:flex-nowrap">
					{#each layers as layer}
						<button
							onclick={() => selectLayer(layer.id)}
							class="group relative flex flex-1 items-center gap-3 overflow-hidden rounded-t-2xl px-6 py-6 font-semibold transition-all duration-300 ease-out hover:scale-[1.02] lg:flex-none {selectedLayer ===
							layer.id
								? `-translate-y-1 transform text-white shadow-2xl`
								: 'text-gray-700 hover:bg-white/70 hover:text-gray-900 hover:shadow-lg'}"
							style={selectedLayer === layer.id
								? `background: linear-gradient(135deg, ${getLayerGradient(layer.color)})`
								: ''}
						>
							<!-- Animated background for non-selected tabs -->
							{#if selectedLayer !== layer.id}
								<div
									class="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								></div>
							{/if}

							<!-- Border animation -->
							<div
								class="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r {getLayerBorderGradient(
									layer.color
								)} transition-all duration-500 group-hover:w-full {selectedLayer === layer.id
									? 'w-full'
									: ''}"
							></div>

							<div class="relative flex items-center gap-3">
								<div class="relative">
									<div
										class="h-5 w-5 rounded-full shadow-lg transition-all duration-300 {selectedLayer ===
										layer.id
											? 'scale-110 bg-white/90 shadow-xl'
											: `${layer.color} group-hover:scale-110`}"
									></div>
									{#if selectedLayer === layer.id}
										<div class="absolute inset-0 animate-ping rounded-full bg-white/30"></div>
									{/if}
								</div>
								<div class="text-left">
									<div class="text-sm leading-tight font-bold">{layer.name}</div>
									<div
										class="text-xs leading-tight {selectedLayer === layer.id
											? 'text-white/90'
											: 'text-gray-500 group-hover:text-gray-600'}"
									>
										{layer.description}
									</div>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Contenu de la couche -->
	<div class="px-4 py-10 sm:px-6 lg:px-8">
		{#if selectedLayer === 'metier'}
			<!-- Couche Métier -->
			<div class="space-y-10">
				<!-- Écosystème MEDILOG -->
				<div
					class="group hover:shadow-3xl relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white/80 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-indigo-50/30"
					></div>
					<div
						class="relative border-b border-blue-200/30 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 px-8 py-6"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
								<Building size={20} class="text-white" />
							</div>
							<h3 class="text-xl font-black text-blue-900">Écosystème MEDILOG</h3>
						</div>
					</div>
					<div class="relative p-8">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{#each $metierStore.ecosysteme as entite, idx}
								<div
									class="group/eco relative overflow-hidden rounded-2xl border border-blue-100/50 bg-gradient-to-r from-white/90 via-blue-50/30 to-white/90 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/50 hover:shadow-xl"
								>
									<div
										class="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-indigo-100/10 opacity-0 transition-opacity duration-300 group-hover/eco:opacity-100"
									></div>
									<div class="relative">
										<div class="mb-3 flex items-center gap-3">
											<div
												class="rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 p-2 transition-all duration-300 group-hover/eco:scale-110"
											>
												<Building size={16} class="text-blue-700" />
											</div>
											<span
												class="rounded-full px-3 py-1 text-xs font-bold {entite.type === 'Client'
													? 'bg-green-100 text-green-800'
													: entite.type === 'Fournisseur'
														? 'bg-orange-100 text-orange-800'
														: 'bg-purple-100 text-purple-800'}"
											>
												{entite.type}
											</span>
										</div>
										<div class="mb-2 text-base font-bold text-gray-900">{entite.nom}</div>
										<div class="text-sm text-gray-600">{entite.relation}</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Établissements MEDILOG -->
				<div
					class="group hover:shadow-3xl relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white/80 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-indigo-50/30"
					></div>
					<div
						class="relative border-b border-blue-200/30 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 px-8 py-6"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
								<Building size={20} class="text-white" />
							</div>
							<h3 class="text-xl font-black text-blue-900">Établissements</h3>
						</div>
					</div>
					<div class="relative p-8">
						<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
							{#each $metierStore.etablissements as etablissement, idx}
								<div
									class="group/etab relative overflow-hidden rounded-2xl border border-blue-100/50 bg-gradient-to-r from-white/90 via-blue-50/30 to-white/90 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/50 hover:shadow-xl"
								>
									<div
										class="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-indigo-100/10 opacity-0 transition-opacity duration-300 group-hover/etab:opacity-100"
									></div>
									<div class="relative">
										<div class="mb-4 flex items-center justify-between">
											<div class="flex items-center gap-3">
												<div
													class="rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 p-2 transition-all duration-300 group-hover/etab:scale-110"
												>
													<Building size={18} class="text-blue-700" />
												</div>
												<span
													class="rounded-full px-3 py-1 text-xs font-bold {etablissement.statut ===
													'Siège social'
														? 'bg-purple-100 text-purple-800'
														: 'bg-blue-100 text-blue-800'}"
												>
													{etablissement.code}
												</span>
											</div>
											<span
												class="rounded-full px-3 py-1 text-xs font-bold {etablissement.statut ===
												'Siège social'
													? 'bg-purple-100 text-purple-800'
													: 'bg-green-100 text-green-800'}"
											>
												{etablissement.statut}
											</span>
										</div>

										<div class="mb-3 text-lg font-bold text-gray-900">{etablissement.nom}</div>
										<div class="mb-4 text-sm text-gray-600">{etablissement.adresse}</div>

										<div class="mb-4 grid grid-cols-2 gap-3 text-sm">
											<div class="rounded-lg bg-gray-50 p-3">
												<span class="font-semibold text-gray-700">Surface:</span>
												<div class="text-gray-600">{etablissement.surface}</div>
											</div>
											<div class="rounded-lg bg-gray-50 p-3">
												<span class="font-semibold text-gray-700">Collaborateurs:</span>
												<div class="text-gray-600">{etablissement.collaborateurs}</div>
											</div>
										</div>

										<div class="mb-4">
											<div class="mb-2 text-sm font-semibold text-gray-700">Activités:</div>
											<div class="flex flex-wrap gap-1">
												{#each etablissement.activites || [] as activite}
													<span class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
														{activite}
													</span>
												{/each}
											</div>
										</div>

										<div class="mb-4">
											<div class="mb-2 text-sm font-semibold text-gray-700">Équipements:</div>
											<ul class="space-y-1">
												{#each etablissement.equipements || [] as equipement}
													<li class="flex items-center text-sm text-gray-600">
														<div class="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
														{equipement}
													</li>
												{/each}
											</ul>
										</div>

										{#if etablissement.risques && etablissement.risques.length > 0}
											<div class="rounded-xl border border-red-200 bg-red-50 p-3">
												<div class="mb-2 flex items-center text-sm font-bold text-red-700">
													<AlertTriangle size={14} class="mr-2" />
													Risques:
												</div>
												<ul class="space-y-1">
													{#each etablissement.risques as risque}
														<li class="flex items-start text-xs text-red-600">
															<AlertTriangle size={10} class="mt-1 mr-2 flex-shrink-0" />
															<span>{risque}</span>
														</li>
													{/each}
												</ul>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
					<div
						class="group hover:shadow-3xl relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white/80 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-indigo-50/30"
						></div>
						<div
							class="relative border-b border-blue-200/30 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 px-8 py-6"
						>
							<div class="flex items-center gap-3">
								<div class="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
									<Building size={20} class="text-white" />
								</div>
								<h3 class="text-xl font-black text-blue-900">Processus Métier</h3>
							</div>
						</div>
						<div class="relative p-8">
							{#each $metierStore.processus as processus}
								<div class="mb-8 last:mb-0">
									<div
										class="group/item flex cursor-pointer items-center rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-xl"
										onclick={() => toggleExpand(`processus-${processus.id}`)}
										role="button"
										tabindex="0"
										onkeydown={(e) =>
											e.key === 'Enter' && toggleExpand(`processus-${processus.id}`)}
									>
										<div class="flex w-full items-center gap-4">
											<div
												class="rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 p-2 transition-all duration-300 group-hover/item:scale-110"
											>
												{#if expandedItems[`processus-${processus.id}`]}
													<ChevronDown
														size={18}
														class="text-blue-700 transition-transform duration-300"
													/>
												{:else}
													<ChevronRight
														size={18}
														class="text-blue-700 transition-transform duration-300 group-hover/item:translate-x-1"
													/>
												{/if}
											</div>
											<div
												class="rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 p-2 transition-all duration-300 group-hover/item:scale-110"
											>
												<Building size={18} class="text-blue-700" />
											</div>
											<span class="text-lg font-bold text-gray-900">{processus.nom}</span>
										</div>
									</div>
									{#if expandedItems[`processus-${processus.id}`]}
										<div class="mt-6 ml-8 space-y-4">
											{#each processus.sousProcessus || [] as sp}
												{@const sousProc = sp as SousProcessus}
												<div
													class="group/sub relative overflow-hidden rounded-2xl border-l-4 border-blue-400 bg-gradient-to-r from-blue-50/80 via-white/90 to-indigo-50/50 p-6 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:border-l-8 hover:shadow-xl"
												>
													<div
														class="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 opacity-0 transition-opacity duration-300 group-hover/sub:opacity-100"
													></div>
													<div class="relative">
														<div class="mb-3 text-base font-bold text-gray-900">{sousProc.nom}</div>
														<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
															<div class="flex items-center gap-2">
																<Users size={14} class="text-blue-600" />
																<span class="font-semibold text-gray-700">Acteurs:</span>
																<span class="text-gray-600"
																	>{(sousProc.acteurs || []).join(', ')}</span
																>
															</div>
															<div class="flex items-center gap-2">
																<Database size={14} class="text-indigo-600" />
																<span class="font-semibold text-gray-700">Sites:</span>
																<span class="text-gray-600"
																	>{(sousProc.sites || []).join(', ')}</span
																>
															</div>
														</div>
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<div
						class="group hover:shadow-3xl relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white/80 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-indigo-50/30"
						></div>
						<div
							class="relative border-b border-blue-200/30 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 px-8 py-6"
						>
							<div class="flex items-center gap-3">
								<div class="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
									<Users size={20} class="text-white" />
								</div>
								<h3 class="text-xl font-black text-blue-900">Acteurs & Organisation</h3>
							</div>
						</div>
						<div class="relative p-8">
							<div class="space-y-4">
								{#each $metierStore.acteurs as acteur}
									<div
										class="group/actor relative overflow-hidden rounded-2xl border border-blue-100/50 bg-gradient-to-r from-white/90 via-blue-50/30 to-white/90 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/50 hover:shadow-xl"
									>
										<div
											class="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-indigo-100/10 opacity-0 transition-opacity duration-300 group-hover/actor:opacity-100"
										></div>
										<div class="relative flex items-center justify-between">
											<div class="flex items-center gap-4">
												<div class="relative">
													<div
														class="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-3 transition-all duration-300 group-hover/actor:scale-110"
													>
														<Users size={20} class="text-blue-700" />
													</div>
													<div
														class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-br from-green-400 to-green-500 opacity-0 shadow-sm transition-opacity duration-300 group-hover/actor:opacity-100"
													></div>
												</div>
												<div class="space-y-1">
													<div class="text-base font-bold text-gray-900">{acteur.nom}</div>
													<div class="text-sm font-medium text-gray-600">{acteur.role}</div>
												</div>
											</div>
											<div class="relative">
												<span
													class="relative z-10 rounded-full border border-blue-200/50 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-bold text-blue-800 shadow-lg transition-all duration-300 group-hover/actor:scale-110"
												>
													{acteur.site}
												</span>
												<div
													class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 opacity-0 blur-sm transition-opacity duration-300 group-hover/actor:opacity-50"
												></div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if selectedLayer === 'fonctionnel'}
			<!-- Couche Fonctionnelle -->
			<div class="space-y-8">
				<div class="overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-xl">
					<div
						class="border-b border-green-200 bg-gradient-to-r from-green-50 to-green-100 px-6 py-4"
					>
						<h3 class="text-lg font-bold text-green-900">Fonctions du SI</h3>
					</div>
					<div class="p-6">
						<div class="grid gap-6">
							{#each $fonctionnelStore.fonctions as fonction}
								<div
									class="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 transition-all duration-200 hover:border-green-300 hover:shadow-lg"
								>
									<div class="mb-4 flex items-center justify-between">
										<div class="flex items-center">
											<div class="mr-3 rounded-lg bg-green-100 p-2">
												<Settings size={18} class="text-green-600" />
											</div>
											<h4 class="text-lg font-bold text-gray-900">{fonction.nom}</h4>
										</div>
										<span
											class="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm {getStatusColor(
												fonction.statut || 'inconnu'
											)}"
										>
											{fonction.statut || 'Non défini'}
										</span>
									</div>
									<p class="mb-5 text-sm leading-relaxed text-gray-700">{fonction.description}</p>
									<div class="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
										<div class="rounded-lg bg-green-50 p-4">
											<div class="mb-2 font-semibold text-green-800">Flux principaux:</div>
											<ul class="space-y-2">
												{#each fonction.flux || [] as flux}
													<li class="flex items-center text-gray-700">
														<div class="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
														{flux}
													</li>
												{/each}
											</ul>
										</div>
										<div class="rounded-lg bg-blue-50 p-4">
											<div class="mb-2 font-semibold text-blue-800">Données manipulées:</div>
											<ul class="space-y-2">
												{#each fonction.donnees || [] as donnee}
													<li class="flex items-center text-gray-700">
														<div class="mr-2 h-2 w-2 rounded-full bg-blue-400"></div>
														{donnee}
													</li>
												{/each}
											</ul>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{:else if selectedLayer === 'applicatif'}
			<!-- Couche Applicative -->
			<div class="space-y-8">
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div
						class="overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-xl lg:col-span-2"
					>
						<div
							class="border-b border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4"
						>
							<h3 class="text-lg font-bold text-yellow-900">Portfolio Applicatif</h3>
						</div>
						<div class="p-6">
							<div class="space-y-6">
								{#each $applicatifStore.applications as app, idx}
									<div
										class="cursor-pointer rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:scale-[1.02] {selectedBlock ===
										`app-${idx}`
											? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-xl'
											: 'bg-gradient-to-br from-white to-gray-50 hover:border-yellow-300 hover:shadow-lg'}"
										onclick={() => selectBlock(`app-${idx}`)}
										role="button"
										tabindex="0"
										onkeydown={(e) => e.key === 'Enter' && selectBlock(`app-${idx}`)}
									>
										<div class="mb-4 flex items-center justify-between">
											<div class="flex items-center">
												<div class="mr-3 rounded-lg bg-yellow-100 p-2">
													<Database size={18} class="text-yellow-600" />
												</div>
												<div>
													<h4 class="font-bold text-gray-900">{app.nom}</h4>
													<span class="text-xs font-medium text-gray-600"
														>{app.type} - {app.domaine}</span
													>
												</div>
											</div>
											<div class="flex items-center gap-3">
												<div
													class="h-3 w-3 rounded-full shadow-sm {getCriticiteColor(
														app.criticite || 'Non définie'
													)}"
												></div>
												<span
													class="rounded-full border px-3 py-1 text-xs font-semibold shadow-sm {getStatusColor(
														app.conformite || 'inconnu'
													)}"
												>
													{app.conformite || 'Non défini'}
												</span>
											</div>
										</div>
										<div class="grid grid-cols-2 gap-4 text-sm">
											<div class="rounded-lg bg-gray-50 p-3">
												<span class="font-semibold text-gray-700">Utilisateurs:</span>
												<div class="text-gray-600">{app.users}</div>
											</div>
											<div class="rounded-lg bg-gray-50 p-3">
												<span class="font-semibold text-gray-700">Sites:</span>
												<div class="text-gray-600">{(app.sites || []).join(', ')}</div>
											</div>
										</div>
										{#if selectedBlock === `app-${idx}`}
											<div class="mt-6 rounded-xl border border-red-200 bg-white p-4 shadow-sm">
												<div class="mb-3 flex items-center text-sm font-bold text-red-700">
													<AlertTriangle size={16} class="mr-2" />
													Risques identifiés:
												</div>
												<ul class="space-y-2">
													{#each app.risques || [] as risque}
														<li class="flex items-start text-sm text-red-600">
															<AlertTriangle size={12} class="mt-1 mr-2 flex-shrink-0" />
															<span>{risque}</span>
														</li>
													{/each}
												</ul>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-xl">
						<div
							class="border-b border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4"
						>
							<h3 class="text-lg font-bold text-yellow-900">Données</h3>
						</div>
						<div class="p-6">
							<div class="space-y-4">
								{#each $applicatifStore.donnees as donnee}
									<div
										class="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 transition-shadow hover:shadow-md"
									>
										<div class="mb-2 text-sm font-bold text-gray-900">{donnee.nom}</div>
										<div
											class="mb-3 inline-block rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-600"
										>
											Source: {donnee.source}
										</div>
										<div class="flex items-center justify-between">
											<span class="text-xs font-medium text-gray-700">Qualité:</span>
											<span
												class="rounded-full px-3 py-1 text-xs font-semibold shadow-sm {getStatusColor(
													(donnee.qualite || 'inconnue').toLowerCase()
												)}"
											>
												{donnee.qualite || 'Non définie'}
											</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if selectedLayer === 'technique'}
			<!-- Couche Technique -->
			<div class="space-y-8">
				<!-- Section Incidents Récents -->
				<div class="overflow-hidden rounded-2xl border border-red-200/50 bg-white shadow-xl">
					<div class="border-b border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-6 py-4">
						<div class="flex items-center gap-3">
							<AlertTriangle size={20} class="text-red-600" />
							<h3 class="text-lg font-bold text-red-900">Incidents Récents</h3>
						</div>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
							{#each $techniqueStore.incidents as incident, idx}
								<div
									class="rounded-xl border p-4 transition-all duration-200 hover:shadow-lg {incident.impact ===
									'Critique'
										? 'border-red-300 bg-red-50'
										: incident.impact === 'Majeur'
											? 'border-orange-300 bg-orange-50'
											: 'border-yellow-300 bg-yellow-50'}"
								>
									<div class="mb-2 text-sm font-bold text-gray-900">{incident.nom}</div>
									<div class="mb-2 flex items-center justify-between">
										<span class="text-xs font-medium text-gray-600">Impact:</span>
										<span
											class="rounded-full px-2 py-1 text-xs font-bold {incident.impact ===
											'Critique'
												? 'bg-red-100 text-red-800'
												: incident.impact === 'Majeur'
													? 'bg-orange-100 text-orange-800'
													: 'bg-yellow-100 text-yellow-800'}"
										>
											{incident.impact}
										</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-xs font-medium text-gray-600">Statut:</span>
										<span
											class="rounded-full px-2 py-1 text-xs font-bold {getStatusColor(
												incident.statut || 'inconnu'
											)}"
										>
											{incident.statut || 'Non défini'}
										</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div
						class="overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-xl lg:col-span-2"
					>
						<div class="border-b border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-6 py-4">
							<h3 class="text-lg font-bold text-red-900">Infrastructure</h3>
						</div>
						<div class="p-6">
							<div class="space-y-6">
								{#each $techniqueStore.infrastructure as infra}
									<div
										class="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 transition-all duration-200 hover:shadow-lg"
									>
										<div class="mb-4 flex items-center justify-between">
											<div class="flex items-center">
												<div class="mr-3 rounded-lg bg-red-100 p-2">
													<Server size={18} class="text-red-600" />
												</div>
												<div>
													<h4 class="font-bold text-gray-900">{infra.nom}</h4>
													<span class="text-xs font-medium text-gray-600"
														>{infra.type} - {infra.localisation}</span
													>
												</div>
											</div>
											<span
												class="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm {getStatusColor(
													infra.statut || 'inconnu'
												)}"
											>
												{infra.statut || 'Non défini'}
											</span>
										</div>
										<div class="mb-4 grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
											{#if infra.capacite}
												<div class="rounded-lg bg-blue-50 p-3">
													<span class="font-semibold text-blue-800">Capacité:</span>
													<div class="text-gray-700">{infra.capacite}</div>
												</div>
											{/if}
											{#if infra.utilisation}
												<div class="rounded-lg bg-green-50 p-3">
													<span class="font-semibold text-green-800">Utilisation:</span>
													<div class="text-gray-700">{infra.utilisation}</div>
												</div>
											{/if}
											{#if infra.bande_passante}
												<div class="rounded-lg bg-purple-50 p-3">
													<span class="font-semibold text-purple-800">Bande passante:</span>
													<div class="text-gray-700">{infra.bande_passante}</div>
												</div>
											{/if}
											{#if infra.disponibilite}
												<div class="rounded-lg bg-orange-50 p-3">
													<span class="font-semibold text-orange-800">Disponibilité:</span>
													<div class="text-gray-700">{infra.disponibilite}</div>
												</div>
											{/if}
											<div class="rounded-lg bg-gray-50 p-3">
												<span class="font-semibold text-gray-800">Redondance:</span>
												<div class="text-gray-700">{infra.redondance}</div>
											</div>
										</div>
										{#if infra.risques}
											<div class="rounded-xl border border-red-200 bg-red-50 p-4">
												<div class="mb-2 flex items-center text-sm font-bold text-red-700">
													<AlertTriangle size={16} class="mr-2" />
													Risques:
												</div>
												<ul class="space-y-2">
													{#each infra.risques as risque}
														<li class="flex items-start text-sm text-red-600">
															<AlertTriangle size={12} class="mt-1 mr-2 flex-shrink-0" />
															<span>{risque}</span>
														</li>
													{/each}
												</ul>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-xl">
						<div class="border-b border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-6 py-4">
							<h3 class="text-lg font-bold text-red-900">Sécurité</h3>
						</div>
						<div class="p-6">
							<div class="space-y-6">
								<div
									class="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4"
								>
									<div class="mb-3 flex items-center justify-between">
										<span class="font-bold text-gray-900">Niveau global</span>
										<span
											class="rounded-full px-3 py-2 text-xs font-bold shadow-sm {getStatusColor(
												'critique'
											)}"
										>
											{$techniqueStore.securite.niveau}
										</span>
									</div>
								</div>

								<div
									class="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-4"
								>
									<div class="mb-3 text-sm font-bold text-green-800">Mesures en place:</div>
									<ul class="space-y-2">
										{#each $techniqueStore.securite.mesures || [] as mesure}
											<li class="flex items-center justify-between text-sm">
												<div class="flex items-center text-gray-700">
													<div class="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
													{mesure.nom || mesure}
												</div>
												{#if mesure.statut}
													<span class="text-xs text-gray-500 italic">({mesure.statut})</span>
												{/if}
											</li>
										{/each}
									</ul>
								</div>

								<div
									class="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4"
								>
									<div class="mb-3 flex items-center text-sm font-bold text-red-700">
										<AlertTriangle size={16} class="mr-2" />
										Manques critiques:
									</div>
									<ul class="space-y-2">
										{#each $techniqueStore.securite.manques || [] as manque}
											<li class="flex items-start justify-between text-sm">
												<div class="flex items-start text-red-600">
													<AlertTriangle size={12} class="mt-1 mr-2 flex-shrink-0" />
													<span>{manque.nom || manque}</span>
												</div>
												{#if manque.priorite}
													<span class="text-xs font-semibold text-red-500">
														{manque.priorite}
													</span>
												{/if}
											</li>
										{/each}
									</ul>
								</div>

								<div
									class="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4"
								>
									<div class="flex items-center justify-between">
										<span class="text-sm font-bold text-gray-900">Incidents 12 derniers mois:</span>
										<span
											class="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-800 shadow-sm"
										>
											{$techniqueStore.securite.incidents_total}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Footer avec synthèse des risques -->
	<div class="relative mt-16 border-t border-gray-200/30 bg-white/80 shadow-2xl backdrop-blur-xl">
		<div
			class="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-white/50 to-slate-50/80"
		></div>
		<div class="relative px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex flex-wrap items-center gap-8">
					<div class="group flex items-center gap-4">
						<div class="relative">
							<div
								class="h-5 w-5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg transition-transform duration-300 group-hover:scale-110"
							></div>
							<div
								class="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75 group-hover:opacity-100"
							></div>
						</div>
						<span class="text-base font-black text-gray-900"
							>Risques Critiques: <span class="text-red-600">{$statistiques.risquesCritiques}</span
							></span
						>
					</div>
					<div class="group flex items-center gap-4">
						<div class="relative">
							<div
								class="h-5 w-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg transition-transform duration-300 group-hover:scale-110"
							></div>
							<div
								class="absolute inset-0 animate-pulse rounded-full bg-yellow-400 opacity-0 group-hover:opacity-50"
							></div>
						</div>
						<span class="text-base font-black text-gray-900"
							>Incidents Récents: <span class="text-orange-600"
								>{$statistiques.incidentsCritiques}</span
							></span
						>
					</div>
					<div class="group flex items-center gap-4">
						<div class="relative">
							<div
								class="h-5 w-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg transition-transform duration-300 group-hover:scale-110"
							></div>
							<div
								class="absolute inset-0 animate-pulse rounded-full bg-green-400 opacity-0 group-hover:opacity-50"
							></div>
						</div>
						<span class="text-base font-black text-gray-900"
							>Applications: <span class="text-blue-600">{$statistiques.applications}</span></span
						>
					</div>
				</div>
				<div class="flex items-center gap-3 text-sm font-bold text-gray-600">
					<div class="rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-2">
						<Database size={16} class="text-gray-600" />
					</div>
					Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
				</div>
			</div>
		</div>
	</div>
</div>
