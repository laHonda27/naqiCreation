import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ShoppingBag, Instagram, Search, X } from 'lucide-react';
import { useCustomizations } from '../hooks/useCustomizations';
import FaqSection from '../components/common/FaqSection';
import SlidingPanel from '../components/common/SlidingPanel';

// Types for customization items
interface CustomizationImage {
  src: string;
  alt: string;
}

interface CustomItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price?: number;
  customPrice?: string;
  minQuantity: number;
  priceInfo: string;
  materials: string[];
  dimensions: string[];
  images: CustomizationImage[];
  examples: string[];
  featured: boolean;
}

const CustomizationPage: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  

  const { customItems } = useCustomizations();
  const [selectedItem, setSelectedItem] = useState<CustomItem | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // Nombre d'éléments par page
  
  // État pour la lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<{src: string, alt: string}[]>([]);
  
  // Sélectionner l'élément à partir du hash de l'URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && customItems.length > 0) {
      const item = customItems.find(item => item.id === hash);
      if (item) {
        openItemDetails(item);
      }
    }
  }, [customItems]);
  
  // Select an item to view details
  const openItemDetails = (item: CustomItem) => {
    setSelectedItem(item);
    setActiveImage(item.images[0].src);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset selected item
  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  // Ouvrir l'image dans le panneau
  const openImageInPanel = (imageSrc: string) => {
    setActiveImage(imageSrc);
  };
  
  // Ouvrir la lightbox
  const openLightbox = (images: CustomizationImage[], index: number) => {
    setLightboxImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Fermer la lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // Navigation dans la lightbox
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  };
  
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
  };
  
  // Filtrer les éléments en fonction de la recherche
  const filteredItems = useMemo(() => {
    let items = customItems;
    
    // Filtrer par recherche si une requête est présente
    if (searchQuery.trim()) {
      items = items.filter(item => {
        const query = searchQuery.toLowerCase().trim();
        return item.title.toLowerCase().includes(query) || 
               item.shortDescription.toLowerCase().includes(query) ||
               item.fullDescription.toLowerCase().includes(query);
      });
    }
    
    // Trier pour afficher les éléments en vedette en premier
    return [...items].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [customItems, searchQuery]);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  // Obtenir les éléments pour la page actuelle
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);
  
  return (
    <>
      <Helmet>
        <title>Personnalisation | Naqi Création</title>
        <meta 
          name="description" 
          content="Découvrez nos options de personnalisation complémentaires: étiquettes, flyers de remerciement, marque-places et cartons d'invitation." 
        />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-beige-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">Personnalisation complémentaire</h1>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
            <p className="text-lg text-taupe-600">
              Au-delà de nos panneaux, nous proposons une gamme complète d'options de personnalisation 
              pour rendre votre événement unique et mémorable.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content Area */}
      <section ref={ref} className="py-16">
        <div className="container-custom">
          <div className="mb-16">
            {/* Barre de recherche */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-taupe-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 border border-beige-200 rounded-lg focus:ring-rose-400 focus:border-rose-400 bg-beige-50 placeholder-taupe-400 text-taupe-800"
                  placeholder="Rechercher une personnalisation..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
                  }}
                />
                {searchQuery && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-taupe-400 hover:text-taupe-600"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-beige-100">
                <h2 className="text-xl font-display font-semibold text-taupe-900">Nos personnalisations</h2>
                <p className="text-sm text-taupe-600">
                  {filteredItems.length} option{filteredItems.length > 1 ? 's' : ''}
                </p>
              </div>
              
              {filteredItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-soft">
                  <p className="text-taupe-600 mb-4">Aucune personnalisation ne correspond à votre recherche.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors"
                  >
                    Réinitialiser la recherche
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {currentItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl flex flex-col h-full hover:-translate-y-2 transition-all duration-500 border border-beige-100 group"
                    >
                      <div className="relative h-80 overflow-hidden">
                        {item.featured && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md backdrop-blur-sm">
                              Populaire
                            </span>
                          </div>
                        )}
                        <img 
                          src={item.images[0].src} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col min-h-[200px]">
                        <h3 className="text-xl font-display font-semibold mb-3 line-clamp-1">{item.title}</h3>
                        <p className="text-taupe-600 text-sm mb-auto line-clamp-3 flex-1">{item.shortDescription}</p>
                        <div className="flex justify-between items-center mt-6 pt-5 border-t border-beige-200">
                          <p className="text-rose-500 font-medium text-sm">
                            {item.customPrice 
                              ? item.customPrice 
                              : item.price !== undefined 
                                ? `À partir de ${item.price}€` 
                                : 'Nous consulter'}
                          </p>
                          <button 
                            onClick={() => openItemDetails(item)}
                            className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center transition-colors"
                          >
                            Détails
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-beige-200 text-sm font-medium ${currentPage === 1 ? 'bg-beige-50 text-taupe-300 cursor-not-allowed' : 'bg-white text-taupe-600 hover:bg-beige-50'}`}
                    >
                      <span className="sr-only">Précédent</span>
                      <ChevronLeft size={16} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-beige-200 text-sm font-medium ${page === currentPage ? 'bg-rose-50 text-rose-500 border-rose-300 z-10' : 'bg-white text-taupe-600 hover:bg-beige-50'}`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-beige-200 text-sm font-medium ${currentPage === totalPages ? 'bg-beige-50 text-taupe-300 cursor-not-allowed' : 'bg-white text-taupe-600 hover:bg-beige-50'}`}
                    >
                      <span className="sr-only">Suivant</span>
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
          
          {/* Why Choose Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-taupe-900">
              Pourquoi nos personnalisations ?
            </h2>
            <div className="w-24 h-1 bg-rose-300 mx-auto mt-6"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-white rounded-2xl p-8 shadow-showcase overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 to-rose-400"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-rose-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 bg-rose-400 rounded-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4 text-taupe-900">
                  Qualité premium
                </h3>
                <p className="text-taupe-600 leading-relaxed">
                  Nous utilisons uniquement des matériaux de haute qualité pour garantir un résultat professionnel.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative bg-white rounded-2xl p-8 shadow-showcase overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 to-rose-400"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-rose-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 bg-rose-400 rounded-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4 text-taupe-900">
                  Design sur mesure
                </h3>
                <p className="text-taupe-600 leading-relaxed">
                  Chaque création est personnalisée selon vos envies et en harmonie avec le thème de votre événement.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative bg-white rounded-2xl p-8 shadow-showcase overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 to-rose-400"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-rose-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 bg-rose-400 rounded-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4 text-taupe-900">
                  Solution complète
                </h3>
                <p className="text-taupe-600 leading-relaxed">
                  De l'invitation au remerciement, nous vous proposons une gamme complète et cohérente de produits.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      

      {/* FAQ Section */}
      <FaqSection 
        pageType="customization" 
        title="Questions fréquentes sur nos personnalisations" 
        subtitle="Retrouvez les réponses à vos questions concernant nos services de personnalisation, délais et processus de création."
      />

      {/* Panneau latéral pour les détails */}
      <SlidingPanel
        isOpen={selectedItem !== null}
        onClose={closeItemDetails}
        title={selectedItem?.title}
      >
        {selectedItem && (
          <div className="p-6">
            {/* Prix - directement sous le titre avec marge négative */}
            <div className="-mt-4 mb-3">
              <p className="text-rose-500 text-xl font-medium">
                {selectedItem.customPrice 
                  ? selectedItem.customPrice 
                  : selectedItem.price !== undefined 
                    ? `À partir de ${selectedItem.price}€` 
                    : 'Nous consulter'}
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
                <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
                Description
              </h3>
              <p className="text-taupe-600 leading-relaxed">{selectedItem.fullDescription}</p>
            </div>

            {/* Section galerie avec titre */}
            <div className="mb-8">
              <h3 className="text-lg font-display font-semibold mb-4 text-taupe-900 flex items-center">
                <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
                Galerie
              </h3>
              
              {/* Image principale */}
              <div className="bg-beige-50 rounded-lg p-4 relative w-full">
                <div 
                  className="aspect-[3/2] md:aspect-[16/9] overflow-hidden rounded-lg mb-4 cursor-pointer shadow-sm relative"
                  onClick={() => openLightbox(selectedItem.images, selectedItem.images.findIndex(img => img.src === activeImage))}
                >
                  <div className="w-full h-full flex items-center justify-center bg-beige-100">
                    <img 
                      src={activeImage} 
                      alt={selectedItem.title} 
                      className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </div>
                
                {/* Miniatures avec meilleure séparation */}
                {selectedItem.images.length > 1 && (
                  <div className="flex flex-wrap justify-center gap-3 pt-2 pb-2">
                    {selectedItem.images.map((image, idx) => (
                      <div 
                        key={idx}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                          activeImage === image.src ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-beige-300'
                        }`}
                        onClick={() => openImageInPanel(image.src)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-beige-50 p-4 rounded-lg">
                <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
                  <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
                  Matériaux
                </h3>
                <div className="space-y-2">
                  {selectedItem.materials.map((material, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-soft">
                      <p className="text-taupe-600">{material}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-beige-50 p-4 rounded-lg">
                <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
                  <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
                  Dimensions
                </h3>
                <div className="space-y-2">
                  {selectedItem.dimensions.map((dimension, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-soft">
                      <p className="text-taupe-600">{dimension}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Exemples d'utilisation */}
            <div className="mb-8 bg-beige-50 p-4 rounded-lg">
              <h3 className="text-lg font-display font-semibold mb-3 text-taupe-900 flex items-center">
                <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
                Exemples d'utilisation
              </h3>
              <div className="space-y-2">
                {selectedItem.examples.map((example, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg shadow-soft">
                    <p className="text-taupe-600">{example}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/contact" 
                className="btn-primary inline-flex items-center justify-center px-6 py-3"
              >
                <ShoppingBag size={18} className="mr-2" />
                Demander un devis
              </Link>
              <a 
                href="https://www.instagram.com/naqi.creation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center justify-center px-6 py-3"
              >
                <Instagram size={18} className="mr-2" />
                Plus d'exemples
              </a>
            </div>
          </div>
        )}
      </SlidingPanel>
      
      {/* Lightbox pour les images */}
      <AnimatePresence>
        {lightboxOpen && lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
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
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={lightboxImages[currentImageIndex].src}
                alt={lightboxImages[currentImageIndex].alt}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Miniatures en bas */}
            {lightboxImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center overflow-x-auto px-4 py-2 space-x-2">
                {lightboxImages.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`w-16 h-16 rounded overflow-hidden flex-shrink-0 border-2 cursor-pointer
                      ${idx === currentImageIndex ? 'border-rose-400' : 'border-transparent'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                  >
                    <img 
                      src={img.src} 
                      alt={img.alt} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomizationPage;