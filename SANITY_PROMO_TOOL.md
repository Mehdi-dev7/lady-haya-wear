# 🎯 Outil de Gestion des Promotions en Masse - Sanity Studio

## 📋 Description

Cet outil permet aux administrateurs de gérer les promotions sur plusieurs produits simultanément dans le studio Sanity, évitant ainsi de modifier chaque produit individuellement.

## 🚀 Fonctionnalités

### ✅ Ce qui est inclus :

- **Filtrage par catégorie** : Sélectionnez une catégorie pour voir tous ses produits
- **Sélection en masse** : Cochez tous les produits d'un coup ou sélectionnez individuellement
- **Deux types de promotions** :
  - **Pourcentage de réduction** (ex: 20% de réduction)
  - **Prix barré** (ex: prix original 50€, prix actuel 30€)
- **Suppression des promotions** : Retirer les promotions en masse
- **Interface intuitive** : Design cohérent avec Sanity Studio
- **Confirmation** : Dialog de confirmation avant application
- **Feedback visuel** : Badges indiquant les produits déjà en promotion

### 🔧 Comment utiliser l'outil

1. **Accéder à l'outil** :
   - Dans le studio Sanity, cherchez l'onglet "🎯 Promotions en Masse"
   - Cliquez dessus pour ouvrir l'outil

2. **Sélectionner une catégorie** :
   - Choisissez une catégorie dans le menu déroulant
   - Les produits de cette catégorie s'affichent automatiquement

3. **Sélectionner les produits** :
   - Utilisez "Tout sélectionner" pour cocher tous les produits
   - Ou cochez individuellement les produits souhaités
   - Les produits déjà en promotion affichent un badge

4. **Configurer la promotion** :
   - **Pourcentage** : Saisissez le pourcentage (ex: 20 pour -20%)
   - **Prix barré** : Saisissez le prix original en euros (ex: 50 pour 50€)

5. **Appliquer** :
   - Cliquez sur "Appliquer à X produit(s)"
   - Confirmez dans le dialog qui s'ouvre
   - Les promotions sont appliquées instantanément

6. **Supprimer les promotions** :
   - Sélectionnez les produits avec promotions
   - Cliquez sur "Supprimer les promotions"

## 🎨 Interface Utilisateur

### Étape 1 : Sélection de catégorie

```
┌─────────────────────────────────────┐
│ 1. Sélectionner une catégorie       │
│ [Menu déroulant des catégories]     │
└─────────────────────────────────────┘
```

### Étape 2 : Sélection des produits

```
┌─────────────────────────────────────┐
│ 2. Sélectionner les produits        │
│ [Tout sélectionner] [Tout désélectionner] │
│                                     │
│ ☑ Produit A              [PROMO]   │
│ ☐ Produit B                        │
│ ☑ Produit C              [-20%]    │
└─────────────────────────────────────┘
```

### Étape 3 : Configuration

```
┌─────────────────────────────────────┐
│ 3. Configurer la promotion          │
│                                     │
│ Type: [Pourcentage ▼]               │
│ Valeur: [20] %                      │
│                                     │
│ [Appliquer à 2 produit(s)]          │
│ [Supprimer les promotions]          │
└─────────────────────────────────────┘
```

## 🔧 Structure Technique

### Fichiers créés :

- `src/sanity/tools/bulkPromo.tsx` - Composant principal de l'outil
- `src/sanity/tools/index.ts` - Configuration des outils
- `sanity.config.ts` - Configuration mise à jour

### Intégration :

L'outil est automatiquement ajouté au studio Sanity et accessible via l'interface.

## 🎯 Avantages

### ⏱️ Gain de temps

- **Avant** : Modifier chaque produit individuellement (5-10 min par produit)
- **Après** : Appliquer une promotion à 50 produits en 30 secondes

### 🎯 Précision

- Pas de risque d'oublier des produits
- Application uniforme des promotions
- Vérification visuelle des produits déjà en promotion

### 🔄 Flexibilité

- Conservation de la gestion individuelle
- Possibilité de mélanger les types de promotions
- Suppression facile des promotions

## 🚨 Notes Importantes

### ⚠️ Limitations

- L'outil fonctionne uniquement avec les produits existants
- Les promotions sont appliquées immédiatement (pas de brouillon)
- Nécessite les permissions d'écriture sur Sanity

### 🔒 Sécurité

- Dialog de confirmation avant application
- Validation des valeurs saisies
- Gestion des erreurs avec messages explicites

## 🎉 Résultat

Les produits modifiés afficheront :

- **Badge de promotion** sur les cartes produits
- **Prix barré** avec le nouveau prix
- **Calcul automatique** de la réduction

L'outil est maintenant **opérationnel** et prêt à être utilisé ! 🚀
