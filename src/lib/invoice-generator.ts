import jsPDF from "jspdf";

interface InvoiceData {
	orderNumber: string;
	orderDate: string;
	customerName: string;
	customerEmail: string;
	customerPhone?: string;
	shippingAddress: {
		civility?: string;
		firstName: string;
		lastName: string;
		street: string;
		city: string;
		zipCode: string;
		country: string;
	};
	items: Array<{
		name: string;
		quantity: number;
		unitPrice: number;
		totalPrice: number;
		colorName?: string;
		sizeName?: string;
	}>;
	subtotal: number;
	taxAmount: number;
	shippingCost: number;
	promoDiscount: number;
	total: number;
	paymentMethod: string;
}

export function generateInvoicePDF(invoiceData: InvoiceData): jsPDF {
	const doc = new jsPDF();

	// Configuration des couleurs
	const primaryColor = [217, 196, 181]; // #d9c4b5
	const secondaryColor = [180, 153, 130]; // #b49982
	const textColor = [51, 51, 51]; // #333333

	// En-tête
	doc.setFillColor(...primaryColor);
	doc.rect(0, 0, 210, 40, "F");

	// Logo/Titre
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(24);
	doc.setFont("helvetica", "bold");
	doc.text("Lady Haya Wear", 20, 25);

	// Informations de l'entreprise
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text("Votre boutique de vêtements et accessoires", 20, 35);

	// Informations de facturation
	doc.setTextColor(...textColor);
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.text("FACTURE", 150, 25);

	// Numéro de commande et date
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text(`Commande: #${invoiceData.orderNumber}`, 150, 35);
	doc.text(`Date: ${invoiceData.orderDate}`, 150, 42);

	// Informations client
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.text("Informations client:", 20, 60);

	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text(`${invoiceData.customerName}`, 20, 70);
	doc.text(`${invoiceData.customerEmail}`, 20, 77);
	if (invoiceData.customerPhone) {
		doc.text(`${invoiceData.customerPhone}`, 20, 84);
	}

	// Adresse de livraison
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.text("Adresse de livraison:", 20, 100);

	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	const civility = invoiceData.shippingAddress.civility === "MR" ? "M." : "Mme";
	doc.text(
		`${civility} ${invoiceData.shippingAddress.firstName} ${invoiceData.shippingAddress.lastName}`,
		20,
		110
	);
	doc.text(invoiceData.shippingAddress.street, 20, 117);
	doc.text(
		`${invoiceData.shippingAddress.zipCode} ${invoiceData.shippingAddress.city}`,
		20,
		124
	);
	doc.text(invoiceData.shippingAddress.country, 20, 131);

	// Tableau des articles
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.text("Articles commandés:", 20, 150);

	// En-tête du tableau
	doc.setFillColor(...secondaryColor);
	doc.rect(20, 155, 170, 10, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(9);
	doc.setFont("helvetica", "bold");
	doc.text("Produit", 25, 162);
	doc.text("Qté", 100, 162);
	doc.text("Prix unit.", 120, 162);
	doc.text("Total", 160, 162);

	// Contenu du tableau
	let yPosition = 170;
	doc.setTextColor(...textColor);
	doc.setFont("helvetica", "normal");

	invoiceData.items.forEach((item, index) => {
		if (yPosition > 250) {
			doc.addPage();
			yPosition = 20;
		}

		// Nom du produit
		const productName = `${item.name}${item.colorName ? ` - ${item.colorName}` : ""}${item.sizeName ? ` (Taille ${item.sizeName})` : ""}`;
		doc.setFontSize(9);
		doc.text(productName, 25, yPosition);

		// Quantité
		doc.text(item.quantity.toString(), 100, yPosition);

		// Prix unitaire
		doc.text(`${item.unitPrice.toFixed(2)}€`, 120, yPosition);

		// Total
		doc.text(`${item.totalPrice.toFixed(2)}€`, 160, yPosition);

		yPosition += 8;
	});

	// Récapitulatif financier
	yPosition = Math.max(yPosition + 10, 200);

	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");

	// Sous-total
	doc.text("Sous-total HT:", 120, yPosition);
	doc.text(`${invoiceData.subtotal.toFixed(2)}€`, 160, yPosition);
	yPosition += 8;

	// TVA
	doc.text("TVA (20%):", 120, yPosition);
	doc.text(`${invoiceData.taxAmount.toFixed(2)}€`, 160, yPosition);
	yPosition += 8;

	// Frais de livraison
	doc.text("Frais de livraison:", 120, yPosition);
	doc.text(`${invoiceData.shippingCost.toFixed(2)}€`, 160, yPosition);
	yPosition += 8;

	// Réduction promo
	if (invoiceData.promoDiscount > 0) {
		doc.setTextColor(0, 128, 0);
		doc.text("Réduction promo:", 120, yPosition);
		doc.text(`-${invoiceData.promoDiscount.toFixed(2)}€`, 160, yPosition);
		yPosition += 8;
		doc.setTextColor(...textColor);
	}

	// Ligne de séparation
	doc.setDrawColor(...secondaryColor);
	doc.line(120, yPosition, 190, yPosition);
	yPosition += 8;

	// Total
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(...primaryColor);
	doc.text("Total TTC:", 120, yPosition);
	doc.text(`${invoiceData.total.toFixed(2)}€`, 160, yPosition);

	// Mode de paiement
	yPosition += 15;
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(...textColor);
	const paymentMethod =
		invoiceData.paymentMethod === "cb"
			? "Carte bancaire"
			: invoiceData.paymentMethod === "paypal"
				? "PayPal"
				: invoiceData.paymentMethod;
	doc.text(`Mode de paiement: ${paymentMethod}`, 20, yPosition);

	// Pied de page
	doc.setFontSize(8);
	doc.setTextColor(128, 128, 128);
	doc.text(
		"Lady Haya Wear - contact@ladyhaya-wear.fr - 01 23 45 67 89",
		20,
		280
	);
	doc.text("Merci pour votre confiance !", 20, 285);

	return doc;
}

export function generateInvoicePDFAsBuffer(invoiceData: InvoiceData): Buffer {
	const doc = generateInvoicePDF(invoiceData);
	const pdfBytes = doc.output("arraybuffer");
	return Buffer.from(pdfBytes);
}
