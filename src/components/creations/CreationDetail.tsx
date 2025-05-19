import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag, ChevronLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Creation } from '../../hooks/useCreations';

interface CreationDetailProps {
  creation: Creation;
  onClose: () => void;
  activeImage: string;
  setActiveImage: (image: string) => void;
  openLightbox: (images: {src: string, alt: string}[], index: number) => void;
}

const CreationDetail: React.FC<CreationDetailProps> = ({ 
  creation, 
  onClose, 
  activeImage, 
  setActiveImage,
  openLightbox
}) => {
  // Construire un tableau d'images pour la navigation
  const [allImages, setAllImages] = useState<{src: string, alt: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  
  // Initialiser le tableau d'images et trouver l'index de l'image active
  useEffect(() => {
    const images = [
      { src: creation.image, alt: creation.title },
      ...(creation.exampleImages || [])
    ];
    setAllImages(images);
    
    // Trouver l'index de l'image active
    const index = images.findIndex(img => img.src === activeImage);
    setCurrentIndex(index >= 0 ? index : 0);
  }, [creation, activeImage]);
  
  // Navigation entre les images
  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(newIndex);
    setActiveImage(allImages[newIndex].src);
  };
  
  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIndex = (currentIndex + 1) % allImages.length;
    setCurrentIndex(newIndex);
    setActiveImage(allImages[newIndex].src);
  };
  
  // Gestion du clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allImages]);
  
  // Ouvrir la lightbox personnalisée
  const handleOpenLightbox = () => {
    openLightbox(allImages, currentIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-16"
    >
      {/* Fil d'Ariane */}
      <div className="flex items-center mb-8 text-sm">
        <button 
          onClick={onClose}
          className="text-taupe-600 hover:text-rose-400 transition-colors"
        >
          Nos créations
        </button>
        <ChevronRight size={16} className="mx-2 text-taupe-400" />
        <span className="text-taupe-800 font-medium">{creation.title}</span>
      </div>
      
      {/* Détails de la création - Nouvelle structure verticale */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        {/* En-tête avec titre et prix */}
        <div className="p-6 md:p-8 border-b border-beige-100">
          <h2 className="text-3xl font-display font-semibold mb-2">{creation.title}</h2>
          <p className="text-rose-500 text-xl font-medium">
            {creation.customPrice 
              ? creation.customPrice 
              : creation.price !== undefined 
                ? `À partir de ${creation.price}€` 
                : 'Nous consulter'}
          </p>
        </div>

        {/* Image principale - Mise en avant avec navigation */}
        <div className="p-6 md:p-8 bg-beige-50 relative">
          <div 
            className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg mb-4 cursor-pointer shadow-medium relative" 
            onClick={handleOpenLightbox}
          >
            {/* Conteneur d'image avec ajustement pour les images portrait */}
            <div className="w-full h-full flex items-center justify-center bg-beige-100">
              <img 
                src={activeImage} 
                alt={creation.title} 
                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
            {/* Boutons de navigation */}
            {allImages.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-taupe-900/40 hover:bg-taupe-900/60 p-2 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious(e);
                  }}
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-taupe-900/40 hover:bg-taupe-900/60 p-2 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext(e);
                  }}
                  aria-label="Image suivante"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          
          {/* Indicateur de position */}
          {allImages.length > 1 && (
            <div className="text-center text-sm text-taupe-600">
              Image {currentIndex + 1} sur {allImages.length}
            </div>
          )}
        </div>

        {/* Section des images d'exemple - Séparée clairement */}
        {allImages.length > 1 && (
          <div className="p-6 md:p-8 bg-white border-t border-b border-beige-100">
            <h3 className="text-xl font-display font-semibold mb-4 text-taupe-900 flex items-center">
              <span className="w-1.5 h-5 bg-rose-400 rounded-full mr-2"></span>
              Galerie d'exemples
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {allImages.map((image, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    idx === currentIndex ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-beige-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Mettre à jour l'image active et l'index
                    setCurrentIndex(idx);
                    setActiveImage(image.src);
                    // Ouvrir la lightbox avec l'image sélectionnée
                    openLightbox(allImages, idx);
                  }}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Description */}
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-display font-semibold mb-4 text-taupe-900 flex items-center">
            <span className="w-1.5 h-5 bg-rose-400 rounded-full mr-2"></span>
            Description
          </h3>
          <p className="text-taupe-600 leading-relaxed">{creation.description}</p>
        </div>

        {/* Caractéristiques */}
        <div className="p-6 md:p-8 bg-beige-50 border-t border-beige-100">
          <h3 className="text-xl font-display font-semibold mb-4 text-taupe-900 flex items-center">
            <span className="w-1.5 h-5 bg-rose-400 rounded-full mr-2"></span>
            Caractéristiques
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <p className="text-sm text-taupe-500 mb-1">Taille standard</p>
              <p className="font-medium">{creation.specifications.standardSize}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <p className="text-sm text-taupe-500 mb-1">Délai de réalisation</p>
              <p className="font-medium">{creation.specifications.deliveryTime}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <p className="text-sm text-taupe-500 mb-1">Matériau</p>
              <p className="font-medium">{creation.specifications.material}</p>
            </div>
          </div>
        </div>
        
        {/* Détails techniques */}
        {creation.technicalDetails && creation.technicalDetails.length > 0 && (
          <div className="p-6 md:p-8 border-t border-beige-100">
            <h3 className="text-xl font-display font-semibold mb-4 text-taupe-900 flex items-center">
              <span className="w-1.5 h-5 bg-rose-400 rounded-full mr-2"></span>
              Détails techniques
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creation.technicalDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start bg-white p-3 rounded-lg shadow-soft">
                  <ChevronRight size={16} className="text-rose-400 mt-1 mr-2 flex-shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Options de personnalisation */}
        {creation.customizationOptions && creation.customizationOptions.length > 0 && (
          <div className="p-6 md:p-8 bg-beige-50 border-t border-beige-100">
            <h3 className="text-xl font-display font-semibold mb-4 text-taupe-900 flex items-center">
              <span className="w-1.5 h-5 bg-rose-400 rounded-full mr-2"></span>
              Options de personnalisation
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creation.customizationOptions.map((option, idx) => (
                <li key={idx} className="flex items-start bg-white p-3 rounded-lg shadow-soft">
                  <ChevronRight size={16} className="text-rose-400 mt-1 mr-2 flex-shrink-0" />
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Informations complémentaires */}
        {creation.specifications.additionalInfo && creation.specifications.additionalInfo.length > 0 && (
          <div className="p-6 md:p-8 border-t border-beige-100">
            <h3 className="text-xl font-display font-semibold mb-4 text-taupe-900 flex items-center">
              <span className="w-1.5 h-5 bg-rose-400 rounded-full mr-2"></span>
              Informations complémentaires
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creation.specifications.additionalInfo.map((info, idx) => (
                <li key={idx} className="flex items-start bg-white p-3 rounded-lg shadow-soft">
                  <ChevronRight size={16} className="text-rose-400 mt-1 mr-2 flex-shrink-0" />
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Bouton d'action */}
        <div className="p-6 md:p-8 border-t border-beige-100 bg-white text-center">
          <Link 
            to="/contact" 
            className="btn-primary inline-flex items-center justify-center px-8 py-4"
          >
            <ShoppingBag size={18} className="mr-2" />
            Demander un devis
          </Link>
        </div>
      </div>
      
      {/* Processus de commande */}
      {creation.orderProcess && creation.orderProcess.length > 0 && (
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-semibold text-taupe-900">Notre processus de création</h3>
            <div className="w-20 h-1 bg-rose-300 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {creation.orderProcess.map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-soft text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-xl text-rose-500">{step.step}</span>
                </div>
                <h4 className="text-lg font-display font-semibold mb-2">{step.title}</h4>
                <p className="text-taupe-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreationDetail;
