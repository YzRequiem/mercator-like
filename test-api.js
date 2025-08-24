#!/usr/bin/env node

/**
 * Script de test automatisé pour l'API CRUD Mercator-like
 * Usage: node test-api.js [base-url]
 */

const baseUrl = process.argv[2] || 'http://localhost:5173';

const endpoints = [
	'etablissements',
	'processus',
	'acteurs',
	'applications',
	'infrastructure',
	'incidents',
	'fonctions',
	'donnees',
	'ecosysteme',
	'securite'
];

/**
 * Test un endpoint spécifique
 */
async function testEndpoint(endpoint) {
	console.log(`\n🔍 Test de l'endpoint: ${endpoint}`);

	try {
		// Test GET all
		const response = await fetch(`${baseUrl}/api/${endpoint}`);
		const data = await response.json();

		console.log(`  GET /${endpoint}: ${response.status} ${response.ok ? '✅' : '❌'}`);
		console.log(`  Success: ${data.success}`);
		console.log(`  Données: ${data.data ? data.data.length : 0} éléments`);

		if (data.error) {
			console.log(`  ❌ Erreur: ${data.error}`);
		}

		// Si on a des données, tester GET by ID
		if (data.success && data.data && data.data.length > 0) {
			const firstItem = data.data[0];
			const detailResponse = await fetch(`${baseUrl}/api/${endpoint}/${firstItem.id}`);
			const detailData = await detailResponse.json();

			console.log(
				`  GET /${endpoint}/${firstItem.id}: ${detailResponse.status} ${detailResponse.ok ? '✅' : '❌'}`
			);
			console.log(`  Élément trouvé: ${detailData.data ? '✅' : '❌'}`);

			if (detailData.error) {
				console.log(`  ❌ Erreur détail: ${detailData.error}`);
			}
		}

		return {
			endpoint,
			success: response.ok && data.success,
			status: response.status,
			count: data.data ? data.data.length : 0,
			error: data.error
		};
	} catch (error) {
		console.log(`  ❌ Erreur de connexion: ${error.message}`);
		return {
			endpoint,
			success: false,
			error: error.message
		};
	}
}

/**
 * Test la documentation API
 */
async function testApiDocumentation() {
	console.log(`\n📚 Test de la documentation API`);

	try {
		const response = await fetch(`${baseUrl}/api`);
		const data = await response.json();

		console.log(`  GET /api: ${response.status} ${response.ok ? '✅' : '❌'}`);
		console.log(`  Success: ${data.success}`);

		if (data.data && data.data.endpoints) {
			console.log(`  Endpoints documentés: ${data.data.endpoints.length}`);
		}

		if (data.error) {
			console.log(`  ❌ Erreur: ${data.error}`);
		}

		return {
			endpoint: 'documentation',
			success: response.ok && data.success,
			status: response.status,
			error: data.error
		};
	} catch (error) {
		console.log(`  ❌ Erreur de connexion: ${error.message}`);
		return {
			endpoint: 'documentation',
			success: false,
			error: error.message
		};
	}
}

/**
 * Fonction principale
 */
async function main() {
	console.log(`🚀 Test de l'API Mercator-like`);
	console.log(`📍 URL de base: ${baseUrl}`);
	console.log(`⏰ ${new Date().toLocaleString()}`);

	const results = [];

	// Test de la documentation
	const docResult = await testApiDocumentation();
	results.push(docResult);

	// Test de tous les endpoints
	for (const endpoint of endpoints) {
		const result = await testEndpoint(endpoint);
		results.push(result);

		// Petite pause entre les tests
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	// Résumé
	console.log(`\n📊 RÉSUMÉ DES TESTS`);
	console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

	const successes = results.filter((r) => r.success).length;
	const failures = results.filter((r) => !r.success).length;

	console.log(`✅ Succès: ${successes}`);
	console.log(`❌ Échecs: ${failures}`);
	console.log(`📈 Taux de réussite: ${Math.round((successes / results.length) * 100)}%`);

	if (failures > 0) {
		console.log(`\n❌ ÉCHECS DÉTAILLÉS:`);
		results
			.filter((r) => !r.success)
			.forEach((result) => {
				console.log(`  • ${result.endpoint}: ${result.error || 'Erreur inconnue'}`);
			});
	}

	// Total des données
	const totalData = results.reduce((sum, r) => sum + (r.count || 0), 0);
	console.log(`\n📦 Total des données disponibles: ${totalData} éléments`);

	console.log(`\n🏁 Tests terminés!`);

	// Code de sortie
	process.exit(failures > 0 ? 1 : 0);
}

// Exécution
main().catch((error) => {
	console.error(`💥 Erreur fatale:`, error);
	process.exit(1);
});
