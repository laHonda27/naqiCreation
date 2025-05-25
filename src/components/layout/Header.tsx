import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      // Utilisation d'un seuil plus bas pour les appareils mobiles
      const scrollThreshold = window.innerWidth < 768 ? 20 : 50;
      
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    // Vérifier la position initiale du défilement
    handleScroll();
    
    // Ajouter l'écouteur d'événement avec passive: true pour améliorer les performances sur mobile
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Vérifier à nouveau après un court délai pour s'assurer que la valeur est correcte
    const timer = setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [location.pathname]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);
  
  return (
    <header className={`fixed w-full z-40 transition-colors duration-300 ${
      isOpen ? 'bg-beige-50' : 
      isScrolled ? 'bg-beige-50/95 backdrop-blur-sm shadow-soft' : 'bg-transparent'
    } ${isScrolled ? 'py-3' : 'py-5'}`}>
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="relative z-50">
          <Logo className="h-14 w-auto" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={({ isActive }) => 
            `font-medium transition-colors hover:text-rose-400 ${isActive ? 'text-rose-500' : 'text-taupe-800'}`
          }>
            Accueil
          </NavLink>
          <NavLink to="/prestations" className={({ isActive }) => 
            `font-medium transition-colors hover:text-rose-400 ${isActive ? 'text-rose-500' : 'text-taupe-800'}`
          }>
            Prestations
          </NavLink>
          <NavLink to="/personnalisation" className={({ isActive }) => 
            `font-medium transition-colors hover:text-rose-400 ${isActive ? 'text-rose-500' : 'text-taupe-800'}`
          }>
            Personnalisation
          </NavLink>
          <NavLink to="/galerie" className={({ isActive }) => 
            `font-medium transition-colors hover:text-rose-400 ${isActive ? 'text-rose-500' : 'text-taupe-800'}`
          }>
            Galerie
          </NavLink>
          <NavLink to="/avis" className={({ isActive }) => 
            `font-medium transition-colors hover:text-rose-400 ${isActive ? 'text-rose-500' : 'text-taupe-800'}`
          }>
            Avis
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => 
            `font-medium transition-colors hover:text-rose-400 ${isActive ? 'text-rose-500' : 'text-taupe-800'}`
          }>
            Contact
          </NavLink>
          
          <a 
            href="https://www.instagram.com/naqi.creation/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-taupe-800 hover:text-rose-400 transition-colors"
          >
            <Instagram size={20} />
          </a>
        </nav>
        
        {/* Improved Mobile Menu Button */}
        <button 
          className={`md:hidden flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 z-50 relative ${
            isOpen 
              ? 'bg-rose-400 text-white shadow-md' 
              : isScrolled 
                ? 'bg-beige-200 hover:bg-beige-300 text-taupe-800' 
                : 'bg-beige-100 hover:bg-beige-200 text-taupe-800'
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <div className="w-6 h-6 flex flex-col items-center justify-center">
            <span 
              className={`block absolute h-0.5 w-6 bg-current rounded transition-all duration-300 ${
                isOpen ? 'rotate-45' : '-translate-y-2'
              }`}
            ></span>
            <span 
              className={`block absolute h-0.5 w-6 bg-current rounded transition-opacity duration-200 ${
                isOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span 
              className={`block absolute h-0.5 w-6 bg-current rounded transition-all duration-300 ${
                isOpen ? '-rotate-45' : 'translate-y-2'
              }`}
            ></span>
          </div>
        </button>
      </div>
      
      {/* Mobile Navigation - Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-beige-50 z-40 flex items-center justify-center md:hidden"
          >
            <motion.nav 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center space-y-6 w-full px-6"
            >
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `text-2xl font-medium py-3 transition-colors ${isActive ? 'text-rose-500' : 'text-taupe-800 hover:text-rose-400'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </NavLink>
              <NavLink 
                to="/prestations" 
                className={({ isActive }) => 
                  `text-2xl font-medium py-3 transition-colors ${isActive ? 'text-rose-500' : 'text-taupe-800 hover:text-rose-400'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Prestations
              </NavLink>
              <NavLink 
                to="/personnalisation" 
                className={({ isActive }) => 
                  `text-2xl font-medium py-3 transition-colors ${isActive ? 'text-rose-500' : 'text-taupe-800 hover:text-rose-400'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Personnalisation
              </NavLink>
              <NavLink 
                to="/galerie" 
                className={({ isActive }) => 
                  `text-2xl font-medium py-3 transition-colors ${isActive ? 'text-rose-500' : 'text-taupe-800 hover:text-rose-400'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Galerie
              </NavLink>
              <NavLink 
                to="/avis" 
                className={({ isActive }) => 
                  `text-2xl font-medium py-3 transition-colors ${isActive ? 'text-rose-500' : 'text-taupe-800 hover:text-rose-400'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Avis
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `text-2xl font-medium py-3 transition-colors ${isActive ? 'text-rose-500' : 'text-taupe-800 hover:text-rose-400'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Contact
              </NavLink>
              
              <a 
                href="https://www.instagram.com/naqi.creation/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-taupe-800 hover:text-rose-400 transition-colors mt-8 py-3"
              >
                <Instagram size={24} className="mr-2" />
                <span className="text-2xl">Instagram</span>
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;