import { sendCustomEmail, sendOrderConfirmationEmail } from "@/lib/brevo";
import { generateInvoicePDFAsBuffer } from "@/lib/invoice-generator";
import { prisma } from "@/lib/prisma";
import { sanityClient } from "@/lib/sanity";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Fonction pour générer un numéro de commande unique
function generateOrderNumber(): string {
	const timestamp = Date.now().toString();
	const random = Math.random().toString(36).substring(2, 8).toUpperCase();
	return `CMD-${timestamp}-${random}`;
}

// POST - Créer une nouvelle commande et envoyer les emails
export async function POST(request: NextRequest) {
	try {
		// Vérifier l'authentification avec le token JWT personnalisé
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		// Vérifier le token JWT
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			include: {
				profile: true,
				addresses: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		const body = await request.json();
		const {
			cartItems,
			selectedAddressId,
			selectedDelivery,
			selectedPayment,
			promoCodeId,
			promoDiscount,
			subtotal,
			shippingCost,
			taxAmount,
			total,
			subscribeNewsletter,
		} = body;

		// Récupérer l'adresse de livraison
		const shippingAddress = user.addresses.find(
			(addr) => addr.id === selectedAddressId
		);
		if (!shippingAddress) {
			return NextResponse.json(
				{ error: "Adresse de livraison non trouvée" },
				{ status: 400 }
			);
		}

		// Créer la commande
		const orderNumber = generateOrderNumber();
		const order = await prisma.order.create({
			data: {
				userId: user.id,
				orderNumber,
				status: "PENDING",
				customerEmail: user.email,
				customerName:
					`${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim(),
				customerPhone: user.profile?.phone,
				subtotal,
				shippingCost,
				taxAmount,
				total,
				promoCodeId,
				promoDiscount,
				paymentMethod: selectedPayment,
				paymentStatus: "PAID",
				shippingAddressId: selectedAddressId,
				billingAddressId: selectedAddressId,

				items: {
					create: cartItems.map((item: any) => ({
						productId: item.id,
						productName: item.name,
						colorName: item.color,
						sizeName: item.size,
						quantity: item.quantity,
						unitPrice: item.price,
						totalPrice: item.price * item.quantity,
					})),
				},
			},
			include: {
				items: true,
				shippingAddress: true,
				billingAddress: true,
				promoCode: true,
			},
		});

		// Décrémenter le stock dans Sanity pour chaque article
		try {
			console.log("🔄 Début de la décrémentation du stock...");

			for (const item of cartItems) {
				console.log(
					`📦 Traitement du produit ${item.name} (${item.color}, ${item.size}) - Quantité: ${item.quantity}`
				);

				// Récupérer le produit détaillé depuis Sanity
				// Essayer d'abord avec le nouveau système unifié
				let productDetail = await sanityClient.fetch(
					`
					*[_type == "productUnified" && _id == $productId][0] {
						_id,
						colors[] {
							name,
							sizes[] {
								size,
								available,
								quantity
							},
							available
						}
					}
				`,
					{ productId: item.id }
				);

				// Si pas trouvé, essayer avec l'ancien système (pour compatibilité)
				if (!productDetail) {
					productDetail = await sanityClient.fetch(
						`
						*[_type == "productDetail" && product._ref == $productId][0] {
							_id,
							colors[] {
								name,
								sizes[] {
									size,
									available,
									quantity
								},
								available
							}
						}
					`,
						{ productId: item.id }
					);
				}

				if (!productDetail) {
					console.warn(`⚠️ Produit non trouvé pour l'ID: ${item.id}`);
					continue;
				}

				// Trouver la couleur et la taille correspondantes
				const colorIndex = productDetail.colors.findIndex(
					(color: any) => color.name === item.color
				);

				if (colorIndex === -1) {
					console.warn(
						`⚠️ Couleur "${item.color}" non trouvée pour le produit ${item.name}`
					);
					continue;
				}

				const sizeIndex = productDetail.colors[colorIndex].sizes.findIndex(
					(size: any) => size.size === item.size
				);

				if (sizeIndex === -1) {
					console.warn(
						`⚠️ Taille "${item.size}" non trouvée pour le produit ${item.name} (${item.color})`
					);
					continue;
				}

				// Vérifier le stock disponible
				const currentStock =
					productDetail.colors[colorIndex].sizes[sizeIndex].quantity;
				if (currentStock < item.quantity) {
					console.error(
						`❌ Stock insuffisant pour ${item.name} (${item.color}, ${item.size}): ${currentStock} disponible, ${item.quantity} demandé`
					);
					return NextResponse.json(
						{
							error: `Stock insuffisant pour ${item.name} (${item.color}, ${item.size}). Stock disponible: ${currentStock}`,
						},
						{ status: 400 }
					);
				}

				// Calculer le nouveau stock
				const newQuantity = currentStock - item.quantity;
				const newAvailable = newQuantity > 0;

				// Mettre à jour le stock dans Sanity
				const updatedColors = [...productDetail.colors];
				const updatedColor = { ...updatedColors[colorIndex] };
				const updatedSizes = [...updatedColor.sizes];
				updatedSizes[sizeIndex] = {
					...updatedSizes[sizeIndex],
					quantity: newQuantity,
					available: newAvailable,
				};
				updatedColor.sizes = updatedSizes;
				updatedColors[colorIndex] = updatedColor;

				await sanityClient
					.patch(productDetail._id)
					.set({ colors: updatedColors })
					.commit();

				console.log(
					`✅ Stock mis à jour pour ${item.name} (${item.color}, ${item.size}): ${currentStock} → ${newQuantity}`
				);
			}

			console.log("✅ Décrémentation du stock terminée avec succès");
		} catch (error) {
			console.error("❌ Erreur lors de la décrémentation du stock:", error);
			return NextResponse.json(
				{ error: "Erreur lors de la mise à jour du stock" },
				{ status: 500 }
			);
		}

		// Vider le panier
		await prisma.cartItem.deleteMany({
			where: { userId: user.id },
		});

		// Gérer l'inscription à la newsletter si demandée
		if (subscribeNewsletter && user.email) {
			try {
				// Mettre à jour le statut newsletter de l'utilisateur
				await prisma.user.update({
					where: { id: user.id },
					data: { newsletterSubscribed: true },
				});
				console.log(`Utilisateur ${user.email} inscrit à la newsletter`);
			} catch (error) {
				console.error("Erreur lors de l'inscription à la newsletter:", error);
				// Ne pas faire échouer la commande si l'inscription newsletter échoue
			}
		}

		// Préparer les données pour les emails
		const orderData = {
			customerName: order.customerName,
			orderNumber: order.orderNumber,
			orderDate: order.createdAt.toLocaleDateString("fr-FR"),
			totalAmount: `${order.total.toFixed(2)}€`,
			items: order.items.map((item) => ({
				name: item.productName,
				quantity: item.quantity,
				price: `${item.totalPrice.toFixed(2)}€`,
			})),
			shippingAddress: order.shippingAddress,
			deliveryMethod: selectedDelivery,
			paymentMethod: selectedPayment,
		};

		// 1. Email de confirmation au client avec facture PDF
		try {
			console.log("Début de génération de la facture PDF...");

			// Générer la facture PDF
			const invoiceData = {
				orderNumber: order.orderNumber,
				orderDate: order.createdAt.toLocaleDateString("fr-FR"),
				customerName: order.customerName,
				customerEmail: order.customerEmail,
				customerPhone: order.customerPhone || undefined,
				shippingAddress: {
					...order.shippingAddress!,
					civility:
						order.shippingAddress?.civility === "MR"
							? "MR"
							: order.shippingAddress?.civility === "MME"
								? "MME"
								: undefined,
				},
				items: order.items.map((item) => ({
					name: item.productName,
					quantity: item.quantity,
					unitPrice: item.unitPrice,
					totalPrice: item.totalPrice,
					colorName: item.colorName || undefined,
					sizeName: item.sizeName || undefined,
				})),
				subtotal: order.subtotal,
				taxAmount: order.taxAmount,
				shippingCost: order.shippingCost,
				promoDiscount: order.promoDiscount,
				total: order.total,
				paymentMethod: selectedPayment,
			};

			console.log("Génération du PDF...");
			const pdfBuffer = generateInvoicePDFAsBuffer(invoiceData);
			console.log("PDF généré avec succès");

			console.log("Envoi de l'email de confirmation...");
			// Envoyer l'email avec la facture PDF en pièce jointe
			await sendOrderConfirmationEmail(user.email, orderData, pdfBuffer);
			console.log("Email de confirmation avec facture PDF envoyé au client");
		} catch (error) {
			console.error(
				"Erreur lors de l'envoi de l'email de confirmation:",
				error
			);
			// Ne pas faire échouer la commande si l'email échoue
		}

		// 2. Email au vendeur avec les détails de la commande
		try {
			const vendorEmailData = {
				to: "contact@ladyhaya-wear.fr",
				subject: `Nouvelle commande #${order.orderNumber} - À préparer`,
				htmlContent: `
          <html>
            <body>
              <h1>Nouvelle commande reçue !</h1>
              <h2>Commande #${order.orderNumber}</h2>
              
              <h3>Informations client :</h3>
              <p><strong>Nom :</strong> ${order.customerName}</p>
              <p><strong>Email :</strong> ${order.customerEmail}</p>
              <p><strong>Téléphone :</strong> ${order.customerPhone || "Non renseigné"}</p>
              
              <h3>Adresse de livraison :</h3>
              <p>${order.shippingAddress?.civility === "MR" ? "M." : "Mme"} ${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}</p>
              <p>${order.shippingAddress?.street}</p>
              <p>${order.shippingAddress?.zipCode} ${order.shippingAddress?.city}</p>
              <p>${order.shippingAddress?.country}</p>
              
              <h3>Mode de livraison :</h3>
              <p>${
								selectedDelivery === "domicile"
									? "À domicile (Colissimo)"
									: selectedDelivery === "relay"
										? "Point relais (Mondial Relay)"
										: "Livraison express (Chronopost)"
							}</p>
              
              <h3>Articles à préparer :</h3>
              <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Produit</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Couleur</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Taille</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantité</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Prix unitaire</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
										.map(
											(item) => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.colorName || "-"}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.sizeName || "-"}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.unitPrice.toFixed(2)}€</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.totalPrice.toFixed(2)}€</td>
                    </tr>
                  `
										)
										.join("")}
                </tbody>
              </table>
              
              <h3>Récapitulatif financier :</h3>
              <p><strong>Sous-total HT :</strong> ${order.subtotal.toFixed(2)}€</p>
              <p><strong>TVA (20%) :</strong> ${order.taxAmount.toFixed(2)}€</p>
              <p><strong>Frais de livraison :</strong> ${order.shippingCost.toFixed(2)}€</p>
              ${order.promoDiscount > 0 ? `<p><strong>Réduction promo :</strong> -${order.promoDiscount.toFixed(2)}€</p>` : ""}
              <p><strong>Total TTC :</strong> <strong style="color: #d9c4b5; font-size: 1.2em;">${order.total.toFixed(2)}€</strong></p>
              
              <h3>Mode de paiement :</h3>
              <p>${selectedPayment === "cb" ? "Carte bancaire" : "PayPal"}</p>
              
              <hr style="margin: 30px 0;">
              <p><em>Cette commande a été automatiquement confirmée et payée.</em></p>
              <p><em>Merci de préparer cette commande dans les plus brefs délais.</em></p>
            </body>
          </html>
        `,
			};

			await sendCustomEmail(vendorEmailData);
			console.log("Email de notification envoyé au vendeur");
		} catch (error) {
			console.error("Erreur lors de l'envoi de l'email au vendeur:", error);
		}

		return NextResponse.json({
			success: true,
			orderId: order.id,
			orderNumber: order.orderNumber,
		});
	} catch (error) {
		console.error("Erreur lors de la création de la commande:", error);

		// Log détaillé de l'erreur pour le debug
		if (error instanceof Error) {
			console.error("Message d'erreur:", error.message);
			console.error("Stack trace:", error.stack);
		}

		return NextResponse.json(
			{
				error: "Erreur lors de la création de la commande",
				details: error instanceof Error ? error.message : "Erreur inconnue",
			},
			{ status: 500 }
		);
	}
}

// GET - Récupérer les commandes de l'utilisateur
export async function GET(request: NextRequest) {
	try {
		// Vérifier l'authentification avec le token JWT personnalisé
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
		}

		// Vérifier le token JWT
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Utilisateur non trouvé" },
				{ status: 404 }
			);
		}

		const orders = await prisma.order.findMany({
			where: { userId: user.id },
			include: {
				items: true,
				shippingAddress: true,
				billingAddress: true,
				promoCode: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json({ orders });
	} catch (error) {
		console.error("Erreur lors de la récupération des commandes:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération des commandes" },
			{ status: 500 }
		);
	}
}
