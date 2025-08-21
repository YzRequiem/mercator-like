import { testConnection, initializeDatabase } from '$lib/migrate.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		// Tester la connexion
		console.log('Test de connexion à Turso...');
		await testConnection();

		// Initialiser les tables
		console.log('Initialisation de la base de données...');
		await initializeDatabase();

		return json({
			success: true,
			message: 'Base de données initialisée avec succès !'
		});
	} catch (error) {
		console.error('Erreur:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Erreur inconnue'
			},
			{ status: 500 }
		);
	}
}
