import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCreations } from '../../hooks/useCreations';

const FeaturedCreations: React.FC = () => {
  const { creations, loading } = useCreations();
  const featuredCreations = creations.filter(creation => creation.featured).slice(0, 3);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Nos créations
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: '4rem' } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto h-1 bg-rose-300 mb-4"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="section-subtitle mx-auto"
          >
            Découvrez nos panneaux personnalisés et laissez-vous inspirer pour votre prochain événement.
          </motion.p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCreations.length > 0 ? (
              featuredCreations.map((creation, index) => (
                <motion.div
                  key={creation.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                  className="card group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={creation.image} 
                      alt={creation.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-semibold mb-2">{creation.title}</h3>
                    <p className="text-taupe-600 mb-4">{creation.description}</p>
                    <p className="text-rose-400 font-medium">
                      {creation.customPrice 
                        ? creation.customPrice 
                        : creation.price !== undefined 
                          ? `À partir de ${creation.price}€` 
                          : 'Nous consulter'}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-taupe-600">Aucune création en vedette pour le moment.</p>
              </div>
            )}
          </div>
        )}
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link to="/prestations" className="inline-flex items-center btn-secondary">
            Voir toutes nos créations
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCreations;