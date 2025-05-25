import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import FaqSection from '../components/common/FaqSection';
import { useTestimonials } from '../hooks/useTestimonials';
import { useCustomizations } from '../hooks/useCustomizations';
import { useServiceDetails, getIconComponent } from '../hooks/useServiceDetails';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { 
  Heart, 
  ChevronRight, 
  Instagram, 
  MessageCircle, 
  ArrowRight, 
  Star, 
  Sparkles,
  Send,
  Users,
  Clock,
  Award
} from 'lucide-react';

// Données pour le flux Instagram (simulées)
const instagramPosts = [
  {
    id: 'post1',
    imageUrl: 'https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: 124,
    caption: 'Panneau personnalisé pour le mariage de Sophie et Thomas #naqicreation #mariage',
    date: '2 jours'
  },
  {
    id: 'post2',
    imageUrl: 'https://images.pexels.com/photos/3171813/pexels-photo-3171813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: 98,
    caption: 'Nouvelle création pour une baby shower pastel #babyshower #naqicreation',
    date: '5 jours'
  },
  {
    id: 'post3',
    imageUrl: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: 156,
    caption: 'Panneau de bienvenue pour les fiançailles de Marie et Antoine #fiancailles',
    date: '1 semaine'
  },
  {
    id: 'post4',
    imageUrl: 'https://images.pexels.com/photos/3419728/pexels-photo-3419728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: 87,
    caption: 'Cartons d\'invitation élégants pour un anniversaire chic #anniversaire',
    date: '2 semaines'
  }
];

// Les témoignages sont maintenant chargés dynamiquement depuis le hook useTestimonials

// Les services sont maintenant chargés dynamiquement depuis le hook useServiceDetails

// Caractéristiques principales
const highlights = [
  { 
    icon: "", 
    title: "Artisanat français", 
    description: "Toutes nos créations sont fabriquées à la main en France, dans notre atelier parisien."
  },
  { 
    icon: "", 
    title: "Expertise reconnue", 
    description: "Notre expérience nous permet de sublimer vos événements avec des créations uniques et raffinées."
  },
  { 
    icon: "", 
    title: "Accompagnement complet", 
    description: "Nous suivons nos clients jusqu'au bout de leur projet pour garantir une satisfaction totale."
  }
];

// Hook pour récupérer les créations mises en avant
import { useFeaturedCreations } from '../hooks/useFeaturedCreations';

// Avantages de nos services
const advantages = [
  {
    icon: <Users />,
    title: "Service personnalisé",
    description: "Un accompagnement sur mesure du début à la fin de votre projet"
  },
  {
    icon: <Clock />,
    title: "Livraison rapide",
    description: "Production et expédition soignées pour respecter vos délais"
  },
  {
    icon: <Award />,
    title: "Qualité garantie",
    description: "Des matériaux premium et une finition irréprochable"
  }
];

