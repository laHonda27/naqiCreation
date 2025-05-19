import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCreations } from '../hooks/useCreations';
import type { Creation } from '../hooks/useCreations';
import { X, ChevronRight, ChevronLeft, Search, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import FaqSection from '../components/common/FaqSection';
import CreationDetail from '../components/creations/CreationDetail';
import SlidingCreationDetail from '../components/creations/SlidingCreationDetail';
import SlidingPanel from '../components/common/SlidingPanel';
import ColorPalette from '../components/creations/ColorPalette';
import AvailableShapes from '../components/creations/AvailableShapes';

const ServicesPage: React.FC = () => {
  const { creations, categories, loading } = useCreations();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc'>('default');
  
  // État pour la vue détaillée
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(null);
  const [activeDetailImage, setActiveDetailImage] = useState<string>('');
  
  // État pour la lightbox des images d'exemple
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<{src: string, alt: string}[]>([]);
  
  const [ref] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    initialInView: false
  });
  
  // Filtrer et trier les créations en fonction de la catégorie, de la recherche et du tri
  const filteredCreations = useMemo(() => {
    // D'abord, filtrer par catégorie
    const categoryFiltered = activeCategory === 'all' 
      ? creations 
      : creations.filter(creation => creation.category === activeCategory);
    
    // Ensuite, filtrer par recherche si une requête est présente
    const searchFiltered = !searchQuery.trim() 
      ? categoryFiltered 
      : categoryFiltered.filter(creation => {
          const query = searchQuery.toLowerCase().trim();
          return creation.title.toLowerCase().includes(query) || 
                 creation.description.toLowerCase().includes(query) ||
                 (creation.specifications?.material && creation.specifications.material.toLowerCase().includes(query));
        });
    
    // Enfin, appliquer le tri
    let sorted = [...searchFiltered];
    
    switch (sortOrder) {
      case 'price-asc':
        sorted.sort((a, b) => {
          if (a.price === undefined) return 1;
          if (b.price === undefined) return -1;
          return a.price - b.price;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          if (a.price === undefined) return 1;
          if (b.price === undefined) return -1;
          return b.price - a.price;
        });
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Conserver l'ordre par défaut
        break;
    }
    
    return sorted;
  }, [creations, activeCategory, searchQuery, sortOrder]);
  
  // Sélectionner la création à partir du hash de l'URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && creations.length > 0) {
      const creation = creations.find(creation => creation.id === hash);
      if (creation) {
        setSelectedCreation(creation);
      }
    }
  }, [creations]);
  
  // Mettre à jour le hash de l'URL quand une création est sélectionnée
  useEffect(() => {
    if (selectedCreation) {
      window.location.hash = selectedCreation.id;
    } else {
      // Effacer le hash si aucune création n'est sélectionnée
      if (window.location.hash) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  }, [selectedCreation]);
  
  // Ouvrir les détails d'une création
  const openCreationDetails = (creation: Creation) => {
    setSelectedCreation(creation);
    if (creation.exampleImages && creation.exampleImages.length > 0) {
      setActiveDetailImage(creation.exampleImages[0].src);
    } else {
      setActiveDetailImage(creation.image);
    }
    window.location.hash = creation.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Fermer les détails d'une création
  const closeCreationDetails = () => {
    setSelectedCreation(null);
  };
  
  // Ouvrir la lightbox pour les images d'exemple
  const handleOpenLightbox = (images: {src: string, alt: string}[], index: number) => {
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
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };
  
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };
  
  // Gestion des touches clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxImages.length]);
  
  // Gérer la sélection de catégorie
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
  return (
    <>
      <Helmet>
        <title>Nos Créations | Naqi Creation</title>
        <meta name="description" content="Découvrez notre gamme de créations personnalisées, conçues avec passion et savoir-faire artisanal." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-beige-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">Nos Créations</h1>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
            <p className="text-lg text-taupe-600">
              Découvrez notre gamme de créations personnalisées, conçues avec passion et savoir-faire artisanal.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content with Sidebar Layout */}
      <section ref={ref} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {(

            <div className="space-y-8">
              {/* Filtres et recherche - Style similaire aux témoignages */}
              <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold">Filtres</h2>
                  
                  <button 
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                      setSortOrder('default');
                    }}
                    className="text-sm text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
                  >
                    <ArrowUpDown size={14} />
                    Réinitialiser les filtres
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Filtre par catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-taupe-700 mb-2">
                      Catégorie
                    </label>
                    <div className="flex flex-wrap gap-2">
                     
                      {categories.filter(category => category.id !== 'tous').map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`py-2 px-3 rounded-md text-sm transition-all ${activeCategory === category.id 
                            ? 'bg-rose-400 text-white' 
                            : 'bg-white border border-beige-200 hover:bg-beige-100 text-taupe-700'}`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recherche */}
                  <div>
                    <label className="block text-sm font-medium text-taupe-700 mb-2">
                      Recherche
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-taupe-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher une création..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 py-2 w-full border border-beige-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-taupe-400 hover:text-taupe-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Tri */}
                  <div>
                    <label className="block text-sm font-medium text-taupe-700 mb-2">
                      Trier par
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-beige-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all"
                    >
                      <option value="default">Tri par défaut</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="title-asc">Ordre alphabétique</option>
                      <option value="title-desc">Ordre alphabétique inverse</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Résultats */}
              <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold">
                    {activeCategory === 'all' 
                      ? 'Toutes nos créations' 
                      : `Créations : ${categories.find(c => c.id === activeCategory)?.name || ''}`}
                    {searchQuery && <span className="text-taupe-500 text-base ml-2">contenant "{searchQuery}"</span>}
                  </h2>
                  <p className="text-sm text-taupe-500">{filteredCreations.length} résultat(s)</p>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400"></div>
                  </div>
                ) : filteredCreations.length === 0 ? (
                  <div className="text-center py-12 bg-beige-50 rounded-lg">
                    <p className="text-taupe-600">
                      {searchQuery 
                        ? `Aucune création ne correspond à votre recherche "${searchQuery}".` 
                        : 'Aucune création trouvée dans cette catégorie.'}
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory('all');
                        setSearchQuery('');
                      }}
                      className="mt-4 text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
                    {filteredCreations.map((creation, index) => (
                      <motion.div
                        key={creation.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.1,
                          ease: [0.43, 0.13, 0.23, 0.96] // Easing personnalisé pour une animation plus fluide
                        }}
                        whileHover={{ 
                          y: -8,
                          transition: { duration: 0.3 }
                        }}
                        className="bg-white rounded-xl shadow-medium overflow-hidden flex flex-col h-full transform transition-all duration-300"
                      >
                        <div 
                          className="aspect-square overflow-hidden cursor-pointer relative group" 
                          onClick={() => setSelectedCreation(creation)}
                        >
                          <img 
                            src={creation.image} 
                            alt={creation.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+non+disponible';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                            <span className="text-white font-medium text-sm bg-rose-500/80 py-1 px-3 rounded-full backdrop-blur-sm">
                              {categories.find(c => c.id === creation.category)?.name || 'Catégorie'}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-display font-semibold mb-2 line-clamp-1">{creation.title}</h3>
                          <p className="text-taupe-600 text-sm mb-5 line-clamp-2 flex-1">{creation.description}</p>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-beige-100">
                            <p className="font-medium text-rose-500">
                              {creation.customPrice 
                                ? creation.customPrice 
                                : creation.price !== undefined 
                                  ? `À partir de ${creation.price}€` 
                                  : 'Nous consulter'}
                            </p>
                            <button 
                              onClick={() => setSelectedCreation(creation)}
                              className="text-sm bg-rose-50 text-rose-500 hover:bg-rose-100 font-medium flex items-center py-1 px-3 rounded-full transition-colors"
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
                
                {/* Séparateur visuel */}
                <div className="my-16 border-t-2 border-beige-200 w-full max-w-4xl mx-auto"></div>
                
                {/* Informations techniques - Section distincte */}
                <section className="py-12 bg-beige-50 rounded-xl">
                  <div className="container-custom">
                    <div className="max-w-5xl mx-auto">
                      <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-display font-semibold text-taupe-900">
                          Informations techniques
                        </h2>
                        <div className="w-20 h-1 bg-rose-300 mx-auto mt-4"></div>
                        <p className="text-taupe-600 mt-4 max-w-2xl mx-auto">
                          Découvrez notre nuancier de couleurs et les différentes formes disponibles pour personnaliser votre création
                        </p>
                      </div>
                      
                      {/* Nuancier de couleurs */}
                      <div className="mb-12">
                        <h3 className="text-2xl font-display font-semibold mb-6 text-center">Nuancier de couleurs</h3>
                        <ColorPalette />
                      </div>
                      
                      {/* Formes disponibles */}
                      <div>
                        <h3 className="text-2xl font-display font-semibold mb-6 text-center">Formes disponibles</h3>
                        <AvailableShapes />
                      </div>
                    </div>
                  </div>
                </section>
                
                {/* Bouton de contact */}
                <div className="mt-12 text-center">
                  <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-rose-400 text-white rounded-full font-medium hover:bg-rose-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Contactez-nous pour un devis
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Panneau coulissant pour les détails de création */}
        <SlidingPanel 
          isOpen={selectedCreation !== null}
          onClose={closeCreationDetails}
          title={selectedCreation?.title}
        >
          {selectedCreation && (
            <SlidingCreationDetail
              creation={selectedCreation}
              onClose={closeCreationDetails}
              openLightbox={handleOpenLightbox}
            />
          )}
        </SlidingPanel>
      </section>

      {/* FAQ Section */}
      <FaqSection 
        pageType="services" 
        title="Questions fréquentes sur nos prestations" 
        subtitle="Retrouvez les réponses à vos questions concernant nos services, délais et processus de création."
      />
      
      {/* Lightbox pour les images d'exemple */}
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
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+non+disponible';
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

export default ServicesPage;
