import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { getUserByMail } from '../config/firebase';

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      return;
    }
    setIsLoading(true);
    setEmailError('');
    try {
      const auth = getAuth();
      const normalizedEmail = email.toLowerCase().trim();      
      const myUser = await getUserByMail(normalizedEmail)
      if (!myUser) {
        setEmailError("Aucun compte associé à cette adresse email.");
        setIsLoading(false);
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("Email de réinitialisation envoyé !");
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessages = {
        'auth/invalid-email': "Adresse email invalide",
        'auth/too-many-requests': "Trop de tentatives. Veuillez réessayer plus tard.",
        'auth/network-request-failed': "Erreur réseau. Vérifiez votre connexion.",
      };
      const errorMessage = errorMessages[error.code] || "Erreur lors de l'envoi de l'email de réinitialisation";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmailSent(false);
    setEmail('');
    setEmailError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent aria-describedby="password-reset-description" className="w-[90%] mx-auto max-w-sm sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg shadow-lg">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4"/>
        </button>

        <div className="p-6 bg-white/70 backdrop-blur-sm">
          {emailSent ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-amber-600">Email envoyé !</h2>
              <p className="text-gray-600">
                Un email de réinitialisation a été envoyé à {email}. 
                Veuillez vérifier votre boîte de réception et suivre les instructions.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Vous n&apos;avez pas reçu l&apos;email ?
                </p>
                <button
                  onClick={resetForm}
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Réessayer avec une autre adresse
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <DialogHeader className="text-center">
                <DialogTitle className="text-xl text-center font-semibold text-amber-600">
                  Réinitialisation du mot de passe
                </DialogTitle>
                <DialogDescription className="mt-2 text-center text-gray-600">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="Votre adresse email"
                  required
                  className="w-full p-4 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
                {emailError && (
                  <p className="text-sm text-center text-amber-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                    {emailError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className={`w-full px-6 py-3.5 rounded-xl font-medium transition-all duration-300
                  ${isLoading || !email 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-amber-600 hover:bg-amber-800 text-white'
                  }
                `}
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

ResetPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResetPasswordModal;