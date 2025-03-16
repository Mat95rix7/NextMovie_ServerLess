import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'cinemas.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const cinemas = JSON.parse(data);
    
    res.status(200).json(cinemas);
  } catch (error) {
    console.error('Erreur lors de la récupération des salles de cinéma:', error);
    res.status(500).json({ error: "Erreur lors de la récupération des salles de cinéma" });
  }
}
