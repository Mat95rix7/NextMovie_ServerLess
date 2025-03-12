import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const TheaterModal = ({ isOpen, onClose, onSubmit, theater, mode }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const theaterData = {
      id: theater?.id,
      nom: formData.get('nom'),
      adresse: formData.get('adresse'),
      commune: formData.get('commune'),
      dep: formData.get('dep'),
      fauteuils: parseInt(formData.get('fauteuils'), 10),
      ecrans: parseInt(formData.get('ecrans'), 10),
      code_insee: formData.get('code_insee'),
    };
    onSubmit(theaterData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? 'Ajouter une salle' : 'Modifier la salle'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              id="nom"
              defaultValue={theater?.nom || ''}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              name="adresse"
              id="adresse"
              defaultValue={theater?.adresse || ''}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="commune" className="block text-sm font-medium text-gray-700">
              Commune
            </label>
            <input
              type="text"
              name="commune"
              id="commune"
              defaultValue={theater?.commune || ''}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="dep" className="block text-sm font-medium text-gray-700">
              Département
            </label>
            <input
              type="text"
              name="dep"
              id="dep"
              defaultValue={theater?.dep || ''}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="fauteuils" className="block text-sm font-medium text-gray-700">
              Nombre de fauteuils
            </label>
            <input
              type="number"
              name="fauteuils"
              id="fauteuils"
              defaultValue={theater?.fauteuils || ''}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="ecrans" className="block text-sm font-medium text-gray-700">
              Nombre d'écrans
            </label>
            <input
              type="number"
              name="ecrans"
              id="ecrans"
              defaultValue={theater?.ecrans || ''}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="code_insee" className="block text-sm font-medium text-gray-700">
              Code INSEE
            </label>
            <input
              type="text"
              name="code_insee"
              id="code_insee"
              defaultValue={theater?.code_insee || ''}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-md"
            >
              {mode === 'add' ? 'Ajouter' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

TheaterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  theater: PropTypes.object,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
};

export default TheaterModal;