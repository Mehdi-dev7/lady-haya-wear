#!/bin/bash

# Script de test pour le job CRON de reviews
# Usage: ./test-review-cron.sh

echo "🧪 Test du job CRON de reviews..."

# Remplace par ton CRON_SECRET et ton domaine
CRON_SECRET="ton-secret-ici"
DOMAIN="https://ton-domaine.com"

# Test GET (job automatique)
echo "📧 Test du job automatique (GET)..."
curl -H "Authorization: Bearer $CRON_SECRET" \
     -H "Content-Type: application/json" \
     "$DOMAIN/api/cron/review-requests"

echo -e "\n\n"

# Test POST (déclenchement manuel)  
echo "🚀 Test du déclenchement manuel (POST)..."
curl -X POST \
     -H "Authorization: Bearer $CRON_SECRET" \
     -H "Content-Type: application/json" \
     "$DOMAIN/api/cron/review-requests"

echo -e "\n\n✅ Tests terminés !"
