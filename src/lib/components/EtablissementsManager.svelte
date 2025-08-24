<!-- Exemple de composant Svelte utilisant l'API client -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient, type Etablissement } from '$lib/apiClient';

	let etablissements: Etablissement[] = [];
	let loading = false;
	let error = '';
	let showCreateForm = false;

	// Formulaire de création/édition
	let formData: Partial<Etablissement> = {
		nom: '',
		code: '',
		adresse: '',
		statut: '',
		surface: '',
		collaborateurs: '',
		statut_operationnel: ''
	};
	let editingId: string | null = null;

	onMount(async () => {
		await loadEtablissements();
	});

	async function loadEtablissements() {
		loading = true;
		error = '';

		try {
			const response = await apiClient.getEtablissements();

			if (response.success && response.data) {
				etablissements = response.data;
			} else {
				error = response.error || 'Erreur lors du chargement';
			}
		} catch (e) {
			error = 'Erreur de connexion';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit() {
		if (!formData.nom || !formData.code) {
			error = 'Le nom et le code sont requis';
			return;
		}

		loading = true;
		error = '';

		try {
			let response;

			if (editingId) {
				response = await apiClient.updateEtablissement(editingId, formData);
			} else {
				response = await apiClient.createEtablissement(formData);
			}

			if (response.success) {
				await loadEtablissements();
				resetForm();
			} else {
				error = response.error || 'Erreur lors de la sauvegarde';
			}
		} catch (e) {
			error = 'Erreur de connexion';
		} finally {
			loading = false;
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) {
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await apiClient.deleteEtablissement(id);

			if (response.success) {
				await loadEtablissements();
			} else {
				error = response.error || 'Erreur lors de la suppression';
			}
		} catch (e) {
			error = 'Erreur de connexion';
		} finally {
			loading = false;
		}
	}

	function startEdit(etablissement: Etablissement) {
		editingId = etablissement.id;
		formData = { ...etablissement };
		showCreateForm = true;
	}

	function resetForm() {
		formData = {
			nom: '',
			code: '',
			adresse: '',
			statut: '',
			surface: '',
			collaborateurs: '',
			statut_operationnel: ''
		};
		editingId = null;
		showCreateForm = false;
	}
</script>

<div class="etablissements-manager">
	<h2>Gestion des Établissements</h2>

	{#if error}
		<div class="error">
			{error}
			<button on:click={() => (error = '')}>×</button>
		</div>
	{/if}

	<div class="actions">
		<button on:click={() => (showCreateForm = !showCreateForm)} class="btn-primary">
			{showCreateForm ? 'Annuler' : 'Nouvel Établissement'}
		</button>

		<button on:click={loadEtablissements} disabled={loading} class="btn-secondary">
			{loading ? 'Chargement...' : 'Actualiser'}
		</button>
	</div>

	{#if showCreateForm}
		<form on:submit|preventDefault={handleSubmit} class="create-form">
			<h3>{editingId ? 'Modifier' : 'Créer'} un établissement</h3>

			<div class="form-group">
				<label for="nom">Nom *</label>
				<input id="nom" type="text" bind:value={formData.nom} required disabled={loading} />
			</div>

			<div class="form-group">
				<label for="code">Code *</label>
				<input id="code" type="text" bind:value={formData.code} required disabled={loading} />
			</div>

			<div class="form-group">
				<label for="adresse">Adresse</label>
				<input id="adresse" type="text" bind:value={formData.adresse} disabled={loading} />
			</div>

			<div class="form-group">
				<label for="statut">Statut</label>
				<select id="statut" bind:value={formData.statut} disabled={loading}>
					<option value="">Sélectionner...</option>
					<option value="actif">Actif</option>
					<option value="inactif">Inactif</option>
					<option value="maintenance">En maintenance</option>
				</select>
			</div>

			<div class="form-group">
				<label for="surface">Surface</label>
				<input id="surface" type="text" bind:value={formData.surface} disabled={loading} />
			</div>

			<div class="form-group">
				<label for="collaborateurs">Collaborateurs</label>
				<input
					id="collaborateurs"
					type="text"
					bind:value={formData.collaborateurs}
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="statut_operationnel">Statut Opérationnel</label>
				<select
					id="statut_operationnel"
					bind:value={formData.statut_operationnel}
					disabled={loading}
				>
					<option value="">Sélectionner...</option>
					<option value="operationnel">Opérationnel</option>
					<option value="degradé">Dégradé</option>
					<option value="hors_service">Hors service</option>
				</select>
			</div>

			<div class="form-actions">
				<button type="submit" disabled={loading} class="btn-primary">
					{loading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
				</button>
				<button type="button" on:click={resetForm} disabled={loading} class="btn-secondary">
					Annuler
				</button>
			</div>
		</form>
	{/if}

	{#if loading && !showCreateForm}
		<div class="loading">Chargement des établissements...</div>
	{:else if etablissements.length === 0}
		<div class="empty-state">
			<p>Aucun établissement trouvé.</p>
			<button on:click={() => (showCreateForm = true)} class="btn-primary">
				Créer le premier établissement
			</button>
		</div>
	{:else}
		<div class="etablissements-grid">
			{#each etablissements as etablissement (etablissement.id)}
				<div class="etablissement-card">
					<div class="card-header">
						<h3>{etablissement.nom}</h3>
						<div class="card-actions">
							<button on:click={() => startEdit(etablissement)} class="btn-edit" disabled={loading}>
								✏️
							</button>
							<button
								on:click={() => handleDelete(etablissement.id)}
								class="btn-delete"
								disabled={loading}
							>
								🗑️
							</button>
						</div>
					</div>

					<div class="card-content">
						<p><strong>Code:</strong> {etablissement.code}</p>
						{#if etablissement.adresse}
							<p><strong>Adresse:</strong> {etablissement.adresse}</p>
						{/if}
						{#if etablissement.statut}
							<p><strong>Statut:</strong> {etablissement.statut}</p>
						{/if}
						{#if etablissement.surface}
							<p><strong>Surface:</strong> {etablissement.surface}</p>
						{/if}
						{#if etablissement.collaborateurs}
							<p><strong>Collaborateurs:</strong> {etablissement.collaborateurs}</p>
						{/if}
						{#if etablissement.statut_operationnel}
							<p><strong>Statut Opérationnel:</strong> {etablissement.statut_operationnel}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.etablissements-manager {
		padding: 20px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.error {
		background: #fee;
		border: 1px solid #fcc;
		color: #a00;
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.error button {
		background: none;
		border: none;
		color: #a00;
		font-size: 18px;
		cursor: pointer;
	}

	.actions {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	.btn-primary {
		background: #007bff;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-primary:hover:not(:disabled) {
		background: #0056b3;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #545b62;
	}

	.btn-primary:disabled,
	.btn-secondary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.create-form {
		background: #f8f9fa;
		padding: 20px;
		border-radius: 4px;
		margin-bottom: 20px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	.form-group label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	.form-group input,
	.form-group select {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.form-actions {
		display: flex;
		gap: 10px;
		margin-top: 20px;
	}

	.loading {
		text-align: center;
		padding: 40px;
		color: #666;
	}

	.empty-state {
		text-align: center;
		padding: 40px;
		color: #666;
	}

	.etablissements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}

	.etablissement-card {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		background: #f8f9fa;
		border-bottom: 1px solid #ddd;
	}

	.card-header h3 {
		margin: 0;
		font-size: 18px;
	}

	.card-actions {
		display: flex;
		gap: 5px;
	}

	.btn-edit,
	.btn-delete {
		background: none;
		border: none;
		font-size: 16px;
		cursor: pointer;
		padding: 5px;
		border-radius: 4px;
	}

	.btn-edit:hover:not(:disabled) {
		background: #e9ecef;
	}

	.btn-delete:hover:not(:disabled) {
		background: #f8d7da;
	}

	.btn-edit:disabled,
	.btn-delete:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.card-content {
		padding: 15px;
	}

	.card-content p {
		margin: 8px 0;
		font-size: 14px;
	}

	.card-content strong {
		color: #495057;
	}
</style>
