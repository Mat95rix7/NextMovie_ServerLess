import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 bg-gray-600 text-gray-900 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-sm md:max-w-md lg:max-w-lg">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-center">Confirmation</h2>
            <p className="mb-6 text-sm md:text-base">{message}</p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onCancel}
                className="w-full sm:w-auto bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm md:text-base"
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm md:text-base"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmationModal;