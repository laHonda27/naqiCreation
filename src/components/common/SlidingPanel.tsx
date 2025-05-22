import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title
}) => {
  // Empêcher le défilement du body quand le panneau est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Gérer la fermeture avec la touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay semi-transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-taupe-900/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Panneau latéral - Conteneur principal sans arrondi */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-4/5 md:w-3/5 lg:w-1/2 overflow-hidden"
          >
            {/* Conteneur interne avec défilement */}
            <div className="absolute inset-0 bg-white shadow-xl flex flex-col">
              {/* En-tête du panneau - fixe */}
              <div className="flex-shrink-0 bg-white z-10 border-b border-beige-100 flex items-center justify-between p-4">
                {title && (
                  <h2 className="text-xl font-display font-semibold text-taupe-900">{title}</h2>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-beige-100 transition-colors ml-auto"
                  aria-label="Fermer"
                >
                  <X size={24} className="text-taupe-600" />
                </button>
              </div>
              
              {/* Contenu du panneau - défilant */}
              <div className="flex-grow overflow-y-auto p-4">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlidingPanel;
