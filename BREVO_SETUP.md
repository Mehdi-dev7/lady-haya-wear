# Configuration Brevo pour le formulaire de contact

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Configuration Brevo
BREVO_API_KEY=votre_clé_api_brevo_ici
BREVO_FROM_EMAIL=contact@ladyhaya-wear.fr
BREVO_TO_EMAIL=contact@ladyhaya-wear.fr

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Configuration Brevo

1. Connectez-vous à votre compte Brevo
2. Allez dans Settings > API Keys
3. Créez une nouvelle clé API
4. Copiez la clé dans `BREVO_API_KEY`

## Fonctionnalités

Le formulaire de contact utilise :

- **Zod** pour la validation des données
- **React Hook Form** pour la gestion du formulaire
- **Brevo** pour l'envoi des emails
- **React Toastify** pour les notifications

## Validation

Le formulaire valide :

- Nom : minimum 2 caractères
- Email : format email valide
- Message : minimum 10 caractères

## Emails

Les emails de contact sont envoyés à l'adresse configurée dans `BREVO_TO_EMAIL` avec :

- Sujet : "Nouveau message de contact - [Nom]"
- Contenu HTML formaté avec les informations du contact
