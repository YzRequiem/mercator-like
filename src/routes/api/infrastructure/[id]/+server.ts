import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbInfrastructure } from '$lib/database.js';

// GET /api/infrastructure/[id] - Récupérer un élément d'infrastructure par ID
export async function GET({ params }) {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM infrastructure WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length === 0) {
			return json(
				{ success: false, error: "Élément d'infrastructure non trouvé" },
				{ status: 404 }
			);
		}

		const infrastructure = result.rows[0] as unknown as DbInfrastructure;

		// Parser les champs JSON
		const infrastructureParsed = {
			...infrastructure,
			risques: JSON.parse(infrastructure.risques || '[]')
		};

		return json({ success: true, data: infrastructureParsed });
	} catch (error) {
		console.error("Erreur lors de la récupération de l'élément d'infrastructure:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/infrastructure/[id] - Mettre à jour un élément d'infrastructure
export async function PUT({ params, request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `UPDATE infrastructure SET 
                  nom = ?, type = ?, localisation = ?, statut = ?, capacite = ?, utilisation = ?, 
                  redondance = ?, modele = ?, date_installation = ?, garantie = ?, cout_acquisition = ?, 
                  maintenance = ?, bande_passante = ?, disponibilite = ?, fournisseur = ?, 
                  cout_mensuel = ?, sla = ?, nombre = ?, os = ?, age_moyen = ?, cout_total = ?, 
                  risques = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?`,
			args: [
				data.nom,
				data.type || null,
				data.localisation || null,
				data.statut || null,
				data.capacite || null,
				data.utilisation || null,
				data.redondance || null,
				data.modele || null,
				data.date_installation || null,
				data.garantie || null,
				data.cout_acquisition || null,
				data.maintenance || null,
				data.bande_passante || null,
				data.disponibilite || null,
				data.fournisseur || null,
				data.cout_mensuel || null,
				data.sla || null,
				data.nombre || null,
				data.os || null,
				data.age_moyen || null,
				data.cout_total || null,
				JSON.stringify(data.risques || []),
				params.id
			]
		});

		if (result.rowsAffected === 0) {
			return json(
				{ success: false, error: "Élément d'infrastructure non trouvé" },
				{ status: 404 }
			);
		}

		return json({ success: true, data: { id: params.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'élément d'infrastructure:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// DELETE /api/infrastructure/[id] - Supprimer un élément d'infrastructure
export async function DELETE({ params }) {
	try {
		const db = getDb();

		const result = await db.execute({
			sql: 'DELETE FROM infrastructure WHERE id = ?',
			args: [params.id]
		});

		if (result.rowsAffected === 0) {
			return json(
				{ success: false, error: "Élément d'infrastructure non trouvé" },
				{ status: 404 }
			);
		}

		return json({ success: true, message: "Élément d'infrastructure supprimé avec succès" });
	} catch (error) {
		console.error("Erreur lors de la suppression de l'élément d'infrastructure:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
