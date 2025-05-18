import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { GalleryImage } from '../../hooks/useGallery';

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
  const [uploadMethod, setUploadMethod] = useState<'url' | 'cloudinary'>('url');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
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
      setUploadMethod('url');
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
  
  const handleCloudinaryUpload = () => {
    setIsUploading(true);
    
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dqo2tnjaf',
        uploadPreset: 'naqi-creation',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxFileSize: 5000000, // 5MB
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setFormData(prev => ({
            ...prev,
            src: result.info.secure_url
          }));
        }
        
        if (result.event === 'close') {
          setIsUploading(false);
        }
      }
    );
    
    widget.open();
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
          {/* Méthode d'upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-taupe-700 mb-2">
              Méthode d'ajout d'image
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                  uploadMethod === 'url' 
                    ? 'bg-rose-100 text-rose-600 border border-rose-300' 
                    : 'bg-beige-100 text-taupe-600 border border-beige-200 hover:bg-beige-200'
                }`}
                onClick={() => setUploadMethod('url')}
              >
                <ImageIcon size={18} className="mr-2" />
                URL
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                  uploadMethod === 'cloudinary' 
                    ? 'bg-rose-100 text-rose-600 border border-rose-300' 
                    : 'bg-beige-100 text-taupe-600 border border-beige-200 hover:bg-beige-200'
                }`}
                onClick={() => setUploadMethod('cloudinary')}
              >
                <Upload size={18} className="mr-2" />
                Upload
              </button>
            </div>
          </div>
          
          {/* URL de l'image */}
          {uploadMethod === 'url' ? (
            <div className="mb-4">
              <label htmlFor="src" className="block text-sm font-medium text-taupe-700 mb-2">
                URL de l'image *
              </label>
              <input
                type="url"
                id="src"
                name="src"
                value={formData.src}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-taupe-700 mb-2">
                Uploader une image *
              </label>
              <button
                type="button"
                onClick={handleCloudinaryUpload}
                className="w-full px-3 py-2 border border-beige-300 rounded-md bg-beige-50 hover:bg-beige-100 transition-colors flex items-center justify-center"
                disabled={isUploading}
              >
                {isUploading ? (
                  <span>Chargement en cours...</span>
                ) : (
                  <>
                    <Upload size={18} className="mr-2" />
                    <span>Sélectionner une image</span>
                  </>
                )}
              </button>
              {formData.src && (
                <div className="mt-2">
                  <p className="text-sm text-taupe-600">Image sélectionnée :</p>
                  <div className="mt-1 h-20 w-full bg-beige-50 rounded-md overflow-hidden">
                    <img 
                      src={formData.src} 
                      alt="Aperçu" 
                      className="h-full object-contain mx-auto" 
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
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
