import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbActeur } from '$lib/database.js';

// GET /api/acteurs/[id] - Récupérer un acteur par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM acteurs WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Acteur non trouvé' }, { status: 404 });
		}

		const acteur = result.rows[0] as unknown as DbActeur;
		return json({ success: true, data: acteur });
	} catch (error) {
		console.error("Erreur lors de la récupération de l'acteur:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/acteurs/[id] - Mettre à jour un acteur
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE acteurs SET nom = ?, site = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
			args: [data.nom, data.site || null, data.role || null, params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Acteur non trouvé' }, { status: 404 });
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'acteur:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/acteurs/[id] - Supprimer un acteur
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM acteurs WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Acteur non trouvé' }, { status: 404 });
		}

		return json({ success: true, message: 'Acteur supprimé avec succès' });
	} catch (error) {
		console.error("Erreur lors de la suppression de l'acteur:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
