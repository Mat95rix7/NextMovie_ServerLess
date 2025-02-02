import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

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
      
      // Vérifier si l'email existe
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      if (signInMethods.length === 0) {
        setEmailError("Aucun compte associé à cette adresse email.");
        setIsLoading(false);
        return;
      }

      // Si l'email existe, envoyer l'email de réinitialisation
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("Email de réinitialisation envoyé !");
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = "Erreur lors de l'envoi de l'email";
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "Adresse email invalide";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
          break;
        default:
          errorMessage = "Erreur lors de l'envoi de l'email de réinitialisation";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
    setEmailError('');
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setIsLoading(false);
    setEmailError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
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
                  onClick={handleTryAgain}
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Réessayer avec une autre adresse
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-amber-600">
                  Réinitialisation du mot de passe
                </h2>
                <p className="mt-2 text-gray-600">
                  Entrez votre adresse email pour recevoir un lien de réinitialisation
                </p>
              </div>

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
                  <p className="text-sm text-amber-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
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
