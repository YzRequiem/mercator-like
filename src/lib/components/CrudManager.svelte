<!-- Composant CRUD générique pour toutes les entités -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/apiClient';
	import type {
		Etablissement,
		Processus,
		Acteur,
		Application,
		Infrastructure,
		Incident,
		Fonction,
		Donnee,
		Ecosysteme,
		Securite
	} from '$lib/apiClient';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { addToast } from '$lib/toastStore';

	// Props
	export let entityType: string;
	export let entityLabel: string;
	export let entityIcon: string = '📋';

	// États
	let items: any[] = [];
	let loading = false;
	let error = '';
	let showCreateForm = false;
	let editingItem: any = null;
	let formData: any = {};
	let searchTerm = '';
	let sortField = '';
	let sortDirection: 'asc' | 'desc' = 'asc';

	// Configuration des champs par entité
	const entityConfigs: Record<
		string,
		{
			fields: Array<{ key: string; label: string; type: string; required?: boolean }>;
			displayFields: string[];
		}
	> = {
		etablissements: {
			fields: [
				{ key: 'nom', label: 'Nom', type: 'text', required: true },
				{ key: 'code', label: 'Code', type: 'text', required: true },
				{ key: 'adresse', label: 'Adresse', type: 'text' },
				{ key: 'statut', label: 'Statut', type: 'text' },
				{ key: 'surface', label: 'Surface', type: 'text' },
				{ key: 'collaborateurs', label: 'Collaborateurs', type: 'text' },
				{ key: 'statut_operationnel', label: 'Statut opérationnel', type: 'text' }
			],
			displayFields: ['nom', 'code', 'adresse', 'statut']
		},
		processus: {
			fields: [{ key: 'nom', label: 'Nom', type: 'text', required: true }],
			displayFields: ['nom']
		},
		acteurs: {
			fields: [
				{ key: 'nom', label: 'Nom', type: 'text', required: true },
				{ key: 'site', label: 'Site', type: 'text' },
				{ key: 'role', label: 'Rôle', type: 'text' }
			],
			displayFields: ['nom', 'site', 'role']
		},
		applications: {
			fields: [
				{ key: 'nom', label: 'Nom', type: 'text', required: true },
				{ key: 'type', label: 'Type', type: 'text' },
				{ key: 'domaine', label: 'Domaine', type: 'text' },
				{ key: 'criticite', label: 'Criticité', type: 'text' },
				{ key: 'statut', label: 'Statut', type: 'text' },
				{ key: 'users', label: 'Utilisateurs', type: 'text' },
				{ key: 'version', label: 'Version', type: 'text' },
				{ key: 'editeur', label: 'Éditeur', type: 'text' },
				{ key: 'cout_annuel', label: 'Coût annuel', type: 'number' }
			],
			displayFields: ['nom', 'type', 'domaine', 'criticite', 'statut']
		},
		infrastructure: {
			fields: [
				{ key: 'nom', label: 'Nom', type: 'text', required: true },
				{ key: 'type', label: 'Type', type: 'text' },
				{ key: 'localisation', label: 'Localisation', type: 'text' },
				{ key: 'statut', label: 'Statut', type: 'text' },
				{ key: 'capacite', label: 'Capacité', type: 'text' },
				{ key: 'utilisation', label: 'Utilisation', type: 'text' },
				{ key: 'fournisseur', label: 'Fournisseur', type: 'text' },
				{ key: 'cout_mensuel', label: 'Coût mensuel', type: 'number' }
			],
			displayFields: ['nom', 'type', 'localisation', 'statut']
		},
		incidents: {
			fields: [
				{ key: 'nom', label: 'Nom', type: 'text', required: true },
				{ key: 'impact', label: 'Impact', type: 'text' },
				{ key: 'date', label: 'Date', type: 'date' },
				{ key: 'statut', label: 'Statut', type: 'text' },
				{ key: 'description', label: 'Description', type: 'textarea' },
				{ key: 'duree', label: 'Durée', type: 'text' },
				{ key: 'cout_estime', label: 'Coût estimé', type: 'number' },
				{ key: 'cause', label: 'Cause', type: 'text' }
			],
			displayFields: ['nom', 'impact', 'date', 'statut']
		},
		fonctions: {
			fields: [
				{ key: 'nom', label: 'Nom', type: 'text', required: true },
				{ key: 'description', label: 'Description', type: 'textarea' },
				{ key: 'statut', label: 'Statut', type: 'text' },
				{ key: 'niveau_automatisation', label: 'Niveau automatisation', type: 'text' },
				{ key: 'frequence_utilisation', label: 'Fréquence utilisation', type: 'text' }
			],
			displayFields: ['nom', 'description', 'statut']
		},
		donnees: {
			fields: [
				{ key: 'nom', label: 'Nom', type: 'text', required: true },
				{ key: 'source', label: 'Source', type: 'text' },
				{ key: 'qualite', label: 'Qualité', type: 'text' },
				{ key: 'volume', label: 'Volume', type: 'text' },
				{ key: 'frequence_maj', label: 'Fréquence MAJ', type: 'text' },
				{ key: 'proprietaire', label: 'Propriétaire', type: 'text' },
				{ key: 'sensibilite', label: 'Sensibilité', type: 'text' },
				{ key: 'format', label: 'Format', type: 'text' }
			],
			displayFields: ['nom', 'source', 'qualite', 'proprietaire']
		},
		ecosysteme: {
			fields: [
				{ key: 'nom', label: 'Nom', type: 'text', required: true },
				{ key: 'type', label: 'Type', type: 'text' },
				{ key: 'relation', label: 'Relation', type: 'text' }
			],
			displayFields: ['nom', 'type', 'relation']
		}
	};

	$: config = entityConfigs[entityType] || { fields: [], displayFields: [] };
	$: filteredItems = searchTerm
		? items.filter((item) =>
				Object.values(item).some((value) =>
					String(value).toLowerCase().includes(searchTerm.toLowerCase())
				)
			)
		: items;

	$: sortedItems = sortField
		? [...filteredItems].sort((a, b) => {
				const aVal = a[sortField] || '';
				const bVal = b[sortField] || '';
				const comparison = String(aVal).localeCompare(String(bVal));
				return sortDirection === 'asc' ? comparison : -comparison;
			})
		: filteredItems;

	onMount(async () => {
		await loadItems();
	});

	async function loadItems() {
		loading = true;
		error = '';

		try {
			let response;
			switch (entityType) {
				case 'etablissements':
					response = await apiClient.getEtablissements();
					break;
				case 'processus':
					response = await apiClient.getProcessus();
					break;
				case 'acteurs':
					response = await apiClient.getActeurs();
					break;
				case 'applications':
					response = await apiClient.getApplications();
					break;
				case 'infrastructure':
					response = await apiClient.getInfrastructure();
					break;
				case 'incidents':
					response = await apiClient.getIncidents();
					break;
				case 'fonctions':
					response = await apiClient.getFonctions();
					break;
				case 'donnees':
					response = await apiClient.getDonnees();
					break;
				case 'ecosysteme':
					response = await apiClient.getEcosysteme();
					break;
				default:
					throw new Error(`Type d'entité non supporté: ${entityType}`);
			}

			if (response.success && response.data) {
				items = response.data;
			} else {
				error = response.error || 'Erreur lors du chargement';
			}
		} catch (e) {
			error = `Erreur de connexion: ${e}`;
			console.error('Erreur lors du chargement:', e);
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		formData = {};
		config.fields.forEach((field: any) => {
			formData[field.key] = field.type === 'number' ? 0 : '';
		});
		editingItem = null;
		showCreateForm = false;
	}

	function startCreate() {
		resetForm();
		showCreateForm = true;
	}

	function startEdit(item: any) {
		formData = { ...item };
		editingItem = item;
		showCreateForm = true;
	}

	async function handleSubmit() {
		try {
			// Validation
			const requiredFields = config.fields.filter((f: any) => f.required);
			for (const field of requiredFields) {
				if (!formData[field.key] || formData[field.key].toString().trim() === '') {
					addToast(`Le champ "${field.label}" est requis`, 'error');
					return;
				}
			}

			let response;
			if (editingItem) {
				// Mise à jour
				switch (entityType) {
					case 'etablissements':
						response = await apiClient.updateEtablissement(editingItem.id, formData);
						break;
					case 'processus':
						response = await apiClient.updateProcessus(editingItem.id, formData);
						break;
					case 'acteurs':
						response = await apiClient.updateActeur(editingItem.id, formData);
						break;
					case 'applications':
						response = await apiClient.updateApplication(editingItem.id, formData);
						break;
					case 'infrastructure':
						response = await apiClient.updateInfrastructure(editingItem.id, formData);
						break;
					case 'incidents':
						response = await apiClient.updateIncident(editingItem.id, formData);
						break;
					case 'fonctions':
						response = await apiClient.updateFonction(editingItem.id, formData);
						break;
					case 'donnees':
						response = await apiClient.updateDonnee(editingItem.id, formData);
						break;
					case 'ecosysteme':
						response = await apiClient.updateEcosysteme(editingItem.id, formData);
						break;
				}
			} else {
				// Création
				switch (entityType) {
					case 'etablissements':
						response = await apiClient.createEtablissement(formData);
						break;
					case 'processus':
						response = await apiClient.createProcessus(formData);
						break;
					case 'acteurs':
						response = await apiClient.createActeur(formData);
						break;
					case 'applications':
						response = await apiClient.createApplication(formData);
						break;
					case 'infrastructure':
						response = await apiClient.createInfrastructure(formData);
						break;
					case 'incidents':
						response = await apiClient.createIncident(formData);
						break;
					case 'fonctions':
						response = await apiClient.createFonction(formData);
						break;
					case 'donnees':
						response = await apiClient.createDonnee(formData);
						break;
					case 'ecosysteme':
						response = await apiClient.createEcosysteme(formData);
						break;
				}
			}

			if (response?.success) {
				addToast(`${entityLabel} ${editingItem ? 'modifié' : 'créé'} avec succès`, 'success');
				resetForm();
				await loadItems();
			} else {
				addToast(response?.error || 'Erreur lors de la sauvegarde', 'error');
			}
		} catch (e) {
			addToast(`Erreur: ${e}`, 'error');
			console.error('Erreur lors de la sauvegarde:', e);
		}
	}

	async function deleteItem(item: any) {
		if (!confirm(`Êtes-vous sûr de vouloir supprimer "${item.nom}" ?`)) {
			return;
		}

		try {
			let response;
			switch (entityType) {
				case 'etablissements':
					response = await apiClient.deleteEtablissement(item.id);
					break;
				case 'processus':
					response = await apiClient.deleteProcessus(item.id);
					break;
				case 'acteurs':
					response = await apiClient.deleteActeur(item.id);
					break;
				case 'applications':
					response = await apiClient.deleteApplication(item.id);
					break;
				case 'infrastructure':
					response = await apiClient.deleteInfrastructure(item.id);
					break;
				case 'incidents':
					response = await apiClient.deleteIncident(item.id);
					break;
				case 'fonctions':
					response = await apiClient.deleteFonction(item.id);
					break;
				case 'donnees':
					response = await apiClient.deleteDonnee(item.id);
					break;
				case 'ecosysteme':
					response = await apiClient.deleteEcosysteme(item.id);
					break;
			}

			if (response?.success) {
				addToast(`${entityLabel} supprimé avec succès`, 'success');
				await loadItems();
			} else {
				addToast(response?.error || 'Erreur lors de la suppression', 'error');
			}
		} catch (e) {
			addToast(`Erreur: ${e}`, 'error');
			console.error('Erreur lors de la suppression:', e);
		}
	}

	function handleSort(field: string) {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}
	}
