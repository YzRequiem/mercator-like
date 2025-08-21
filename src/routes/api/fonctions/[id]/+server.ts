import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbFonction } from '$lib/database.js';

// GET /api/fonctions/[id] - Récupérer une fonction par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM fonctions WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Fonction non trouvée' }, { status: 404 });
		}

		const fonction = result.rows[0] as unknown as DbFonction;

		// Parser les champs JSON
		const fonctionParsed = {
			...fonction,
			flux: JSON.parse(fonction.flux || '[]'),
			donnees: JSON.parse(fonction.donnees || '[]'),
			utilisateurs: JSON.parse(fonction.utilisateurs || '[]'),
			sites: JSON.parse(fonction.sites || '[]')
		};

		return json({ success: true, data: fonctionParsed });
	} catch (error) {
		console.error('Erreur lors de la récupération de la fonction:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/fonctions/[id] - Mettre à jour une fonction
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE fonctions SET 
                  nom = ?, description = ?, flux = ?, donnees = ?, statut = ?, 
                  niveau_automatisation = ?, frequence_utilisation = ?, utilisateurs = ?, 
                  sites = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?`,
			args: [
				data.nom,
				data.description || null,
				JSON.stringify(data.flux || []),
				JSON.stringify(data.donnees || []),
				data.statut || null,
				data.niveau_automatisation || null,
				data.frequence_utilisation || null,
				JSON.stringify(data.utilisateurs || []),
				JSON.stringify(data.sites || []),
				params.id
			]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Fonction non trouvée' }, { status: 404 });
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de la fonction:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/fonctions/[id] - Supprimer une fonction
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM fonctions WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Fonction non trouvée' }, { status: 404 });
		}

		return json({ success: true, message: 'Fonction supprimée avec succès' });
	} catch (error) {
		console.error('Erreur lors de la suppression de la fonction:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
