import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbApplication } from '$lib/database.js';

// GET /api/applications/[id] - Récupérer une application par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM applications WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Application non trouvée' }, { status: 404 });
		}

		const application = result.rows[0] as unknown as DbApplication;

		// Parser les champs JSON
		const applicationParsed = {
			...application,
			sites: JSON.parse(application.sites || '[]'),
			risques: JSON.parse(application.risques || '[]'),
			fonctionnalites: JSON.parse(application.fonctionnalites || '[]')
		};

		return json({ success: true, data: applicationParsed });
	} catch (error) {
		console.error("Erreur lors de la récupération de l'application:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/applications/[id] - Mettre à jour une application
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE applications SET 
                  nom = ?, type = ?, domaine = ?, criticite = ?, statut = ?, users = ?, 
                  sites = ?, conformite = ?, version = ?, editeur = ?, cout_annuel = ?, 
                  date_mise_en_service = ?, risques = ?, fonctionnalites = ?, 
                  updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?`,
			args: [
				data.nom,
				data.type || null,
				data.domaine || null,
				data.criticite || null,
				data.statut || null,
				data.users || null,
				JSON.stringify(data.sites || []),
				data.conformite || null,
				data.version || null,
				data.editeur || null,
				data.cout_annuel || null,
				data.date_mise_en_service || null,
				JSON.stringify(data.risques || []),
				JSON.stringify(data.fonctionnalites || []),
				params.id
			]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Application non trouvée' }, { status: 404 });
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'application:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/applications/[id] - Supprimer une application
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM applications WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json({ success: false, error: 'Application non trouvée' }, { status: 404 });
		}

		return json({ success: true, message: 'Application supprimée avec succès' });
	} catch (error) {
		console.error("Erreur lors de la suppression de l'application:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
