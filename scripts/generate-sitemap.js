import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Équivalent de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { generateSitemap, generateSitemapXSL } from '../src/sitemap.js';

async function writeSitemapFiles() {
  try {
    // Générer le sitemap XML
    const sitemap = await generateSitemap();
    
    // Résoudre le chemin vers le dossier public
    const publicDir = path.resolve(__dirname, '..', 'public');
    
    // Assurer que le dossier public existe
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    // Chemins pour les fichiers
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    const xslPath = path.join(publicDir, 'sitemap.xsl');
    
    // Écrire le sitemap XML
    fs.writeFileSync(sitemapPath, sitemap);
    
    // Générer et écrire le fichier XSL
    const sitemapXSL = generateSitemapXSL();
    fs.writeFileSync(xslPath, sitemapXSL);
    
    console.log('Sitemap et XSL générés avec succès.');
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap :', error);
  }
}

writeSitemapFiles();