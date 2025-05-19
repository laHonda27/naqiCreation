import React, { useState } from 'react';
import { Trash2, Edit, Plus, Star } from 'lucide-react';
import { useTestimonials, Testimonial, TextTestimonial, ScreenshotTestimonial } from '../../hooks/useTestimonials';
import TestimonialFormModal from './TestimonialFormModal';
import GlobalSaveButton from './GlobalSaveButton';
import Masonry from 'react-masonry-css';
import '../testimonials/TestimonialGrid.css';

const TestimonialsManager: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Ouvrir le modal pour ajouter un témoignage
  const handleAddNew = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };
  
  // Ouvrir le modal pour modifier un témoignage
  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };
  
  // Gérer la soumission du formulaire (ajout ou mise à jour)
  const handleFormSubmit = async (formData: Partial<Testimonial> & { id?: string }) => {
    try {
      if (formData.id) {
        // Mettre à jour un témoignage existant
        await updateTestimonial(formData.id, formData as any);
      } else {
        // Ajouter un nouveau témoignage
        await addTestimonial(formData as any);
      }
      
      // Indiquer qu'il y a des changements non enregistrés
      setHasUnsavedChanges(true);
      // Fermer le modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du témoignage:", error);
    }
  };
  
  // Supprimer un témoignage
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      try {
        await deleteTestimonial(id);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error("Erreur lors de la suppression du témoignage:", error);
      }
    }
  };

  return (
    <div className="p-4 bg-beige-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-taupe-800 font-semibold">Gestion des témoignages</h2>
        <button
          onClick={handleAddNew}
          className="btn-primary px-3 py-2 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Ajouter un témoignage
        </button>
      </div>
      
      {testimonials.length === 0 ? (
        <p className="text-center py-8 text-taupe-600">
          Aucun témoignage pour le moment.
        </p>
      ) : (
        <Masonry
          breakpointCols={{
            default: 2,
            1280: 2,
            768: 1
          }}
          className="my-masonry-grid admin-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="masonry-item bg-white p-5 rounded-lg border border-beige-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between">
                <div className="flex flex-grow">
                  {testimonial.type === 'text' ? (
                    <>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-beige-100 flex-shrink-0 mr-3">
                        {(testimonial as TextTestimonial).avatar ? (
                          <img 
                            src={(testimonial as TextTestimonial).avatar} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Avatar';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-taupe-400 text-lg font-medium">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <h3 className="font-medium">{testimonial.name}</h3>
                          <span className="ml-2 px-2 py-0.5 bg-beige-100 text-taupe-600 text-xs rounded-full">
                            Texte
                          </span>
                        </div>
                        {testimonial.event && testimonial.event.trim() !== '' && (
                          <p className="text-sm text-taupe-600">{testimonial.event}</p>
                        )}
                        <div className="flex mt-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < testimonial.rating ? "text-rose-400 fill-rose-400" : "text-beige-300"}
                            />
                          ))}
                        </div>
                        <p className="text-taupe-700 text-sm italic">"{(testimonial as TextTestimonial).comment}"</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <span className="ml-2 px-2 py-0.5 bg-beige-100 text-taupe-600 text-xs rounded-full">
                          Capture d'écran
                        </span>
                      </div>
                      {testimonial.event && testimonial.event.trim() !== '' && (
                        <p className="text-sm text-taupe-600 mb-1">{testimonial.event}</p>
                      )}
                      <div className="flex mt-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < testimonial.rating ? "text-rose-400 fill-rose-400" : "text-beige-300"}
                          />
                        ))}
                      </div>
                      
                      <div className="mt-2">
                        <div className="border border-beige-200 rounded-md overflow-hidden max-w-xs">
                          <img 
                            src={(testimonial as ScreenshotTestimonial).imageUrl} 
                            alt={`Capture d'écran du témoignage de ${testimonial.name}`}
                            className="w-full h-auto" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                            }}
                          />
                        </div>
                        {(testimonial as ScreenshotTestimonial).caption && (
                          <p className="text-sm text-taupe-500 italic mt-1">
                            {(testimonial as ScreenshotTestimonial).caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="text-taupe-600 hover:text-taupe-800 p-1"
                    aria-label="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      )}

      {/* Modal pour ajouter/modifier un témoignage */}
      <TestimonialFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingTestimonial={editingTestimonial}
      />
      
      {/* Bouton flottant pour enregistrer les modifications */}
      <GlobalSaveButton 
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveComplete={() => setHasUnsavedChanges(false)}
      />
    </div>
  );
};

export default TestimonialsManager;
