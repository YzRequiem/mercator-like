import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbDonnee } from '$lib/database.js';

// GET /api/donnees/[id] - Récupérer une donnée par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM donnees WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Donnée non trouvée' }, { status: 404 });
		}

		const donnee = result.rows[0] as unknown as DbDonnee;
		return json({ success: true, data: donnee });
	} catch (error) {
		console.error('Erreur lors de la récupération de la donnée:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/donnees/[id] - Mettre à jour une donnée
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE donnees SET 
                  nom = ?, source = ?, qualite = ?, volume = ?, frequence_maj = ?, 
                  proprietaire = ?, sensibilite = ?, retention = ?, format = ?, 
                  taille_estimee = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?`,
			args: [
				data.nom,
				data.source || null,
				data.qualite || null,
				data.volume || null,
				data.frequence_maj || null,
				data.proprietaire || null,
				data.sensibilite || null,
				data.retention || null,
				data.format || null,
				data.taille_estimee || null,
				params.id
			]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Donnée non trouvée' }, { status: 404 });
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de la donnée:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/donnees/[id] - Supprimer une donnée
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM donnees WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Donnée non trouvée' }, { status: 404 });
		}

		return json({ success: true, message: 'Donnée supprimée avec succès' });
	} catch (error) {
		console.error('Erreur lors de la suppression de la donnée:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
