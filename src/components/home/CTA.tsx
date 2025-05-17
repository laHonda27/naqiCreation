import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const CTA: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <section ref={ref} className="py-20 bg-taupe-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-rose-400"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-beige-300"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-display mb-6"
          >
            Prêt à créer un événement <span className="text-rose-300">inoubliable</span> ?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-beige-100 mb-8 max-w-2xl mx-auto"
          >
            Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé. Ensemble, créons des souvenirs qui resteront gravés dans vos mémoires.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/contact" className="btn-primary bg-rose-400 hover:bg-rose-500">
              Nous contacter
            </Link>
            <Link to="/galerie" className="btn bg-white text-taupe-800 hover:bg-beige-100">
              Voir nos réalisations
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;