</script>

<div class="crud-manager">
	<div class="crud-header">
		<div class="header-title">
			<span class="entity-icon">{entityIcon}</span>
			<h2>Gestion des {entityLabel}</h2>
		</div>
		<div class="header-actions">
			<div class="search-box">
				<input
					type="text"
					placeholder="Rechercher..."
					bind:value={searchTerm}
					class="search-input"
				/>
				<span class="search-icon">🔍</span>
			</div>
			<button class="btn btn-primary" on:click={startCreate}>
				<span>➕</span>
				Nouveau {entityLabel.slice(0, -1)}
			</button>
			<button class="btn btn-secondary" on:click={loadItems}>
				<span>🔄</span>
				Actualiser
			</button>
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
			<p>Chargement des {entityLabel.toLowerCase()}...</p>
		</div>
	{:else if sortedItems.length === 0}
		<div class="empty-state">
			<div class="empty-icon">{entityIcon}</div>
			<h3>Aucun {entityLabel.slice(0, -1).toLowerCase()} trouvé</h3>
			<p>Commencez par créer votre premier {entityLabel.slice(0, -1).toLowerCase()}.</p>
			<button class="btn btn-primary" on:click={startCreate}>
				Créer le premier {entityLabel.slice(0, -1).toLowerCase()}
			</button>
		</div>
	{:else}
		<div class="data-table-container">
			<div class="results-info">
				<span>{sortedItems.length} résultat{sortedItems.length > 1 ? 's' : ''}</span>
				{#if searchTerm}
					<span class="search-info">pour "{searchTerm}"</span>
				{/if}
			</div>

			<table class="data-table">
				<thead>
					<tr>
						{#each config.displayFields as field}
							<th>
								<button
									class="sort-header {sortField === field ? 'active' : ''}"
									on:click={() => handleSort(field)}
								>
									{config.fields.find((f: any) => f.key === field)?.label || field}
									{#if sortField === field}
										<span class="sort-icon">
											{sortDirection === 'asc' ? '↑' : '↓'}
										</span>
									{/if}
								</button>
							</th>
						{/each}
						<th class="actions-column">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each sortedItems as item (item.id)}
						<tr class="data-row">
							{#each config.displayFields as field}
								<td>
									<span class="cell-content">
										{item[field] || '-'}
									</span>
								</td>
							{/each}
							<td class="actions-cell">
								<button
									class="btn btn-small btn-secondary"
									on:click={() => startEdit(item)}
									title="Modifier"
								>
									✏️
								</button>
								<button
									class="btn btn-small btn-danger"
									on:click={() => deleteItem(item)}
									title="Supprimer"
								>
									🗑️
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Modal de création/édition -->
	{#if showCreateForm}
		<div
			class="modal-overlay"
			on:click={resetForm}
			on:keydown={(e) => e.key === 'Escape' && resetForm()}
			role="button"
			tabindex="0"
		>
			<div
				class="modal-content"
				on:click|stopPropagation
				on:keydown|stopPropagation
				role="dialog"
				aria-labelledby="modal-title"
				tabindex="-1"
			>
				<div class="modal-header">
					<h3 id="modal-title">
						{editingItem ? 'Modifier' : 'Créer'} un {entityLabel.slice(0, -1).toLowerCase()}
					</h3>
					<button class="modal-close" on:click={resetForm}>✕</button>
				</div>

				<form on:submit|preventDefault={handleSubmit} class="modal-form">
					<div class="form-grid">
						{#each config.fields as field}
							<div class="form-group {field.required ? 'required' : ''}">
								<label for={field.key}>
									{field.label}
									{#if field.required}<span class="required-star">*</span>{/if}
								</label>

								{#if field.type === 'textarea'}
									<textarea
										id={field.key}
										bind:value={formData[field.key]}
										placeholder={field.label}
										rows="3"
									></textarea>
								{:else if field.type === 'number'}
									<input
										id={field.key}
										type="number"
										bind:value={formData[field.key]}
										placeholder={field.label}
									/>
								{:else if field.type === 'date'}
									<input id={field.key} type="date" bind:value={formData[field.key]} />
								{:else}
									<input
										id={field.key}
										type="text"
										bind:value={formData[field.key]}
										placeholder={field.label}
									/>
								{/if}
							</div>
						{/each}
					</div>

					<div class="modal-actions">
						<button type="button" class="btn btn-secondary" on:click={resetForm}> Annuler </button>
						<button type="submit" class="btn btn-primary">
							{editingItem ? 'Modifier' : 'Créer'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.crud-manager {
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.crud-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 25px;
		background: #f8f9fa;
		border-bottom: 1px solid #eee;
		flex-wrap: wrap;
		gap: 15px;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.entity-icon {
		font-size: 1.5rem;
	}

	.crud-header h2 {
		margin: 0;
		color: #333;
		font-size: 1.5rem;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.search-box {
		position: relative;
	}

	.search-input {
		padding: 8px 35px 8px 12px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 14px;
		width: 200px;
	}

	.search-icon {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		color: #666;
		pointer-events: none;
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
		background: #667eea;
		color: white;
	}

	.btn-primary:hover {
		background: #5a6fd8;
	}

	.btn-secondary {
		background: #f8f9fa;
		color: #666;
		border: 1px solid #ddd;
	}

	.btn-secondary:hover {
		background: #e9ecef;
	}

	.btn-danger {
		background: #dc3545;
		color: white;
	}

	.btn-danger:hover {
		background: #c82333;
	}

	.btn-small {
		padding: 4px 8px;
		font-size: 12px;
	}

	.error-message {
		padding: 15px 25px;
		background: #fee;
		color: #c33;
		border-left: 4px solid #c33;
	}

	.loading-container {
		padding: 40px;
		text-align: center;
		color: #666;
	}

	.empty-state {
		padding: 60px 40px;
		text-align: center;
		color: #666;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 20px;
		opacity: 0.5;
	}

	.empty-state h3 {
		margin: 0 0 10px 0;
		color: #333;
	}

	.empty-state p {
		margin: 0 0 25px 0;
	}

	.data-table-container {
		overflow-x: auto;
	}

	.results-info {
		padding: 12px 25px;
		background: #f8f9fa;
		font-size: 14px;
		color: #666;
		border-bottom: 1px solid #eee;
	}

	.search-info {
		font-style: italic;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table th,
	.data-table td {
		padding: 12px 15px;
		text-align: left;
		border-bottom: 1px solid #eee;
	}

	.data-table th {
		background: #fafafa;
		font-weight: 600;
		color: #333;
	}

	.sort-header {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		font-weight: 600;
		color: #333;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.sort-header:hover {
		color: #667eea;
	}

	.sort-header.active {
		color: #667eea;
	}

	.sort-icon {
		font-size: 12px;
	}

	.actions-column {
		width: 120px;
	}

	.data-row:hover {
		background: #f8f9fa;
	}

	.cell-content {
		display: block;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions-cell {
		display: flex;
		gap: 6px;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}

	.modal-content {
		background: white;
		border-radius: 8px;
		width: 100%;
		max-width: 600px;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 25px;
		border-bottom: 1px solid #eee;
	}

	.modal-header h3 {
		margin: 0;
		color: #333;
	}

	.modal-close {
		background: none;
		border: none;
		font-size: 20px;
		color: #666;
		cursor: pointer;
		padding: 0;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
	}

	.modal-close:hover {
		background: #f0f0f0;
	}

	.modal-form {
		padding: 25px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 25px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.form-group label {
		font-weight: 500;
		color: #333;
		font-size: 14px;
	}

	.required-star {
		color: #dc3545;
		margin-left: 2px;
	}

	.form-group input,
	.form-group textarea {
		padding: 10px 12px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 14px;
		transition: border-color 0.2s ease;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.form-group.required input:invalid,
	.form-group.required textarea:invalid {
		border-color: #dc3545;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		border-top: 1px solid #eee;
		padding-top: 20px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.crud-header {
			flex-direction: column;
			align-items: stretch;
		}

		.header-actions {
			justify-content: space-between;
		}

		.search-input {
			width: 150px;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.data-table {
			font-size: 14px;
		}

		.cell-content {
			max-width: 120px;
		}
	}
</style>
