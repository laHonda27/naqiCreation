import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCreations } from '../hooks/useCreations';
import { Plus, X, ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage: React.FC = () => {
  const { creations, categories, loading } = useCreations();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeCreation, setActiveCreation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'colors' | 'shapes'>('overview');
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    initialInView: false
  });
  
  const filteredCreations = activeCategory === 'all' 
    ? creations 
    : creations.filter(creation => creation.category === activeCategory);
  
  const toggleCreationDetails = (id: string) => {
    if (activeCreation === id) {
      setActiveCreation(null);
    } else {
      setActiveCreation(id);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsCategoryMenuOpen(false);
  };
  
  return (
    <>
      <Helmet>
        <title>Nos Prestations | Naqi Création</title>
        <meta 
          name="description" 
          content="Découvrez nos panneaux personnalisés pour mariage, fiançailles et tous types d'événements. Créations sur mesure réalisées avec passion." 
        />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-beige-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">Nos Prestations</h1>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
            <p className="text-lg text-taupe-600">
              Découvrez notre gamme de panneaux personnalisés pour tous vos événements.
              Chaque création est unique et réalisée avec passion pour sublimer vos moments spéciaux.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content with Sidebar Layout */}
      <section ref={ref} className="py-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Category Button */}
            {/* Fixed Filter Button */}
            <button
              onClick={() => setIsCategoryMenuOpen(true)}
              className="lg:hidden fixed bottom-6 right-6 z-30 bg-rose-400 text-white rounded-full shadow-lg px-6 py-3 hover:bg-rose-500 transition-colors"
            >
              <span className="font-medium">Filtrer</span>
            </button>

            {/* Mobile Category Sidebar */}
            <AnimatePresence>
              {isCategoryMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden overflow-hidden"
                    onClick={() => setIsCategoryMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white z-50 lg:hidden flex flex-col"
                  >
                    <div className="flex-shrink-0 bg-white border-b border-beige-200 p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-semibold text-taupe-900">Catégories</h2>
                        <button
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="p-2 hover:bg-beige-100 rounded-full transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="space-y-2">
                        {categories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category.id)}
                            className={`w-full text-left px-4 py-3 rounded-md transition-all duration-300 flex items-center relative ${
                              activeCategory === category.id
                                ? 'bg-rose-50 text-rose-500 font-medium'
                                : 'text-taupe-700 hover:bg-beige-50'
                            }`}
                          >
                            {activeCategory === category.id && (
                              <div className="w-1 absolute left-0 top-0 bottom-0 bg-rose-400 rounded-r-full"></div>
                            )}
                            <span>{category.name}</span>
                            {activeCategory === category.id && (
                              <ChevronRight size={18} className="ml-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Sidebar with Categories */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-white rounded-lg shadow-soft p-6 sticky top-24">
                <h2 className="text-xl font-display font-semibold mb-4 text-taupe-900">Catégories</h2>
                <div className="space-y-2 mb-4">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-md transition-all duration-300 flex items-center relative ${
                        activeCategory === category.id
                          ? 'bg-rose-50 text-rose-500 font-medium'
                          : 'text-taupe-700 hover:bg-beige-50'
                      }`}
                    >
                      {activeCategory === category.id && (
                        <div className="w-1 absolute left-0 top-0 bottom-0 bg-rose-400 rounded-r-full"></div>
                      )}
                      <span>{category.name}</span>
                      {activeCategory === category.id && (
                        <ChevronRight size={18} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Text summary of our services */}
                <div className="mt-8 p-4 bg-beige-50 rounded-lg">
                  <h3 className="font-medium text-taupe-800 mb-2">Nos engagements</h3>
                  <ul className="text-sm text-taupe-600 space-y-2">
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2">•</span>
                      <span>Création sur mesure pour des événements uniques</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2">•</span>
                      <span>Matériaux de qualité premium</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2">•</span>
                      <span>Délais respectés et service attentionné</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="lg:w-3/4">
              {/* Tabs for Product Details / Colors / Shapes */}
              <div className="mb-8 flex bg-white rounded-lg shadow-soft overflow-hidden">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 px-2 md:px-4 text-center transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-beige-100 text-taupe-900 font-medium' 
                      : 'bg-white text-taupe-600 hover:bg-beige-50'
                  }`}
                >
                  Nos créations
                </button>
                <button 
                  onClick={() => setActiveTab('colors')}
                  className={`flex-1 py-4 px-2 md:px-4 text-center transition-colors ${
                    activeTab === 'colors' 
                      ? 'bg-beige-100 text-taupe-900 font-medium' 
                      : 'bg-white text-taupe-600 hover:bg-beige-50'
                  }`}
                >
                  Nuancier de couleurs
                </button>
                <button 
                  onClick={() => setActiveTab('shapes')}
                  className={`flex-1 py-4 px-2 md:px-4 text-center transition-colors ${
                    activeTab === 'shapes' 
                      ? 'bg-beige-100 text-taupe-900 font-medium' 
                      : 'bg-white text-taupe-600 hover:bg-beige-50'
                  }`}
                >
                  Formes disponibles
                </button>
              </div>
              
              {/* Content for active tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Introduction text before the product list */}
                    <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
                      <h2 className="text-2xl font-display font-semibold mb-4">Des créations uniques pour vos moments précieux</h2>
                      <p className="text-taupe-700 mb-4">
                        Nos panneaux personnalisés sont conçus pour sublimer vos événements et créer des souvenirs inoubliables. 
                        Chaque création est réalisée avec passion et attention aux détails pour refléter parfaitement 
                        votre style et la thématique de votre célébration.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-beige-50 p-4 rounded-lg">
                          <h3 className="font-medium text-taupe-800 mb-2">Qualité exceptionnelle</h3>
                          <p className="text-sm text-taupe-600">
                            Nous utilisons du plexiglass de qualité supérieure pour garantir durabilité et élégance à votre panneau.
                          </p>
                        </div>
                        <div className="bg-beige-50 p-4 rounded-lg">
                          <h3 className="font-medium text-taupe-800 mb-2">Personnalisation totale</h3>
                          <p className="text-sm text-taupe-600">
                            Choisissez les formes, couleurs, textes et motifs qui correspondent à vos envies et à votre événement.
                          </p>
                        </div>
                        <div className="bg-beige-50 p-4 rounded-lg">
                          <h3 className="font-medium text-taupe-800 mb-2">Service sur mesure</h3>
                          <p className="text-sm text-taupe-600">
                            Nous vous accompagnons à chaque étape pour créer le panneau de vos rêves, du design à la livraison.
                          </p>
                        </div>
                      </div>
                    </div>
                  
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400"></div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {filteredCreations.length === 0 ? (
                          <div className="text-center py-12 bg-white rounded-lg shadow-soft">
                            <p className="text-lg text-taupe-600">
                              Aucune création ne correspond à cette catégorie pour le moment.
                            </p>
                          </div>
                        ) : (
                          filteredCreations.map((creation) => (
                            <div 
                              key={creation.id} 
                              className="bg-white rounded-lg shadow-soft overflow-hidden transition-all duration-300"
                            >
                              {/* Main Creation Card */}
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 h-64 md:h-auto">
                                  {creation.image ? (
                                    <img 
                                      src={creation.image.startsWith('http') 
                                        ? creation.image 
                                        : `https://raw.githubusercontent.com/laHonda27/naqiCreation/main/public${creation.image}`} 
                                      alt={creation.title} 
                                      className="w-full h-full object-cover" 
                                      onError={(e) => {
                                        // Fallback en cas d'erreur de chargement de l'image
                                        e.currentTarget.src = '/placeholder-image.jpg';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-beige-100">
                                      <span className="text-taupe-500">{creation.title}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="md:w-2/3 p-6 flex flex-col">
                                  <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="text-xl font-display font-semibold text-taupe-900">{creation.title}</h3>
                                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-beige-100 text-taupe-700">
                                        {categories.find(c => c.id === creation.category)?.name}
                                      </span>
                                    </div>
                                    <p className="text-taupe-600 mb-4">{creation.description}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                      <div className="bg-beige-50 p-3 rounded-md">
                                        <p className="text-xs text-taupe-600 mb-1">Taille standard</p>
                                        <p className="font-medium text-taupe-800">{creation.specifications?.standardSize}</p>
                                      </div>
                                      <div className="bg-beige-50 p-3 rounded-md">
                                        <p className="text-xs text-taupe-600 mb-1">Délai de réalisation</p>
                                        <p className="font-medium text-taupe-800">{creation.specifications?.deliveryTime}</p>
                                      </div>
                                      <div className="bg-beige-50 p-3 rounded-md">
                                        <p className="text-xs text-taupe-600 mb-1">Matériau</p>
                                        <p className="font-medium text-taupe-800">{creation.specifications?.material}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <p className="text-rose-500 font-medium text-lg">À partir de {(creation.price / 100).toFixed(2)}€</p>
                                    <button 
                                      onClick={() => toggleCreationDetails(creation.id)}
                                      className="inline-flex items-center text-taupe-800 font-medium hover:text-rose-500 transition-colors"
                                    >
                                      {activeCreation === creation.id ? (
                                        <>
                                          <X size={18} className="mr-1" />
                                          Fermer
                                        </>
                                      ) : (
                                        <>
                                          <Plus size={18} className="mr-1" />
                                          Détails
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Expanded Details */}
                              <AnimatePresence>
                                {activeCreation === creation.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-beige-200 overflow-hidden"
                                  >
                                    <div className="p-6 bg-beige-50">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                          <h4 className="text-lg font-display font-semibold mb-3">Détails techniques</h4>
                                          <ul className="space-y-3 text-taupe-700">
                                            {creation.technicalDetails?.map((detail, index) => (
                                              <li key={index} className="flex items-start">
                                                <span className="text-rose-400 mr-2">•</span>
                                                <p>{detail}</p>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-display font-semibold mb-3">Options de personnalisation</h4>
                                          <ul className="space-y-3 text-taupe-700">
                                            {creation.customizationOptions?.map((option, index) => (
                                              <li key={index} className="flex items-start">
                                                <span className="text-rose-400 mr-2">•</span>
                                                <p>{option}</p>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-6 pt-6 border-t border-beige-200">
                                        <h4 className="text-lg font-display font-semibold mb-3">Processus de commande</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                          {creation.orderProcess?.map((step) => (
                                            <div key={step.step} className="bg-white p-4 rounded-lg text-center">
                                              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="font-display text-lg text-rose-500">{step.step}</span>
                                              </div>
                                              <h5 className="font-medium text-taupe-800 mb-1">{step.title}</h5>
                                              <p className="text-sm text-taupe-600">{step.description}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      <div className="flex justify-center mt-8">
                                        <a href="/contact" className="btn-primary">
                                          Demander un devis personnalisé
                                        </a>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === 'colors' && (
                  <motion.div
                    key="colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-soft p-6 md:p-8"
                  >
                    <h2 className="text-2xl font-display font-semibold mb-6">Nuancier de couleurs</h2>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-display mb-4">Couleurs pour le fond du panneau</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#F5F2E6]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Beige</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#FFD4DC]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Rose bonbon</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#DEA5A4]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Rose pantone</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#722F37]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Bordeaux</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#00533E]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Vert émeraude</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#D0ECF7]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Bleu clair</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#97A595]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Vert sauge</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-white"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Blanc</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#E9ECF2] flex items-center justify-center">
                            <span className="text-taupe-500 text-sm">Transparent</span>
                          </div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Transparent</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#F0DC9E] bg-gradient-to-br from-[#F0DC9E] to-[#D2AF44]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Doré - effet miroir</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#E0E0E2] bg-gradient-to-br from-[#E0E0E2] to-[#AAACB1]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Argenté - effet miroir</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#D4D6D8] bg-opacity-50"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Givré</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-display mb-4">Couleurs pour les inscriptions</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#D2AF44]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Doré</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-white"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Blanc</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#C0C2C4]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800">Argenté</p>
                          </div>
                        </div>
                        <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                          <div className="h-24 bg-[#222222]"></div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-taupe-800 text-black">Noir</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-beige-200">
                      <p className="text-taupe-600 italic text-center">
                        Ces couleurs sont présentées à titre indicatif. De légères variations peuvent exister entre l'affichage à l'écran et le rendu final.
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'shapes' && (
                  <motion.div
                    key="shapes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-soft p-6 md:p-8"
                  >
                    <h2 className="text-2xl font-display font-semibold mb-6">Formes et tailles de plexiglass</h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-beige-50 p-4 rounded-lg text-center">
                        <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 rounded-t-[40px] flex items-center justify-center text-white font-medium">
                          <span>50x70 cm</span>
                        </div>
                        <p className="font-medium text-taupe-800">Arche orientale</p>
                      </div>
                      <div className="bg-beige-50 p-4 rounded-lg text-center">
                        <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 rounded-t-[100px] flex items-center justify-center text-white font-medium">
                          <span>50x70 cm</span>
                        </div>
                        <p className="font-medium text-taupe-800">Arche classique</p>
                      </div>
                      <div className="bg-beige-50 p-4 rounded-lg text-center">
                        <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 flex items-center justify-center text-white font-medium">
                          <span>50x70 cm</span>
                        </div>
                        <p className="font-medium text-taupe-800">Rectangle</p>
                      </div>
                      <div className="bg-beige-50 p-4 rounded-lg text-center">
                        <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 rounded-[100%] flex items-center justify-center text-white font-medium">
                          <span>50x70 cm</span>
                        </div>
                        <p className="font-medium text-taupe-800">Ovale</p>
                      </div>
                      <div className="bg-beige-50 p-4 rounded-lg text-center">
                        <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 rounded-[30px] flex items-center justify-center text-white font-medium">
                          <span>50x70 cm</span>
                        </div>
                        <p className="font-medium text-taupe-800">Nuage</p>
                      </div>
                      <div className="bg-beige-50 p-4 rounded-lg text-center">
                        <div className="aspect-[3/4] bg-taupe-300 mx-auto mb-3 flex items-center justify-center text-white font-medium">
                          <span>30x40 cm</span>
                        </div>
                        <p className="font-medium text-taupe-800">Rectangle (petit)</p>
                      </div>
                      <div className="bg-beige-50 p-4 rounded-lg text-center">
                        <div className="aspect-square bg-taupe-300 mx-auto mb-3 flex items-center justify-center text-white font-medium">
                          <span>50x50 cm</span>
                        </div>
                        <p className="font-medium text-taupe-800">Carré</p>
                      </div>
                      <div className="bg-beige-50 p-4 rounded-lg text-center">
                        <div className="aspect-square bg-taupe-300 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-medium">
                          <span>50x50 cm</span>
                        </div>
                        <p className="font-medium text-taupe-800">Cercle</p>
                      </div>
                    </div>
                    
                    <div className="bg-beige-100 p-6 rounded-lg">
                      <h3 className="text-lg font-display font-semibold mb-3">Informations importantes</h3>
                      <ul className="space-y-2 text-taupe-700">
                        <li className="flex items-start">
                          <span className="text-rose-400 mr-2">•</span>
                          <p>Les tailles indiquées sont standard, mais des dimensions personnalisées sont disponibles sur demande.</p>
                        </li>
                        <li className="flex items-start">
                          <span className="text-rose-400 mr-2">•</span>
                          <p>Toutes les formes sont réalisées dans du plexiglass de 3mm d'épaisseur pour garantir solidité et légèreté.</p>
                        </li>
                        <li className="flex items-start">
                          <span className="text-rose-400 mr-2">•</span>
                          <p>Chaque panneau est livré avec un support en bois adapté à sa forme.</p>
                        </li>
                        <li className="flex items-start">
                          <span className="text-rose-400 mr-2">•</span>
                          <p>Des formes sur mesure peuvent être réalisées selon vos besoins spécifiques (supplément possible).</p>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      
      {/* Important Information Banner */}
      <section className="py-12 bg-gradient-to-b from-white to-beige-50/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 relative overflow-hidden border-t-[3px] border-t-rose-400">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <p className="text-lg font-display font-medium text-taupe-900 mb-1">3 semaines</p>
                <p className="text-taupe-600">Commande à passer avant l'événement</p>
              </div>
            </div>
            <div className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 relative overflow-hidden border-t-[3px] border-t-rose-400">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <p className="text-lg font-display font-medium text-taupe-900 mb-1">Paiement facilité</p>
                <p className="text-taupe-600">Règlement possible en deux fois</p>
              </div>
            </div>
            <div className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 relative overflow-hidden border-t-[3px] border-t-rose-400">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <p className="text-lg font-display font-medium text-taupe-900 mb-1">Livraison locale</p>
                <p className="text-taupe-600">Sur Nîmes et ses alentours</p>
              </div>
            </div>
            <div className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 relative overflow-hidden border-t-[3px] border-t-rose-400">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <p className="text-lg font-display font-medium text-taupe-900 mb-1">Envoi national</p>
                <p className="text-taupe-600">Expédition dans toute la France</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Information */}
      <section className="py-16 bg-beige-50">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-display font-semibold text-taupe-900">
                Pourquoi choisir nos panneaux ?
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
                    Personnalisation totale
                  </h3>
                  <p className="text-taupe-600 leading-relaxed">
                    Chaque panneau est entièrement personnalisable selon vos goûts et les couleurs de votre événement.
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
                    Conseils d'experts
                  </h3>
                  <p className="text-taupe-600 leading-relaxed">
                    Nous vous guidons à chaque étape pour créer un panneau qui correspond parfaitement à vos attentes.
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
                    Qualité premium
                  </h3>
                  <p className="text-taupe-600 leading-relaxed">
                    Des matériaux de haute qualité et une finition soignée pour un résultat qui vous ravira.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 text-center"
            >
              <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-rose-400 text-white rounded-full font-medium hover:bg-rose-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Contactez-nous pour un devis
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
