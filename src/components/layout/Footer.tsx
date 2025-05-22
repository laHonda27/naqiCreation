import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin, Package } from 'lucide-react';
import Logo from '../common/Logo';
import { useContactInfo } from '../../hooks/useContactInfo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { contactInfo } = useContactInfo();
  
  return (
    <footer className="bg-beige-100 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-1">
            <Logo className="h-16 w-auto mb-4" />
            <p className="text-taupe-700 mt-4">
              Des créations sur mesure pour vos moments inoubliables. Panneaux personnalisés pour mariages, fiançailles et tous types d'événements.
            </p>

            {/* Social Media */}
            <div className="mb-6">
              <div className="flex space-x-3">
                {contactInfo.instagram && (
                  <a 
                    href={`https://www.instagram.com/${contactInfo.instagram}/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-rose-100 p-2 rounded-full hover:bg-rose-200 transition-colors flex items-center space-x-2 pr-4"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} className="text-rose-500" />
                    <span className="text-rose-500 font-medium">@{contactInfo.instagram}</span>
                  </a>
                )}
              </div>
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
                <Link to="/avis" className="text-taupe-700 hover:text-rose-400 transition-colors">
                  Avis
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
              {contactInfo.address && (
                <li className="flex items-start">
                  <MapPin size={18} className="text-rose-400 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-taupe-700">{contactInfo.address}</span>
                </li>
              )}
              <li className="flex items-start">
                <Package size={18} className="text-rose-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-taupe-700">Envois possibles partout en France</span>
              </li>
              {contactInfo.phone && contactInfo.showPhone && (
                <li className="flex items-start">
                  <Phone size={18} className="text-rose-400 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-taupe-700">{contactInfo.phone}</span>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-start">
                  <Mail size={18} className="text-rose-400 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-taupe-700">{contactInfo.email}</span>
                </li>
              )}
            </ul>
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