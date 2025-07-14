# Configuration d'authentification - Lady Haya Wear

## Variables d'environnement nécessaires

Créez un fichier `.env.local` avec les variables suivantes :

```bash
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/lady_haya_wear"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Brevo (SendinBlue) pour l'envoi d'emails
BREVO_API_KEY="your-brevo-api-key"
BREVO_FROM_EMAIL="noreply@yourdomain.com"

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="your-sanity-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-sanity-api-token"
```

## Configuration Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+
4. Allez dans "Identifiants" > "Créer des identifiants" > "ID client OAuth 2.0"
5. Configurez les URI de redirection autorisés :
   - `http://localhost:3000/api/auth/callback/google` (développement)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## Configuration Brevo

1. Créez un compte sur [Brevo](https://www.brevo.com/)
2. Allez dans "Paramètres" > "Clés API"
3. Créez une nouvelle clé API
4. Configurez l'email expéditeur dans les paramètres de Brevo

**Variables Brevo dans votre .env.local :**
- `BREVO_API_KEY` : Clé API Brevo pour l'envoi d'emails
- `BREVO_FROM_EMAIL` : Adresse expéditeur (emails de vérification, notifications)
- `BREVO_TO_EMAIL` : Adresse destinataire (emails de contact depuis le formulaire)

## Base de données

Le schéma Prisma est déjà configuré. Exécutez les commandes suivantes :

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# (Optionnel) Visualiser la base de données
npx prisma studio
```

## Fonctionnalités implémentées

✅ **Authentification par email/mot de passe**

- Inscription avec hachage bcrypt
- Connexion avec vérification du mot de passe
- Validation des données avec Zod

✅ **Vérification d'email**

- Envoi d'email de confirmation à l'inscription
- Tokens de vérification avec expiration (24h)
- Redirection après vérification

✅ **Authentification Google**

- Connexion via Google OAuth
- Création automatique du profil utilisateur
- Synchronisation des informations

✅ **Gestion des sessions**

- Sessions JWT avec NextAuth
- Durée de session configurable (30 jours)
- Gestion des tokens de rafraîchissement

✅ **Sécurité**

- Middleware de protection des routes
- Hachage des mots de passe avec bcrypt
- Validation des inputs côté serveur
- Protection CSRF intégrée

✅ **Interface utilisateur**

- Formulaires de connexion/inscription
- Gestion des erreurs et messages
- Chargement et états d'attente
- Design responsive

## Routes API créées

- `POST /api/auth/register` - Inscription
- `GET/POST /api/auth/verify-email` - Vérification d'email
- `POST /api/send-email` - Envoi d'emails
- `[...nextauth]` - Gestion NextAuth

## Routes protégées

Le middleware protège automatiquement ces routes :

- `/cart` - Panier utilisateur
- `/profile` - Profil utilisateur
- `/orders` - Commandes

## Règles de validation

### **Validation côté serveur ET client**

**Email :**
- Format valide avec regex : `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
- Requis pour l'inscription et la connexion

**Mot de passe :**
- Minimum 8 caractères
- Au moins 1 minuscule (a-z)
- Au moins 1 majuscule (A-Z)
- Au moins 1 chiffre (0-9)
- Message d'erreur : "Le mot de passe doit contenir une maj et un chiffre"

**Prénom et nom :**
- Minimum 2 lettres
- Maximum 50 caractères
- Uniquement des lettres, espaces, apostrophes et tirets
- Regex : `/^[a-zA-ZÀ-ÿ\s'-]+$/`
- Optionnels (peuvent être vides)

### **Validation en temps réel**

- Messages d'erreur instantanés pendant la saisie
- Bordures rouges pour les champs invalides
- Validation avant soumission du formulaire

## Prochaines étapes

1. Configurer les variables d'environnement
2. Tester l'inscription et la connexion
3. Configurer les providers OAuth supplémentaires si nécessaire
4. Personnaliser les emails de vérification
5. Ajouter la réinitialisation de mot de passe
