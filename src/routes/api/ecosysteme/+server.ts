import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbEcosysteme } from '$lib/database.js';

// GET /api/ecosysteme - Lister tous les éléments de l'écosystème
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT * FROM ecosysteme ORDER BY nom');
		const ecosysteme = result.rows as unknown as DbEcosysteme[];

		return json({ success: true, data: ecosysteme });
	} catch (error) {
		console.error("Erreur lors de la récupération de l'écosystème:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/ecosysteme - Créer un nouvel élément d'écosystème
export async function POST({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		await db.execute({
			sql: `INSERT INTO ecosysteme (id, nom, type, relation) VALUES (?, ?, ?, ?)`,
			args: [data.id, data.nom, data.type || null, data.relation || null]
		});

		return json({ success: true, data: { id: data.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la création de l'élément d'écosystème:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
