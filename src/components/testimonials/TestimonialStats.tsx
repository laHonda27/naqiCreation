import React, { useMemo } from 'react';
import { Star, Users, BarChart3 } from 'lucide-react';
import { Testimonial } from '../../hooks/useTestimonials';
import { motion } from 'framer-motion';

interface TestimonialStatsProps {
  testimonials: Testimonial[];
  className?: string;
}

const TestimonialStats: React.FC<TestimonialStatsProps> = ({ testimonials, className = '' }) => {
  // Calculer les statistiques
  const stats = useMemo(() => {
    if (testimonials.length === 0) {
      return {
        averageRating: 0,
        totalCount: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
        textCount: 0,
        screenshotCount: 0
      };
    }
    
    // Note moyenne
    const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
    const averageRating = totalRating / testimonials.length;
    
    // Distribution des notes
    const ratingDistribution = [0, 0, 0, 0, 0]; // Index 0 = 1 étoile, index 4 = 5 étoiles
    testimonials.forEach(t => {
      if (t.rating >= 1 && t.rating <= 5) {
        ratingDistribution[t.rating - 1]++;
      }
    });
    
    // Nombre par type
    const textCount = testimonials.filter(t => t.type === 'text').length;
    const screenshotCount = testimonials.filter(t => t.type === 'screenshot').length;
    
    return {
      averageRating,
      totalCount: testimonials.length,
      ratingDistribution,
      textCount,
      screenshotCount
    };
  }, [testimonials]);
  
  // Trouver la valeur maximale pour la distribution des notes
  const maxRatingCount = Math.max(...stats.ratingDistribution);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-xl font-display font-semibold text-taupe-800 mb-6">Statistiques des avis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Note moyenne */}
        <motion.div 
          className="bg-beige-50 rounded-lg p-5 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-rose-400 mb-2">
            <Star size={40} className="fill-rose-400" />
          </div>
          <div className="text-3xl font-semibold text-taupe-800">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-taupe-600 mt-1">Note moyenne</div>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={16} 
                className={`${
                  star <= Math.round(stats.averageRating) 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
        </motion.div>
        
        {/* Nombre total d'avis */}
        <motion.div 
          className="bg-beige-50 rounded-lg p-5 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="text-rose-400 mb-2">
            <Users size={40} />
          </div>
          <div className="text-3xl font-semibold text-taupe-800">
            {stats.totalCount}
          </div>
          <div className="text-sm text-taupe-600 mt-1">Avis clients</div>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-taupe-600">
            <span>{stats.textCount} textuels</span>
            <span className="w-1 h-1 rounded-full bg-taupe-300"></span>
            <span>{stats.screenshotCount} avec images</span>
          </div>
        </motion.div>
        
        {/* Distribution des notes */}
        <motion.div 
          className="bg-beige-50 rounded-lg p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-3">
            <BarChart3 size={24} className="text-rose-400 mr-2" />
            <span className="text-sm font-medium text-taupe-700">Distribution des notes</span>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <div className="w-8 flex items-center">
                  <span className="text-xs font-medium text-taupe-700">{rating}</span>
                  <Star size={12} className="ml-1 text-amber-400" />
                </div>
                <div className="flex-1 h-4 bg-beige-200 rounded-full overflow-hidden ml-2">
                  <motion.div 
                    className="h-full bg-rose-400"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: maxRatingCount > 0 
                        ? `${(stats.ratingDistribution[rating - 1] / maxRatingCount) * 100}%` 
                        : '0%' 
                    }}
                    transition={{ duration: 0.8, delay: 0.3 + (5 - rating) * 0.1 }}
                  ></motion.div>
                </div>
                <div className="w-8 text-right text-xs text-taupe-600 ml-2">
                  {stats.ratingDistribution[rating - 1]}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialStats;
