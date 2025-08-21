import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbIncident } from '$lib/database.js';

// GET /api/incidents/[id] - Récupérer un incident par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM incidents WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Incident non trouvé' }, { status: 404 });
		}

		const incident = result.rows[0] as unknown as DbIncident;

		// Parser les champs JSON
		const incidentParsed = {
			...incident,
			mesures_correctives: JSON.parse(incident.mesures_correctives || '[]')
		};

		return json({ success: true, data: incidentParsed });
	} catch (error) {
		console.error("Erreur lors de la récupération de l'incident:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/incidents/[id] - Mettre à jour un incident
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE incidents SET 
                  nom = ?, impact = ?, date = ?, statut = ?, description = ?, duree = ?, 
                  cout_estime = ?, cause = ?, mesures_correctives = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?`,
			args: [
				data.nom,
				data.impact || null,
				data.date || null,
				data.statut || null,
				data.description || null,
				data.duree || null,
				data.cout_estime || null,
				data.cause || null,
				JSON.stringify(data.mesures_correctives || []),
				params.id
			]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Incident non trouvé' }, { status: 404 });
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'incident:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/incidents/[id] - Supprimer un incident
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM incidents WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Incident non trouvé' }, { status: 404 });
		}

		return json({ success: true, message: 'Incident supprimé avec succès' });
	} catch (error) {
		console.error("Erreur lors de la suppression de l'incident:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
