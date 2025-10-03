# 🚀 Migration vers le système de produits simplifié

## ✨ Qu'est-ce qui change ?

**AVANT** : Système compliqué

- ❌ Créer un "Produit" (carte)
- ❌ Créer une "Fiche Produit Détaillée" séparée
- ❌ Les relier ensemble
- ❌ Cocher "featured" aux deux endroits pour les coups de cœur

**APRÈS** : Système simple

- ✅ Créer un seul "🛍️ Produit"
- ✅ Tout est au même endroit
- ✅ Cocher "⭐ Coup de cœur" une seule fois
- ✅ Interface organisée en 5 sections claires

---

## 📋 Les 5 sections du nouveau produit

1. **📝 Informations de base**
   - Nom du produit
   - URL (générée automatiquement)
   - Description courte (pour les cartes)
   - Description détaillée (pour la page produit)
   - Catégorie

2. **💰 Prix**
   - Prix actuel
   - Prix original (si en promo)

3. **📸 Images principales**
   - Image principale
   - Image au survol

4. **🎨 Couleurs & Tailles**
   - Toutes les couleurs disponibles
   - Photos par couleur
   - Tailles et stock par couleur

5. **⭐ Options d'affichage**
   - ⭐ Coup de cœur (pour la section coups de cœur)
   - 🆕 Nouveau produit (badge "NOUVEAU")
   - 🏷️ En promotion (badge promo)
   - Tags pour la recherche

---

## 🔧 Comment migrer ?

### Étape 1 : Vérifier l'environnement

Vérifiez que vous avez votre token Sanity dans `.env.local` :

```
SANITY_API_TOKEN=votre_token_ici
```

### Étape 2 : Lancer la migration

Dans le terminal, exécutez :

```bash
node scripts/migrate-to-unified-products.js
```

Le script va :

- ✅ Lire tous vos produits existants
- ✅ Fusionner "Produit" + "Fiche Détaillée" en un seul document
- ✅ Conserver toutes vos données
- ✅ Garder les anciens documents (sécurité)

### Étape 3 : Vérifier dans Sanity Studio

1. Allez dans Sanity Studio
2. Vous verrez un nouveau type : **🛍️ Produit**
3. Vérifiez que vos produits sont bien là
4. Vérifiez les images, prix, couleurs, etc.

### Étape 4 : Utiliser le nouveau système

Une fois la migration validée, je basculerais le code pour utiliser les nouveaux produits :

- Les pages produits utiliseront le nouveau schéma
- La section "Coups de cœur" fonctionnera correctement
- Tout sera plus simple !

---

## 👩‍💼 Guide pour votre cliente

### Comment ajouter un produit ?

1. **Allez dans Sanity Studio**
2. **Cliquez sur "🛍️ Produit"**
3. **Cliquez sur "Create new"**

4. **Remplissez les 5 sections** (onglets en haut) :

   **📝 Section 1 : Informations de base**
   - Nom du produit : _ex: "Robe longue fleurie"_
   - URL : cliquez sur "Generate"
   - Description courte : _ex: "Robe élégante parfaite pour l'été"_
   - Description détaillée : décrivez le produit en détail
   - Catégorie : choisissez dans la liste

   **💰 Section 2 : Prix**
   - Prix actuel : _ex: 49.90_
   - Prix original : _(si en promo, ex: 79.90)_

   **📸 Section 3 : Images principales**
   - Image principale : la première image du produit
   - Image au survol : (optionnel) image qui s'affiche au survol

   **🎨 Section 4 : Couleurs & Tailles**
   - Cliquez sur "Add item" pour chaque couleur
   - Pour chaque couleur :
     - Nom : _ex: "Noir"_
     - Code couleur : _ex: #000000_ (utilisez un color picker en ligne)
     - Photo principale de cette couleur
     - Photos supplémentaires (optionnel)
     - Tailles disponibles : ajoutez chaque taille avec son stock

   **⭐ Section 5 : Options**
   - ⭐ Coup de cœur : cochez pour afficher dans "Coups de cœur"
   - 🆕 Nouveau produit : cochez pour afficher le badge "NOUVEAU"
   - 🏷️ En promotion : cochez si le produit est en promo
   - Pourcentage de réduction : _ex: 20 pour -20%_

5. **Cliquez sur "Publish"** ✅

---

## ❓ FAQ

### Que deviennent mes anciens produits ?

Ils restent dans Sanity mais ne seront plus utilisés. Vous pouvez les garder comme backup.

### Dois-je recréer tous mes produits ?

Non ! Le script de migration les transfère automatiquement.

### Et si je veux supprimer les anciens documents ?

Une fois que tout fonctionne bien avec les nouveaux, vous pourrez les supprimer manuellement dans Sanity Studio.

### Le problème des "coups de cœur" sera réglé ?

Oui ! Il suffira de cocher "⭐ Coup de cœur" une seule fois dans le produit.

---

## 🆘 Besoin d'aide ?

Si vous avez des questions ou des problèmes, contactez votre développeur !
