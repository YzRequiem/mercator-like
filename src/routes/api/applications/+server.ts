import { json } from '@sveltejs/kit';
import { getDb } from '$lib/database.js';
import type { DbApplication } from '$lib/database.js';

// GET /api/applications - Lister toutes les applications
export async function GET() {
	try {
		const db = getDb();
		const result = await db.execute('SELECT * FROM applications ORDER BY nom');
		const applications = result.rows as unknown as DbApplication[];

		// Parser les champs JSON
		const applicationsParsed = applications.map((app) => ({
			...app,
			sites: JSON.parse(app.sites || '[]'),
			risques: JSON.parse(app.risques || '[]'),
			fonctionnalites: JSON.parse(app.fonctionnalites || '[]')
		}));

		return json({ success: true, data: applicationsParsed });
	} catch (error) {
		console.error('Erreur lors de la récupération des applications:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}

// POST /api/applications - Créer une nouvelle application
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
			sql: `INSERT INTO applications 
                  (id, nom, type, domaine, criticite, statut, users, sites, conformite, 
                   version, editeur, cout_annuel, date_mise_en_service, risques, fonctionnalites) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [
				id,
				data.nom,
				data.type || null,
				data.domaine || null,
				data.criticite || null,
				data.statut || null,
				data.users || null,
				JSON.stringify(data.sites || []),
				data.conformite || null,
				data.version || null,
				data.editeur || null,
				data.cout_annuel || null,
				data.date_mise_en_service || null,
				JSON.stringify(data.risques || []),
				JSON.stringify(data.fonctionnalites || [])
			]
		});

		return json({ success: true, data: { id, ...data } });
	} catch (error) {
		console.error("Erreur lors de la création de l'application:", error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
			{ status: 500 }
		);
	}
}
