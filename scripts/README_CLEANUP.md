# 📝 Scripts de nettoyage temporaires

## Scripts à supprimer plus tard :

Ces scripts ont été utilisés pour la migration vers le système de produits unifié et ne sont plus nécessaires :

- ✅ `cleanup-old-products.js` (avec confirmation interactive)
- ✅ `cleanup-old-products-confirmed.js` (sans confirmation)
- ✅ `cleanup-old-products-v2.js` (version corrigée utilisée)
- ✅ `migrate-to-unified-products.js` (migration déjà effectuée)

## ⏰ Rappel

**Une fois que vous êtes 100% sûr que tout fonctionne en production**, vous pouvez supprimer ces 4 scripts :

```bash
rm scripts/cleanup-old-products.js
rm scripts/cleanup-old-products-confirmed.js
rm scripts/cleanup-old-products-v2.js
rm scripts/migrate-to-unified-products.js
rm scripts/README_CLEANUP.md
```

## ✅ Ce qui a été fait

- Migration de 3 produits vers le système unifié
- Suppression de 9 anciens documents (6 productDetail + 3 product)
- Système de produits simplifié actif sur tout le site

---

**Date de création :** 3 octobre 2025
