import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbActeur } from '$lib/database.js';

// GET /api/acteurs - Lister tous les acteurs
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT * FROM acteurs ORDER BY nom');
		const acteurs = result.rows as unknown as DbActeur[];

		return json({ success: true, data: acteurs });
	} catch (error) {
		console.error('Erreur lors de la récupération des acteurs:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/acteurs - Créer un nouvel acteur
export async function POST({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		await db.execute({
			sql: `INSERT INTO acteurs (id, nom, site, role) VALUES (?, ?, ?, ?)`,
			args: [data.id, data.nom, data.site || null, data.role || null]
		});

		return json({ success: true, data: { id: data.id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la création de l'acteur:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
