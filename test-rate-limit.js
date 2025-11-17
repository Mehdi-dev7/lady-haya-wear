/**
 * Script de test du rate limiting avec Redis
 *
 * Ce script teste que le rate limiting fonctionne correctement
 * en envoyant plusieurs requêtes à l'API de login
 */

const API_URL = 'http://localhost:3000/api/auth/login';
const TEST_EMAIL = 'test-rate-limit@example.com';
const TEST_PASSWORD = 'WrongPassword123!';

async function testRateLimit() {
	console.log('🧪 TEST DU RATE LIMITING\n');
	console.log('📝 Configuration:');
	console.log('   - Limite: 5 tentatives');
	console.log('   - Fenêtre: 15 minutes (900 secondes)');
	console.log('   - Endpoint: POST /api/auth/login\n');

	console.log('🚀 Envoi de 8 requêtes consécutives...\n');

	const results = [];

	for (let i = 1; i <= 8; i++) {
		try {
			const response = await fetch(API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: TEST_EMAIL,
					password: TEST_PASSWORD,
				}),
			});

			const data = await response.json();
			const status = response.status;

			results.push({ attempt: i, status, data });

			// Affichage du résultat
			if (status === 429) {
				console.log(`❌ Requête ${i}: BLOQUÉE (429 Too Many Requests)`);
				console.log(`   → Message: ${data.error}`);
				if (data.retryAfter) {
					console.log(`   → Réessayer dans: ${data.retryAfter}s`);
				}
			} else if (status === 401) {
				console.log(`✅ Requête ${i}: AUTORISÉE (${status}) - Rate limit non atteint`);
				console.log(`   → Message: ${data.error}`);
			} else {
				console.log(`⚠️  Requête ${i}: Status ${status}`);
				console.log(`   → Réponse: ${JSON.stringify(data)}`);
			}
		} catch (error) {
			console.log(`💥 Requête ${i}: ERREUR`);
			console.log(`   → ${error.message}`);
		}

		// Petit délai pour éviter de surcharger
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	// Résumé
	console.log('\n📊 RÉSUMÉ DES TESTS\n');
	const authorized = results.filter(r => r.status !== 429).length;
	const blocked = results.filter(r => r.status === 429).length;

	console.log(`✅ Requêtes autorisées: ${authorized}/8`);
	console.log(`❌ Requêtes bloquées: ${blocked}/8`);

	// Vérification du résultat attendu
	console.log('\n🎯 VERDICT:\n');
	if (authorized === 5 && blocked === 3) {
		console.log('✅ LE RATE LIMITING FONCTIONNE CORRECTEMENT !');
		console.log('   → Les 5 premières requêtes passent');
		console.log('   → Les 3 suivantes sont bloquées (429)');
	} else {
		console.log('⚠️  LE RATE LIMITING NE FONCTIONNE PAS COMME ATTENDU');
		console.log(`   → Attendu: 5 autorisées, 3 bloquées`);
		console.log(`   → Obtenu: ${authorized} autorisées, ${blocked} bloquées`);

		if (blocked === 0) {
			console.log('\n💡 Causes possibles:');
			console.log('   1. Redis non connecté (vérifier UPSTASH_REDIS_REST_URL et TOKEN)');
			console.log('   2. Les variables d\'environnement ne sont pas chargées');
			console.log('   3. Le code Redis a une erreur (vérifier les logs du serveur)');
		}
	}

	console.log('\n✨ Test terminé !\n');
}

// Lancer le test
testRateLimit().catch(error => {
	console.error('💥 Erreur fatale:', error);
	process.exit(1);
});
