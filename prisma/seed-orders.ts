import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Début du seeding des commandes...");

	// Vérifier si des commandes existent déjà
	const existingOrders = await prisma.order.findFirst();

	if (existingOrders) {
		console.log("✅ Des commandes existent déjà, skip du seeding");
		return;
	}

	// Créer un utilisateur de test si nécessaire
	let testUser = await prisma.user.findFirst({
		where: { email: "test@ladyhaya.com" },
	});

	if (!testUser) {
		testUser = await prisma.user.create({
			data: {
				email: "test@ladyhaya.com",
				emailVerified: new Date(),
			},
		});
	}

	// Créer des adresses de test
	const shippingAddress = await prisma.address.create({
		data: {
			userId: testUser.id,
			type: "SHIPPING",
			firstName: "Marie",
			lastName: "Dupont",
			street: "123 Rue de la Paix",
			city: "Paris",
			zipCode: "75001",
			country: "France",
			phone: "0123456789",
		},
	});

	// Données de commandes de test
	const testOrders = [
		{
			orderNumber: "LH-2024-001",
			customerEmail: "marie.dupont@email.com",
			customerName: "Marie Dupont",
			customerPhone: "0123456789",
			status: "DELIVERED",
			subtotal: 89.99,
			shippingCost: 5.99,
			taxAmount: 17.99,
			total: 113.97,
			paymentMethod: "Carte bancaire",
			paymentStatus: "PAID",
			notes: "Livraison en point relais",
			confirmedAt: new Date("2024-01-15T10:30:00Z"),
			shippedAt: new Date("2024-01-16T14:20:00Z"),
			deliveredAt: new Date("2024-01-18T16:45:00Z"),
			items: [
				{
					productId: "product-1",
					productName: "Robe Élégante",
					colorName: "Rose",
					sizeName: "M",
					quantity: 1,
					unitPrice: 89.99,
					totalPrice: 89.99,
				},
			],
		},
		{
			orderNumber: "LH-2024-002",
			customerEmail: "sophie.martin@email.com",
			customerName: "Sophie Martin",
			customerPhone: "0987654321",
			status: "SHIPPED",
			subtotal: 156.5,
			shippingCost: 0,
			taxAmount: 31.3,
			total: 187.8,
			paymentMethod: "PayPal",
			paymentStatus: "PAID",
			notes: "Livraison express demandée",
			confirmedAt: new Date("2024-01-14T09:15:00Z"),
			shippedAt: new Date("2024-01-15T11:30:00Z"),
			items: [
				{
					productId: "product-2",
					productName: "Ensemble Soirée",
					colorName: "Noir",
					sizeName: "S",
					quantity: 1,
					unitPrice: 156.5,
					totalPrice: 156.5,
				},
			],
		},
		{
			orderNumber: "LH-2024-003",
			customerEmail: "julie.bernard@email.com",
			customerName: "Julie Bernard",
			customerPhone: "0555666777",
			status: "CONFIRMED",
			subtotal: 67.8,
			shippingCost: 5.99,
			taxAmount: 13.56,
			total: 87.35,
			paymentMethod: "Carte bancaire",
			paymentStatus: "PAID",
			notes: "Préfère les emballages écologiques",
			confirmedAt: new Date("2024-01-13T16:45:00Z"),
			items: [
				{
					productId: "product-3",
					productName: "Blouse Chic",
					colorName: "Blanc",
					sizeName: "L",
					quantity: 1,
					unitPrice: 67.8,
					totalPrice: 67.8,
				},
			],
		},
		{
			orderNumber: "LH-2024-004",
			customerEmail: "anne.petit@email.com",
			customerName: "Anne Petit",
			customerPhone: "0444333222",
			status: "PENDING",
			subtotal: 234.0,
			shippingCost: 0,
			taxAmount: 46.8,
			total: 280.8,
			paymentMethod: null,
			paymentStatus: "PENDING",
			notes: "Commande en attente de validation",
			items: [
				{
					productId: "product-4",
					productName: "Manteau Hiver",
					colorName: "Beige",
					sizeName: "M",
					quantity: 1,
					unitPrice: 234.0,
					totalPrice: 234.0,
				},
			],
		},
		{
			orderNumber: "LH-2024-005",
			customerEmail: "claire.dubois@email.com",
			customerName: "Claire Dubois",
			customerPhone: "0333222111",
			status: "CANCELLED",
			subtotal: 45.5,
			shippingCost: 5.99,
			taxAmount: 9.1,
			total: 60.59,
			paymentMethod: "Carte bancaire",
			paymentStatus: "REFUNDED",
			notes: "Annulée par le client",
			items: [
				{
					productId: "product-5",
					productName: "Écharpe Soie",
					colorName: "Rouge",
					sizeName: "Unique",
					quantity: 1,
					unitPrice: 45.5,
					totalPrice: 45.5,
				},
			],
		},
	];

	// Créer les commandes
	for (const orderData of testOrders) {
		const { items, ...orderInfo } = orderData;

		const order = await prisma.order.create({
			data: {
				...orderInfo,
				userId: testUser.id,
				shippingAddressId: shippingAddress.id,
				billingAddressId: shippingAddress.id,
			},
		});

		// Créer les items de la commande
		for (const item of items) {
			await prisma.orderItem.create({
				data: {
					...item,
					orderId: order.id,
				},
			});
		}

		console.log(`✅ Commande créée: ${order.orderNumber}`);
	}

	console.log("🎉 Seeding des commandes terminé !");
}

main()
	.catch((e) => {
		console.error("❌ Erreur lors du seeding des commandes:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
