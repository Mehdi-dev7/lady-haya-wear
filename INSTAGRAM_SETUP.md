# Configuration de l'authentification Instagram

## Prérequis

1. Un compte développeur Facebook (nécessaire pour créer une app Instagram)
2. Une application Facebook configurée
3. **Un compte Instagram Business ou Creator** (requis pour l'API Instagram)

## Étapes de configuration

### 1. Créer une application Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Cliquez sur "Créer une application"
3. Sélectionnez "Application de consommation" ou "Application métier"
4. Remplissez les informations de base de votre application

### 2. Configurer l'authentification Instagram

1. Dans votre application Facebook, allez dans "Produits" > "Instagram API with Instagram Login"
2. Cliquez sur "Configurer"
3. Ajoutez les informations suivantes :
   - **URI de redirection OAuth valides** :
     - `http://localhost:3000/api/auth/instagram/callback` (développement)
     - `https://lady-haya-wear.vercel.app/api/auth/instagram/callback` (production)

### 3. Vérifier votre compte Instagram

**IMPORTANT** : Vous devez avoir un compte Instagram Business ou Creator :

1. Allez sur votre compte Instagram
2. **Paramètres** → **Compte**
3. Si vous avez un compte personnel, cliquez **"Passer à un compte professionnel"**
4. Choisissez **"Business"** ou **"Creator"**
5. Suivez les étapes de configuration

### 4. Obtenir les identifiants

1. Dans votre application Facebook, allez dans "Paramètres" > "De base"
2. Notez votre **ID d'application** (App ID)
3. Allez dans "Paramètres" > "Avancés" pour voir votre **Secret d'application** (App Secret)

### 5. Configurer les variables d'environnement

Ajoutez les variables suivantes à votre fichier `.env.local` :

```env
# Instagram OAuth
INSTAGRAM_APP_ID=votre_app_id_ici
INSTAGRAM_APP_SECRET=votre_app_secret_ici
```

### 6. Tester l'authentification

1. Démarrez votre serveur de développement : `npm run dev`
2. Allez sur la page de connexion
3. Cliquez sur le bouton Instagram
4. Vous devriez être redirigé vers Instagram pour l'autorisation
5. Après autorisation, vous serez redirigé vers votre application

## Permissions Instagram

L'application utilise la nouvelle API Instagram avec les permissions suivantes :

- `instagram_business_basic` : Accès aux informations de base du profil Business/Creator

## Gestion des erreurs

L'application gère les erreurs suivantes :

- `instagram_auth_failed` : Erreur générale d'authentification
- `instagram_code_missing` : Code d'autorisation manquant
- `instagram_state_invalid` : Erreur de sécurité (state invalide)
- `instagram_token_failed` : Erreur lors de l'obtention du token
- `instagram_user_data_failed` : Erreur lors de la récupération des données utilisateur
- `instagram_callback_failed` : Erreur générale du callback

## Intégration avec la base de données

L'authentification Instagram :

1. Crée un utilisateur avec un email unique basé sur l'ID Instagram
2. Crée une entrée dans la table `Account` pour lier l'utilisateur à Instagram
3. Met à jour le token d'accès à chaque connexion
4. Crée une session JWT valide pendant 7 jours

## Sécurité

- Utilisation de cookies httpOnly pour les tokens
- Validation du state pour prévenir les attaques CSRF
- Stockage sécurisé des tokens d'accès
- Nettoyage automatique des cookies temporaires

## Déploiement

Pour le déploiement en production :

1. Mettez à jour l'URI de redirection dans votre application Facebook
2. Assurez-vous que les variables d'environnement sont configurées
3. Vérifiez que le domaine de production est autorisé dans Facebook

## Limitations

- Nécessite un compte Instagram Business ou Creator
- Pas d'accès aux publicités ou au tagging
- API limitée aux fonctionnalités de base

## Migration des anciens scopes

Si vous utilisiez l'ancienne API Instagram Basic Display, les nouveaux scopes sont :

- Ancien : `user_profile,user_media`
- Nouveau : `instagram_business_basic`

Les anciens scopes seront dépréciés le 27 janvier 2025.
