import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbIncident } from '$lib/database.js';

// GET /api/incidents - Lister tous les incidents
export async function GET({ url }) {
	try {
		const db = getDb();
		const impact = url.searchParams.get('impact');
		const statut = url.searchParams.get('statut');

		let sql = 'SELECT * FROM incidents';
		const args: string[] = [];
		const conditions: string[] = [];

		if (impact) {
			conditions.push('impact = ?');
			args.push(impact);
		}

		if (statut) {
			conditions.push('statut = ?');
			args.push(statut);
		}

		if (conditions.length > 0) {
			sql += ' WHERE ' + conditions.join(' AND ');
		}

		sql += ' ORDER BY date DESC';

		const result = await db.execute({ sql, args });
		const incidents = result.rows as unknown as DbIncident[];

		// Parser les champs JSON
		const incidentsParsed = incidents.map((incident) => ({
			...incident,
			mesures_correctives: JSON.parse(incident.mesures_correctives || '[]')
		}));

		return json({ success: true, data: incidentsParsed });
	} catch (error) {
		console.error('Erreur lors de la récupération des incidents:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/incidents - Créer un nouvel incident
export async function POST({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		await db.execute({
			sql: `INSERT INTO incidents 
                  (id, nom, impact, date, statut, description, duree, cout_estime, 
                   cause, mesures_correctives) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [
				data.id,
				data.nom,
				data.impact || null,
				data.date || null,
				data.statut || null,
				data.description || null,
				data.duree || null,
				data.cout_estime || null,
				data.cause || null,
				JSON.stringify(data.mesures_correctives || [])
			]
		});

		return json({ success: true, data: { id: data.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la création de l'incident:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
