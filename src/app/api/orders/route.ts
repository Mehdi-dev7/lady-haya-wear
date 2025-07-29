import { sendCustomEmail, sendOrderConfirmationEmail } from "@/lib/brevo";
import { generateInvoicePDFAsBuffer } from "@/lib/invoice-generator";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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

		// Vider le panier
		await prisma.cartItem.deleteMany({
			where: { userId: user.id },
		});

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

			const pdfBuffer = generateInvoicePDFAsBuffer(invoiceData);

			// Envoyer l'email avec la facture PDF en pièce jointe
			await sendOrderConfirmationEmail(user.email, orderData, pdfBuffer);
			console.log("Email de confirmation avec facture PDF envoyé au client");
		} catch (error) {
			console.error(
				"Erreur lors de l'envoi de l'email de confirmation:",
				error
			);
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
		return NextResponse.json(
			{ error: "Erreur lors de la création de la commande" },
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
