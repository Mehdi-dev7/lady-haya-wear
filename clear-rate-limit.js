/**
 * Script pour nettoyer le rate limiting dans Redis
 */

import { redis } from './src/lib/redis.ts';

async function clearRateLimit() {
	console.log('🧹 Nettoyage du rate limiting...\n');

	try {
		// Supprimer toutes les clés de rate limiting
		const keys = await redis.keys('rate_limit:*');

		if (keys.length === 0) {
			console.log('✅ Aucune clé de rate limiting à nettoyer.');
			return;
		}

		console.log(`📝 Trouvé ${keys.length} clé(s) de rate limiting:`);
		keys.forEach(key => console.log(`   - ${key}`));

		console.log('\n🗑️  Suppression...');

		for (const key of keys) {
			await redis.del(key);
		}

		console.log(`\n✅ ${keys.length} clé(s) supprimée(s) avec succès !`);
		console.log('✨ Vous pouvez relancer les tests maintenant.\n');

	} catch (error) {
		console.error('❌ Erreur lors du nettoyage:', error);
	}

	process.exit(0);
}

clearRateLimit();
