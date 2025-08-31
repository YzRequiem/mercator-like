import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbDonnee } from '$lib/database.js';

// GET /api/donnees - Lister toutes les données
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT * FROM donnees ORDER BY nom');
		const donnees = result.rows as unknown as DbDonnee[];

		return json({ success: true, data: donnees });
	} catch (error) {
		console.error('Erreur lors de la récupération des données:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/donnees - Créer une nouvelle donnée
export async function POST({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		// Générer un ID unique si non fourni
		const id =
			data.id ||
			data.nom
				?.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^a-z0-9]/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-|-$/g, '') ||
			crypto.randomUUID();

		await db.execute({
			sql: `INSERT INTO donnees 
                  (id, nom, source, qualite, volume, frequence_maj, proprietaire, 
                   sensibilite, retention, format, taille_estimee) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [
				id,
				data.nom,
				data.source || null,
				data.qualite || null,
				data.volume || null,
				data.frequence_maj || null,
				data.proprietaire || null,
				data.sensibilite || null,
				data.retention || null,
				data.format || null,
				data.taille_estimee || null
			]
		});

		return json({ success: true, data: { id, ...data } });
	} catch (error) {
		console.error('Erreur lors de la création de la donnée:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
