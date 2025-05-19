import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Testimonial, ScreenshotTestimonial } from '../../hooks/useTestimonials';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, className = '' }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  
  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Générer les étoiles pour la note
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={`${index < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  // Générer un avatar par défaut si aucun n'est fourni
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Générer une couleur aléatoire mais cohérente basée sur le nom
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-rose-400', 'bg-pink-400', 'bg-fuchsia-400', 'bg-purple-400', 
      'bg-violet-400', 'bg-indigo-400', 'bg-blue-400', 'bg-cyan-400', 
      'bg-teal-400', 'bg-emerald-400', 'bg-green-400', 'bg-lime-400'
    ];
    
    // Utiliser la somme des codes de caractères comme seed
    const seed = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[seed % colors.length];
  };
  
  return (
    <>
      <motion.div 
        className={`bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-5 flex-1 flex flex-col">
          {/* En-tête du témoignage */}
          <div className="flex items-center mb-4">
            {testimonial.type === 'text' && testimonial.avatar ? (
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  // Fallback en cas d'erreur de chargement de l'image
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // On pourrait ajouter un élément de remplacement ici
                }}
              />
            ) : testimonial.type === 'text' ? (
              <div className={`w-12 h-12 rounded-full ${getAvatarColor(testimonial.name)} flex items-center justify-center text-white font-medium mr-4`}>
                {getInitials(testimonial.name)}
              </div>
            ) : null}
            
            <div className="flex-1">
              <h3 className="font-medium text-taupe-800">{testimonial.name}</h3>
              <div className="flex items-center text-sm text-taupe-500">
                <div className="flex mr-3">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="text-sm text-taupe-500">
                  {formatDate(testimonial.dateAdded)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Type d'événement - affiché uniquement s'il est renseigné */}
          {testimonial.event && testimonial.event.trim() !== '' && (
            <div className="mb-3">
              <span className="inline-block bg-beige-100 text-taupe-700 text-xs px-2 py-1 rounded">
                {testimonial.event}
              </span>
            </div>
          )}
          
          {/* Contenu du témoignage */}
          <div className="flex-1 flex flex-col">
            {testimonial.type === 'text' ? (
              <div className="text-taupe-700 mb-3 flex-1">
                <p>{testimonial.comment}</p>
              </div>
            ) : (
              <div className="mb-3 flex-1 flex flex-col">
                <div 
                  className="relative cursor-pointer rounded-lg overflow-hidden mb-3"
                  onClick={() => setShowFullImage(true)}
                >
                  <img 
                    src={testimonial.imageUrl} 
                    alt={testimonial.name} 
                    className="w-full h-auto rounded-lg object-cover max-h-64"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                    <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-xs opacity-0 hover:opacity-100 transition-opacity">
                      Agrandir
                    </span>
                  </div>
                </div>
                
                {/* Affichage de la légende après l'image */}
                {(testimonial as ScreenshotTestimonial).caption && (
                  <p className="text-taupe-700 text-sm italic mt-2">
                    {(testimonial as ScreenshotTestimonial).caption}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Modal pour afficher l'image en plein écran */}
      {testimonial.type === 'screenshot' && showFullImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full"
            onClick={() => setShowFullImage(false)}
          >
            <X size={24} />
          </button>
          <img 
            src={testimonial.imageUrl} 
            alt={testimonial.name} 
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default TestimonialCard;
