import { getDb } from '$lib/database.js';
import { json } from '@sveltejs/kit';
import { dataService } from '$lib/dataService.js';

export async function POST() {
	try {
		const db = getDb();
		console.log('Début de la migration des données...');

		// Récupérer toutes les données depuis le service existant
		const metierData = dataService.getMetierData();
		const fonctionnelData = dataService.getFonctionnelData();
		const applicatifData = dataService.getApplicatifData();
		const techniqueData = dataService.getTechniqueData();

		// Migration des établissements
		for (const etab of metierData.etablissements) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO etablissements 
                      (id, nom, code, adresse, statut, surface, collaborateurs, 
                       activites, equipements, risques, statut_operationnel) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				args: [
					etab.id,
					etab.nom,
					etab.code,
					etab.adresse || null,
					etab.statut || null,
					etab.surface || null,
					etab.collaborateurs || null,
					JSON.stringify(etab.activites || []),
					JSON.stringify(etab.equipements || []),
					JSON.stringify(etab.risques || []),
					etab.statut_operationnel || null
				]
			});
		}
		console.log(`✓ ${metierData.etablissements.length} établissements migrés`);

		// Migration des processus
		for (const proc of metierData.processus) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO processus (id, nom, sous_processus) VALUES (?, ?, ?)`,
				args: [proc.id, proc.nom, JSON.stringify(proc.sousProcessus || [])]
			});
		}
		console.log(`✓ ${metierData.processus.length} processus migrés`);

		// Migration des acteurs
		for (const acteur of metierData.acteurs) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO acteurs (id, nom, site, role) VALUES (?, ?, ?, ?)`,
				args: [acteur.id, acteur.nom, acteur.site || null, acteur.role || null]
			});
		}
		console.log(`✓ ${metierData.acteurs.length} acteurs migrés`);

		// Migration de l'écosystème
		for (const eco of metierData.ecosysteme) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO ecosysteme (id, nom, type, relation) VALUES (?, ?, ?, ?)`,
				args: [eco.id, eco.nom, eco.type || null, eco.relation || null]
			});
		}
		console.log(`✓ ${metierData.ecosysteme.length} éléments d'écosystème migrés`);

		// Migration des fonctions
		for (const func of fonctionnelData.fonctions) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO fonctions 
                      (id, nom, description, flux, donnees, statut, niveau_automatisation, 
                       frequence_utilisation, utilisateurs, sites) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				args: [
					func.id,
					func.nom,
					func.description || null,
					JSON.stringify(func.flux || []),
					JSON.stringify(func.donnees || []),
					func.statut || null,
					func.niveau_automatisation || null,
					func.frequence_utilisation || null,
					JSON.stringify(func.utilisateurs || []),
					JSON.stringify(func.sites || [])
				]
			});
		}
		console.log(`✓ ${fonctionnelData.fonctions.length} fonctions migrées`);

		// Migration des applications
		for (const app of applicatifData.applications) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO applications 
                      (id, nom, type, domaine, criticite, statut, users, sites, conformite, 
                       version, editeur, cout_annuel, date_mise_en_service, risques, fonctionnalites) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				args: [
					app.id,
					app.nom,
					app.type || null,
					app.domaine || null,
					app.criticite || null,
					app.statut || null,
					app.users || null,
					JSON.stringify(app.sites || []),
					app.conformite || null,
					app.version || null,
					app.editeur || null,
					app.cout_annuel || null,
					app.date_mise_en_service || null,
					JSON.stringify(app.risques || []),
					JSON.stringify(app.fonctionnalites || [])
				]
			});
		}
		console.log(`✓ ${applicatifData.applications.length} applications migrées`);

		// Migration des données
		for (const data of applicatifData.donnees) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO donnees 
                      (id, nom, source, qualite, volume, frequence_maj, proprietaire, 
                       sensibilite, retention, format, taille_estimee) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				args: [
					data.id,
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
		}
		console.log(`✓ ${applicatifData.donnees.length} données migrées`);

		// Migration de l'infrastructure
		for (const infra of techniqueData.infrastructure) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO infrastructure 
                      (id, nom, type, localisation, statut, capacite, utilisation, redondance, 
                       modele, date_installation, garantie, cout_acquisition, maintenance, 
                       bande_passante, disponibilite, fournisseur, cout_mensuel, sla, 
                       nombre, os, age_moyen, cout_total, risques) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				args: [
					infra.id,
					infra.nom,
					infra.type || null,
					infra.localisation || null,
					infra.statut || null,
					infra.capacite || null,
					infra.utilisation || null,
					infra.redondance || null,
					infra.modele || null,
					infra.date_installation || null,
					infra.garantie || null,
					infra.cout_acquisition || null,
					infra.maintenance || null,
					infra.bande_passante || null,
					infra.disponibilite || null,
					infra.fournisseur || null,
					infra.cout_mensuel || null,
					infra.sla || null,
					infra.nombre || null,
					infra.os || null,
					infra.age_moyen || null,
					infra.cout_total || null,
					JSON.stringify(infra.risques || [])
				]
			});
		}
		console.log(`✓ ${techniqueData.infrastructure.length} éléments d'infrastructure migrés`);

		// Migration des incidents
		for (const incident of techniqueData.incidents) {
			await db.execute({
				sql: `INSERT OR REPLACE INTO incidents 
                      (id, nom, impact, date, statut, description, duree, cout_estime, 
                       cause, mesures_correctives) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				args: [
					incident.id,
					incident.nom,
					incident.impact || null,
					incident.date || null,
					incident.statut || null,
					incident.description || null,
					incident.duree || null,
					incident.cout_estime || null,
					incident.cause || null,
					JSON.stringify(incident.mesures_correctives || [])
				]
			});
		}
		console.log(`✓ ${techniqueData.incidents.length} incidents migrés`);

		// Migration de la sécurité
		const securite = techniqueData.securite;
		await db.execute({
			sql: `INSERT OR REPLACE INTO securite 
                  (id, niveau, score_global, derniere_evaluation, mesures, manques, 
                   incidents_total, incidents_critiques, incidents_majeurs) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [
				'global',
				securite.niveau || null,
				securite.score_global || null,
				securite.derniere_evaluation || null,
				JSON.stringify(securite.mesures || []),
				JSON.stringify(securite.manques || []),
				securite.incidents_total || 0,
				securite.incidents_critiques || 0,
				securite.incidents_majeurs || 0
			]
		});
		console.log('✓ Données de sécurité migrées');

		return json({
			success: true,
			message: 'Migration des données terminée avec succès !',
			stats: {
				etablissements: metierData.etablissements.length,
				processus: metierData.processus.length,
				acteurs: metierData.acteurs.length,
				ecosysteme: metierData.ecosysteme.length,
				fonctions: fonctionnelData.fonctions.length,
				applications: applicatifData.applications.length,
				donnees: applicatifData.donnees.length,
				infrastructure: techniqueData.infrastructure.length,
				incidents: techniqueData.incidents.length,
				securite: 1
			}
		});
	} catch (error) {
		console.error('Erreur lors de la migration:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Erreur inconnue'
			},
			{ status: 500 }
		);
	}
}
