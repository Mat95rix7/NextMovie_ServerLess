import { useState, useEffect, useRef } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle } from 'lucide-react';
import emailjs from 'emailjs-com'

function ContactForm() {
  // Référence pour le formulaire
  const form = useRef();
  const [focused, setFocused] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const Public_Key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  const Service_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const Template_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

    // Initialiser EmailJS
    useEffect(() => {
      emailjs.init(Public_Key); // Remplacez par votre clé publique
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    emailjs.sendForm(Service_ID,Template_ID, form.current)
      .then(() => {
        console.log('SUCCESS!');
      }, (error) => {
        console.log('FAILED...', error);
      });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  
  return (
    <div className="w-full max-w-3xl mx-auto pt-20">
      <form 
        ref={form} 
        id="contact-form" 
        onSubmit={handleSubmit}
        className="space-y-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-amber-600 transform origin-left transition-transform duration-500 ease-in-out"
             style={{ transform: isSubmitted ? 'scaleX(1)' : 'scaleX(0)' }}>
          <div className="h-full w-full flex items-center justify-center">
            <CheckCircle className="text-white w-16 h-16" />
          </div>
        </div>

        <div className={`transition-opacity duration-600 ${isSubmitted ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="text-2xl font-bold text-amber-500 text-center mb-6">
            Contactez-nous
          </h2>
          
          <div className="space-y-6">
            <div className="relative">
              <label 
                className={`block text-sm font-medium transition-all duration-200 ${
                  focused === 'name' ? 'text-amber-800' : 'text-gray-700'
                }`}
              >
                Nom
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    focused === 'name' ? 'text-amber-600' : 'text-gray-400'
                  }`} />
                  <input 
                    type="text" 
                    name="user_name" 
                    required 
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    className="mt-1 block w-full rounded-lg border-gray-300 pl-12 
                      focus:border-amber-500 focus:ring-2 focus:ring-amber-500 
                      text-sm px-4 py-3 border transition-all duration-200
                      hover:border-amber-400 bg-white"
                    placeholder="Votre nom"
                  />
                </div>
              </label>
            </div>

            <div className="relative">
              <label 
                className={`block text-sm font-medium transition-all duration-200 ${
                  focused === 'email' ? 'text-amber-600' : 'text-gray-700'
                }`}
              >
                Email
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    focused === 'email' ? 'text-amber-800' : 'text-gray-400'
                  }`} />
                  <input 
                    type="email" 
                    name="user_email" 
                    required 
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    className="mt-1 block w-full rounded-lg border-gray-300 pl-12
                      focus:border-amber-500 focus:ring-2 focus:ring-amber-500 
                      text-sm px-4 py-3 border transition-all duration-200
                      hover:border-amber-400 bg-white"
                    placeholder="votre@email.com"
                  />
                </div>
              </label>
            </div>

            <div className="relative">
              <label 
                className={`block text-sm font-medium transition-all duration-200 ${
                  focused === 'message' ? 'text-black' : 'text-gray-700'
                }`}
              >
                Message
                <div className="relative">
                  <MessageSquare className={`absolute left-3 top-[22px] w-5 h-5 transition-colors duration-200 ${
                    focused === 'message' ? 'text-amber-600' : 'text-gray-400'
                  }`} />
                  <textarea 
                    name="message" 
                    required 
                    rows="5"
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused('')}
                    className="mt-1 block w-full rounded-lg border-gray-300 pl-12
                      focus:border-amber-500 focus:ring-2 focus:ring-amber-500 
                      text-sm px-4 py-3 border transition-all duration-200
                      hover:border-amber-400 resize-none bg-white"
                    placeholder="Votre message ici..."
                  />
                </div>
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg 
                text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-700
                hover:from-amber-300 hover:to-amber-800 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Envoyer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
