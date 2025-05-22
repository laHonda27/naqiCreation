import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCreations } from '../hooks/useCreations';
import type { Creation } from '../hooks/useCreations';
import { X, ChevronRight, ChevronLeft, Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import FaqSection from '../components/common/FaqSection';
import SlidingCreationDetail from '../components/creations/SlidingCreationDetail';
import SlidingPanel from '../components/common/SlidingPanel';

const ServicesPage: React.FC = () => {
  const { creations, categories, loading } = useCreations();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc'>('default');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // Nombre d'éléments par page
  
  // État pour la vue détaillée
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(null);
  
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
        // Si aucun tri spécifique n'est sélectionné, mettre les éléments en vedette en premier
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
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
  
  // Réinitialiser la pagination lors de la recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);
  
  // Faire défiler vers le haut lors du changement de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);
  
  
  // Fermer les détails d'une création
  const closeCreationDetails = () => {
    setSelectedCreation(null);
  };
  
  // Ouvrir la lightbox pour les images d'exemple
  const handleOpenLightbox = (images: {src: string, alt: string}[], index: number) => {
    setLightboxImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };
  
  // Fermer la lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  // Navigation dans la lightbox
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };
  
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % lightboxImages.length);
  };
  
  // Gestion des touches clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => (prev + 1) % lightboxImages.length);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxImages.length]);
  
  // Gérer la sélection de catégorie
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Réinitialiser la pagination lors du changement de catégorie
  };
  
  return (
    <>
      <Helmet>
        <title>Nos prestations | Naqi Création</title>
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-beige-100">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-taupe-900 mb-4">
              Nos prestations
            </h1>
            <div className="w-24 h-1 bg-rose-300 mx-auto mb-6"></div>
            <p className="text-lg text-taupe-700">
              Découvrez notre gamme de créations personnalisées pour tous vos événements spéciaux.
              Chaque pièce est réalisée avec soin pour rendre votre moment inoubliable.
            </p>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16">
        <div className="container-custom max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400"></div>
              </div>
            ) : (
              <div>
                {/* Filtres et recherche */}
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-10 mb-6 border border-beige-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    <h2 className="text-2xl font-display font-semibold text-taupe-900 relative after:content-[''] after:absolute after:w-16 after:h-0.5 after:bg-rose-400 after:-bottom-3 after:left-0">
                      Filtres
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Barre de recherche */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-taupe-700 mb-2">Recherche</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Rechercher une création..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-md border border-beige-200 focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300 bg-beige-50/50"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-taupe-400" size={18} />
                        </div>
                      </div>
                      
                      {/* Sélecteur de tri */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-taupe-700 mb-2">Trier par</label>
                        <div className="relative">
                          <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as any)}
                            className="appearance-none w-full pl-4 pr-10 py-2.5 rounded-md border border-beige-200 focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300 bg-beige-50/50"
                          >
                            <option value="default">Tri par défaut</option>
                            <option value="price-asc">Prix croissant</option>
                            <option value="price-desc">Prix décroissant</option>
                            <option value="title-asc">Nom A-Z</option>
                            <option value="title-desc">Nom Z-A</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-taupe-500" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Filtres par catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-taupe-700 mb-3">Catégorie</label>
                    <div className="flex flex-wrap gap-3">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                            activeCategory === category.id
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'bg-white text-taupe-700 border border-beige-200 hover:border-rose-300'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Grille des créations */}
                {filteredCreations.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl shadow-soft">
                    <p className="text-taupe-600 mb-4">Aucune création ne correspond à votre recherche.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                        setSortOrder('default');
                      }}
                      className="px-4 py-2 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8 w-full">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-beige-100">
                        <h2 className="text-xl font-display font-semibold text-taupe-900">Nos créations</h2>
                        <p className="text-sm text-taupe-600">
                          {filteredCreations.length} résultat{filteredCreations.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" ref={ref}>
                        {filteredCreations
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((creation, index) => (
                      <motion.div
                        key={creation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl flex flex-col h-full hover:-translate-y-2 transition-all duration-500 border border-beige-100 group"
                      >
                        <div className="relative h-96 overflow-hidden">
                          {creation.featured && (
                            <div className="absolute top-3 right-3 z-10">
                              <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md backdrop-blur-sm">
                                En vedette
                              </span>
                            </div>
                          )}
                          <img
                            src={creation.image || (creation.exampleImages && creation.exampleImages.length > 0 ? creation.exampleImages[0].src : '/images/placeholder.jpg')}
                            alt={creation.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-10 pb-3 px-4">
                            <span className="inline-block bg-black/40 backdrop-blur-sm text-white font-medium text-sm px-3 py-1 rounded-md border-l-2 border-rose-400">
                              {categories.find(c => c.id === creation.category)?.name || 'Catégorie'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col min-h-[220px]">
                          <h3 className="text-xl font-display font-semibold mb-3 line-clamp-1">{creation.title}</h3>
                          <p className="text-taupe-600 text-sm mb-auto line-clamp-3 flex-1">{creation.description}</p>
                          <div className="flex justify-between items-center mt-6 pt-5 border-t border-beige-200">
                            <p className="text-rose-500 font-medium text-sm">
                              {creation.customPrice 
                                ? creation.customPrice 
                                : creation.price !== undefined 
                                  ? `À partir de ${creation.price}€` 
                                  : 'Nous consulter'}
                            </p>
                            <button 
                              onClick={() => setSelectedCreation(creation)}
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
                    </div>
                    
                    {/* Pagination */}
                    {filteredCreations.length > itemsPerPage && (
                      <div className="mt-10 flex justify-center">
                        <nav className="flex items-center space-x-2">
                          <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-md ${currentPage === 1 ? 'bg-beige-100 text-taupe-400 cursor-not-allowed' : 'bg-beige-100 text-taupe-700 hover:bg-beige-200'}`}
                            aria-label="Page précédente"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          
                          {Array.from({ length: Math.ceil(filteredCreations.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === page ? 'bg-rose-400 text-white' : 'bg-beige-100 text-taupe-700 hover:bg-beige-200'}`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredCreations.length / itemsPerPage)))}
                            disabled={currentPage === Math.ceil(filteredCreations.length / itemsPerPage)}
                            className={`px-3 py-2 rounded-md ${currentPage === Math.ceil(filteredCreations.length / itemsPerPage) ? 'bg-beige-100 text-taupe-400 cursor-not-allowed' : 'bg-beige-100 text-taupe-700 hover:bg-beige-200'}`}
                            aria-label="Page suivante"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
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

      {/* Section Informations Techniques - Complètement séparée des prestations */}
      <section className="py-6 bg-beige-50 mt-2">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-taupe-900">
                Informations techniques
              </h2>
              <div className="w-20 h-1 bg-rose-300 mx-auto mt-3"></div>
              <p className="text-taupe-600 mt-3 max-w-2xl mx-auto">
                Découvrez notre nuancier de couleurs et les différentes formes disponibles pour personnaliser votre création
              </p>
            </div>
            
            {/* Nuancier de couleurs - Simplifié */}
            <div className="mb-10">
              <h3 className="text-lg font-display font-semibold mb-3 text-center">Nuancier de couleurs</h3>
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                {/* Couleurs pour le fond du panneau */}
                <div className="mb-4">
                  <h4 className="text-lg font-display mb-3">Couleurs pour le fond du panneau</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Échantillons de couleurs */}
                    {["Beige", "Rose bonbon", "Rose pantone", "Bordeaux", "Vert émeraude", "Bleu clair", "Vert sauge", "Blanc", "Transparent", "Doré - effet miroir", "Argenté - effet miroir", "Givré"].map((color, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-sm border border-beige-100">
                        <div className={`h-16 ${index === 7 ? 'bg-white' : index === 8 ? 'bg-[#E9ECF2] flex items-center justify-center' : index === 9 ? 'bg-gradient-to-br from-[#F0DC9E] to-[#D2AF44]' : index === 10 ? 'bg-gradient-to-br from-[#E0E0E2] to-[#AAACB1]' : index === 0 ? 'bg-[#F5F2E6]' : index === 1 ? 'bg-[#FFD4DC]' : index === 2 ? 'bg-[#DEA5A4]' : index === 3 ? 'bg-[#722F37]' : index === 4 ? 'bg-[#00533E]' : index === 5 ? 'bg-[#D0ECF7]' : index === 6 ? 'bg-[#97A595]' : 'bg-[#D4D6D8] bg-opacity-50'}`}>
                          {index === 8 && <span className="text-taupe-500 text-sm">Transparent</span>}
                        </div>
                        <div className="p-2 text-center bg-white">
                          <p className="font-medium text-taupe-800 text-sm">{color}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Couleurs pour les inscriptions */}
                <div>
                  <h4 className="text-lg font-display mb-3">Couleurs pour les inscriptions</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["Doré", "Blanc", "Argenté", "Noir"].map((color, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-sm border border-beige-100">
                        <div className={`h-16 ${index === 0 ? 'bg-[#D2AF44]' : index === 1 ? 'bg-white' : index === 2 ? 'bg-[#C0C2C4]' : 'bg-[#222222]'}`}></div>
                        <div className="p-2 text-center bg-white">
                          <p className="font-medium text-taupe-800 text-sm">{color}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-beige-200">
                  <p className="text-taupe-600 italic text-center text-sm">
                    Ces couleurs sont présentées à titre indicatif. De légères variations peuvent exister entre l'affichage à l'écran et le rendu final.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Formes disponibles - Simplifié */}
            <div className="mb-10">
              <h3 className="text-lg font-display font-semibold mb-3 text-center">Formes disponibles</h3>
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { name: "Arche orientale", style: "rounded-t-[40px]" },
                    { name: "Arche classique", style: "rounded-t-[100px]" },
                    { name: "Rectangle", style: "" },
                    { name: "Ovale", style: "rounded-[100%]" },
                    { name: "Nuage", style: "rounded-[30px]" },
                    { name: "Rectangle (petit)", style: "", aspect: "aspect-[3/4]" },
                    { name: "Carré", style: "", aspect: "aspect-square" },
                    { name: "Cercle", style: "rounded-full", aspect: "aspect-square" }
                  ].map((shape, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-sm border border-beige-100 p-3 bg-beige-50">
                      <div className={`${shape.aspect || 'aspect-[4/5]'} bg-taupe-300 mx-auto mb-3 ${shape.style} flex items-center justify-center text-white font-medium text-sm`}>
                        <span>{index === 5 ? '30x40 cm' : index === 6 || index === 7 ? '50x50 cm' : '50x70 cm'}</span>
                      </div>
                      <p className="font-medium text-taupe-800 text-center text-sm">{shape.name}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-beige-100 p-4 rounded-lg">
                  <h4 className="text-lg font-display font-semibold mb-2">Informations importantes</h4>
                  <ul className="space-y-2 text-taupe-700 text-sm">
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2 flex-shrink-0">•</span>
                      <p>Les tailles indiquées sont standard, mais des dimensions personnalisées sont disponibles sur demande.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2 flex-shrink-0">•</span>
                      <p>Toutes les formes sont réalisées dans du plexiglass de 3mm d'épaisseur pour garantir solidité et légèreté.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2 flex-shrink-0">•</span>
                      <p>Chaque panneau est livré avec un support en bois adapté à sa forme.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2 flex-shrink-0">•</span>
                      <p>Des formes sur mesure peuvent être réalisées selon vos besoins spécifiques (supplément possible).</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bouton de contact */}
            <div className="mt-12 text-center">
              <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-rose-400 text-white rounded-full font-medium hover:bg-rose-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Contactez-nous pour un devis
              </Link>
            </div>
          </div>
        </div>
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

export default ServicesPage;