const HomePage: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animating, setAnimating] = useState(false);
  
  // Récupération des témoignages depuis le hook
  const { testimonials } = useTestimonials();
  
  // Récupération des créations mises en avant
  const { featuredCreations, loading, error } = useFeaturedCreations();
  
  // Récupération des paramètres du site
  const { settings: siteSettings, loading: settingsLoading } = useSiteSettings();
  
  // Sélection des 5 témoignages les plus récents
  const recentTestimonials = useMemo(() => {
    if (!testimonials) return [];
    
    // Trier par date (du plus récent au plus ancien)
    return [...testimonials]
      .sort((a, b) => {
        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5); // Prendre les 5 premiers
  }, [testimonials]);

  // Options pour tous les useInView avec une valeur par défaut en cas de problème
  const inViewOptions = { triggerOnce: true, threshold: 0.1, initialInView: false };
  
  const [heroRef, heroInView] = useInView(inViewOptions);
  const [servicesRef, servicesInView] = useInView(inViewOptions);
  const [showcaseRef, showcaseInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Chargement des détails de service
  const { serviceDetails } = useServiceDetails();
  
  // Récupération des données de customization
  const { customItems } = useCustomizations();
  
  // Préparation des éléments à afficher dans la section "Des créations qui émerveillent"
  const showcaseCreations = useMemo(() => {
    // Filtrer les éléments avec featured=true
    const featuredItems = customItems.filter(item => item.featured);
    
    // Si nous avons au moins 3 éléments featured, prendre les 3 derniers
    if (featuredItems.length >= 3) {
      return featuredItems.slice(-3).map(item => ({
        id: item.id,
        title: item.title,
        image: item.images[0]?.src || 'https://images.pexels.com/photos/1024981/pexels-photo-1024981.jpeg',
        tag: 'POPULAIRE'
      }));
    } 
    // Sinon, prendre les 3 premiers éléments de la liste complète
    else {
      return customItems.slice(0, 3).map(item => ({
        id: item.id,
        title: item.title,
        image: item.images[0]?.src || 'https://images.pexels.com/photos/1024981/pexels-photo-1024981.jpeg',
        tag: item.featured ? 'POPULAIRE' : undefined
      }));
    }
  }, [customItems]);

  const [eventsRef, eventsInView] = useInView(inViewOptions);
  const [instagramRef, instagramInView] = useInView(inViewOptions);
  const [testimonialsRef, testimonialsInView] = useInView(inViewOptions);
  const [highlightsRef, highlightsInView] = useInView(inViewOptions);
  const [ctaRef, ctaInView] = useInView(inViewOptions);
  const [faqRef] = useInView(inViewOptions);
  
  // Forcer rafraîchissement des sections lors du retour sur la page
  useEffect(() => {
    // Petit délai pour s'assurer que le composant est complètement monté
    const timer = setTimeout(() => {
      // Forcer le recalcul de la visibilité des sections
      window.dispatchEvent(new Event('scroll'));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gestion des témoignages
  const testimonialVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  const nextTestimonial = () => {
    if (animating || !recentTestimonials.length) return;
    setAnimating(true);
    setCurrentTestimonial((prev) => (prev + 1) % recentTestimonials.length);
    setTimeout(() => setAnimating(false), 500);
  };
  
  const prevTestimonial = () => {
    if (animating || !recentTestimonials.length) return;
    setAnimating(true);
    setCurrentTestimonial((prev) => (prev - 1 + recentTestimonials.length) % recentTestimonials.length);
    setTimeout(() => setAnimating(false), 500);
  };
  
  return (
    <>
      <SEO 
        title="Naqi Création | Panneaux Personnalisés pour Événements" 
        description="Panneaux personnalisés pour mariages, fiançailles et événements. Créations sur mesure pour des moments inoubliables."
        keywords="panneaux personnalisés, décoration mariage, événements, création sur mesure, plexiglass, panneaux bienvenue"
        url="https://naqi-creation.com"
      />
      
      {/* Hero Section avec design asymétrique et moderne */}
      <section ref={heroRef} className="min-h-screen relative overflow-hidden bg-gradient-to-br from-beige-50 via-beige-100 to-beige-50">
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-1/3 h-screen bg-rose-100 opacity-30 rounded-bl-[300px]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-taupe-100 opacity-40 rounded-tr-[200px]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-[10%] w-24 h-24 bg-rose-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-40 right-[15%] w-40 h-40 bg-beige-300 rounded-full opacity-20"></div>
        </div>
        
        <div className="container-custom relative z-10 pt-36 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 lg:col-start-1 order-2 lg:order-1"
            >
              <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-rose-100 text-rose-500 rounded-full text-sm font-medium mb-2"
                >
                  Créations personnalisées pour chaque instant de bonheur
                </motion.span>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-4xl md:text-6xl font-display font-semibold !leading-tight"
                >
                  {siteSettings?.hero?.title ? (
                    <>
                      {siteSettings.hero.title.split(' moments ').length > 1 ? (
                        <>
                          {siteSettings.hero.title.split(' moments ')[0]} <span className="text-rose-400 relative">
                            moments
                            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 15" preserveAspectRatio="none">
                              <path d="M0,5 Q50,15 100,5" stroke="#f27a94" strokeWidth="3" fill="none" />
                            </svg>
                          </span> {siteSettings.hero.title.split(' moments ')[1]}
                        </>
                      ) : (
                        siteSettings.hero.title
                      )}
                    </>
                  ) : (
                    <>Sublimez vos <span className="text-rose-400 relative">
                      moments
                      <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 15" preserveAspectRatio="none">
                        <path d="M0,5 Q50,15 100,5" stroke="#f27a94" strokeWidth="3" fill="none" />
                      </svg>
                    </span> avec des créations uniques</>
                  )}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-lg text-taupe-700 mt-6"
                >
                  {siteSettings?.hero?.subtitle || 'Des panneaux et accessoires sur mesure pour rendre vos mariages, fiançailles et célébrations véritablement exceptionnels. Créations artisanales, designs uniques, souvenirs éternels.'}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="pt-8 flex flex-wrap gap-4"
                >
                  <Link 
                    to="/prestations" 
                    className="btn-primary px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] transition-all"
                  >
                    Découvrir nos créations
                  </Link>
                  <Link 
                    to="/galerie" 
                    className="btn-outline px-8 py-4 rounded-full hover:bg-white/50 transform hover:translate-y-[-2px] transition-all"
                  >
                    Voir notre galerie
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex items-center space-x-4 mt-8 pt-4"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <img 
                          src={`https://images.pexels.com/photos/${1987301 + item}/pexels-photo-${1987301 + item}.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1`} 
                          alt="Client heureux" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className="text-rose-400 fill-rose-400" />
                      ))}
                    </div>
                    <p className="text-sm text-taupe-600 mt-1">
                      Plus de <span className="font-medium">150</span> clients satisfaits
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <div className="lg:col-span-6 order-1 lg:order-2 relative min-h-[400px] lg:min-h-[600px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="absolute top-0 right-0 w-full h-full flex justify-center items-center"
              >
                <div className="relative shadow-2xl rounded-2xl overflow-hidden w-full max-w-lg transform rotate-1">
                  <img 
                    src={siteSettings?.hero?.useCustomImage && siteSettings.hero.customImageUrl 
                      ? siteSettings.hero.customImageUrl 
                      : "https://images.pexels.com/photos/6267516/pexels-photo-6267516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                    alt="Panneau personnalisé élégant" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 80, y: -40 }}
                animate={heroInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="absolute -bottom-8 -left-4 md:bottom-16 md:left-0 bg-white p-4 rounded-xl shadow-xl max-w-[200px] z-10 rotate-3"
              >
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className="text-rose-400 fill-rose-400" />
                  ))}
                </div>
                <p className="text-sm font-display italic">"Un travail exceptionnel ! Merci pour ce superbe panneau !"</p>
                <p className="text-xs text-taupe-600 mt-2">- Marie L.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -40, y: 60 }}
                animate={heroInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 1 }}
                className="hidden md:block absolute top-20 right-0 md:-right-8 bg-white p-3 rounded-lg shadow-xl -rotate-6"
              >
                <div className="flex items-center space-x-2">
                  <Heart className="text-rose-400" size={22} />
                  <span className="text-sm font-medium">249 J'aime</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce">
          <ChevronRight size={30} className="text-taupe-400 rotate-90" />
        </div>
      </section>
      
      {/* Section détaillée des services et prestations */}
      <section ref={servicesRef} className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full -translate-x-20 -translate-y-20 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-beige-50 rounded-full translate-x-[-30%] translate-y-[30%] opacity-80"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-beige-100 text-taupe-700 rounded-full text-sm font-medium mb-4">Nos prestations exclusives</span>
            <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
              Une gamme complète de <span className="relative text-rose-400">
                créations
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path d="M0,5 Q50,15 100,5" stroke="#f27a94" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-taupe-700 max-w-3xl mx-auto mt-4">
              Découvrez notre collection de panneaux personnalisés et accessoires assortis pour 
              sublimer tous vos événements, du mariage à l'anniversaire.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {serviceDetails.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-beige-100"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg">
                  {getIconComponent(service.iconType)}
                </div>
                <div className="pt-8 text-center">
                  <h3 className="text-2xl font-display font-semibold mb-4 text-taupe-900">{service.title}</h3>
                  <p className="text-taupe-700 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 mb-8 text-left">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-rose-400 mr-2 mt-1 text-xl">•</span>
                        <span className="text-taupe-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    to={service.link} 
                    className="inline-flex items-center font-medium text-rose-500 hover:text-rose-600"
                  >
                    <span>Découvrir</span>
                    <ChevronRight size={18} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-lg text-taupe-700 mb-6 max-w-3xl mx-auto">
              Chaque création est réalisée avec passion et savoir-faire pour garantir un résultat qui dépasse vos attentes.
              Nos matériaux premium et notre attention aux détails font toute la différence.
            </p>
            <Link 
              to="/prestations" 
              className="inline-flex items-center bg-taupe-800 text-white px-8 py-4 rounded-full hover:bg-taupe-700 transition-colors font-medium shadow-lg"
            >
              <span>Voir toutes nos prestations</span>
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Section des créations mises en avant */}
      <section ref={eventsRef} className="py-24 bg-beige-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={eventsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-rose-100 text-rose-500 rounded-full text-sm font-medium mb-4">Nos créations populaires</span>
            <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
              Des créations adaptées à chaque <span className="text-rose-400">événement</span>
            </h2>
            <p className="text-lg text-taupe-700 max-w-3xl mx-auto mt-4">
              Découvrez une sélection de nos créations les plus appréciées pour sublimer vos événements spéciaux.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredCreations.map((creation, idx) => (
              <motion.div
                key={creation.id}
                initial={{ opacity: 0, y: 30 }}
                animate={eventsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative overflow-hidden rounded-xl shadow-xl"
              >
                <div className="relative h-[28rem]">
                  <div className="absolute inset-0">
                    <img 
                      src={creation.image} 
                      alt={creation.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-display font-semibold mb-2 text-white">{creation.title}</h3>
                    <p className="text-white/90 mb-4">{creation.description}</p>
                    <Link 
                      to="/prestations" 
                      className="inline-flex items-center text-white border-b border-white/60 pb-1 self-start hover:border-white hover:text-white transition-colors"
                    >
                      <span>Découvrir</span>
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={eventsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 bg-white p-6 md:p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-display font-semibold mb-4 text-center">Pourquoi choisir nos créations personnalisées ?</h3>
            <p className="text-taupe-700 mb-8 text-center max-w-3xl mx-auto">
              Nos panneaux et accessoires apportent cette touche unique à votre événement, créant une ambiance mémorable et offrant 
              des souvenirs précieux à conserver. Chaque création est pensée pour refléter parfaitement le style et la personnalité des hôtes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advantages.map((advantage, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                    <div className="text-rose-500">{advantage.icon}</div>
                  </div>
                  <h4 className="font-medium text-taupe-900 mb-1">{advantage.title}</h4>
                  <p className="text-sm text-taupe-600">{advantage.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Section de mise en avant visuelle des créations */}
      <section ref={showcaseRef} className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showcaseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
              Des personnalisations <span className="relative text-rose-400">
                complémentaires
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path d="M0,5 Q50,15 100,5" stroke="#f27a94" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-taupe-700 max-w-3xl mx-auto mt-4">
              Découvrez nos options de personnalisation complémentaires pour rendre
              votre événement encore plus unique et mémorable.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseCreations.map((creation, idx) => (
              <motion.div
                key={creation.id}
                initial={{ opacity: 0, y: 30 }}
                animate={showcaseInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="group relative overflow-hidden rounded-xl shadow-xl"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={creation.image} 
                    alt={creation.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                
                {creation.tag && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rose-500 shadow-md">
                    {creation.tag}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <h3 className="text-white text-xl font-display font-semibold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                    {creation.title}
                  </h3>
                  <Link 
                    to="/personnalisation" 
                    className="inline-flex items-center text-white mt-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <span>Explorer</span>
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showcaseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link 
              to="/personnalisation" 
              className="inline-flex items-center px-8 py-4 bg-taupe-800 text-white rounded-full hover:bg-taupe-700 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] transition-all font-medium"
            >
              <span>Voir toutes nos personnalisations</span>
              <ChevronRight size={18} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Section points forts avec design moderne */}
      <section ref={highlightsRef} className="py-20 bg-beige-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={highlightsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="container-custom relative"
        >
          {/* Éléments décoratifs */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-rose-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-taupe-200 rounded-full opacity-20"></div>
          
          <div className="text-center relative z-10 mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={highlightsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-display font-semibold mb-4"
            >
              Ce qui nous <span className="text-rose-400">distingue</span>
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={highlightsInView ? { width: '120px' } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 bg-rose-300 mx-auto mb-6"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={highlightsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-display font-semibold mb-3 text-taupe-900">{item.title}</h3>
                <p className="text-taupe-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* Section témoignages sous forme de messages */}
      <section ref={testimonialsRef} className="py-20 bg-gradient-to-br from-rose-50 to-beige-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={testimonialsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="container-custom"
        >
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-display font-semibold mb-4"
            >
              Ce que nos clients <span className="text-rose-400">disent</span>
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={testimonialsInView ? { width: '120px' } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 bg-rose-300 mx-auto mb-6"
            />
            
            {/* Bouton pour voir tous les avis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <Link 
                to="/avis" 
                className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium px-6 py-3 rounded-full border border-rose-300 hover:border-rose-500 bg-white shadow-sm hover:shadow-md relative z-20"
              >
                <ArrowRight size={18} className="mr-2" />
                Voir tous nos avis clients
              </Link>
            </motion.div>
          </div>
          
          <div className="max-w-4xl mx-auto relative px-4">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-100/20 to-taupe-100/20 rounded-3xl transform -rotate-1"></div>
            

            
            <div className="relative bg-white rounded-2xl shadow-xl p-2 sm:p-4 overflow-hidden">
              {/* Style similaire à un chat message */}
              <div className="relative bg-rose-50 rounded-xl p-6 sm:p-8">
                <div className="absolute top-0 left-4 w-4 h-4 bg-rose-50 transform rotate-45 -translate-y-2"></div>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentTestimonial}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={testimonialVariants}
                    transition={{ duration: 0.4 }}
                    className={`flex flex-col ${recentTestimonials[currentTestimonial]?.type !== 'screenshot' ? 'md:flex-row md:items-start' : ''} gap-6`}
                  >
                    {recentTestimonials[currentTestimonial]?.type !== 'screenshot' ? (
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white">
                            <img 
                              src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(recentTestimonials[currentTestimonial]?.name || 'Client')} 
                              alt={recentTestimonials[currentTestimonial]?.name || 'Client'} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                        </div>
                      </div>
                    ) : null}
                    
                    {recentTestimonials[currentTestimonial]?.type === 'screenshot' ? (
                      <div className="w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-taupe-900">
                              {recentTestimonials[currentTestimonial]?.name || 'Client'}
                            </h3>
                            {recentTestimonials[currentTestimonial]?.event && (
                              <p className="text-sm text-taupe-600">
                                {recentTestimonials[currentTestimonial]?.event}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-taupe-500">
                            {recentTestimonials[currentTestimonial]?.dateAdded 
                              ? new Date(recentTestimonials[currentTestimonial]?.dateAdded).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long'}) 
                              : ''}
                          </div>
                        </div>
                        
                        <div className="mt-2 overflow-hidden rounded-lg shadow-sm">
                          <div className="max-h-[500px] overflow-hidden">
                            <img 
                              src={recentTestimonials[currentTestimonial]?.imageUrl} 
                              alt={recentTestimonials[currentTestimonial]?.name || 'Capture d\'écran'}
                              className="w-full h-auto object-contain max-h-[500px] mx-auto"
                            />
                          </div>
                        </div>
                        
                        {recentTestimonials[currentTestimonial]?.caption && (
                          <div className="mt-2 text-taupe-800 bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-lg">
                              {recentTestimonials[currentTestimonial]?.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-taupe-900">
                              {recentTestimonials[currentTestimonial]?.name || 'Client'}
                            </h3>
                            {recentTestimonials[currentTestimonial]?.event && (
                              <p className="text-sm text-taupe-600">
                                {recentTestimonials[currentTestimonial]?.event}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-taupe-500">
                            {recentTestimonials[currentTestimonial]?.dateAdded 
                              ? new Date(recentTestimonials[currentTestimonial]?.dateAdded).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long'}) 
                              : ''}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-taupe-800 bg-white p-4 rounded-lg rounded-tl-none shadow-sm">
                          <p className="text-lg">
                            {recentTestimonials[currentTestimonial]?.comment}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex justify-between items-center pt-4 px-4">
                <div className="flex items-center text-rose-400">
                  <MessageCircle size={20} className="mr-2" />
                  <span className="text-sm font-medium">Avis clients</span>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={prevTestimonial}
                    disabled={animating}
                    className="w-10 h-10 rounded-full bg-beige-100 hover:bg-beige-200 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={20} className="text-taupe-700 transform rotate-180" />
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    disabled={animating}
                    className="w-10 h-10 rounded-full bg-beige-100 hover:bg-beige-200 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={20} className="text-taupe-700" />
                  </button>
                </div>
              </div>
            </div>
            

            
            {/* Pagination dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {recentTestimonials.map((_, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!animating) {
                      setAnimating(true);
                      setCurrentTestimonial(idx);
                      setTimeout(() => setAnimating(false), 500);
                    }
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    idx === currentTestimonial ? 'bg-rose-400' : 'bg-beige-300'
                  }`}
                  aria-label={`Voir témoignage ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Section flux Instagram */}
      <section ref={instagramRef} className="py-20 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={instagramInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="container-custom"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={instagramInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-center mb-4"
              >
                <Instagram size={24} className="text-rose-500 mr-3" />
                <h2 className="text-2xl font-display font-semibold">@naqi.creation</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={instagramInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-taupe-600"
              >
                Suivez-nous sur Instagram pour plus d'inspiration et de créations
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={instagramInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <a 
                href="https://www.instagram.com/naqi.creation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-rose-500 hover:text-rose-600 font-medium"
              >
                <span>Nous suivre</span>
                <ArrowRight size={18} className="ml-2" />
              </a>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {instagramPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={instagramInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt="Instagram post" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <p className="text-white text-sm line-clamp-2">{post.caption}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-white">
                      <Heart size={16} className="mr-1" />
                      <span className="text-xs">{post.likes}</span>
                    </div>
                    <span className="text-xs text-white/80">{post.date}</span>
                  </div>
                </div>
                
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                    <Instagram size={16} className="text-rose-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* Section FAQ */}
      <section ref={faqRef} className="py-20 bg-white">
        <FaqSection 
          pageType="home" 
          title="Questions fréquentes" 
          subtitle="Retrouvez les réponses aux questions les plus courantes concernant nos créations personnalisées."
        />
      </section>
      
      {/* CTA Section moderne */}
      <section ref={ctaRef} className="py-24 bg-gradient-to-br from-taupe-900 to-taupe-800 relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-400 opacity-10 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-beige-300 opacity-10 rounded-full"></div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 0.03 } : {}}
            transition={{ duration: 1 }}
            className="absolute inset-0 blur-xl"
          >
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  opacity: Math.random() * 0.3,
                }}
              ></div>
            ))}
          </motion.div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={ctaInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8"
            >
              <Sparkles size={18} className="text-rose-300 mr-2" />
              <span className="text-beige-100 font-medium">Prêt à créer des souvenirs inoubliables ?</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-display font-semibold text-white mb-6"
            >
              Transformez vos <span className="text-rose-300">rêves</span> en <span className="text-rose-300">réalité</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-beige-100 mb-10"
            >
              Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link 
                to="/contact" 
                className="bg-rose-400 hover:bg-rose-500 text-white font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center transform hover:translate-y-[-2px]"
              >
                <Send size={18} className="mr-2" />
                Contactez-nous
              </Link>
              <Link 
                to="/personnalisation" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center transform hover:translate-y-[-2px]"
              >
                <span>Options de personnalisation</span>
                <ChevronRight size={18} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;