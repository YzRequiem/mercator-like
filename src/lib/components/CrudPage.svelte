<!-- Composant CRUD simplifié utilisant les données du serveur -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { addToast } from '$lib/toastStore';
	import LoadingSpinner from './LoadingSpinner.svelte';

	// Props
	export let data: any[];
	export let entityType: string;
	export let entityLabel: string;
	export let entityIcon: string = '📋';
	export let fields: Array<{ key: string; label: string; type: string; required?: boolean }>;
	export let displayFields: string[];

	// États locaux
	let showCreateForm = false;
	let editingItem: any = null;
	let formData: any = {};
	let searchTerm = '';
	let sortField = '';
	let sortDirection: 'asc' | 'desc' = 'asc';
	let isSubmitting = false;

	// Données filtrées et triées
	$: filteredItems = searchTerm
		? data.filter((item) =>
				Object.values(item).some((value) =>
					String(value).toLowerCase().includes(searchTerm.toLowerCase())
				)
			)
		: data;

	$: sortedItems = sortField
		? [...filteredItems].sort((a, b) => {
				const aVal = a[sortField] || '';
				const bVal = b[sortField] || '';
				const comparison = String(aVal).localeCompare(String(bVal));
				return sortDirection === 'asc' ? comparison : -comparison;
			})
		: filteredItems;

	function resetForm() {
		formData = {};
		fields.forEach((field: any) => {
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

	function handleSort(field: string) {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}
	}

	// Fonctions pour les actions avec formulaires SvelteKit
	function handleFormResult(result: any) {
		if (result.type === 'success') {
			addToast(`${entityLabel} ${editingItem ? 'modifié' : 'créé'} avec succès`, 'success');
			resetForm();
			invalidateAll();
		} else if (result.type === 'failure') {
			addToast(result.data?.message || 'Erreur lors de la sauvegarde', 'error');
		}
		isSubmitting = false;
	}

	function handleDeleteResult(result: any) {
		if (result.type === 'success') {
			addToast(`${entityLabel} supprimé avec succès`, 'success');
			invalidateAll();
		} else if (result.type === 'failure') {
			addToast(result.data?.message || 'Erreur lors de la suppression', 'error');
		}
	}
</script>

<div class="crud-container {entityType}">
	<div class="crud-header">
		<div class="header-title">
			<span class="entity-icon">{entityIcon}</span>
			<h1>Gestion des {entityLabel}</h1>
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
			<button class="btn btn-primary" onclick={startCreate}>
				<span>➕</span>
				Nouveau {entityLabel.slice(0, -1)}
			</button>
		</div>
	</div>

	{#if sortedItems.length === 0}
		<div class="empty-state">
			<div class="empty-icon">{entityIcon}</div>
			<h3>Aucun {entityLabel.slice(0, -1).toLowerCase()} trouvé</h3>
			<p>Commencez par créer votre premier {entityLabel.slice(0, -1).toLowerCase()}.</p>
			<button class="btn btn-primary" onclick={startCreate}>
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
						{#each displayFields as field}
							<th>
								<button
									class="sort-header {sortField === field ? 'active' : ''}"
									onclick={() => handleSort(field)}
								>
									{fields.find((f: any) => f.key === field)?.label || field}
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
							{#each displayFields as field}
								<td>
									<span class="cell-content">
										{item[field] || '-'}
									</span>
								</td>
							{/each}
							<td class="actions-cell">
								<button
									class="btn btn-small btn-secondary"
									onclick={() => startEdit(item)}
									title="Modifier"
								>
									✏️
								</button>
								<form
									method="POST"
									action="?/delete"
									use:enhance={() => {
										return async ({ result }) => {
											handleDeleteResult(result);
										};
									}}
									style="display: inline;"
								>
									<input type="hidden" name="id" value={item.id} />
									<button
										type="submit"
										class="btn btn-small btn-danger"
										title="Supprimer"
										onclick={() =>
											confirm(
												`Êtes-vous sûr de vouloir supprimer ce ${entityLabel.slice(0, -1).toLowerCase()} ?`
											)}
									>
										🗑️
									</button>
								</form>
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
			onclick={resetForm}
			onkeydown={(e) => e.key === 'Escape' && resetForm()}
			role="button"
			tabindex="0"
		>
			<div class="modal-content" role="dialog" aria-labelledby="modal-title" tabindex="-1">
				<div class="modal-header">
					<h3 id="modal-title">
						{editingItem ? 'Modifier' : 'Créer'} un {entityLabel.slice(0, -1).toLowerCase()}
					</h3>
					<button class="modal-close" onclick={resetForm}>✕</button>
				</div>

				<form
					method="POST"
					action={editingItem ? '?/update' : '?/create'}
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result }) => {
							handleFormResult(result);
						};
					}}
					class="modal-form"
				>
					{#if editingItem}
						<input type="hidden" name="id" value={editingItem.id} />
					{/if}

					<div class="form-grid">
						{#each fields as field}
							<div class="form-group {field.required ? 'required' : ''}">
								<label for={field.key}>
									{field.label}
									{#if field.required}<span class="required-star">*</span>{/if}
								</label>

								{#if field.type === 'textarea'}
									<textarea
										id={field.key}
										name={field.key}
										bind:value={formData[field.key]}
										placeholder={field.label}
										rows="3"
										required={field.required}
									></textarea>
								{:else if field.type === 'number'}
									<input
										id={field.key}
										name={field.key}
										type="number"
										bind:value={formData[field.key]}
										placeholder={field.label}
										required={field.required}
									/>
								{:else if field.type === 'date'}
									<input
										id={field.key}
										name={field.key}
										type="date"
										bind:value={formData[field.key]}
										required={field.required}
									/>
								{:else}
									<input
										id={field.key}
										name={field.key}
										type="text"
										bind:value={formData[field.key]}
										placeholder={field.label}
										required={field.required}
									/>
								{/if}
							</div>
						{/each}
					</div>

					<div class="modal-actions">
						<button type="button" class="btn btn-secondary" onclick={resetForm}> Annuler </button>
						<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
							{#if isSubmitting}
								<LoadingSpinner />
							{/if}
							{editingItem ? 'Modifier' : 'Créer'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.crud-container {
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

	.crud-header h1 {
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

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #667eea;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
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

	/* Modal styles */
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
