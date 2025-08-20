<script lang="ts">
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

	let selectedLayer = $state('metier');
	let expandedItems = $state({});
	let selectedBlock = $state(null);

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

	const metierData = {
		processus: [
			{
				id: 'logistique',
				nom: 'Logistique Médicale',
				sousProcessus: [
					{ nom: 'Réception', acteurs: ['Magasiniers'], sites: ['IDF', 'ARA', 'PACA'] },
					{ nom: 'Stockage', acteurs: ['Responsables Entrepôt'], sites: ['IDF', 'ARA', 'PACA'] },
					{ nom: 'Conditionnement', acteurs: ['Équipes Qualité'], sites: ['IDF', 'ARA', 'PACA'] },
					{ nom: 'Expédition', acteurs: ['Logisticiens'], sites: ['IDF', 'ARA', 'PACA'] },
					{ nom: 'Traçabilité', acteurs: ['Responsable Qualité'], sites: ['IDF', 'ARA', 'PACA'] }
				]
			},
			{
				id: 'commercial',
				nom: 'Gestion Commerciale',
				sousProcessus: [
					{ nom: 'Prospection', acteurs: ['Équipe Commerciale'], sites: ['IDF'] },
					{ nom: 'Devis', acteurs: ['Responsable Commercial'], sites: ['IDF'] },
					{ nom: 'Suivi Client', acteurs: ['Service Client'], sites: ['IDF', 'ARA', 'PACA'] }
				]
			},
			{
				id: 'qualite',
				nom: 'Qualité & Conformité',
				sousProcessus: [
					{
						nom: 'Contrôle Qualité',
						acteurs: ['Responsable Qualité'],
						sites: ['IDF', 'ARA', 'PACA']
					},
					{
						nom: 'Conformité ANSM',
						acteurs: ['Responsable Qualité'],
						sites: ['IDF', 'ARA', 'PACA']
					},
					{ nom: 'Audit Interne', acteurs: ['Direction Qualité'], sites: ['IDF'] }
				]
			}
		],
		acteurs: [
			{ nom: 'Directeur Général', site: 'IDF', role: 'Stratégie globale' },
			{ nom: 'Responsable Logistique National', site: 'IDF', role: 'Coordination logistique' },
			{ nom: 'Responsable Site IDF', site: 'IDF', role: 'Opérations IDF' },
			{ nom: 'Responsable Site ARA', site: 'ARA', role: 'Opérations ARA' },
			{ nom: 'Responsable Site PACA', site: 'PACA', role: 'Opérations PACA' },
			{ nom: 'Responsable Qualité', site: 'IDF', role: 'Conformité ANSM' },
			{ nom: 'Responsable Commercial', site: 'IDF', role: 'Relation client' }
		]
	};

	const fonctionnelData = {
		fonctions: [
			{
				nom: 'Gestion des Stocks',
				description: 'Suivi inventaire et approvisionnement',
				flux: ['Réception → Stockage', 'Stockage → Expédition'],
				donnees: ['Stock disponible', 'Mouvements', 'Inventaires'],
				statut: 'critique'
			},
			{
				nom: 'Traçabilité',
				description: 'Suivi des dispositifs médicaux',
				flux: ['Réception → Traçabilité', 'Traçabilité → Livraison'],
				donnees: ['N° lot', 'Température', 'Géolocalisation'],
				statut: 'critique'
			},
			{
				nom: 'Gestion Commerciale',
				description: 'CRM et suivi clients',
				flux: ['Prospect → Devis', 'Commande → Facturation'],
				donnees: ['Contacts', 'Commandes', 'Facturation'],
				statut: 'partiel'
			},
			{
				nom: 'Reporting',
				description: 'Tableaux de bord et KPI',
				flux: ['Données → Consolidation', 'Consolidation → Reporting'],
				donnees: ['KPI', 'Alertes', 'Analyses'],
				statut: 'absent'
			}
		]
	};

	const applicatifData = {
		applications: [
			{
				nom: 'Excel Stocks',
				type: 'Tableur',
				domaine: 'Logistique',
				criticite: 'Haute',
				statut: 'En service',
				users: '15 utilisateurs',
				sites: ['IDF', 'ARA', 'PACA'],
				conformite: 'Non conforme',
				risques: ['Erreurs de saisie', 'Pas de traçabilité', 'Versions multiples']
			},
			{
				nom: 'HubSpot CRM',
				type: 'CRM',
				domaine: 'Commercial',
				criticite: 'Moyenne',
				statut: 'En service',
				users: '8 utilisateurs',
				sites: ['IDF'],
				conformite: 'Partielle',
				risques: ['Version gratuite limitée']
			},
			{
				nom: 'Processus Papier',
				type: 'Manuel',
				domaine: 'Traçabilité',
				criticite: 'Critique',
				statut: 'En service',
				users: '25 utilisateurs',
				sites: ['IDF', 'ARA', 'PACA'],
				conformite: 'Non conforme',
				risques: ['Perte documents', 'Erreurs humaines', 'Non-conformité ANSM']
			},
			{
				nom: 'Comptabilité Externe',
				type: 'SaaS',
				domaine: 'Finance',
				criticite: 'Moyenne',
				statut: 'En service',
				users: '3 utilisateurs',
				sites: ['Externe'],
				conformite: 'Conforme',
				risques: ['Dépendance externe']
			}
		],
		donnees: [
			{ nom: 'Référentiel Produits', source: 'Excel', qualite: 'Faible', volume: 'Moyen' },
			{ nom: 'Stocks', source: 'Excel', qualite: 'Faible', volume: 'Élevé' },
			{ nom: 'Contacts Clients', source: 'HubSpot', qualite: 'Moyenne', volume: 'Moyen' },
			{ nom: 'Traçabilité', source: 'Papier', qualite: 'Très faible', volume: 'Élevé' }
		]
	};

	const techniqueData = {
		infrastructure: [
			{
				nom: 'NAS Synology IDF',
				type: 'Stockage',
				localisation: 'IDF',
				statut: 'Opérationnel',
				capacite: '4 To',
				utilisation: '75%',
				redondance: 'Non',
				risques: ['Panne unique', 'Pas de sauvegarde distante']
			},
			{
				nom: 'NAS Synology ARA',
				type: 'Stockage',
				localisation: 'ARA',
				statut: 'Opérationnel',
				capacite: '2 To',
				utilisation: '60%',
				redondance: 'Non',
				risques: ['Panne unique', 'Capacité limitée']
			},
			{
				nom: 'NAS Synology PACA',
				type: 'Stockage',
				localisation: 'PACA',
				statut: 'Défaillant',
				capacite: '4 To',
				utilisation: 'N/A',
				redondance: 'Non',
				risques: ['Perte données avril 2025', 'Pas de sauvegarde']
			},
			{
				nom: 'VPN Inter-sites',
				type: 'Réseau',
				localisation: 'Multi-sites',
				statut: 'Instable',
				bande_passante: '100 Mbps',
				disponibilite: '85%',
				redondance: 'Non',
				risques: ['Coupures fréquentes', 'Pas de lien de secours']
			}
		],
		securite: {
			niveau: 'Insuffisant',
			mesures: ['VPN basique', 'Antivirus postes'],
			manques: ['RSSI', 'Politique sécurité', 'Formation', 'Supervision', 'Sauvegarde distante'],
			incidents: 4
		}
	};

	function toggleExpand(key: string) {
		expandedItems[key] = !expandedItems[key];
	}

	function getStatusColor(statut: string) {
		switch (statut) {
			case 'critique':
			case 'Défaillant':
			case 'Non conforme':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'partiel':
			case 'Instable':
			case 'Partielle':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'absent':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			case 'Opérationnel':
			case 'En service':
			case 'Conforme':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'faible':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'très faible':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'moyenne':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
			default:
				return 'bg-green-500';
		}
	}

	function selectLayer(layerId: string) {
		selectedLayer = layerId;
	}

	function selectBlock(blockId: string | null) {
		selectedBlock = selectedBlock === blockId ? null : blockId;
	}
