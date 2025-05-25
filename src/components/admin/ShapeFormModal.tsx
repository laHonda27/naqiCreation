import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import { Shape } from '../../hooks/useShapesAndColors';

interface ShapeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<Shape, 'id'> & { id?: string }) => void;
  editingShape?: Shape | null;
}

const ShapeFormModal: React.FC<ShapeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingShape
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // État du formulaire
  const [formData, setFormData] = useState<Omit<Shape, 'id'> & { id?: string }>({
    name: '',
    image: '',
    size: '',
    description: ''
  });

  // Initialiser le formulaire avec les données de la forme en cours d'édition
  useEffect(() => {
    if (editingShape) {
      setFormData({
        ...editingShape
      });
    } else {
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        image: '',
        size: '',
        description: ''
      });
    }
  }, [editingShape, isOpen]);

  // Gérer les changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer les changements d'image
  const handleImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }));
  };

  // Soumettre le formulaire
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.image) newErrors.image = 'L\'image est requise';
    if (!formData.size) newErrors.size = 'La taille est requise';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Générer un ID si c'est une nouvelle forme
    if (!formData.id) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      formData.id = slug;
    }
    
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingShape ? `Modifier ${editingShape.name}` : 'Ajouter une forme'}
      size="md"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Nom de la forme"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <ImageUploader
            value={formData.image}
            onChange={handleImageChange}
            placeholder="URL de l'image"
            defaultMode="upload"
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          <p className="text-xs text-taupe-500 mt-1">
            Les images seront automatiquement enregistrées dans le dossier <code>/images/formes/</code>.
            Format recommandé : PNG avec transparence, dimensions ~500x500px.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Taille</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className={`input-field ${errors.size ? 'border-red-500' : ''}`}
            placeholder="ex: 50x70 cm"
          />
          {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            placeholder="Description de la forme"
            rows={3}
          />
        </div>

        {/* Aperçu */}
        {formData.image && (
          <div className="mt-4 p-3 bg-beige-50 rounded-lg border border-beige-200">
            <h3 className="font-medium mb-2">Aperçu</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 flex items-center justify-center bg-white rounded-md border border-beige-200 p-2">
                <img 
                  src={formData.image} 
                  alt={formData.name || 'Aperçu de la forme'} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{formData.name || 'Nom de la forme'}</p>
                <p className="text-sm text-taupe-600">{formData.size || 'Dimensions'}</p>
                {formData.description && (
                  <p className="text-sm text-taupe-600 mt-1">{formData.description}</p>
                )}
              </div>
            </div>
          </div>
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
            {editingShape ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ShapeFormModal;
