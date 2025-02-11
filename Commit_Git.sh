#!/bin/bash

# Demander un message de commit personnalisé
echo "Entrez votre message de commit :"
read commit_message

# Vérifier si le message n'est pas vide
if [ -z "$commit_message" ]; then
    echo "Le message de commit ne peut pas être vide. Annulation."
    exit 1
fi

# Ajouter tous les fichiers modifiés
git add .

# Créer un commit avec le message saisi
git commit -m "$commit_message"

# Pousser vers la branche actuelle
git push origin $(git rev-parse --abbrev-ref HEAD)

echo "Les modifications ont été poussées avec succès avec le message : '$commit_message'"
