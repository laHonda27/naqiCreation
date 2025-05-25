import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import { Color } from '../../hooks/useShapesAndColors';

interface ColorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<Color, 'id'> & { id?: string }) => void;
  editingColor?: Color | null;
  isTextColor?: boolean;
}

const ColorFormModal: React.FC<ColorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingColor,
  isTextColor = false
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // État du formulaire
  const [formData, setFormData] = useState<Omit<Color, 'id'> & { id?: string }>({
    name: '',
    hexCode: '',
    image: '',
    opacity: 1
  });

  // Initialiser le formulaire avec les données de la couleur en cours d'édition
  useEffect(() => {
    if (editingColor) {
      setFormData({
        ...editingColor
      });
    } else {
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        hexCode: isTextColor ? '#000000' : '#FFFFFF',
        image: '',
        opacity: 1
      });
    }
  }, [editingColor, isOpen, isTextColor]);

  // Gérer les changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'opacity') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 1
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    if (!formData.hexCode) newErrors.hexCode = 'La couleur est requise';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Générer un ID si c'est une nouvelle couleur
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
      title={editingColor ? `Modifier ${editingColor.name}` : `Ajouter une couleur ${isTextColor ? 'de texte' : 'de panneau'}`}
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
            placeholder="Nom de la couleur"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Couleur</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="colorPicker"
              value={formData.hexCode.startsWith('#') ? formData.hexCode : '#FFFFFF'}
              onChange={(e) => setFormData(prev => ({ ...prev, hexCode: e.target.value }))}
              className="h-10 w-10 rounded cursor-pointer"
            />
            <input
              type="text"
              name="hexCode"
              value={formData.hexCode}
              onChange={handleChange}
              className={`input-field flex-1 ${errors.hexCode ? 'border-red-500' : ''}`}
              placeholder="#FFFFFF ou rgba(255,255,255,1)"
            />
          </div>
          {errors.hexCode && <p className="text-red-500 text-xs mt-1">{errors.hexCode}</p>}
        </div>
        
        {!isTextColor && (
          <div>
            <label className="block text-sm font-medium mb-1">Opacité (optionnel)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                name="opacity"
                min="0"
                max="1"
                step="0.1"
                value={formData.opacity || 1}
                onChange={handleChange}
                className="flex-1"
              />
              <input
                type="number"
                name="opacity"
                min="0"
                max="1"
                step="0.1"
                value={formData.opacity || 1}
                onChange={handleChange}
                className="input-field w-20"
              />
            </div>
          </div>
        )}
        
        <div>
          <ImageUploader
            value={formData.image}
            onChange={handleImageChange}
            placeholder="URL de l'image"
            defaultMode="upload"
          />
          <p className="text-xs text-taupe-500 mt-1">
            Les images seront automatiquement enregistrées dans le dossier <code>/images/couleurs/</code>.
            {isTextColor ? 
              "Utilisez le préfixe 'texte-' pour les couleurs de texte." : 
              "Format recommandé : JPG ou PNG, dimensions ~300x200px."}
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-beige-50 rounded-lg border border-beige-200">
          <h3 className="font-medium mb-2">Aperçu</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex space-x-4 items-center">
              <div 
                className="w-16 h-16 rounded-md border border-beige-200"
                style={{ 
                  backgroundColor: formData.hexCode,
                  opacity: formData.opacity || 1
                }}
              ></div>
              {formData.image && (
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-md border border-beige-200 p-1">
                  <img 
                    src={formData.image} 
                    alt={formData.name || 'Aperçu de la couleur'} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{formData.name || 'Nom de la couleur'}</p>
              <p className="text-sm text-taupe-600">{formData.hexCode || '#FFFFFF'}</p>
              {formData.opacity !== undefined && formData.opacity !== 1 && (
                <p className="text-sm text-taupe-600">Opacité: {formData.opacity}</p>
              )}
              <p className="text-xs text-taupe-500 mt-1">
                {isTextColor ? 'Couleur pour les inscriptions' : 'Couleur pour les panneaux'}
              </p>
            </div>
          </div>
        </div>

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
            {editingColor ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ColorFormModal;
