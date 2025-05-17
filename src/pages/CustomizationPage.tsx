import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Plus, Minus, ChevronRight, ShoppingBag, Award, Image, Instagram } from 'lucide-react';
import customizationsData from '../data/customizations.json';

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
  price: number;
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
  
  const [secondRef, secondInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CustomItem | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Load data
  useEffect(() => {
    setCustomItems(customizationsData.customItems);
  }, []);
  
  // Select an item to view details
  const openItemDetails = (item: CustomItem) => {
    setSelectedItem(item);
    setActiveImage(item.images[0].src);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Open the image modal
  const openImageModal = (imageSrc: string) => {
    setActiveImage(imageSrc);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Close the image modal
  const closeImageModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // Reset selected item
  const closeItemDetails = () => {
    setSelectedItem(null);
  };
  
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
          {selectedItem ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-16"
            >
              {/* Breadcrumb */}
              <div className="flex items-center mb-8 text-sm">
                <button 
                  onClick={closeItemDetails}
                  className="text-taupe-600 hover:text-rose-400 transition-colors"
                >
                  Personnalisations
                </button>
                <ChevronRight size={16} className="mx-2 text-taupe-400" />
                <span className="text-taupe-800 font-medium">{selectedItem.title}</span>
              </div>
              
              {/* Product Detail */}
              <div className="bg-white rounded-xl shadow-medium overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Images */}
                  <div className="p-6 md:p-8">
                    <div className="aspect-square overflow-hidden rounded-lg mb-4 cursor-pointer" onClick={() => openImageModal(activeImage)}>
                      <img 
                        src={activeImage} 
                        alt={selectedItem.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    
                    {selectedItem.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedItem.images.map((image, idx) => (
                          <div 
                            key={idx}
                            className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                              activeImage === image.src ? 'border-rose-400' : 'border-transparent hover:border-beige-300'
                            }`}
                            onClick={() => setActiveImage(image.src)}
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
                  
                  {/* Info */}
                  <div className="p-6 md:p-8 bg-beige-50 flex flex-col">
                    <h2 className="text-3xl font-display font-semibold mb-3">{selectedItem.title}</h2>
                    <p className="text-rose-500 text-xl font-medium mb-6">
                      À partir de {selectedItem.price.toFixed(2)}€ <span className="text-taupe-600 text-sm font-normal">/ unité</span>
                    </p>
                    
                    <p className="text-taupe-700 mb-6">{selectedItem.fullDescription}</p>
                    
                    <div className="bg-white p-4 rounded-lg mb-6">
                      <p className="text-taupe-800 font-medium mb-2">Informations tarifaires :</p>
                      <p className="text-taupe-600 text-sm">{selectedItem.priceInfo}</p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="font-medium text-taupe-800 mb-2">Matériaux disponibles :</h3>
                        <ul className="text-taupe-600 space-y-1">
                          {selectedItem.materials.map((material, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2"></span>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-taupe-800 mb-2">Dimensions :</h3>
                        <ul className="text-taupe-600 space-y-1">
                          {selectedItem.dimensions.map((dimension, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2"></span>
                              {dimension}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-taupe-800 mb-2">Exemples d'utilisation :</h3>
                      <ul className="text-taupe-600 space-y-2">
                        {selectedItem.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <ChevronRight size={16} className="text-rose-400 mt-1 mr-2 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-auto flex flex-col sm:flex-row gap-4">
                      <Link 
                        to="/contact" 
                        className="btn-primary flex items-center justify-center"
                      >
                        <ShoppingBag size={18} className="mr-2" />
                        Demander un devis
                      </Link>
                      <a 
                        href="https://www.instagram.com/naqi.creation/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline flex items-center justify-center"
                      >
                        <Instagram size={18} className="mr-2" />
                        Voir plus d'exemples
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mb-16">
              <h2 className="text-3xl font-display font-semibold text-center mb-4">Nos options de personnalisation</h2>
              <div className="w-16 h-1 bg-rose-300 mx-auto mb-12"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {customItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                        src={item.images[0].src} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      {item.featured && (
                        <div className="absolute top-4 left-4 bg-rose-400 text-white text-xs font-medium px-3 py-1 rounded-full">
                          Populaire
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <button 
                          onClick={() => openItemDetails(item)}
                          className="w-full bg-white text-taupe-800 hover:bg-rose-400 hover:text-white font-medium py-2 rounded-md transition-colors duration-300"
                        >
                          Voir les détails
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-display font-semibold mb-2">{item.title}</h3>
                      <p className="text-taupe-600 mb-4 line-clamp-2">{item.shortDescription}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-rose-500 font-medium">À partir de {item.price.toFixed(2)}€</p>
                        <button 
                          onClick={() => openItemDetails(item)}
                          className="text-taupe-700 hover:text-rose-400 transition-colors flex items-center"
                        >
                          <span className="mr-1">Détails</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Why Choose Us Section - Styled like the Services page */}
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
      
      {/* Process Section */}
      <section ref={secondRef} className="py-12 bg-beige-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Notre processus de personnalisation</h2>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
            <p className="section-subtitle mx-auto">
              De l'idée à la réalisation, découvrez comment nous travaillons pour créer vos éléments personnalisés.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={secondInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-soft text-center"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-2xl text-rose-500">1</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Consultation</h3>
              <p className="text-taupe-600">
                Nous discutons de vos besoins et préférences pour comprendre votre vision.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={secondInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-soft text-center"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-2xl text-rose-500">2</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Proposition</h3>
              <p className="text-taupe-600">
                Nous vous présentons des designs et options adaptés à votre événement.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={secondInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-soft text-center"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-2xl text-rose-500">3</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Création</h3>
              <p className="text-taupe-600">
                Nous réalisons vos créations personnalisées avec soin et attention.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={secondInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-soft text-center"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-2xl text-rose-500">4</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Livraison</h3>
              <p className="text-taupe-600">
                Nous livrons vos créations dans les délais pour votre événement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Questions fréquentes</h2>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-soft">
                <h3 className="text-xl font-display font-semibold mb-2">Quels sont les délais pour les personnalisations ?</h3>
                <p className="text-taupe-600">
                  Nous recommandons de commander au moins 3 semaines avant votre événement pour garantir une livraison à temps. Pour les commandes urgentes, contactez-nous directement.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-soft">
                <h3 className="text-xl font-display font-semibold mb-2">Puis-je voir des échantillons avant de commander ?</h3>
                <p className="text-taupe-600">
                  Nous vous envoyons des maquettes numériques avant de réaliser vos créations pour validation. Pour certains produits, des échantillons physiques peuvent être disponibles sur demande.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-soft">
                <h3 className="text-xl font-display font-semibold mb-2">Quelles sont les options de livraison ?</h3>
                <p className="text-taupe-600">
                  Nous proposons la livraison sur Nîmes et alentours, ainsi que l'expédition partout en France. Les frais d'envoi dépendent du poids et de la taille des articles.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-soft">
                <h3 className="text-xl font-display font-semibold mb-2">Quelles sont les méthodes de paiement acceptées ?</h3>
                <p className="text-taupe-600">
                  Nous acceptons les paiements par virement bancaire, PayPal et espèces pour les livraisons en personne. Un acompte de 50% est demandé à la commande.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-rose-300 transition-colors"
            >
              Fermer
            </button>
            <img 
              src={activeImage} 
              alt="Vue agrandie" 
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomizationPage;
