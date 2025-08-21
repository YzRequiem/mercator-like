import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbProcessus } from '$lib/database.js';

// GET /api/processus/[id] - Récupérer un processus par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM processus WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Processus non trouvé' }, { status: 404 });
		}

		const processus = result.rows[0] as unknown as DbProcessus;

		// Parser les champs JSON
		const processusParsed = {
			...processus,
			sous_processus: JSON.parse(processus.sous_processus || '[]')
		};

		return json({ success: true, data: processusParsed });
	} catch (error) {
		console.error('Erreur lors de la récupération du processus:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/processus/[id] - Mettre à jour un processus
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE processus SET nom = ?, sous_processus = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
			args: [data.nom, JSON.stringify(data.sous_processus || []), params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Processus non trouvé' }, { status: 404 });
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error('Erreur lors de la mise à jour du processus:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/processus/[id] - Supprimer un processus
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM processus WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Processus non trouvé' }, { status: 404 });
		}

		return json({ success: true, message: 'Processus supprimé avec succès' });
	} catch (error) {
		console.error('Erreur lors de la suppression du processus:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
