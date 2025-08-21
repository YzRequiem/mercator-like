import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbInfrastructure } from '$lib/database.js';

// GET /api/infrastructure - Lister toute l'infrastructure
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT * FROM infrastructure ORDER BY nom');
		const infrastructure = result.rows as unknown as DbInfrastructure[];

		// Parser les champs JSON
		const infrastructureParsed = infrastructure.map((infra) => ({
			...infra,
			risques: JSON.parse(infra.risques || '[]')
		}));

		return json({ success: true, data: infrastructureParsed });
	} catch (error) {
		console.error("Erreur lors de la récupération de l'infrastructure:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/infrastructure - Créer un nouvel élément d'infrastructure
export async function POST({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		await db.execute({
			sql: `INSERT INTO infrastructure 
                  (id, nom, type, localisation, statut, capacite, utilisation, redondance, 
                   modele, date_installation, garantie, cout_acquisition, maintenance, 
                   bande_passante, disponibilite, fournisseur, cout_mensuel, sla, 
                   nombre, os, age_moyen, cout_total, risques) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [
				data.id,
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
				JSON.stringify(data.risques || [])
			]
		});

		return json({ success: true, data: { id: data.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la création de l'élément d'infrastructure:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
