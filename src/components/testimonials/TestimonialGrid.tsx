import React, { useState, useEffect } from 'react';
import { Star, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../../hooks/useTestimonials';
import TestimonialCard from './TestimonialCard';
import Masonry from 'react-masonry-css';
import './TestimonialGrid.css';

interface TestimonialGridProps {
  testimonials: Testimonial[];
  className?: string;
}

const TestimonialGrid: React.FC<TestimonialGridProps> = ({ testimonials, className = '' }) => {
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>(testimonials);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterEvent, setFilterEvent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'text' | 'screenshot'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const testimonialsPerPage = 6;
  
  // Extraire les événements uniques pour les filtres
  const uniqueEvents = Array.from(new Set(testimonials.map(t => t.event)));
  
  // Appliquer les filtres lorsqu'ils changent
  useEffect(() => {
    let result = [...testimonials];
    
    // Filtre par note
    if (filterRating !== null) {
      result = result.filter(t => t.rating === filterRating);
    }
    
    // Filtre par événement
    if (filterEvent !== null) {
      result = result.filter(t => t.event === filterEvent);
    }
    
    // Filtre par type
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }
    
    // Trier par date (plus récent en premier)
    result.sort((a, b) => {
      const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
      const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
      return dateB - dateA;
    });
    
    setFilteredTestimonials(result);
    setCurrentPage(1); // Réinitialiser la pagination lors d'un changement de filtre
  }, [testimonials, filterRating, filterEvent, filterType]);
  
  // Calculer les témoignages à afficher pour la page actuelle
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredTestimonials.slice(
    indexOfFirstTestimonial,
    indexOfLastTestimonial
  );
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredTestimonials.length / testimonialsPerPage);
  
  // Changer de page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    // Faire défiler vers le haut de la grille
    window.scrollTo({ top: document.getElementById('testimonials-grid')?.offsetTop || 0, behavior: 'smooth' });
  };
  
  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilterRating(null);
    setFilterEvent(null);
    setFilterType('all');
  };
  
  // Générer les boutons de pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Bouton précédent
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Page précédente"
      >
        <ChevronLeft size={20} />
      </button>
    );
    
    // Première page si nécessaire
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            currentPage === 1 ? 'bg-rose-400 text-white' : 'bg-beige-100 hover:bg-beige-200'
          }`}
        >
          1
        </button>
      );
      
      // Ellipsis si nécessaire
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className="px-2">...</span>
        );
      }
    }
    
    // Pages numériques
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            currentPage === i ? 'bg-rose-400 text-white' : 'bg-beige-100 hover:bg-beige-200'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Dernière page si nécessaire
    if (endPage < totalPages) {
      // Ellipsis si nécessaire
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" className="px-2">...</span>
        );
      }
      
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            currentPage === totalPages ? 'bg-rose-400 text-white' : 'bg-beige-100 hover:bg-beige-200'
          }`}
        >
          {totalPages}
        </button>
      );
    }
    
    // Bouton suivant
    pageNumbers.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Page suivante"
      >
        <ChevronRight size={20} />
      </button>
    );
    
    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        {pageNumbers}
      </div>
    );
  };
  
  return (
    <div className={className} id="testimonials-grid">
      {/* Section de filtres */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-taupe-700 hover:text-rose-500 transition-colors"
            >
              <Filter size={18} className="mr-2" />
              <span className="font-medium">Filtrer les avis</span>
            </button>
            
            {(filterRating !== null || filterEvent !== null || filterType !== 'all') && (
              <button
                onClick={resetFilters}
                className="ml-4 text-sm text-rose-500 hover:text-rose-600 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
          
          <div className="text-sm text-taupe-600">
            {filteredTestimonials.length} avis trouvé{filteredTestimonials.length > 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Panneau de filtres */}
        {showFilters && (
          <div className="mt-4 p-4 bg-beige-50 rounded-lg border border-beige-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtre par note */}
              <div>
                <label className="block text-sm font-medium text-taupe-700 mb-2">
                  Note
                </label>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm ${
                        filterRating === rating 
                          ? 'bg-rose-400 text-white' 
                          : 'bg-white border border-beige-200 hover:bg-beige-100'
                      }`}
                    >
                      {rating} <Star size={14} className={`ml-1 ${filterRating === rating ? '' : 'text-amber-400'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filtre par événement */}
              <div>
                <label className="block text-sm font-medium text-taupe-700 mb-2">
                  Type d'événement
                </label>
                <select
                  value={filterEvent || ''}
                  onChange={(e) => setFilterEvent(e.target.value || null)}
                  className="w-full px-3 py-2 bg-white border border-beige-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="">Tous les événements</option>
                  {uniqueEvents.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Filtre par type */}
              <div>
                <label className="block text-sm font-medium text-taupe-700 mb-2">
                  Format d'avis
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm ${
                      filterType === 'all' 
                        ? 'bg-rose-400 text-white' 
                        : 'bg-white border border-beige-200 hover:bg-beige-100'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilterType('text')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm ${
                      filterType === 'text' 
                        ? 'bg-rose-400 text-white' 
                        : 'bg-white border border-beige-200 hover:bg-beige-100'
                    }`}
                  >
                    Texte
                  </button>
                  <button
                    onClick={() => setFilterType('screenshot')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm ${
                      filterType === 'screenshot' 
                        ? 'bg-rose-400 text-white' 
                        : 'bg-white border border-beige-200 hover:bg-beige-100'
                    }`}
                  >
                    Images
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Grille de témoignages */}
      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-beige-50 rounded-lg">
          <p className="text-taupe-600">Aucun avis ne correspond à vos critères de recherche.</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-rose-500 hover:text-rose-600 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          {/* Les styles pour la grille masonry sont dans le fichier CSS */}
          
          <Masonry
            breakpointCols={{
              default: 3,
              1024: 3,
              768: 2,
              640: 1
            }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {currentTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="masonry-item">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </Masonry>
          
          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default TestimonialGrid;
