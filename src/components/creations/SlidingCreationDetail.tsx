import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Creation } from '../../hooks/useCreations';

interface SlidingCreationDetailProps {
  creation: Creation;
  onClose: () => void;
  openLightbox: (images: {src: string, alt: string}[], index: number) => void;
}

const SlidingCreationDetail: React.FC<SlidingCreationDetailProps> = ({ 
  creation, 
  onClose,
  openLightbox
}) => {
  // État pour la gestion des images
  const [activeImage, setActiveImage] = useState<string>(creation.image);
  const [allImages, setAllImages] = useState<{src: string, alt: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Initialiser le tableau d'images
  useEffect(() => {
    const images = [
      { src: creation.image, alt: creation.title },
      ...(creation.exampleImages || [])
    ];
    setAllImages(images);
    setActiveImage(creation.image);
    setCurrentIndex(0);
  }, [creation]);
  
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
  
  // Ouvrir la lightbox
  const handleOpenLightbox = () => {
    openLightbox(allImages, currentIndex);
  };

  return (
    <div className="sliding-creation-detail">
      {/* En-tête avec prix */}
      <div className="mb-6">
        <p className="text-rose-500 text-xl font-medium">
          {creation.customPrice 
            ? creation.customPrice 
            : creation.price !== undefined 
              ? `À partir de ${creation.price}€` 
              : 'Nous consulter'}
        </p>
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
          <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
          Description
        </h3>
        <p className="text-taupe-600 leading-relaxed">{creation.description}</p>
      </div>

      {/* Section galerie avec titre */}
      <div className="mb-8">
        <h3 className="text-lg font-display font-semibold mb-4 text-taupe-900 flex items-center">
          <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
          Galerie
        </h3>
        
        {/* Image principale avec navigation - étirée en desktop */}
        <div className="bg-beige-50 rounded-lg p-4 relative w-full">
          <div 
            className="aspect-[3/2] md:aspect-[16/9] overflow-hidden rounded-lg mb-4 cursor-pointer shadow-sm relative" 
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-white bg-taupe-900/40 hover:bg-taupe-900/60 p-2 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious(e);
                  }}
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white bg-taupe-900/40 hover:bg-taupe-900/60 p-2 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext(e);
                  }}
                  aria-label="Image suivante"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          
          {/* Miniatures avec meilleure séparation */}
          {allImages.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 pt-2 pb-2">
              {allImages.map((image, idx) => (
                <div 
                  key={idx}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    idx === currentIndex ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-beige-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    setActiveImage(image.src);
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
          )}
        </div>
      </div>
      
      {/* Caractéristiques */}
      <div className="mb-6 bg-beige-50 p-4 rounded-lg">
        <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
          <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
          Caractéristiques
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-soft">
            <p className="text-sm text-taupe-500 mb-1">Taille standard</p>
            <p className="font-medium">{creation.specifications.standardSize}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-soft">
            <p className="text-sm text-taupe-500 mb-1">Délai de réalisation</p>
            <p className="font-medium">{creation.specifications.deliveryTime}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-soft">
            <p className="text-sm text-taupe-500 mb-1">Matériau</p>
            <p className="font-medium">{creation.specifications.material}</p>
          </div>
        </div>
      </div>
      
      {/* Détails techniques */}
      {creation.technicalDetails && creation.technicalDetails.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
            <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
            Détails techniques
          </h3>
          <ul className="space-y-2">
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
        <div className="mb-6 bg-beige-50 p-4 rounded-lg">
          <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
            <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
            Options de personnalisation
          </h3>
          <ul className="space-y-2">
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
        <div className="mb-6">
          <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
            <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
            Informations complémentaires
          </h3>
          <ul className="space-y-2">
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
      <div className="mt-8 text-center">
        <Link 
          to="/contact" 
          className="btn-primary inline-flex items-center justify-center px-6 py-3 w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Demander un devis
        </Link>
      </div>
    </div>
  );
};

export default SlidingCreationDetail;
