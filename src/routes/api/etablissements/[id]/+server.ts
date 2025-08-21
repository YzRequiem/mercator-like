import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbEtablissement } from '$lib/database.js';

// GET /api/etablissements/[id] - Récupérer un établissement par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM etablissements WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Établissement non trouvé' }, { status: 404 });
		}

		const etablissement = result.rows[0] as unknown as DbEtablissement;

		// Parser les champs JSON
		const etablissementParsed = {
			...etablissement,
			activites: JSON.parse(etablissement.activites || '[]'),
			equipements: JSON.parse(etablissement.equipements || '[]'),
			risques: JSON.parse(etablissement.risques || '[]')
		};

		return json({ success: true, data: etablissementParsed });
	} catch (error) {
		console.error("Erreur lors de la récupération de l'établissement:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/etablissements/[id] - Mettre à jour un établissement
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE etablissements SET 
                  nom = ?, code = ?, adresse = ?, statut = ?, surface = ?, 
                  collaborateurs = ?, activites = ?, equipements = ?, risques = ?, 
                  statut_operationnel = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?`,
			args: [
				data.nom,
				data.code,
				data.adresse || null,
				data.statut || null,
				data.surface || null,
				data.collaborateurs || null,
				JSON.stringify(data.activites || []),
				JSON.stringify(data.equipements || []),
				JSON.stringify(data.risques || []),
				data.statut_operationnel || null,
				params.id
			]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Établissement non trouvé' }, { status: 404 });
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'établissement:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/etablissements/[id] - Supprimer un établissement
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM etablissements WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Établissement non trouvé' }, { status: 404 });
		}

		return json({ success: true, message: 'Établissement supprimé avec succès' });
	} catch (error) {
		console.error("Erreur lors de la suppression de l'établissement:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
