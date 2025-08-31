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
	export let fields: Array<{
		key: string;
		label: string;
		type: string;
		required?: boolean;
		placeholder?: string;
		options?: Array<{ value: string; label: string }>;
		subFields?: Array<{
			key: string;
			label: string;
			type: string;
			placeholder?: string;
			options?: Array<{ value: string; label: string }>;
		}>;
	}>;
	export let displayFields: string[];
	// Données de référence pour les sélecteurs (peut être utilisée dans le futur)
	export const referenceData: Record<string, any[]> = {};

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
			if (field.type === 'number') {
				formData[field.key] = 0;
			} else if (field.type === 'tags') {
				formData[field.key] = [];
			} else {
				formData[field.key] = '';
			}
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
		// S'assurer que les champs de type tags sont des arrays
		fields.forEach((field: any) => {
			if (field.type === 'tags' && formData[field.key]) {
				// Si c'est une string JSON, la parser, sinon garder l'array
				if (typeof formData[field.key] === 'string') {
					try {
						formData[field.key] = JSON.parse(formData[field.key]);
					} catch (e) {
						formData[field.key] = [];
					}
				}
			}
		});
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
		console.log('Form result:', result); // Debug
		if (result.type === 'success') {
			addToast(`${entityLabel} ${editingItem ? 'modifié' : 'créé'} avec succès`, 'success');
			resetForm();
			invalidateAll();
		} else if (result.type === 'failure') {
			const errorMessage =
				result.data?.error || result.data?.message || 'Erreur lors de la sauvegarde';
			console.error('Form error:', result.data); // Debug
			addToast(errorMessage, 'error');
		}
		isSubmitting = false;
	}

	function handleDeleteResult(result: any) {
		console.log('Delete result:', result); // Debug
		if (result.type === 'success') {
			addToast(`${entityLabel} supprimé avec succès`, 'success');
			invalidateAll();
		} else if (result.type === 'failure') {
			const errorMessage =
				result.data?.error || result.data?.message || 'Erreur lors de la suppression';
			console.error('Delete error:', result.data); // Debug
			addToast(errorMessage, 'error');
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
										{#if Array.isArray(item[field])}
											{#if item[field].length > 0 && typeof item[field][0] === 'object'}
												<!-- Affichage pour les sous-objets -->
												<div class="sub-objects-preview">
													{#each item[field].slice(0, 2) as obj, index}
														<span class="sub-object-preview"
															>{obj.nom || obj.name || `Objet ${index + 1}`}</span
														>
													{/each}
													{#if item[field].length > 2}
														<span class="more-indicator">+{item[field].length - 2} autres</span>
													{/if}
												</div>
											{:else}
												<!-- Affichage pour les tableaux simples (tags) -->
												{#each item[field] as tag, index}
													<span class="cell-tag">{tag}</span>{#if index < item[field].length - 1},
													{/if}
												{/each}
											{/if}
										{:else if typeof item[field] === 'string' && item[field].startsWith('[') && item[field].endsWith(']')}
											{@const parsedArray = JSON.parse(item[field] || '[]')}
											{#if parsedArray.length > 0 && typeof parsedArray[0] === 'object'}
												<!-- Affichage pour les sous-objets depuis JSON -->
												<div class="sub-objects-preview">
													{#each parsedArray.slice(0, 2) as obj, index}
														<span class="sub-object-preview"
															>{obj.nom || obj.name || `Objet ${index + 1}`}</span
														>
													{/each}
													{#if parsedArray.length > 2}
														<span class="more-indicator">+{parsedArray.length - 2} autres</span>
													{/if}
												</div>
											{:else}
												<!-- Affichage pour les tableaux simples depuis JSON -->
												{#each parsedArray as tag, index}
													<span class="cell-tag">{tag}</span>{#if index < parsedArray.length - 1},
													{/if}
												{/each}
											{/if}
										{:else}
											{item[field] || '-'}
										{/if}
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
			<div
				class="modal-content"
				role="dialog"
				aria-labelledby="modal-title"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
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
								{:else if field.type === 'select'}
									<select
										id={field.key}
										name={field.key}
										bind:value={formData[field.key]}
										required={field.required}
									>
										<option value="">Sélectionner...</option>
										{#each field.options || [] as option}
											<option value={option.value}>{option.label}</option>
										{/each}
									</select>
								{:else if field.type === 'select-tags'}
									<div class="select-tags-container">
										<div class="tags-display">
											{#each formData[field.key] || [] as tag, tagIndex}
												<span class="tag">
													{tag}
													<button
														type="button"
														class="tag-remove"
														onclick={() => {
															const tags = [...(formData[field.key] || [])];
															tags.splice(tagIndex, 1);
															formData[field.key] = tags;
															formData = { ...formData }; // Force reactivity
														}}
													>
														×
													</button>
												</span>
											{/each}
										</div>
										<select
											onchange={(e) => {
												const target = e.target as HTMLSelectElement;
												const value = target.value;
												if (value && !(formData[field.key] || []).includes(value)) {
													formData[field.key] = [...(formData[field.key] || []), value];
													formData = { ...formData }; // Force reactivity
													target.value = '';
												}
											}}
										>
											<option value="">Sélectionner {field.label.toLowerCase()}...</option>
											{#each field.options || [] as option}
												<option value={option.value}>{option.label}</option>
											{/each}
										</select>
									</div>
								{:else if field.type === 'tags'}
									<div class="tags-input-container">
										<div class="tags-display">
											{#each formData[field.key] || [] as tag, index}
												<span class="tag">
													{tag}
													<button
														type="button"
														class="tag-remove"
														onclick={() => {
															const tags = [...(formData[field.key] || [])];
															tags.splice(index, 1);
															formData[field.key] = tags;
														}}
													>
														×
													</button>
												</span>
											{/each}
										</div>
										<input
											type="text"
											placeholder={field.placeholder || `Ajouter ${field.label.toLowerCase()}...`}
											onkeydown={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault();
													const target = e.target as HTMLInputElement;
													const value = target.value.trim();
													if (value && !(formData[field.key] || []).includes(value)) {
														formData[field.key] = [...(formData[field.key] || []), value];
														target.value = '';
													}
												}
											}}
										/>
										<input
											type="hidden"
											name={field.key}
											value={JSON.stringify(formData[field.key] || [])}
										/>
									</div>
								{:else if field.type === 'sub-objects'}
									<div class="sub-objects-container">
										<div class="sub-objects-header">
											<span>{field.label}</span>
											<button
												type="button"
												class="btn btn-small btn-primary"
												onclick={() => {
													const newObj: Record<string, any> = {};
													field.subFields?.forEach((subField) => {
														if (subField.type === 'tags') {
															newObj[subField.key] = [];
														} else {
															newObj[subField.key] = '';
														}
													});
													formData[field.key] = [...(formData[field.key] || []), newObj];
													formData = { ...formData }; // Force reactivity
												}}
											>
												+ Ajouter
											</button>
										</div>

										{#each formData[field.key] || [] as subObj, objIndex}
											<div class="sub-object-item">
												<div class="sub-object-header">
													<span>#{objIndex + 1}</span>
													<button
														type="button"
														class="btn btn-small btn-danger"
														onclick={() => {
															const objects = [...(formData[field.key] || [])];
															objects.splice(objIndex, 1);
															formData[field.key] = objects;
															formData = { ...formData }; // Force reactivity
														}}
													>
														×
													</button>
												</div>

												<div class="sub-object-fields">
													{#each field.subFields || [] as subField}
														<div class="sub-field-group">
															<span class="sub-field-label">{subField.label}</span>
															{#if subField.type === 'tags'}
																<div class="tags-input-container">
																	<div class="tags-display">
																		{#each subObj[subField.key] || [] as tag, tagIndex}
																			<span class="tag">
																				{tag}
																				<button
																					type="button"
																					class="tag-remove"
																					onclick={() => {
																						const tags = [...(subObj[subField.key] || [])];
																						tags.splice(tagIndex, 1);
																						subObj[subField.key] = tags;
																						formData[field.key] = [...formData[field.key]];
																						formData = { ...formData }; // Force reactivity
																					}}
																				>
																					×
																				</button>
																			</span>
																		{/each}
																	</div>
																	<input
																		type="text"
																		placeholder={subField.placeholder ||
																			`Ajouter ${subField.label.toLowerCase()}...`}
																		onkeydown={(e) => {
																			if (e.key === 'Enter') {
																				e.preventDefault();
																				const target = e.target as HTMLInputElement;
																				const value = target.value.trim();
																				if (
																					value &&
																					!(subObj[subField.key] || []).includes(value)
																				) {
																					subObj[subField.key] = [
																						...(subObj[subField.key] || []),
																						value
																					];
																					formData[field.key] = [...formData[field.key]];
																					formData = { ...formData }; // Force reactivity
																					target.value = '';
																				}
																			}
																		}}
																	/>
																</div>
															{:else if subField.type === 'select-tags'}
																<div class="select-tags-container">
																	<div class="tags-display">
																		{#each subObj[subField.key] || [] as tag, tagIndex}
																			<span class="tag">
																				{tag}
																				<button
																					type="button"
																					class="tag-remove"
																					onclick={() => {
																						const tags = [...(subObj[subField.key] || [])];
																						tags.splice(tagIndex, 1);
																						subObj[subField.key] = tags;
																						formData[field.key] = [...formData[field.key]];
																						formData = { ...formData }; // Force reactivity
																					}}
																				>
																					×
																				</button>
																			</span>
																		{/each}
																	</div>
																	<select
																		onchange={(e) => {
																			const target = e.target as HTMLSelectElement;
																			const value = target.value;
																			if (value && !(subObj[subField.key] || []).includes(value)) {
																				subObj[subField.key] = [
																					...(subObj[subField.key] || []),
																					value
																				];
																				formData[field.key] = [...formData[field.key]];
																				formData = { ...formData }; // Force reactivity
																				target.value = '';
																			}
																		}}
																	>
																		<option value=""
																			>Sélectionner {subField.label.toLowerCase()}...</option
																		>
																		{#each subField.options || [] as option}
																			<option value={option.value}>{option.label}</option>
																		{/each}
																	</select>
																</div>
															{:else if subField.type === 'textarea'}
																<textarea
																	bind:value={subObj[subField.key]}
																	placeholder={subField.label}
																	rows="2"
																></textarea>
															{:else}
																<input
																	type="text"
																	bind:value={subObj[subField.key]}
																	placeholder={subField.label}
																/>
															{/if}
														</div>
													{/each}
												</div>
											</div>
										{/each}

										<input
											type="hidden"
											name={field.key}
											value={JSON.stringify(formData[field.key] || [])}
										/>
									</div>
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
		max-width: 800px;
		max-height: 95vh;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
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
		overflow-y: auto;
		flex: 1;
		max-height: calc(95vh - 140px); /* Hauteur modal moins header et actions avec padding */
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
	.form-group textarea,
	.form-group select {
		padding: 10px 12px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 14px;
		transition: border-color 0.2s ease;
	}

	.form-group input:focus,
	.form-group textarea:focus,
	.form-group select:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	/* Styles pour les tags */
	.tags-input-container {
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 8px;
		min-height: 44px;
		background: white;
		transition: border-color 0.2s ease;
	}

	.tags-input-container:focus-within {
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.tags-display {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 6px;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		background: #667eea;
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
		gap: 4px;
	}

	.tag-remove {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 14px;
		font-weight: bold;
		padding: 0;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease;
	}

	.tag-remove:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.tags-input-container input[type='text'] {
		border: none;
		outline: none;
		padding: 4px 0;
		font-size: 14px;
		width: 100%;
		background: transparent;
	}

	.select-tags-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.select-tags-container .tags-display {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-bottom: 8px;
		min-height: 25px;
		padding: 6px;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: #f9f9f9;
	}

	.select-tags-container select {
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
		background: white;
		cursor: pointer;
	}

	.select-tags-container select:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}

	.cell-tag {
		background: #f0f0f0;
		color: #333;
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 11px;
		display: inline-block;
		margin: 1px;
	}

	/* Sub-objects preview in table */
	.sub-objects-preview {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		align-items: center;
	}

	.sub-object-preview {
		background: #e3f2fd;
		color: #1976d2;
		padding: 2px 6px;
		border-radius: 12px;
		font-size: 0.8em;
		border: 1px solid #bbdefb;
	}

	.more-indicator {
		color: #666;
		font-style: italic;
		font-size: 0.8em;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		border-top: 1px solid #eee;
		padding: 20px 25px;
		background: white;
		flex-shrink: 0;
	}

	/* Sub-objects styles */
	.sub-objects-container {
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 15px;
		background: #f9f9f9;
		max-height: 400px;
		overflow-y: auto;
	}

	.sub-objects-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
		font-weight: bold;
		position: sticky;
		top: 0;
		background: #f9f9f9;
		padding: 5px 0;
		z-index: 1;
	}

	.sub-object-item {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 12px;
		margin-bottom: 10px;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.sub-object-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		font-weight: bold;
		color: #666;
		background: #f8f9fa;
		padding: 5px 10px;
		border-radius: 3px;
		margin: -12px -12px 10px -12px;
	}

	.sub-object-fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 10px;
	}
	.sub-field-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.sub-field-group label,
	.sub-field-group .sub-field-label {
		font-size: 0.9em;
		font-weight: 500;
		color: #555;
		margin: 0;
	}

	.sub-field-group input,
	.sub-field-group textarea {
		padding: 6px 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.btn.btn-small {
		padding: 4px 8px;
		font-size: 0.8em;
		border-radius: 4px;
		border: none;
		cursor: pointer;
	}

	.btn.btn-primary {
		background: #007bff;
		color: white;
	}

	.btn.btn-danger {
		background: #dc3545;
		color: white;
	}

	.btn:hover {
		opacity: 0.9;
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

		.modal-content {
			max-width: 95vw;
			margin: 10px;
		}

		.modal-form {
			padding: 15px;
			max-height: calc(95vh - 100px);
		}

		.sub-objects-container {
			max-height: 300px;
		}

		.sub-object-fields {
			grid-template-columns: 1fr;
		}

		.modal-actions {
			padding: 15px;
		}
	}
</style>
