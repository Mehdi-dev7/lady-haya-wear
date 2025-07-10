import * as SibApiV3Sdk from "@getbrevo/brevo";

// Configuration de l'API Brevo
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configuration de l'API key (à définir dans les variables d'environnement)
apiInstance.setApiKey(
	SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
	process.env.BREVO_API_KEY || ""
);

// Types pour les emails
interface EmailData {
	to: string;
	subject: string;
	htmlContent: string;
	textContent?: string;
	from?: string;
}

interface OrderConfirmationData {
	customerName: string;
	orderNumber: string;
	orderDate: string;
	totalAmount: string;
	items: Array<{
		name: string;
		quantity: number;
		price: string;
	}>;
}

// Fonction pour envoyer un email de confirmation de commande
export async function sendOrderConfirmationEmail(
	email: string,
	orderData: OrderConfirmationData
) {
	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

	sendSmtpEmail.to = [{ email }];
	sendSmtpEmail.subject = `Confirmation de commande #${orderData.orderNumber} - Lady Haya Wear`;
	sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>Merci pour votre commande, ${orderData.customerName} !</h1>
        <p>Votre commande #${orderData.orderNumber} a été confirmée.</p>
        <h2>Détails de la commande :</h2>
        <p><strong>Date :</strong> ${orderData.orderDate}</p>
        <p><strong>Total :</strong> ${orderData.totalAmount}</p>
        <h3>Articles commandés :</h3>
        <ul>
          ${orderData.items
						.map(
							(item) => `
            <li>${item.name} - Quantité: ${item.quantity} - Prix: ${item.price}</li>
          `
						)
						.join("")}
        </ul>
        <p>Nous vous tiendrons informé(e) du statut de votre commande.</p>
        <p>Cordialement,<br>L'équipe Lady Haya Wear</p>
      </body>
    </html>
  `;
	sendSmtpEmail.sender = {
		name: "Lady Haya Wear",
		email: process.env.BREVO_FROM_EMAIL || "contact@ladyhaya.com",
	};

	try {
		const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
		console.log("Email envoyé avec succès:", response);
		return { success: true, messageId: response.messageId };
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email:", error);
		throw error;
	}
}

// Fonction pour envoyer un email de bienvenue
export async function sendWelcomeEmail(email: string, customerName: string) {
	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

	sendSmtpEmail.to = [{ email }];
	sendSmtpEmail.subject = "Bienvenue chez Lady Haya Wear !";
	sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>Bienvenue ${customerName} !</h1>
        <p>Nous sommes ravis de vous accueillir chez Lady Haya Wear.</p>
        <p>Découvrez notre collection exclusive de vêtements et accessoires.</p>
        <p>Merci de nous faire confiance !</p>
        <p>Cordialement,<br>L'équipe Lady Haya Wear</p>
      </body>
    </html>
  `;
	sendSmtpEmail.sender = {
		name: "Lady Haya Wear",
		email: process.env.BREVO_FROM_EMAIL || "contact@ladyhaya.com",
	};

	try {
		const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
		console.log("Email de bienvenue envoyé:", response);
		return { success: true, messageId: response.messageId };
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
		throw error;
	}
}

// Fonction pour envoyer un email de récupération de mot de passe
export async function sendPasswordResetEmail(
	email: string,
	resetToken: string
) {
	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

	sendSmtpEmail.to = [{ email }];
	sendSmtpEmail.subject =
		"Réinitialisation de votre mot de passe - Lady Haya Wear";
	sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <p>Cordialement,<br>L'équipe Lady Haya Wear</p>
      </body>
    </html>
  `;
	sendSmtpEmail.sender = {
		name: "Lady Haya Wear",
		email: process.env.BREVO_FROM_EMAIL || "contact@ladyhaya.com",
	};

	try {
		const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
		console.log("Email de récupération envoyé:", response);
		return { success: true, messageId: response.messageId };
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email de récupération:", error);
		throw error;
	}
}

// Fonction générique pour envoyer un email personnalisé
export async function sendCustomEmail(emailData: EmailData) {
	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

	sendSmtpEmail.to = [{ email: emailData.to }];
	sendSmtpEmail.subject = emailData.subject;
	sendSmtpEmail.htmlContent = emailData.htmlContent;
	if (emailData.textContent) {
		sendSmtpEmail.textContent = emailData.textContent;
	}
	sendSmtpEmail.sender = {
		name: "Lady Haya Wear",
		email:
			emailData.from || process.env.BREVO_FROM_EMAIL || "contact@ladyhaya.com",
	};

	try {
		const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
		console.log("Email personnalisé envoyé:", response);
		return { success: true, messageId: response.messageId };
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email personnalisé:", error);
		throw error;
	}
}

// Fonction pour envoyer un email de contact
export async function sendContactEmail(contactData: {
	name: string;
	email: string;
	message: string;
}) {
	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

	sendSmtpEmail.to = [
		{ email: process.env.BREVO_TO_EMAIL || "contact@ladyhaya-wear.fr" },
	];
	sendSmtpEmail.subject = `Nouveau message de contact - ${contactData.name}`;
	sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>Nouveau message de contact</h1>
        <p><strong>Nom/Société :</strong> ${contactData.name}</p>
        <p><strong>Email :</strong> ${contactData.email}</p>
        <h2>Message :</h2>
        <p>${contactData.message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><em>Ce message a été envoyé depuis le formulaire de contact de Lady Haya Wear</em></p>
      </body>
    </html>
  `;
	sendSmtpEmail.sender = {
		name: "Lady Haya Wear - Contact",
		email: process.env.BREVO_FROM_EMAIL || "contact@ladyhaya-wear.fr",
	};

	try {
		const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
		console.log("Email de contact envoyé:", response);
		return { success: true, messageId: response.messageId };
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email de contact:", error);
		throw error;
	}
}
