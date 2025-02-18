# Utiliser une image Node.js légère
FROM node:18-alpine

# Définir le dossier de travail
WORKDIR /movieapp

# Définir l’environnement (dev par défaut)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Copier uniquement les fichiers essentiels pour l'installation des dépendances
COPY package.json package-lock.json ./

# Installer les dépendances (en fonction de l'environnement)
RUN npm install --only=$NODE_ENV

# Copier le reste des fichiers
COPY . .

# Exposer le bon port pour Vite
EXPOSE 5173

# Lancer l’application avec Vite
CMD ["npm", "run", "dev", "--", "--host"]

