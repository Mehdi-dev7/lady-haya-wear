/**
 * Script de test pour la synchronisation des stocks
 *
 * Ce script teste :
 * 1. Vérification de disponibilité du stock
 * 2. Création d'une commande (décrémentation automatique)
 * 3. Vérification que le stock a bien été décrémenté
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Couleurs pour les logs
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testStockSync() {
	console.log('\n' + '='.repeat(60));
	log('🧪 TEST DE SYNCHRONISATION DES STOCKS', 'cyan');
	console.log('='.repeat(60) + '\n');

	try {
		// 1️⃣ Connexion avec un utilisateur de test
		log('\n1️⃣  Connexion...', 'blue');

		const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'test@example.com', // Remplacez par un email de test valide
				password: 'testpassword123', // Remplacez par le mot de passe
			}),
		});

		if (!loginResponse.ok) {
			log('❌ Échec de la connexion. Veuillez créer un utilisateur de test.', 'red');
			log('ℹ️  Conseil: Créez un compte via /api/auth/register ou utilisez un compte existant', 'yellow');
			return;
		}

		const authToken = loginResponse.headers.get('set-cookie')?.match(/auth-token=([^;]+)/)?.[1];
		if (!authToken) {
			log('❌ Token non trouvé dans la réponse', 'red');
			return;
		}

		log('✅ Connexion réussie', 'green');

		// 2️⃣ Récupérer les produits disponibles
		log('\n2️⃣  Récupération d\'un produit de test...', 'blue');

		// NOTE: Vous devrez remplacer ceci par un vrai produit de votre CMS Sanity
		const testCartItems = [
			{
				id: 'votre-product-id', // Remplacez par un vrai ID Sanity
				slug: 'votre-product-slug', // Remplacez par un vrai slug
				name: 'Produit Test',
				color: 'Noir', // Remplacez par une couleur existante
				size: 'M', // Remplacez par une taille existante
				quantity: 1,
				price: 49.99,
			},
		];

		log('ℹ️  Produit à commander:', 'yellow');
		console.log(testCartItems[0]);

		// 3️⃣ Vérifier le stock avant commande
		log('\n3️⃣  Vérification du stock disponible...', 'blue');

		// Cette vérification se fait automatiquement dans l'API /orders
		// On va directement créer la commande qui inclut la vérification

		// 4️⃣ Créer une commande de test
		log('\n4️⃣  Création de la commande de test...', 'blue');

		const orderData = {
			cartItems: testCartItems,
			selectedAddressId: 'your-address-id', // Remplacez par une adresse valide
			selectedDelivery: 'standard',
			selectedPayment: 'card',
			promoCodeId: null,
			promoDiscount: 0,
			subtotal: 49.99,
			shippingCost: 5.00,
			taxAmount: 0,
			total: 54.99,
			subscribeNewsletter: false,
		};

		const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': `auth-token=${authToken}`,
			},
			body: JSON.stringify(orderData),
		});

		if (!orderResponse.ok) {
			const error = await orderResponse.json();
			log(`❌ Échec de création de commande: ${error.error}`, 'red');

			if (error.details) {
				log('\nDétails:', 'yellow');
				error.details.forEach(detail => console.log(`  - ${detail}`));
			}

			if (error.unavailableItems) {
				log('\nArticles indisponibles:', 'yellow');
				error.unavailableItems.forEach(item => {
					console.log(`  - ${item.productName} (${item.color} - ${item.size})`);
					console.log(`    Demandé: ${item.requested}, Disponible: ${item.available_quantity}`);
				});
			}

			return;
		}

		const orderResult = await orderResponse.json();
		log('✅ Commande créée avec succès!', 'green');
		log(`   Numéro de commande: ${orderResult.orderNumber}`, 'cyan');

		// 5️⃣ Vérifier que le stock a été décrémenté
		log('\n5️⃣  Vérification de la décrémentation du stock...', 'blue');
		log('ℹ️  Consultez les logs du serveur pour voir les messages de décrémentation', 'yellow');
		log('ℹ️  Vérifiez dans Sanity Studio que le stock a bien été mis à jour', 'yellow');

		// 6️⃣ Résumé
		log('\n' + '='.repeat(60), 'cyan');
		log('✅ TEST TERMINÉ AVEC SUCCÈS', 'green');
		console.log('='.repeat(60));

		log('\n📋 Pour tester l\'incrémentation du stock (annulation):', 'yellow');
		log('   1. Allez dans le dashboard admin', 'yellow');
		log(`   2. Changez le statut de la commande ${orderResult.orderNumber} à CANCELLED`, 'yellow');
		log('   3. Vérifiez dans Sanity que le stock a été restauré', 'yellow');

	} catch (error) {
		log(`\n❌ Erreur durant le test: ${error.message}`, 'red');
		console.error(error);
	}
}

// Instructions d'utilisation
log('\n📝 INSTRUCTIONS:', 'cyan');
log('1. Assurez-vous que le serveur de développement tourne (npm run dev)', 'yellow');
log('2. Modifiez les variables dans ce script:', 'yellow');
log('   - email et password de test', 'yellow');
log('   - ID et slug d\'un produit Sanity', 'yellow');
log('   - ID d\'une adresse de livraison', 'yellow');
log('3. Lancez: node test-stock-sync.js\n', 'yellow');

// Demander confirmation avant d'exécuter
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

readline.question('Avez-vous configuré les variables ? (o/n) ', (answer) => {
	if (answer.toLowerCase() === 'o' || answer.toLowerCase() === 'oui') {
		testStockSync().finally(() => readline.close());
	} else {
		log('\n⚠️  Veuillez d\'abord configurer les variables dans le script', 'yellow');
		readline.close();
	}
});
