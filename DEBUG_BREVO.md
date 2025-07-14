# Debug des erreurs Brevo (SendinBlue)

## 🔍 **Diagnostic de l'erreur HTTP 400**

Vous avez cette erreur : `HTTP request failed` avec `statusCode: 400` de Brevo.

### **Étape 1 : Vérifier les variables d'environnement**

Dans votre `.env.local`, vérifiez que vous avez :

```bash
BREVO_API_KEY="votre-vraie-clé-api-brevo"
BREVO_FROM_EMAIL="votre-email-verifie@domain.com"
```

### **Étape 2 : Vérifier votre clé API Brevo**

1. **Connectez-vous à [Brevo](https://app.brevo.com/)**
2. **Allez dans "Paramètres" → "Clés API"**
3. **Vérifiez que votre clé API est active**
4. **Copiez la clé exacte** (sans espaces)

### **Étape 3 : Vérifier l'email expéditeur**

**L'email expéditeur DOIT être vérifié dans Brevo :**

1. **Allez dans "Paramètres" → "Expéditeurs et IP"**
2. **Vérifiez que votre email est dans la liste**
3. **Si pas vérifié, cliquez sur "Ajouter un expéditeur"**
4. **Brevo vous enverra un email de confirmation**
5. **Cliquez sur le lien dans l'email**

### **Étape 4 : Tester avec un email simple**

Créez un fichier de test `test-brevo.js` :

```javascript
const { TransactionalEmailsApi, SendSmtpEmail } = require("@getbrevo/brevo");

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(0, "VOTRE_CLE_API_ICI");

const sendSmtpEmail = new SendSmtpEmail({
	subject: "Test",
	htmlContent: "<p>Test email</p>",
	sender: {
		name: "Test",
		email: "VOTRE_EMAIL_VERIFIE@domain.com",
	},
	to: [{ email: "VOTRE_EMAIL_PERSONNEL@gmail.com" }],
});

apiInstance
	.sendTransacEmail(sendSmtpEmail)
	.then((response) => {
		console.log("✅ Email envoyé avec succès:", response.messageId);
	})
	.catch((error) => {
		console.error("❌ Erreur:", error);
		if (error.response) {
			console.error("Status:", error.statusCode);
			console.error("Body:", error.body);
		}
	});
```

Lancez : `node test-brevo.js`

## 🔧 **Solutions aux erreurs communes**

### **Erreur 400 - "Invalid API key"**

```bash
# Vérifiez votre clé API
BREVO_API_KEY="xkeysib-a1b2c3d4..." # Doit commencer par "xkeysib-"
```

### **Erreur 400 - "Sender not verified"**

```bash
# L'email expéditeur doit être vérifié dans Brevo
BREVO_FROM_EMAIL="email-verifie@domain.com"
```

### **Erreur 400 - "Daily limit exceeded"**

- Compte gratuit limité à 300 emails/jour
- Vérifiez votre quota dans Brevo

### **Erreur 400 - "Invalid email format"**

```bash
# Vérifiez le format de votre email
BREVO_FROM_EMAIL="noreply@ladyhayawear.com"  # ✅ Correct
BREVO_FROM_EMAIL="noreply@ladyhayawear"      # ❌ Pas de TLD
```

## 🚀 **Solution temporaire pour continuer le développement**

En attendant de résoudre le problème Brevo, l'inscription fonctionne maintenant même si l'email n'est pas envoyé.

**Inscription sans email :**

- ✅ L'utilisateur est créé en base
- ✅ Le token de vérification est généré
- ⚠️ L'email ne sera pas envoyé
- ℹ️ Message : "L'email de vérification n'a pas pu être envoyé"

**Pour activer un compte manuellement :**

```sql
-- Dans votre base de données
UPDATE "User" SET "emailVerified" = NOW() WHERE email = 'email@user.com';
```

## 🔧 **Commandes utiles**

### **Voir les logs détaillés**

```bash
npm run dev
# Les logs détaillés apparaîtront dans la console
```

### **Vérifier la base de données**

```bash
npx prisma studio
# Ouvrez http://localhost:5555 pour voir les utilisateurs créés
```

### **Réactiver l'envoi d'email**

Une fois Brevo configuré, supprimez le try/catch dans `register/route.ts` :

```typescript
// Remplacez ceci :
try {
	await sendVerificationEmail(email, verificationToken);
	emailSent = true;
} catch (emailError) {
	console.error("Erreur lors de l'envoi de l'email...", emailError);
}

// Par ceci :
await sendVerificationEmail(email, verificationToken);
```

## 📋 **Checklist de vérification**

- [ ] BREVO_API_KEY est correct et active
- [ ] BREVO_FROM_EMAIL est vérifié dans Brevo
- [ ] Compte Brevo n'a pas atteint la limite quotidienne
- [ ] Test avec un email simple fonctionne
- [ ] Variables d'environnement chargées (redémarrer npm run dev)

## 📧 **Contact**

Si le problème persiste, contactez le support Brevo avec :

- Votre clé API (premiers caractères seulement)
- L'email expéditeur utilisé
- Le message d'erreur exact
