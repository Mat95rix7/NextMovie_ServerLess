import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { LoginForm } from './LoginForm';

const SlidingLoginModal = ({ isOpen, onClose }) => {
  // Récupérer les données du banner depuis Redux
  const bannerData = useSelector((state) => state.movieData.bannerData);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="flex fixed inset-0 z-50">
          {/* Panneau de connexion (côté gauche) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-1/2 h-full bg-gray-900/70 backdrop-blur-md"
          >
            <div className="relative w-full h-full p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>


            </div>
          </motion.div>

          {/* Section des cartes (côté droit) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-1/2 h-full overflow-y-auto bg-gray-900/30 backdrop-blur-sm"
          >
            <div className="p-6 grid grid-cols-2 gap-4">
              {bannerData?.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <img
                    src={item.backdrop_path}
                    alt={item.title || item.name}
                    className="w-full aspect-video object-cover rounded-lg transform transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold">
                        {item.title || item.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {item.release_date || item.first_air_date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SlidingLoginModal;