# Configuration Sanity pour Lady Haya Wear

## 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Autres variables d'environnement
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 2. Créer un projet Sanity

1. Allez sur [sanity.io](https://sanity.io)
2. Créez un nouveau projet
3. Notez votre `Project ID`
4. Remplacez `your-project-id` dans `.env.local`

## 3. Schémas Sanity Studio (optionnel)

Pour gérer le contenu, vous pouvez installer Sanity Studio :

```bash
npm install -g @sanity/cli
sanity init --template clean --create-project "lady-haya-wear" --dataset production
```

## 4. Types de contenu configurés

Le projet est configuré pour gérer :

- **Produits** : Nom, description, prix, images, catégories, tailles, couleurs
- **Catégories** : Nom, description, image
- **Images** : Avec alt text et légendes

## 5. Requêtes disponibles

- `getAllProducts()` : Tous les produits
- `getProductBySlug(slug)` : Produit spécifique
- `getFeaturedProducts()` : Produits mis en avant
- `getProductsByCategory(categorySlug)` : Produits par catégorie
- `getAllCategories()` : Toutes les catégories
- `searchProducts(searchTerm)` : Recherche de produits

## 6. Utilisation dans les composants

```tsx
import { getFeaturedProducts } from "@/lib/sanity-queries";
import { urlFor } from "@/lib/sanity";

// Dans un composant
const products = await getFeaturedProducts();

// Pour les images
const imageUrl = urlFor(product.images[0]).url();
```
