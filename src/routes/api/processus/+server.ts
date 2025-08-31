import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbProcessus } from '$lib/database.js';

// GET /api/processus - Lister tous les processus
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT * FROM processus ORDER BY nom');
		const processus = result.rows as unknown as DbProcessus[];

		// Parser les champs JSON
		const processusParsed = processus.map((proc) => ({
			...proc,
			sous_processus: JSON.parse(proc.sous_processus || '[]')
		}));

		return json({ success: true, data: processusParsed });
	} catch (error) {
		console.error('Erreur lors de la récupération des processus:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/processus - Créer un nouveau processus
export async function POST({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		// Générer un ID unique si non fourni
		const id = data.id || crypto.randomUUID();

		await db.execute({
			sql: `INSERT INTO processus (id, nom, sous_processus) VALUES (?, ?, ?)`,
			args: [id, data.nom, JSON.stringify(data.sous_processus || [])]
		});

		return json({ success: true, data: { id, ...data } });
	} catch (error) {
		console.error('Erreur lors de la création du processus:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
