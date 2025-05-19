import React from 'react';
import { Helmet } from 'react-helmet';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useTestimonials } from '../hooks/useTestimonials';
import TestimonialGrid from '../components/testimonials/TestimonialGrid';
import TestimonialStats from '../components/testimonials/TestimonialStats';

const TestimonialsPage: React.FC = () => {
  const { testimonials, loading } = useTestimonials();
  
  return (
    <>
      <Helmet>
        <title>Avis Clients | Naqi Création</title>
        <meta 
          name="description" 
          content="Découvrez les avis et témoignages de nos clients satisfaits. Panneaux personnalisés pour mariages, fiançailles et événements." 
        />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-beige-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">Avis de nos clients</h1>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
            <p className="text-lg text-taupe-600">
              Découvrez ce que nos clients pensent de nos créations personnalisées.
              Votre satisfaction est notre priorité.
            </p>
          </div>
        </div>
      </section>
      
      {/* Statistiques */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <TestimonialStats testimonials={testimonials} />
          )}
        </div>
      </section>
      
      {/* Grille de témoignages */}
      <section className="py-12 bg-beige-50">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-taupe-800 mb-4">
              Tous nos avis clients
            </h2>
            <p className="text-taupe-600">
              Découvrez les expériences de nos clients avec nos créations personnalisées.
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <TestimonialGrid testimonials={testimonials} />
          )}
        </div>
      </section>
      
      {/* Appel à l'action */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-rose-50 rounded-lg p-8 border border-rose-100 relative overflow-hidden">
              {/* Élément décoratif */}
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-rose-100 rounded-full opacity-50"></div>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-100 rounded-full opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <ThumbsUp size={32} className="text-rose-400" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-display font-semibold text-taupe-800 mb-3">
                      Vous appréciez nos créations ?
                    </h3>
                    <p className="text-taupe-600 mb-6">
                      Votre satisfaction est notre priorité ! Nous recueillons les avis de nos clients après chaque prestation 
                      pour vous offrir un aperçu authentique de notre travail.
                    </p>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-medium text-taupe-800 mb-4">
                        Comment sont collectés nos avis ?
                      </h4>
                      <p className="text-taupe-600 mb-4">
                        Tous nos avis sont recueillis directement auprès de nos clients après la livraison de leur commande. 
                        Nous les contactons personnellement pour connaître leur niveau de satisfaction et leurs retours.
                      </p>
                      <div className="flex justify-center md:justify-start">
                        <a 
                          href="/contact" 
                          className="btn-primary flex items-center"
                        >
                          <MessageSquare size={18} className="mr-2" />
                          Nous contacter
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsPage;
