import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Package, Phone, Mail, Instagram } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';

const ContactPage: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <>
      <Helmet>
        <title>Contact | Naqi Création</title>
        <meta 
          name="description" 
          content="Contactez Naqi Création pour vos panneaux personnalisés. Basé à Nîmes avec envoi possible partout en France." 
        />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-beige-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">Contactez-nous</h1>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
            <p className="text-lg text-taupe-600">
              Vous avez un projet en tête ? Une question ? N'hésitez pas à nous contacter.
              Nous sommes là pour vous aider à créer des souvenirs inoubliables.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section ref={ref} className="py-16 bg-beige-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">Informations de contact</h2>
              <div className="divider mb-8"></div>
              
              <div className="space-y-6">
                {/* Instagram Card - Featured first with enhanced styling */}
                <div className="flex items-start bg-white p-6 rounded-lg shadow-soft border-2 border-rose-300 transition-transform hover:translate-y-[-5px] duration-300">
                  <div className="bg-rose-400 p-3 rounded-full mr-4">
                    <Instagram size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Instagram <span className="text-sm text-rose-500 font-normal">(Recommandé)</span></h3>
                    <a 
                      href="https://www.instagram.com/naqi.creation/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-rose-400 hover:text-rose-500 transition-colors font-medium"
                    >
                      @naqi.creation
                    </a>
                    <p className="text-taupe-600 mt-2 text-sm italic">Contactez-nous via Instagram pour une réponse plus rapide</p>
                    <a 
                      href="https://www.instagram.com/naqi.creation/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm bg-rose-50 text-rose-500 hover:bg-rose-100 px-3 py-1 rounded-full mt-3 transition-colors"
                    >
                      <Instagram size={14} className="mr-1" />
                      Nous suivre
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start bg-white p-6 rounded-lg shadow-soft transition-transform hover:translate-y-[-5px] duration-300">
                  <div className="bg-rose-100 p-3 rounded-full mr-4">
                    <MapPin size={24} className="text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Localisation</h3>
                    <p className="text-taupe-600">Nîmes et alentours</p>
                    <p className="text-taupe-600">Gard (30), France</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-white p-6 rounded-lg shadow-soft transition-transform hover:translate-y-[-5px] duration-300">
                  <div className="bg-rose-100 p-3 rounded-full mr-4">
                    <Package size={24} className="text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Livraison & Envoi</h3>
                    <p className="text-taupe-600">Livraison possible sur Nîmes et alentours</p>
                    <p className="text-taupe-600">Envoi possible partout en France</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-white p-6 rounded-lg shadow-soft transition-transform hover:translate-y-[-5px] duration-300">
                  <div className="bg-rose-100 p-3 rounded-full mr-4">
                    <Phone size={24} className="text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
                    <p className="text-taupe-600">06 XX XX XX XX</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-white p-6 rounded-lg shadow-soft transition-transform hover:translate-y-[-5px] duration-300">
                  <div className="bg-rose-100 p-3 rounded-full mr-4">
                    <Mail size={24} className="text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-taupe-600">contact@naqicreation.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">Envoyez-nous un message</h2>
              <div className="divider mb-8"></div>
              
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Questions fréquentes</h2>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-beige-50 p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300">
                <h3 className="text-xl font-display font-semibold mb-2">Comment passer commande ?</h3>
                <p className="text-taupe-600">
                  Pour passer commande, contactez-nous via le formulaire de contact, Instagram ou par email. Nous discuterons de votre projet et vous enverrons un devis personnalisé.
                </p>
              </div>
              
              <div className="bg-beige-50 p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300">
                <h3 className="text-xl font-display font-semibold mb-2">Quels sont les délais de réalisation ?</h3>
                <p className="text-taupe-600">
                  Nos délais de réalisation sont généralement de 2 à 3 semaines selon la complexité du projet. Nous vous recommandons de commander au moins 3 semaines avant votre événement.
                </p>
              </div>
              
              <div className="bg-beige-50 p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300">
                <h3 className="text-xl font-display font-semibold mb-2">Proposez-vous des modèles prédéfinis ?</h3>
                <p className="text-taupe-600">
                  Nous proposons des modèles prédéfinis que vous pouvez personnaliser selon vos goûts, mais nous pouvons également créer des designs entièrement sur mesure selon vos idées.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;