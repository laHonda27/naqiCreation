import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Masonry from 'react-masonry-css';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  categories?: string[];
  className?: string;
}

const Gallery: React.FC<GalleryProps> = ({ images, categories = [], className = "" }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Filtrer les images par catégorie
  const filteredImages = activeCategory
    ? images.filter(image => image.category === activeCategory)
    : images;
  
  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imagesArray = activeCategory ? filteredImages : images;
    const newIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
    setCurrentIndex(newIndex);
    setSelectedImage(imagesArray[newIndex]);
  };
  
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imagesArray = activeCategory ? filteredImages : images;
    const newIndex = (currentIndex + 1) % imagesArray.length;
    setCurrentIndex(newIndex);
    setSelectedImage(imagesArray[newIndex]);
  };
  
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        const imagesArray = activeCategory ? filteredImages : images;
        const newIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
        setCurrentIndex(newIndex);
        setSelectedImage(imagesArray[newIndex]);
      } else if (e.key === 'ArrowRight') {
        const imagesArray = activeCategory ? filteredImages : images;
        const newIndex = (currentIndex + 1) % imagesArray.length;
        setCurrentIndex(newIndex);
        setSelectedImage(imagesArray[newIndex]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, images]);
  
  return (
    <>
      {categories.length > 0 && (
        <div className="filter-container mb-10">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-beige-100">
            <div className="mb-6">
              <h3 className="text-xl font-display font-semibold text-taupe-900 relative after:content-[''] after:absolute after:w-16 after:h-0.5 after:bg-rose-400 after:-bottom-3 after:left-0 mb-6">Filtrer par catégorie</h3>
            </div>
            
            <div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                    !activeCategory
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-white text-taupe-700 border border-beige-200 hover:border-rose-300'
                  }`}
                >
                  Tous
                </button>
                
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-white text-taupe-700 border border-beige-200 hover:border-rose-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-taupe-500 italic">
                  {activeCategory 
                    ? `${filteredImages.length} création${filteredImages.length > 1 ? 's' : ''} dans la catégorie "${activeCategory}"` 
                    : `Toutes les créations (${images.length})`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {filteredImages.length === 0 ? (
        <div className="text-center p-10 bg-beige-50 rounded-lg shadow-inner w-full min-h-[200px] flex items-center justify-center">
          <p className="text-taupe-700 text-lg">Aucune création trouvée dans cette catégorie.</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={{
            default: 3,
            1100: 3,
            700: 2,
            500: 1
          }}
          className={`masonry-grid ${className}`}
          columnClassName="masonry-grid_column"
        >
          {filteredImages.map((image: GalleryImage, index: number) => (
            <motion.div 
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4 overflow-hidden rounded-lg cursor-pointer relative group"
              onClick={() => openLightbox(image, index)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-taupe-900/0 md:group-hover:bg-taupe-900/40 bg-taupe-900/40 md:bg-taupe-900/0 transition-all duration-300 flex items-end justify-start p-4">
                <div className="text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-medium">{image.alt}</p>
                  {image.category && <p className="text-sm text-beige-100">{image.category}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      )}
      
      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fullscreen-overlay"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-4 right-4 z-10 text-white bg-taupe-900/40 hover:bg-taupe-900/60 p-2 rounded-full" 
              onClick={closeLightbox}
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
            
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-taupe-900/40 hover:bg-taupe-900/60 p-2 rounded-full"
              onClick={goToPrevious}
              aria-label="Image précédente"
            >
              <ChevronLeft size={30} />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-taupe-900/40 hover:bg-taupe-900/60 p-2 rounded-full"
              onClick={goToNext}
              aria-label="Image suivante"
            >
              <ChevronRight size={30} />
            </button>
            
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Thumbnails at bottom */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center overflow-x-auto px-4 py-2 space-x-2">
              {(activeCategory ? filteredImages : images).map((img, idx) => (
                <div 
                  key={img.id}
                  className={`w-16 h-16 rounded overflow-hidden flex-shrink-0 border-2 cursor-pointer
                    ${idx === currentIndex ? 'border-rose-400' : 'border-transparent'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    setSelectedImage(img);
                  }}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;