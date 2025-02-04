import PropTypes from 'prop-types';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ showModal, setShowModal, type }) => {

  
  return (
    <Dialog 
      open={showModal} 
      onOpenChange={setShowModal}
      aria-labelledby="success-dialog-title"
      aria-describedby="success-dialog-description"
    >
      <DialogContent className="w-[90%] mx-auto max-w-sm sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-white to-amber-50 rounded-lg shadow-lg border border-amber-100">
        <div className="relative">
          {/* Cercles décoratifs avec animation subtile */}
          <div 
            className="absolute -top-24 -left-24 w-48 h-48 bg-amber-100 rounded-full opacity-20 animate-pulse"
            aria-hidden="true"
          />
          <div 
            className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-100 rounded-full opacity-20 animate-pulse"
            aria-hidden="true"
          />
          
          <div className="relative p-6">
            {/* Conteneur de l'icône avec animation personnalisée */}
            <div className="flex items-center justify-center" role="presentation">
              <div className="bg-amber-100 p-4 rounded-full shadow-lg transform animate-[bounce_2s_ease-in-out_infinite]">
                <CheckCircle 
                  className="h-12 w-12 text-amber-600" 
                  aria-hidden="true"
                />
              </div>
            </div>
            
            {/* En-tête avec titre et description */}
            <DialogHeader className="text-center space-y-4 pt-6">
              <DialogTitle 
                id="success-dialog-title"
                className="text-2xl font-bold text-center text-gray-800"
              >
                {type} réussie !
              </DialogTitle>
              <DialogDescription 
                id="success-dialog-description"
                className="text-gray-700 text-center text-base leading-relaxed"
              >
                Vous êtes maintenant connecté à votre compte.
                <br />
                Vous allez être redirigé vers la page d&apos;accueil...
              </DialogDescription>
            </DialogHeader>

            {/* Barre de progression animée */}
            <div 
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={showModal ? 100 : 0}
              className="w-full h-2 bg-gray-100 rounded-full mt-6 overflow-hidden border border-gray-200"
            >
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-3000 ease-in-out"
                style={{
                  width: showModal ? '100%' : '0%',
                  transition: 'width 3s linear'
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

SuccessModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.string,
};

SuccessModal.defaultProps = {
  message: null,
};

export default SuccessModal;