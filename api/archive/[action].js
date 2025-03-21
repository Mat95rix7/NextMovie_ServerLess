// pages/api/auth.js
import { verifyToken, login, signup, logout } from '../../lib/authService.js';

export default async function handler(req, res) {
  // Route de login
  if (req.method === 'POST' && req.url.endsWith('/login')) {
    console.log('hello');
    return login(req, res);
  }
  
  // Route d'inscription
  if (req.method === 'POST' && req.url.endsWith('/signup')) {
    return signup(req, res);
  }
  
  // Route de déconnexion (protégée)
  if (req.method === 'POST' && req.url.endsWith('/logout')) {
    return verifyToken(req, res, () => logout(req, res));
  }
  
  // Méthode non supportée
  return res.status(405).json({ error: 'Méthode non autorisée' });
}