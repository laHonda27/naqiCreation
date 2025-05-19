import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GalleryImage } from '../../hooks/useGallery';
import ImageUploader from './ImageUploader';

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<GalleryImage> & { id?: string }) => void;
  editingImage: GalleryImage | null;
  categories: string[];
}

const GalleryFormModal: React.FC<GalleryFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingImage,
  categories
}) => {
  const [formData, setFormData] = useState<Partial<GalleryImage> & { id?: string }>({
    src: '',
    alt: '',
    category: categories[0] || ''
  });
  const [newCategory, setNewCategory] = useState<string>('');

  
  // Réinitialiser le formulaire lorsque le modal s'ouvre ou que l'image à éditer change
  useEffect(() => {
    if (isOpen) {
      if (editingImage) {
        setFormData({
          id: editingImage.id,
          src: editingImage.src,
          alt: editingImage.alt,
          category: editingImage.category
        });
      } else {
        setFormData({
          src: '',
          alt: '',
          category: categories[0] || ''
        });
      }
      setNewCategory('');
    }
  }, [isOpen, editingImage, categories]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  

  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-taupe-900/50">
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-beige-200">
          <h2 className="text-xl font-display font-semibold text-taupe-800">
            {editingImage ? 'Modifier l\'image' : 'Ajouter une image'}
          </h2>
          <button 
            onClick={onClose}
            className="text-taupe-400 hover:text-taupe-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {/* Image */}
          <div className="mb-4">
            <ImageUploader
              value={formData.src}
              onChange={(url) => setFormData(prev => ({ ...prev, src: url }))}
              placeholder="URL de l'image"
              required={true}
            />
          </div>
          
          {/* Description de l'image */}
          <div className="mb-4">
            <label htmlFor="alt" className="block text-sm font-medium text-taupe-700 mb-2">
              Description de l'image *
            </label>
            <input
              type="text"
              id="alt"
              name="alt"
              value={formData.alt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="Panneau de bienvenue mariage"
              required
            />
          </div>
          
          {/* Catégorie */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-taupe-700 mb-2">
              Catégorie *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              {newCategory && !categories.includes(newCategory) && (
                <option value={newCategory}>{newCategory}</option>
              )}
            </select>
          </div>
          
          {/* Nouvelle catégorie */}
          <div className="mb-6">
            <label htmlFor="newCategory" className="block text-sm font-medium text-taupe-700 mb-2">
              Ajouter une nouvelle catégorie
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Nouvelle catégorie"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCategory.trim()) {
                    setFormData(prev => ({ ...prev, category: newCategory }));
                  }
                }}
                className="px-4 py-2 bg-beige-100 text-taupe-600 rounded-md hover:bg-beige-200 transition-colors"
                disabled={!newCategory.trim()}
              >
                Utiliser
              </button>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-beige-300 rounded-md hover:bg-beige-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-400 text-white rounded-md hover:bg-rose-500 transition-colors"
              disabled={!formData.src || !formData.alt || !formData.category}
            >
              {editingImage ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryFormModal;
