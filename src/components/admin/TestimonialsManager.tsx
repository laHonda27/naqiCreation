import React, { useState } from 'react';
import { Trash2, Edit, Plus, Star, X, Check, Upload, MessageCircle, Image } from 'lucide-react';
import { useTestimonials, Testimonial, TextTestimonial, ScreenshotTestimonial } from '../../hooks/useTestimonials';

const TestimonialsManager: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testimonialType, setTestimonialType] = useState<'text' | 'screenshot'>('text');
  const [formData, setFormData] = useState<Omit<TextTestimonial | ScreenshotTestimonial, 'id'>>({
    type: 'text',
    name: '',
    comment: '',
    rating: 5,
    event: '',
    avatar: ''
  });
  
  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'text',
      name: '',
      comment: '',
      rating: 5,
      event: '',
      avatar: ''
    });
    setTestimonialType('text');
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      const newType = value as 'text' | 'screenshot';
      setTestimonialType(newType);
      
      // Reset form data based on new type
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
  
  // Start editing a testimonial
  const handleEdit = (testimonial: Testimonial) => {
    setTestimonialType(testimonial.type);
    setFormData(testimonial);
    setEditingId(testimonial.id);
    setIsAdding(true);
  };
  
  // Cancel adding/editing
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };
  
  // Submit the form (add or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing testimonial
      await updateTestimonial(editingId, formData);
      setEditingId(null);
    } else {
      // Add new testimonial
      await addTestimonial(formData);
    }
    
    setIsAdding(false);
    resetForm();
  };
  
  // Delete a testimonial
  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      await deleteTestimonial(id);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des témoignages</h2>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary px-4 py-2 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un témoignage
          </button>
        )}
      </div>
      
      {isAdding ? (
        <div className="bg-beige-50 p-6 rounded-lg border border-beige-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">
              {editingId ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-taupe-600 hover:text-taupe-800"
              aria-label="Annuler"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-taupe-700 mb-1">
                  Nom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="event" className="block text-sm font-medium text-taupe-700 mb-1">
                  Événement
                </label>
                <input
                  id="event"
                  name="event"
                  type="text"
                  value={formData.event}
                  onChange={handleChange}
                  required
                  className="input-field text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-taupe-700 mb-1">
                Type de témoignage
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                  testimonialType === 'text' 
                    ? 'bg-rose-50 border-rose-300' 
                    : 'bg-white border-beige-200 hover:bg-beige-50'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="text"
                    checked={testimonialType === 'text'}
                    onChange={handleChange}
                    className="mr-2 text-rose-400 focus:ring-rose-300"
                  />
                  <MessageCircle size={18} className="mr-2 text-taupe-700" />
                  <span>Témoignage texte</span>
                </label>
                
                <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                  testimonialType === 'screenshot' 
                    ? 'bg-rose-50 border-rose-300' 
                    : 'bg-white border-beige-200 hover:bg-beige-50'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="screenshot"
                    checked={testimonialType === 'screenshot'}
                    onChange={handleChange}
                    className="mr-2 text-rose-400 focus:ring-rose-300"
                  />
                  <Image size={18} className="mr-2 text-taupe-700" />
                  <span>Capture d'écran</span>
                </label>
              </div>
            </div>
            
            {testimonialType === 'text' ? (
              <>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-taupe-700 mb-1">
                    Témoignage
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    value={(formData as TextTestimonial).comment || ''}
                    onChange={handleChange}
                    required
                    className="input-field text-sm resize-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-taupe-700 mb-1">
                    URL de la photo (optionnel)
                  </label>
                  <input
                    id="avatar"
                    name="avatar"
                    type="url"
                    value={(formData as TextTestimonial).avatar || ''}
                    onChange={handleChange}
                    className="input-field text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-taupe-700 mb-1">
                    URL de la capture d'écran
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={(formData as ScreenshotTestimonial).imageUrl || ''}
                    onChange={handleChange}
                    required
                    className="input-field text-sm"
                    placeholder="https://example.com/screenshot.jpg"
                  />
                </div>
                
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-taupe-700 mb-1">
                    Légende de l'image (optionnel)
                  </label>
                  <input
                    id="caption"
                    name="caption"
                    type="text"
                    value={(formData as ScreenshotTestimonial).caption || ''}
                    onChange={handleChange}
                    className="input-field text-sm"
                    placeholder="Ex: Message reçu via Instagram"
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-taupe-700 mb-1">
                Note
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="input-field text-sm"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} étoile{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-outline px-4 py-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary px-4 py-2 flex items-center"
              >
                <Check size={18} className="mr-2" />
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
      
      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <p className="text-center py-8 text-taupe-600">
            Aucun témoignage pour le moment.
          </p>
        ) : (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-5 rounded-lg border border-beige-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  {testimonial.type === 'text' ? (
                    <>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-beige-100 flex-shrink-0">
                        {(testimonial as TextTestimonial).avatar ? (
                          <img 
                            src={(testimonial as TextTestimonial).avatar} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-taupe-400">
                            <span>{testimonial.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{testimonial.name}</h3>
                          <span className="ml-2 px-2 py-0.5 bg-beige-100 text-taupe-600 text-xs rounded-full">
                            Texte
                          </span>
                        </div>
                        <p className="text-sm text-taupe-600">{testimonial.event}</p>
                        <div className="flex mt-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < testimonial.rating ? "text-rose-400 fill-rose-400" : "text-beige-300"}
                            />
                          ))}
                        </div>
                        <p className="text-taupe-700">"{(testimonial as TextTestimonial).comment}"</p>
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
                      <p className="text-sm text-taupe-600 mb-1">{testimonial.event}</p>
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
                
                <div className="flex space-x-2">
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
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;