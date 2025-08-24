import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbEcosysteme } from '$lib/database.js';

// GET /api/ecosysteme/[id] - Récupérer un élément d'écosystème par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM ecosysteme WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: "Élément d'écosystème non trouvé" }, { status: 404 });
		}

		const ecosysteme = result.rows[0] as unknown as DbEcosysteme;
		return json({ success: true, data: ecosysteme });
	} catch (error) {
		console.error("Erreur lors de la récupération de l'élément d'écosystème:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/ecosysteme/[id] - Mettre à jour un élément d'écosystème
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE ecosysteme SET nom = ?, type = ?, relation = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
			args: [data.nom, data.type || null, data.relation || null, params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: "Élément d'écosystème non trouvé" }, { status: 404 });
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'élément d'écosystème:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/ecosysteme/[id] - Supprimer un élément d'écosystème
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM ecosysteme WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: "Élément d'écosystème non trouvé" }, { status: 404 });
		}

		return json({ success: true, message: "Élément d'écosystème supprimé avec succès" });
	} catch (error) {
		console.error("Erreur lors de la suppression de l'élément d'écosystème:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
