import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash } from 'lucide-react';
import { CustomItem } from '../../hooks/useCustomizations';
import ImageUploader from './ImageUploader';

interface CustomItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<CustomItem, 'id'> & { id?: string }) => void;
  editingItem: CustomItem | null;
}

const CustomItemFormModal: React.FC<CustomItemFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem
}) => {
  const [formData, setFormData] = useState<Omit<CustomItem, 'id'> & { id?: string }>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    price: 0,
    minQuantity: 1,
    priceInfo: '',
    materials: [''],
    dimensions: [''],
    images: [{ src: '', alt: '' }],
    examples: [''],
    featured: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données de l'élément à éditer
  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem
      });
    } else {
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        price: 0,
        minQuantity: 1,
        priceInfo: '',
        materials: [''],
        dimensions: [''],
        images: [{ src: '', alt: '' }],
        examples: [''],
        featured: false
      });
    }
    setErrors({});
  }, [editingItem, isOpen]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Gérer les changements dans les tableaux
  const handleArrayChange = (
    arrayName: 'materials' | 'dimensions' | 'examples',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => (i === index ? value : item))
    }));
  };

  // Ajouter un élément à un tableau
  const handleAddArrayItem = (arrayName: 'materials' | 'dimensions' | 'examples') => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  // Supprimer un élément d'un tableau
  const handleRemoveArrayItem = (
    arrayName: 'materials' | 'dimensions' | 'examples',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  // Gérer les changements d'images
  const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? { ...img, [field]: value } : img))
    }));
  };

  // Ajouter une image
  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { src: '', alt: '' }]
    }));
  };

  // Supprimer une image
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'La description courte est requise';
    }
    
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'La description complète est requise';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }
    
    if (formData.minQuantity <= 0) {
      newErrors.minQuantity = 'La quantité minimale doit être supérieure à 0';
    }
    
    if (!formData.priceInfo.trim()) {
      newErrors.priceInfo = 'Les informations de prix sont requises';
    }
    
    if (formData.images.length === 0 || !formData.images[0].src) {
      newErrors.images = 'Au moins une image est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-taupe-800">
            {editingItem ? 'Modifier la personnalisation' : 'Ajouter une personnalisation'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-taupe-400 hover:text-taupe-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-taupe-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Étiquettes de bouteilles"
                required
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            
            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-taupe-700 mb-1">
                Prix (€)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                placeholder="2.50"
                step="0.01"
                min="0"
                required
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Quantité minimale */}
            <div>
              <label className="block text-sm font-medium text-taupe-700 mb-1">
                Quantité minimale
              </label>
              <input
                type="number"
                name="minQuantity"
                value={formData.minQuantity}
                onChange={handleChange}
                className={`input-field ${errors.minQuantity ? 'border-red-500' : ''}`}
                placeholder="10"
                min="1"
                required
              />
              {errors.minQuantity && <p className="text-red-500 text-xs mt-1">{errors.minQuantity}</p>}
            </div>
            
            {/* Informations de prix */}
            <div>
              <label className="block text-sm font-medium text-taupe-700 mb-1">
                Informations de prix
              </label>
              <input
                type="text"
                name="priceInfo"
                value={formData.priceInfo}
                onChange={handleChange}
                className={`input-field ${errors.priceInfo ? 'border-red-500' : ''}`}
                placeholder="Prix par unité, commande minimum de 10 pièces."
                required
              />
              {errors.priceInfo && <p className="text-red-500 text-xs mt-1">{errors.priceInfo}</p>}
            </div>
          </div>
          
          {/* Description courte */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-taupe-700 mb-1">
              Description courte
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className={`input-field ${errors.shortDescription ? 'border-red-500' : ''}`}
              placeholder="Étiquettes personnalisées pour vos bouteilles d'eau, vin ou champagne."
              required
            />
            {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
          </div>
          
          {/* Description complète */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-taupe-700 mb-1">
              Description complète
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              className={`input-field min-h-[100px] ${errors.fullDescription ? 'border-red-500' : ''}`}
              placeholder="Nos étiquettes personnalisées sont parfaites pour donner une touche unique à vos bouteilles lors de vos événements..."
              required
            />
            {errors.fullDescription && <p className="text-red-500 text-xs mt-1">{errors.fullDescription}</p>}
          </div>
          
          {/* Matériaux */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-taupe-700 mb-2">
              Matériaux
            </label>
            {formData.materials.map((material, index) => (
              <div key={`material-${index}`} className="flex mb-2">
                <input
                  type="text"
                  value={material}
                  onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="Papier adhésif premium"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('materials', index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-600"
                  disabled={formData.materials.length <= 1}
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('materials')}
              className="text-rose-500 hover:text-rose-600 text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter un matériau
            </button>
          </div>
          
          {/* Dimensions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-taupe-700 mb-2">
              Dimensions
            </label>
            {formData.dimensions.map((dimension, index) => (
              <div key={`dimension-${index}`} className="flex mb-2">
                <input
                  type="text"
                  value={dimension}
                  onChange={(e) => handleArrayChange('dimensions', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="Standard: 9x12 cm"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('dimensions', index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-600"
                  disabled={formData.dimensions.length <= 1}
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('dimensions')}
              className="text-rose-500 hover:text-rose-600 text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter une dimension
            </button>
          </div>
          
          {/* Exemples */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-taupe-700 mb-2">
              Exemples d'utilisation
            </label>
            {formData.examples.map((example, index) => (
              <div key={`example-${index}`} className="flex mb-2">
                <input
                  type="text"
                  value={example}
                  onChange={(e) => handleArrayChange('examples', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="Bouteilles d'eau pour un mariage élégant"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('examples', index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-600"
                  disabled={formData.examples.length <= 1}
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('examples')}
              className="text-rose-500 hover:text-rose-600 text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter un exemple
            </button>
          </div>
          
          {/* Images */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-taupe-700 mb-2">
              Images
            </label>
            {formData.images.map((image, index) => (
              <div key={`image-${index}`} className="mb-4 p-4 border border-beige-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Image {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500 hover:text-red-600"
                    disabled={formData.images.length <= 1}
                  >
                    <Trash size={18} />
                  </button>
                </div>
                
                <div className="mb-2">
                  <ImageUploader
                    value={image.src}
                    onChange={(url) => handleImageChange(index, 'src', url)}
                    placeholder="URL de l'image"
                    required={index === 0}
                    defaultMode="upload"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-taupe-700 mb-1">
                    Texte alternatif
                  </label>
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                    className="input-field"
                    placeholder="Étiquettes de bouteilles personnalisées"
                    required
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddImage}
              className="text-rose-500 hover:text-rose-600 text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter une image
            </button>
            
            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
          </div>
          
          {/* Mise en avant */}
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-rose-500 border-taupe-300 rounded focus:ring-rose-500"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-taupe-700">
                Mettre en avant sur la page de personnalisation
              </label>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary mr-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              <Save size={18} className="mr-2" />
              {editingItem ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomItemFormModal;
