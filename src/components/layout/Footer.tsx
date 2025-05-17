import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Package, Phone, Mail } from 'lucide-react';
import Logo from '../common/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-beige-100 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-1">
            <Logo className="h-16 w-auto mb-4" />
            <p className="text-taupe-700 mt-4">
              Des créations sur mesure pour vos moments inoubliables. Panneaux personnalisés pour mariages, fiançailles et tous types d'événements.
            </p>
            <div className="mt-6 flex items-center">
              <a 
                href="https://www.instagram.com/naqi.creation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-taupe-800 hover:text-rose-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} className="mr-2" />
                <span>@naqi.creation</span>
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-display font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-taupe-700 hover:text-rose-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/prestations" className="text-taupe-700 hover:text-rose-400 transition-colors">
                  Prestations
                </Link>
              </li>
              <li>
                <Link to="/personnalisation" className="text-taupe-700 hover:text-rose-400 transition-colors">
                  Personnalisation
                </Link>
              </li>
              <li>
                <Link to="/galerie" className="text-taupe-700 hover:text-rose-400 transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-taupe-700 hover:text-rose-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-rose-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-taupe-700">Nîmes et alentours</span>
              </li>
              <li className="flex items-start">
                <Package size={18} className="text-rose-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-taupe-700">Envois possibles partout en France</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="text-rose-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-taupe-700">06 XX XX XX XX</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-rose-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-taupe-700">contact@naqicreation.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-display font-semibold mb-4">Newsletter</h4>
            <p className="text-taupe-700 mb-4">
              Abonnez-vous pour recevoir nos actualités et promotions.
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="input-field text-sm" 
                required 
              />
              <button type="submit" className="btn-primary w-full">
                S'abonner
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-beige-200 mt-12 pt-8 text-center text-taupe-600">
          <p>&copy; {currentYear} Naqi Création. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;