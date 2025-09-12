# Configuration du Système de Reviews

## Vue d'ensemble

Le système de reviews permet de collecter automatiquement les avis clients 48h après la livraison de leurs commandes et de les modérer avant publication.

## Architecture

### 1. Modèle de données (Prisma)

- **Review** : Stocke les avis avec statuts PENDING/APPROVED/REJECTED
- Relations avec User, Order, et tracking des emails

### 2. Job CRON automatique

- **URL** : `/api/cron/review-requests`
- **Fréquence** : À configurer selon vos besoins (recommandé : toutes les heures)
- **Fonction** : Trouve les commandes livrées il y a 48h et envoie les emails de demande d'avis

### 3. Interface client

- **URL** : `/review?token=TOKEN_UNIQUE`
- **Fonction** : Permet aux clients de laisser leurs avis via un lien sécurisé

### 4. Interface admin

- **URL** : `/dashboard/reviews`
- **Fonction** : Modération des avis (approuver/rejeter/supprimer)

### 5. Affichage public

- **Composant** : `Reviews.tsx`
- **API** : `/api/reviews`
- **Fonction** : Affiche uniquement les avis approuvés

## Configuration

### 1. Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Sécurité pour le job CRON
CRON_SECRET=your-super-secret-cron-key

# Configuration email Brevo (déjà configuré)
BREVO_API_KEY=your-brevo-api-key
BREVO_FROM_EMAIL=contact@ladyhaya-wear.fr

# URL de l'application
NEXT_PUBLIC_APP_URL=https://ladyhaya-wear.fr
```

### 2. Migration de la base de données

```bash
npx prisma migrate dev --name add_reviews
```

### 3. Configuration du CRON

#### Option A : Service externe (recommandé)

Utilisez un service comme **Vercel Cron**, **Uptime Robot**, ou **cron-job.org** :

- **URL** : `https://votre-domaine.com/api/cron/review-requests`
- **Méthode** : GET
- **Headers** : `Authorization: Bearer YOUR_CRON_SECRET`
- **Fréquence** : Toutes les heures

#### Option B : Serveur dédié

```bash
# Crontab
0 * * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://votre-domaine.com/api/cron/review-requests
```

## Utilisation

### 1. Flux automatique

1. Client passe commande
2. Commande est marquée comme "DELIVERED"
3. 48h après livraison : email automatique envoyé
4. Client clique sur le lien et laisse son avis
5. Admin modère l'avis dans le dashboard
6. Avis approuvé apparaît sur le site

### 2. Test manuel

```bash
# Déclencher le job CRON manuellement
curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://votre-domaine.com/api/cron/review-requests
```

### 3. Gestion admin

- Accédez à `/dashboard/reviews`
- Filtrez par statut (En attente, Approuvés, Rejetés)
- Recherchez par nom, email, produit, ou commande
- Approuvez/rejetez/supprimez les avis

## APIs disponibles

### Reviews publiques

```bash
GET /api/reviews?limit=10&page=1&productId=PRODUCT_ID
```

### Soumission d'avis

```bash
POST /api/reviews/submit
{
  "token": "email_token",
  "reviews": [
    {
      "productId": "product_id",
      "rating": 5,
      "comment": "Excellent produit!"
    }
  ]
}
```

### Gestion admin

```bash
GET /api/admin/reviews?status=PENDING&page=1
PUT /api/admin/reviews/REVIEW_ID { "status": "APPROVED" }
DELETE /api/admin/reviews/REVIEW_ID
```

## Sécurité

### 1. Tokens uniques

- Chaque email contient un token unique
- Token expire après 30 jours
- Token invalidé après utilisation

### 2. Protection CRON

- Header Authorization requis
- Clé secrète dans les variables d'environnement

### 3. Modération

- Tous les avis sont en attente par défaut
- Seuls les avis approuvés apparaissent publiquement

## Personnalisation

### 1. Template d'email

Modifiez `sendReviewRequestEmail()` dans `/src/lib/brevo.ts`

### 2. Délai d'envoi

Changez `48` heures dans `/src/app/api/cron/review-requests/route.ts`

### 3. Apparence

Personnalisez le composant `/src/components/Reviews/Reviews.tsx`

## Monitoring

### 1. Logs

Les jobs CRON loggent dans la console :

- Nombre de commandes traitées
- Emails envoyés avec succès
- Erreurs rencontrées

### 2. Statistiques

Le dashboard admin affiche :

- Nombre total d'avis par statut
- Distribution des notes
- Avis récents

## Dépannage

### 1. Emails non envoyés

- Vérifiez la configuration Brevo
- Vérifiez les logs du job CRON
- Testez manuellement l'API

### 2. Tokens invalides

- Vérifiez que le token n'a pas expiré (30 jours)
- Vérifiez qu'il n'a pas déjà été utilisé

### 3. Job CRON ne fonctionne pas

- Vérifiez l'URL et les headers
- Testez manuellement avec curl
- Vérifiez les logs serveur

## Support

Pour toute question ou problème, vérifiez :

1. Les logs de l'application
2. La configuration des variables d'environnement
3. L'état de la base de données
4. La configuration du service CRON
