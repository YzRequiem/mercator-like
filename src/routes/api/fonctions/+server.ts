import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbFonction } from '$lib/database.js';

// GET /api/fonctions - Lister toutes les fonctions
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT * FROM fonctions ORDER BY nom');
		const fonctions = result.rows as unknown as DbFonction[];

		// Parser les champs JSON
		const fonctionsParsed = fonctions.map((func) => ({
			...func,
			flux: JSON.parse(func.flux || '[]'),
			donnees: JSON.parse(func.donnees || '[]'),
			utilisateurs: JSON.parse(func.utilisateurs || '[]'),
			sites: JSON.parse(func.sites || '[]')
		}));

		return json({ success: true, data: fonctionsParsed });
	} catch (error) {
		console.error('Erreur lors de la récupération des fonctions:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/fonctions - Créer une nouvelle fonction
export async function POST({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		await db.execute({
			sql: `INSERT INTO fonctions 
                  (id, nom, description, flux, donnees, statut, niveau_automatisation, 
                   frequence_utilisation, utilisateurs, sites) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [
				data.id,
				data.nom,
				data.description || null,
				JSON.stringify(data.flux || []),
				JSON.stringify(data.donnees || []),
				data.statut || null,
				data.niveau_automatisation || null,
				data.frequence_utilisation || null,
				JSON.stringify(data.utilisateurs || []),
				JSON.stringify(data.sites || [])
			]
		});

		return json({ success: true, data: { id: data.id, ...data } });
	} catch (error) {
		console.error('Erreur lors de la création de la fonction:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
