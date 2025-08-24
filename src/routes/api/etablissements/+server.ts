import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbEtablissement } from '$lib/database.js';

// GET /api/etablissements - Lister tous les établissements
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT * FROM etablissements ORDER BY nom');
		const etablissements = result.rows as unknown as DbEtablissement[];

		// Parser les champs JSON
		const etablissementsParsed = etablissements.map((etab) => ({
			...etab,
			activites: JSON.parse(etab.activites || '[]'),
			equipements: JSON.parse(etab.equipements || '[]'),
			risques: JSON.parse(etab.risques || '[]')
		}));

		return json({ success: true, data: etablissementsParsed });
	} catch (error) {
		console.error('Erreur lors de la récupération des établissements:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/etablissements - Créer un nouvel établissement
export async function POST({ request }) {
	try {
		const data = await request.json();
		const db = getDb();

		// Générer un ID unique si non fourni
		const id = data.id || crypto.randomUUID();

		const result = await db.execute({
			sql: `INSERT INTO etablissements 
                  (id, nom, code, adresse, statut, surface, collaborateurs, 
                   activites, equipements, risques, statut_operationnel) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [
				id,
				data.nom,
				data.code,
				data.adresse || null,
				data.statut || null,
				data.surface || null,
				data.collaborateurs || null,
				JSON.stringify(data.activites || []),
				JSON.stringify(data.equipements || []),
				JSON.stringify(data.risques || []),
				data.statut_operationnel || null
			]
		});

		return json({ success: true, data: { id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la création de l'établissement:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
