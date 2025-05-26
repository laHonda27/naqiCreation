import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check, Send, AlertCircle, Instagram } from 'lucide-react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';

interface FormInputs {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setEmailError(null);
    setCaptchaError(null);

    // Vérifier si le captcha a été validé
    if (!captchaValue) {
      setCaptchaError('Veuillez confirmer que vous n\'êtes pas un robot');
      setIsSubmitting(false);
      return;
    }

    try {
      // Préparer les données supplémentaires pour le template
      const templateParams = {
        nom_complet: data.name,
        email: data.email,
        portable: data.phone || 'Non fourni',
        type_evenement: data.eventType,
        message: data.message,
        initiales: data.name.charAt(0).toUpperCase(),
        date: new Date().toLocaleDateString('fr-FR'),
        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        annee: new Date().getFullYear(),
        'g-recaptcha-response': captchaValue
      };

      // Envoyer l'email via EmailJS
      const response = await emailjs.send(
        'service_cb56cus', 
        'template_4womf8d',
        templateParams,
        '6xSU95yp9wK81yhxl'
      );

      console.log('Email envoyé avec succès:', response);
      setIsSubmitted(true);
      reset();
      setCaptchaValue(null);

      // Réinitialiser le captcha
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      setEmailError('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.');

      // Réinitialiser le captcha en cas d'erreur
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaValue(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialiser EmailJS
  React.useEffect(() => {
    emailjs.init('6xSU95yp9wK81yhxl');
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-medium p-6 md:p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute w-24 h-24 bg-rose-100 rounded-full -top-12 -right-12 opacity-50"></div>
      <div className="absolute w-16 h-16 bg-beige-200 rounded-full -bottom-8 -left-8 opacity-50"></div>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check size={28} className="text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-display font-semibold text-green-800 mb-2">Message envoyé !</h3>
          <p className="text-green-700 mb-4">
            Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
          </p>

          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <p className="text-taupe-600 text-sm mb-3">Pour une réponse plus rapide, n'hésitez pas à nous contacter sur Instagram :</p>
            <a 
              href="https://www.instagram.com/naqi.creation/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-rose-500 hover:text-rose-600 font-medium"
            >
              <Instagram size={18} className="mr-2" />
              @naqi.creation
            </a>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-rose-50 rounded-lg border-l-4 border-rose-400">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <AlertCircle size={18} className="text-rose-500" />
              </div>
              <div>
                <p className="text-rose-800 font-medium text-sm">Pour une réponse plus rapide</p>
                <p className="text-rose-700 text-sm">Contactez-nous directement sur Instagram :</p>
                <a 
                  href="https://www.instagram.com/naqi.creation/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-rose-500 hover:text-rose-600 mt-1 font-medium text-sm"
                >
                  <Instagram size={16} className="mr-1" />
                  @naqi.creation
                </a>
              </div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            {emailError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                {emailError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-taupe-800 font-medium mb-2">
                Nom complet *
              </label>
              <input
                id="name"
                type="text"
                className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-300' : 'border-beige-200 focus:border-rose-300 focus:ring-rose-200'}`}
                {...register('name', { required: 'Ce champ est requis' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-taupe-800 font-medium mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-300' : 'border-beige-200 focus:border-rose-300 focus:ring-rose-200'}`}
                  {...register('email', { 
                    required: 'Ce champ est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-taupe-800 font-medium mb-2">
                  Téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="input-field border-beige-200 focus:border-rose-300 focus:ring-rose-200"
                  {...register('phone')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="eventType" className="block text-taupe-800 font-medium mb-2">
                Type d'événement *
              </label>
              <select
                id="eventType"
                className={`input-field ${errors.eventType ? 'border-red-400 focus:ring-red-300' : 'border-beige-200 focus:border-rose-300 focus:ring-rose-200'}`}
                {...register('eventType', { required: 'Ce champ est requis' })}
              >
                <option value="">Sélectionnez un type d'événement</option>
                <option value="mariage">Mariage</option>
                <option value="fiançailles">Fiançailles</option>
                <option value="anniversaire">Anniversaire</option>
                <option value="baptême">Baptême</option>
                <option value="babyshower">Baby Shower</option>
                <option value="evjf">EVJF</option>
                <option value="autre">Autre événement</option>
              </select>
              {errors.eventType && (
                <p className="mt-1 text-sm text-red-500">{errors.eventType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-taupe-800 font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                rows={5}
                className={`input-field resize-none ${errors.message ? 'border-red-400 focus:ring-red-300' : 'border-beige-200 focus:border-rose-300 focus:ring-rose-200'}`}
                {...register('message', { required: 'Ce champ est requis' })}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LcOHEorAAAAAH0Uqyn0KoQVSJnwiO437crCgkEL"
                  onChange={(value) => {
                    setCaptchaValue(value);
                    setCaptchaError(null);
                  }}
                  onExpired={() => setCaptchaValue(null)}
                />
              </div>
              {captchaError && (
                <p className="mt-2 text-center text-sm text-red-500">{captchaError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full flex justify-center items-center py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Envoyer le message
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ContactForm;