# Lady Haya Wear

Une boutique en ligne moderne et élégante spécialisée dans la mode modeste, construite avec Next.js, TypeScript, Tailwind CSS et Sanity CMS.

## 🚀 Technologies Utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour un code plus robuste
- **Tailwind CSS** - Framework CSS utilitaire
- **Sanity CMS** - CMS headless pour la gestion de contenu
- **Framer Motion** - Animations fluides
- **React Icons** - Icônes modernes
- **clsx & tailwind-merge** - Gestion intelligente des classes CSS

## 📁 Structure du Projet

```
lady-haya-wear/
├── src/
│   ├── app/                 # Pages et routes Next.js
│   ├── components/          # Composants réutilisables
│   ├── lib/                 # Utilitaires et configuration
│   └── types/               # Types TypeScript
├── public/                  # Assets statiques
└── docs/                    # Documentation
```

## 🛠️ Installation

1. **Cloner le projet**

   ```bash
   git clone <repository-url>
   cd lady-haya-wear
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   ```bash
   cp .env.example .env.local
   ```

   Puis éditez `.env.local` avec vos informations Sanity :

   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

4. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🎨 Fonctionnalités

### ✅ Implémentées

- **Page d'accueil moderne** avec section héro et produits mis en avant
- **Composant ProductCard** responsive avec gestion des images Sanity
- **Configuration Sanity** complète avec requêtes GROQ
- **Types TypeScript** pour les produits et catégories
- **Utilitaires CSS** avec clsx et tailwind-merge
- **Design responsive** avec Tailwind CSS

### 🚧 À Implémenter

- [ ] Navigation et header
- [ ] Page de détail produit
- [ ] Page de collection/catégorie
- [ ] Système de panier
- [ ] Authentification utilisateur
- [ ] Système de recherche
- [ ] Filtres et tri
- [ ] Page de commande
- [ ] Footer

## 📊 Types de Contenu Sanity

### Produit

```typescript
interface Product {
	_id: string;
	name: string;
	slug: { current: string };
	description: string;
	price: number;
	images: SanityImage[];
	category: { _ref: string };
	sizes: string[];
	colors: string[];
	inStock: boolean;
	featured: boolean;
}
```

### Catégorie

```typescript
interface Category {
	_id: string;
	name: string;
	slug: { current: string };
	description?: string;
	image?: SanityImage;
}
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
```

## 🎯 Requêtes Sanity Disponibles

- `getAllProducts()` - Tous les produits
- `getProductBySlug(slug)` - Produit spécifique
- `getFeaturedProducts()` - Produits mis en avant
- `getProductsByCategory(categorySlug)` - Produits par catégorie
- `getAllCategories()` - Toutes les catégories
- `searchProducts(searchTerm)` - Recherche de produits

## 🎨 Design System

### Couleurs

- **Primaire** : Amber-600 (#d97706)
- **Secondaire** : Gray-900 (#111827)
- **Accent** : Orange-100 (#ffedd5)

### Typographie

- **Titres** : Font-bold, tailles 3xl-5xl
- **Corps** : Font-normal, tailles base-lg
- **Navigation** : Font-semibold

## 📱 Responsive Design

Le site est entièrement responsive avec des breakpoints :

- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

## 🔒 Sécurité

- Variables d'environnement pour les clés sensibles
- Validation TypeScript pour les données
- Sanitisation des requêtes Sanity

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Autres Plateformes

Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js.

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement

---

**Lady Haya Wear** - Élégance et modestie réunies ✨