</script>

<svelte:head>
	<title>Mercator SI - MEDILOG</title>
	<meta name="description" content="Cartographie du Système d'Information" />
</svelte:head>

<div class="mx-auto min-h-screen w-full max-w-7xl bg-gray-100">
	<!-- Header Mercator -->
	<div class="border-b bg-white shadow-sm">
		<div class="px-6 py-4">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Mercator SI - MEDILOG</h1>
					<p class="text-gray-600">Cartographie du Système d'Information</p>
				</div>
				<div class="flex items-center gap-3">
					<div class="text-right text-sm">
						<div class="font-medium">220 collaborateurs</div>
						<div class="text-gray-600">3 sites - 4000-6000 colis/jour</div>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded bg-blue-600">
						<Building class="text-white" size={24} />
					</div>
				</div>
			</div>
		</div>

		<!-- Navigation des couches -->
		<div class="border-t bg-gray-50">
			<div class="px-6">
				<div class="flex">
					{#each layers as layer}
						<button
							onclick={() => selectLayer(layer.id)}
							class="flex items-center gap-3 border-b-3 px-6 py-4 font-semibold transition-all {selectedLayer ===
							layer.id
								? `border-current text-white ${layer.color}`
								: 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
						>
							<div
								class="h-4 w-4 rounded {selectedLayer === layer.id ? 'bg-white' : layer.color}"
							></div>
							<div>
								<div class="font-bold">{layer.name}</div>
								<div
									class="text-xs {selectedLayer === layer.id ? 'text-gray-100' : 'text-gray-500'}"
								>
									{layer.description}
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Contenu de la couche -->
	<div class="p-6">
		{#if selectedLayer === 'metier'}
			<!-- Couche Métier -->
			<div class="space-y-6">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div class="rounded-lg border bg-white">
						<div class="border-b bg-blue-50 px-4 py-3">
							<h3 class="font-semibold text-blue-900">Processus Métier</h3>
						</div>
						<div class="p-4">
							{#each metierData.processus as processus}
								<div class="mb-4">
									<div
										class="flex cursor-pointer items-center rounded p-2 hover:bg-gray-50"
										onclick={() => toggleExpand(`processus-${processus.id}`)}
										role="button"
										tabindex="0"
										onkeydown={(e) =>
											e.key === 'Enter' && toggleExpand(`processus-${processus.id}`)}
									>
										{#if expandedItems[`processus-${processus.id}`]}
											<ChevronDown size={16} class="mr-2" />
										{:else}
											<ChevronRight size={16} class="mr-2" />
										{/if}
										<Building size={16} class="mr-2 text-blue-600" />
										<span class="font-medium">{processus.nom}</span>
									</div>
									{#if expandedItems[`processus-${processus.id}`]}
										<div class="mt-2 ml-6 space-y-2">
											{#each processus.sousProcessus as sp}
												<div class="rounded border-l-4 border-blue-400 bg-gray-50 p-3">
													<div class="text-sm font-medium">{sp.nom}</div>
													<div class="mt-1 text-xs text-gray-600">
														Acteurs: {sp.acteurs.join(', ')}
													</div>
													<div class="text-xs text-gray-600">
														Sites: {sp.sites.join(', ')}
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<div class="rounded-lg border bg-white">
						<div class="border-b bg-blue-50 px-4 py-3">
							<h3 class="font-semibold text-blue-900">Acteurs & Organisation</h3>
						</div>
						<div class="p-4">
							{#each metierData.acteurs as acteur}
								<div
									class="flex items-center justify-between border-b p-3 last:border-b-0 hover:bg-gray-50"
								>
									<div class="flex items-center">
										<Users size={16} class="mr-3 text-blue-600" />
										<div>
											<div class="text-sm font-medium">{acteur.nom}</div>
											<div class="text-xs text-gray-600">{acteur.role}</div>
										</div>
									</div>
									<span class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
										>{acteur.site}</span
									>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{:else if selectedLayer === 'fonctionnel'}
			<!-- Couche Fonctionnelle -->
			<div class="space-y-6">
				<div class="rounded-lg border bg-white">
					<div class="border-b bg-green-50 px-4 py-3">
						<h3 class="font-semibold text-green-900">Fonctions du SI</h3>
					</div>
					<div class="p-4">
						<div class="grid gap-4">
							{#each fonctionnelData.fonctions as fonction}
								<div class="rounded-lg border p-4 transition-shadow hover:shadow-sm">
									<div class="mb-3 flex items-center justify-between">
										<div class="flex items-center">
											<Settings size={16} class="mr-2 text-green-600" />
											<h4 class="font-semibold">{fonction.nom}</h4>
										</div>
										<span
											class="rounded-full border px-3 py-1 text-sm font-medium {getStatusColor(
												fonction.statut
											)}"
										>
											{fonction.statut}
										</span>
									</div>
									<p class="mb-3 text-sm text-gray-600">{fonction.description}</p>
									<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
										<div>
											<div class="mb-1 font-medium text-gray-700">Flux principaux:</div>
											<ul class="space-y-1">
												{#each fonction.flux as flux}
													<li class="text-gray-600">• {flux}</li>
												{/each}
											</ul>
										</div>
										<div>
											<div class="mb-1 font-medium text-gray-700">Données manipulées:</div>
											<ul class="space-y-1">
												{#each fonction.donnees as donnee}
													<li class="text-gray-600">• {donnee}</li>
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
			<div class="space-y-6">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div class="rounded-lg border bg-white lg:col-span-2">
						<div class="border-b bg-yellow-50 px-4 py-3">
							<h3 class="font-semibold text-yellow-900">Portfolio Applicatif</h3>
						</div>
						<div class="p-4">
							<div class="space-y-4">
								{#each applicatifData.applications as app, idx}
									<div
										class="cursor-pointer rounded-lg border p-4 transition-all {selectedBlock ===
										`app-${idx}`
											? 'border-yellow-500 bg-yellow-50'
											: 'hover:shadow-sm'}"
										onclick={() => selectBlock(`app-${idx}`)}
										role="button"
										tabindex="0"
										onkeydown={(e) => e.key === 'Enter' && selectBlock(`app-${idx}`)}
									>
										<div class="mb-3 flex items-center justify-between">
											<div class="flex items-center">
												<Database size={16} class="mr-2 text-yellow-600" />
												<div>
													<h4 class="font-semibold">{app.nom}</h4>
													<span class="text-xs text-gray-600">{app.type} - {app.domaine}</span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<div class="h-3 w-3 rounded-full {getCriticiteColor(app.criticite)}"></div>
												<span
													class="rounded border px-2 py-1 text-xs font-medium {getStatusColor(
														app.conformite
													)}"
												>
													{app.conformite}
												</span>
											</div>
										</div>
										<div class="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span class="font-medium">Utilisateurs:</span>
												{app.users}
											</div>
											<div>
												<span class="font-medium">Sites:</span>
												{app.sites.join(', ')}
											</div>
										</div>
										{#if selectedBlock === `app-${idx}`}
											<div class="mt-4 rounded border-t bg-white p-3 pt-3">
												<div class="mb-2 text-sm font-medium text-red-700">Risques identifiés:</div>
												<ul class="space-y-1">
													{#each app.risques as risque}
														<li class="flex items-center text-sm text-red-600">
															<AlertTriangle size={12} class="mr-1" />
															{risque}
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

					<div class="rounded-lg border bg-white">
						<div class="border-b bg-yellow-50 px-4 py-3">
							<h3 class="font-semibold text-yellow-900">Données</h3>
						</div>
						<div class="p-4">
							<div class="space-y-3">
								{#each applicatifData.donnees as donnee}
									<div class="rounded border p-3">
										<div class="text-sm font-medium">{donnee.nom}</div>
										<div class="mt-1 text-xs text-gray-600">
											Source: {donnee.source}
										</div>
										<div class="mt-2 flex justify-between">
											<span class="text-xs">Qualité:</span>
											<span
												class="rounded px-2 py-1 text-xs {getStatusColor(
													donnee.qualite.toLowerCase()
												)}"
											>
												{donnee.qualite}
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
			<div class="space-y-6">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div class="rounded-lg border bg-white lg:col-span-2">
						<div class="border-b bg-red-50 px-4 py-3">
							<h3 class="font-semibold text-red-900">Infrastructure</h3>
						</div>
						<div class="p-4">
							<div class="space-y-4">
								{#each techniqueData.infrastructure as infra}
									<div class="rounded-lg border p-4">
										<div class="mb-3 flex items-center justify-between">
											<div class="flex items-center">
												<Server size={16} class="mr-2 text-red-600" />
												<div>
													<h4 class="font-semibold">{infra.nom}</h4>
													<span class="text-xs text-gray-600"
														>{infra.type} - {infra.localisation}</span
													>
												</div>
											</div>
											<span
												class="rounded-full border px-3 py-1 text-sm font-medium {getStatusColor(
													infra.statut
												)}"
											>
												{infra.statut}
											</span>
										</div>
										<div class="mb-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-3">
											{#if infra.capacite}
												<div><span class="font-medium">Capacité:</span> {infra.capacite}</div>
											{/if}
											{#if infra.utilisation}
												<div><span class="font-medium">Utilisation:</span> {infra.utilisation}</div>
											{/if}
											{#if infra.bande_passante}
												<div>
													<span class="font-medium">Bande passante:</span>
													{infra.bande_passante}
												</div>
											{/if}
											{#if infra.disponibilite}
												<div>
													<span class="font-medium">Disponibilité:</span>
													{infra.disponibilite}
												</div>
											{/if}
											<div><span class="font-medium">Redondance:</span> {infra.redondance}</div>
										</div>
										{#if infra.risques}
											<div>
												<div class="mb-1 text-sm font-medium text-red-700">Risques:</div>
												<ul class="space-y-1">
													{#each infra.risques as risque}
														<li class="flex items-center text-sm text-red-600">
															<AlertTriangle size={12} class="mr-1" />
															{risque}
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

					<div class="rounded-lg border bg-white">
						<div class="border-b bg-red-50 px-4 py-3">
							<h3 class="font-semibold text-red-900">Sécurité</h3>
						</div>
						<div class="p-4">
							<div class="space-y-4">
								<div class="rounded border p-3">
									<div class="mb-2 flex items-center justify-between">
										<span class="font-medium">Niveau global</span>
										<span
											class="rounded px-2 py-1 text-xs font-medium {getStatusColor('critique')}"
										>
											{techniqueData.securite.niveau}
										</span>
									</div>
								</div>

								<div class="rounded border p-3">
									<div class="mb-2 text-sm font-medium">Mesures en place:</div>
									<ul class="space-y-1">
										{#each techniqueData.securite.mesures as mesure}
											<li class="text-sm text-gray-600">• {mesure}</li>
										{/each}
									</ul>
								</div>

								<div class="rounded border bg-red-50 p-3">
									<div class="mb-2 text-sm font-medium text-red-700">Manques critiques:</div>
									<ul class="space-y-1">
										{#each techniqueData.securite.manques as manque}
											<li class="flex items-center text-sm text-red-600">
												<AlertTriangle size={12} class="mr-1" />
												{manque}
											</li>
										{/each}
									</ul>
								</div>

								<div class="rounded border p-3">
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium">Incidents 12 derniers mois:</span>
										<span class="rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-800">
											{techniqueData.securite.incidents}
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
	<div class="mt-8 border-t bg-white">
		<div class="px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-6">
					<div class="flex items-center gap-2">
						<div class="h-3 w-3 rounded-full bg-red-500"></div>
						<span class="text-sm font-medium">Risques Critiques: 8</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
						<span class="text-sm font-medium">Attention: 5</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-3 w-3 rounded-full bg-green-500"></div>
						<span class="text-sm font-medium">Conformes: 2</span>
					</div>
				</div>
				<div class="text-sm text-gray-600">
					Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
				</div>
			</div>
		</div>
	</div>
</div>
