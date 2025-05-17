import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Star, MessageSquare, Instagram } from 'lucide-react';
import { useTestimonials, Testimonial, TextTestimonial, ScreenshotTestimonial } from '../../hooks/useTestimonials';

const Testimonials: React.FC = () => {
  const { testimonials, loading } = useTestimonials();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    initialInView: false
  });
  
  // Reset current slide when testimonials change
  useEffect(() => {
    if (testimonials.length > 0 && currentSlide >= testimonials.length) {
      setCurrentSlide(0);
    }
  }, [testimonials, currentSlide]);
  
  const nextSlide = () => {
    if (animating || testimonials.length <= 1) return;
    setAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setAnimating(false), 500);
  };
  
  const prevSlide = () => {
    if (animating || testimonials.length <= 1) return;
    setAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setAnimating(false), 500);
  };
  
  const handleDotClick = (index: number) => {
    if (animating || currentSlide === index) return;
    setAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setAnimating(false), 500);
  };

  const isTextTestimonial = (testimonial: Testimonial): testimonial is TextTestimonial => {
    return testimonial.type === 'text';
  };

  const isScreenshotTestimonial = (testimonial: Testimonial): testimonial is ScreenshotTestimonial => {
    return testimonial.type === 'screenshot';
  };

  // Variants pour les animations
  const slideVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.92, transition: { duration: 0.3 } }
  };
  
  return (
    <section ref={ref} className="py-20 bg-beige-100">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Ce que nos clients disent
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
            Découvrez les retours d'expérience de nos clients satisfaits.
          </motion.p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto relative">
            <div className="relative overflow-hidden rounded-xl shadow-lg bg-white">
              <AnimatePresence mode="wait">
                {testimonials.length > 0 && (
                  <motion.div
                    key={currentSlide}
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full p-1"
                  >
                    {isTextTestimonial(testimonials[currentSlide]) && (
                      <div className="p-6 md:p-8">
                        <div className="relative bg-beige-50 rounded-lg p-6 shadow-inner">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 flex flex-col items-center">
                              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
                                <img 
                                  src={testimonials[currentSlide].avatar || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                                  alt={testimonials[currentSlide].name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={15}
                                    className={i < testimonials[currentSlide].rating ? "text-rose-400 fill-rose-400" : "text-beige-300"}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="mb-4">
                                <h4 className="font-medium text-taupe-900 text-lg">{testimonials[currentSlide].name}</h4>
                                <p className="text-sm text-taupe-600">{testimonials[currentSlide].event}</p>
                              </div>
                              
                              <div className="relative bg-white p-5 rounded-lg shadow-sm">
                                <div className="absolute top-0 left-6 w-4 h-4 bg-white transform rotate-45 -translate-y-2"></div>
                                <p className="italic text-taupe-700 text-lg">"{(testimonials[currentSlide] as TextTestimonial).comment}"</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {isScreenshotTestimonial(testimonials[currentSlide]) && (
                      <div className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-6 bg-beige-50 p-4 md:p-6 rounded-lg">
                          <div className="flex-1">
                            <div className="mb-4 flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-taupe-900 text-lg">{testimonials[currentSlide].name}</h4>
                                <p className="text-sm text-taupe-600">{testimonials[currentSlide].event}</p>
                              </div>
                              <div className="flex items-center">
                                <div className="flex mr-2">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={i < testimonials[currentSlide].rating ? "text-rose-400 fill-rose-400" : "text-beige-300"}
                                    />
                                  ))}
                                </div>
                                <Instagram size={18} className="text-rose-400" />
                              </div>
                            </div>
                            
                            <div className="relative overflow-hidden rounded-lg border-4 border-white shadow-lg">
                              <img 
                                src={(testimonials[currentSlide] as ScreenshotTestimonial).imageUrl} 
                                alt={`Capture d'écran du témoignage de ${testimonials[currentSlide].name}`}
                                className="w-full h-auto"
                              />
                            </div>
                            
                            {(testimonials[currentSlide] as ScreenshotTestimonial).caption && (
                              <p className="text-sm text-taupe-500 italic mt-3 text-center">
                                {(testimonials[currentSlide] as ScreenshotTestimonial).caption}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {testimonials.length > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-medium p-3 hover:bg-beige-100 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  aria-label="Témoignage précédent"
                  disabled={animating}
                >
                  <ChevronLeft size={24} className="text-taupe-700" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-1/2 bg-white rounded-full shadow-medium p-3 hover:bg-beige-100 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  aria-label="Témoignage suivant"
                  disabled={animating}
                >
                  <ChevronRight size={24} className="text-taupe-700" />
                </button>
              </>
            )}
            
            {/* Pagination dots */}
            {testimonials.length > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentSlide ? 'bg-rose-400' : 'bg-beige-300 hover:bg-rose-200'
                    }`}
                    aria-label={`Aller au témoignage ${index + 1}`}
                    disabled={animating}
                  />
                ))}
              </div>
            )}
            
            <div className="text-center mt-8">
              <a
                href="https://www.instagram.com/naqi.creation/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium"
              >
                <MessageSquare size={18} className="mr-2" />
                Voir plus de témoignages sur notre Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;