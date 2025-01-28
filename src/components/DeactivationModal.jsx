
const DeactivationModal = ({ isOpen, onClose, onContact }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Compte désactivé</h2>
        <p className="mb-4">
          Votre compte est actuellement désactivé. Si vous souhaitez réactiver votre compte,
          veuillez nous contacter.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Fermer
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onContact}
          >
            Contacter le support
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivationModal;
