import { json } from '@sveltejs/kit';
import { getStatistiques } from '$lib/tursoService.js';

export async function GET() {
	try {
		const stats = await getStatistiques();
		return json({
			success: true,
			stats
		});
	} catch (error) {
		console.error('Erreur lors de la récupération des statistiques:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Erreur inconnue'
			},
			{ status: 500 }
		);
	}
}
