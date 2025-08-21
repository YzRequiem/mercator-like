import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbSecurite } from '$lib/database.js';

// GET /api/securite - Récupérer les données de sécurité globales
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT * FROM securite WHERE id = ?',
			args: ['global']
		});

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Données de sécurité non trouvées' }, { status: 404 });
		}

		const securite = result.rows[0] as unknown as DbSecurite;

		// Parser les champs JSON
		const securiteParsed = {
			...securite,
			mesures: JSON.parse(securite.mesures || '[]'),
			manques: JSON.parse(securite.manques || '[]')
		};

		return json({ success: true, data: securiteParsed });
	} catch (error) {
		console.error('Erreur lors de la récupération des données de sécurité:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// PUT /api/securite - Mettre à jour les données de sécurité globales
export async function PUT({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		const result = await db.execute({
			sql: `INSERT OR REPLACE INTO securite 
                  (id, niveau, score_global, derniere_evaluation, mesures, manques, 
                   incidents_total, incidents_critiques, incidents_majeurs, updated_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
			args: [
				'global',
				data.niveau || null,
				data.score_global || null,
				data.derniere_evaluation || null,
				JSON.stringify(data.mesures || []),
				JSON.stringify(data.manques || []),
				data.incidents_total || 0,
				data.incidents_critiques || 0,
				data.incidents_majeurs || 0
			]
		});

		return json({ success: true, data: { id: 'global', ...data } });
	} catch (error) {
		console.error('Erreur lors de la mise à jour des données de sécurité:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
