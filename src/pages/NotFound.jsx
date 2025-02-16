import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Animation de 404 */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-9xl font-extrabold text-gray-800 mb-4"></h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-2xl text-amber-500"
        >
          Oups ! La page que vous cherchez est introuvable.
        </motion.p>
      </motion.div>

      {/* Bouton pour revenir à l'accueil */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-6"
      >
        <Link
          to="/"
          className="px-6 py-3 text-white bg-amber-700 rounded-lg shadow-lg hover:bg-amber-500 transition"
        >
          Retour à l&apos;accueil
        </Link>
      </motion.div>
    </div>
  );
}
