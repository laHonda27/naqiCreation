import React, { useState, useEffect } from 'react';
import { Check, Star } from 'lucide-react';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import type { Testimonial, TextTestimonial, ScreenshotTestimonial } from '../../hooks/useTestimonials';

interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<Testimonial, 'id'> & { id?: string }) => void;
  editingTestimonial?: Testimonial | null;
}

const TestimonialFormModal: React.FC<TestimonialFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTestimonial
}) => {
  const [testimonialType, setTestimonialType] = useState<'text' | 'screenshot'>('text');
  
  // État du formulaire
  const [formData, setFormData] = useState<(Omit<TextTestimonial, 'id'> | Omit<ScreenshotTestimonial, 'id'>) & { id?: string }>({
    type: 'text',
    name: '',
    comment: '',
    rating: 5,
    event: '',
    avatar: ''
  });

  // Initialiser le formulaire avec les données du témoignage en cours d'édition
  useEffect(() => {
    if (editingTestimonial) {
      setFormData({
        ...editingTestimonial
      });
      setTestimonialType(editingTestimonial.type);
    } else {
      // Réinitialiser le formulaire
      setFormData({
        type: 'text',
        name: '',
        comment: '',
        rating: 5,
        event: '',
        avatar: ''
      });
      setTestimonialType('text');
    }
  }, [editingTestimonial, isOpen]);

  // Gérer les changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      const newType = value as 'text' | 'screenshot';
      setTestimonialType(newType);
      
      // Réinitialiser les données du formulaire en fonction du nouveau type
      if (newType === 'text') {
        setFormData({
          type: 'text',
          name: formData.name,
          comment: '',
          rating: formData.rating,
          event: formData.event,
          avatar: ''
        });
      } else {
        setFormData({
          type: 'screenshot',
          name: formData.name,
          imageUrl: '',
          rating: formData.rating,
          event: formData.event,
          caption: ''
        });
      }
    } else if (name === 'rating') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Gérer les changements d'image
  const handleImageChange = (url: string, fieldName: 'avatar' | 'imageUrl') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: url
    }));
  };

  // Soumettre le formulaire
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // S'assurer que tous les champs requis sont présents selon le type
    if (testimonialType === 'text') {
      const textData = {
        ...formData,
        type: 'text' as const,
        comment: (formData as TextTestimonial).comment || ''
      };
      onSubmit(textData);
    } else {
      const screenshotData = {
        ...formData,
        type: 'screenshot' as const,
        imageUrl: (formData as ScreenshotTestimonial).imageUrl || ''
      };
      onSubmit(screenshotData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTestimonial ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
      size="lg"
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Type de témoignage */}
        <div>
          <label className="block text-sm font-medium text-taupe-700 mb-2">
            Type de témoignage
          </label>
          <div className="flex flex-wrap gap-3">
            <label className={`flex items-center p-3 rounded-lg border ${testimonialType === 'text' ? 'border-rose-400 bg-rose-50' : 'border-beige-200 bg-white'} cursor-pointer`}>
              <input
                type="radio"
                name="type"
                value="text"
                checked={testimonialType === 'text'}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-sm font-medium">Témoignage textuel</span>
            </label>
            
            <label className={`flex items-center p-3 rounded-lg border ${testimonialType === 'screenshot' ? 'border-rose-400 bg-rose-50' : 'border-beige-200 bg-white'} cursor-pointer`}>
              <input
                type="radio"
                name="type"
                value="screenshot"
                checked={testimonialType === 'screenshot'}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-sm font-medium">Capture d'écran</span>
            </label>
          </div>
        </div>

        {/* Informations communes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-taupe-700 mb-1">
              Nom du client
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field text-sm w-full"
              placeholder="Ex: Marie Dupont"
            />
          </div>
          
          <div>
            <label htmlFor="event" className="block text-sm font-medium text-taupe-700 mb-1">
              Événement / Occasion
            </label>
            <input
              id="event"
              name="event"
              type="text"
              value={formData.event}
              onChange={handleChange}
              className="input-field text-sm w-full"
              placeholder="Ex: Mariage, Anniversaire, etc."
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-taupe-700 mb-1">
            Note
          </label>
          <div className="flex items-center">
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="input-field text-sm mr-3"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < (formData.rating || 5) ? "text-rose-400 fill-rose-400" : "text-beige-300"}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Date (optionnelle) */}
        <div>
          <label htmlFor="dateAdded" className="block text-sm font-medium text-taupe-700 mb-1">
            Date (optionnelle) Si non renseignée, la date du jour sera utilisée.
          </label>
          <div className="flex items-center">
            <input
              id="dateAdded"
              name="dateAdded"
              type="date"
              value={formData.dateAdded ? new Date(formData.dateAdded).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className="input-field text-sm w-full"
              placeholder="Date de l'avis"
            />
          </div>
        </div>
        
        {/* Option pour mettre en avant dans le hero */}
        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="featuredInHero"
              name="featuredInHero"
              type="checkbox"
              checked={formData.featuredInHero || false}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  featuredInHero: e.target.checked
                }));
              }}
              className="h-4 w-4 text-rose-500 border-beige-300 rounded focus:ring-rose-500 mr-2"
            />
            <label htmlFor="featuredInHero" className="text-sm font-medium text-taupe-700">
              Mettre en avant dans la section hero de la page d'accueil
            </label>
          </div>
          <p className="text-xs text-taupe-500 mt-1 ml-6">
            Un seul témoignage peut être mis en avant. Si vous sélectionnez celui-ci, il remplacera tout autre témoignage actuellement mis en avant.
          </p>
        </div>

        {/* Champs spécifiques au type de témoignage */}
        {testimonialType === 'text' ? (
          <>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-taupe-700 mb-1">
                Commentaire
              </label>
              <textarea
                id="comment"
                name="comment"
                value={(formData as TextTestimonial).comment || ''}
                onChange={handleChange}
                required
                rows={4}
                className="input-field text-sm w-full"
                placeholder="Entrez le commentaire du client..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-taupe-700 mb-2">
                Avatar (optionnel)
              </label>
              <ImageUploader 
                initialImage={(formData as TextTestimonial).avatar || ''}
                onImageChange={(url) => handleImageChange(url, 'avatar')}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-taupe-700 mb-2">
                Image de la capture d'écran
              </label>
              <ImageUploader 
                initialImage={(formData as ScreenshotTestimonial).imageUrl || ''}
                onImageChange={(url) => handleImageChange(url, 'imageUrl')}
                required
              />
            </div>
            
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-taupe-700 mb-1">
                Légende (optionnelle)
              </label>
              <input
                id="caption"
                name="caption"
                type="text"
                value={(formData as ScreenshotTestimonial).caption || ''}
                onChange={handleChange}
                className="input-field text-sm w-full"
                placeholder="Ex: Message reçu sur Instagram"
              />
            </div>
          </>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-beige-200">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline px-4 py-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary px-4 py-2 flex items-center"
          >
            <Check size={18} className="mr-2" />
            {editingTestimonial ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TestimonialFormModal;
