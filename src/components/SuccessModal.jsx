import PropTypes from 'prop-types';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ showModal, setShowModal, type}) => {

  return (
    <div className="space-y-4">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-white to-gray-50">
          <div className="relative">
            {/* Cercles décoratifs */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-100 rounded-full opacity-20" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-green-100 rounded-full opacity-20" />
            
            <div className="relative p-6">
              <div className="flex items-center justify-center">
                <div className="bg-green-100 p-4 rounded-full shadow-lg transform animate-bounce">
                  <CheckCircle className="h-12 w-12 text-amber-600" />
                </div>
              </div>
              
              <DialogHeader className="text-center space-y-4 pt-6">
                <DialogTitle className="text-2xl font-bold text-center text-gray-900">
                  { type } réussie!
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-centertext-base">
                  Vous êtes maintenant connecté à votre compte. 
                  <br />
                  Vous allez être redirigé vers la page d&apos;accueil...
                </DialogDescription>
              </DialogHeader>

              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-6 overflow-hidden">
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
    </div>
  );
};

SuccessModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default SuccessModal;
