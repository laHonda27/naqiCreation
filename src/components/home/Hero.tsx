import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useTestimonials } from '../../hooks/useTestimonials';
import { Star } from 'lucide-react';

const Hero: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Récupérer le témoignage mis en avant
  const { getFeaturedTestimonial } = useTestimonials();
  const featuredTestimonial = getFeaturedTestimonial();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };
  
  return (
    <section className="relative min-h-screen pt-24 pb-12 overflow-hidden flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-beige-50 opacity-90"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-beige-100 clip-path-slant opacity-50"></div>
      </div>
      
      <div className="container-custom relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="lg:pr-8"
          >
            <motion.div variants={itemVariants}>
              <h5 className="uppercase tracking-wider text-rose-400 font-medium mb-3">Naqi Création</h5>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 leading-tight"
            >
              Sublimez vos événements avec nos <span className="text-rose-400">panneaux personnalisés</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg text-taupe-700 mb-8 max-w-2xl"
            >
              Des créations sur mesure pour des moments inoubliables. Mariages, fiançailles, fêtes... Personnalisez vos événements avec élégance et originalité.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/prestations" className="btn-primary">
                Découvrir nos créations
              </Link>
              <Link to="/contact" className="btn-outline">
                Nous contacter
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:pl-8"
          >
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6267516/pexels-photo-6267516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Panneau personnalisé pour mariage" 
                className="rounded-lg shadow-showcase object-cover w-full h-[500px]" 
              />
              {featuredTestimonial ? (
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-medium max-w-[300px]">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center font-semibold mr-2">
                      {featuredTestimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-taupe-800">{featuredTestimonial.name}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < featuredTestimonial.rating ? "text-rose-400 fill-rose-400" : "text-beige-300"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {featuredTestimonial.type === 'text' && (
                    <p className="font-display italic text-sm text-taupe-800">
                      "{featuredTestimonial.comment}"
                    </p>
                  )}
                  {featuredTestimonial.type === 'screenshot' && featuredTestimonial.caption && (
                    <p className="font-display italic text-sm text-taupe-800">
                      "{featuredTestimonial.caption}"
                    </p>
                  )}
                  <p className="text-xs text-taupe-500 mt-2">Plus de 100 clients satisfaits</p>
                </div>
              ) : (
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-medium">
                  <p className="font-display italic text-lg text-taupe-800">
                    "Personnalisez à votre image !"
                  </p>
                  <p className="text-xs text-taupe-500 mt-2">Plus de 100 clients satisfaits</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;