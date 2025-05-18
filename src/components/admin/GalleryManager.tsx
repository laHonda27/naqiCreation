import React, { useState } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useGallery, GalleryImage } from '../../hooks/useGallery';
import GalleryFormModal from './GalleryFormModal';
import GlobalSaveButton from './GlobalSaveButton';

const GalleryManager: React.FC = () => {
  const { galleryData, loading, error, addImage, updateImage, deleteImage, addCategory } = useGallery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Ouvrir le modal pour ajouter une image
  const handleAddNew = () => {
    setEditingImage(null);
    setIsModalOpen(true);
  };
  
  // Ouvrir le modal pour modifier une image
  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setIsModalOpen(true);
  };
  
  // Gérer la soumission du formulaire (ajout ou mise à jour)
  const handleFormSubmit = async (formData: Partial<GalleryImage> & { id?: string }) => {
    try {
      setHasUnsavedChanges(true);
      
      // Si une nouvelle catégorie a été ajoutée, l'ajouter à la liste
      if (formData.category && !galleryData.categories.includes(formData.category)) {
        await addCategory(formData.category);
      }
      
      if (formData.id) {
        // Mettre à jour une image existante
        await updateImage(formData.id, formData);
      } else {
        // Ajouter une nouvelle image
        await addImage({
          src: formData.src || '',
          alt: formData.alt || '',
          category: formData.category || ''
        });
      }
      
      setIsModalOpen(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };
  
  // Supprimer une image
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      try {
        setHasUnsavedChanges(true);
        await deleteImage(id);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
      }
    }
  };
  
  // Filtrer les images par catégorie
  const filteredImages = activeCategory === 'all' 
    ? galleryData.images 
    : galleryData.images.filter(image => image.category === activeCategory);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-taupe-800">Gestion de la Galerie</h2>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-taupe-800">Gestion de la Galerie</h2>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-taupe-800">Gestion de la Galerie</h2>
        
        {hasUnsavedChanges && (
          <GlobalSaveButton 
            hasUnsavedChanges={hasUnsavedChanges}
            onSaveComplete={() => setHasUnsavedChanges(false)}
          />
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === 'all' 
                ? 'bg-rose-400 text-white' 
                : 'bg-beige-100 text-taupe-600 hover:bg-beige-200'
            }`}
          >
            Toutes les images
          </button>
          
          {galleryData.categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category 
                  ? 'bg-rose-400 text-white' 
                  : 'bg-beige-100 text-taupe-600 hover:bg-beige-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-500 px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={16} />
          <span>Ajouter une image</span>
        </button>
      </div>
      
      {filteredImages.length === 0 ? (
        <div className="text-center py-8 bg-beige-50 rounded-lg">
          <p className="text-taupe-600">Aucune image dans cette catégorie. Cliquez sur "Ajouter une image" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="bg-beige-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[3/4] relative">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-taupe-900/0 hover:bg-taupe-900/20 transition-all duration-300 flex items-end justify-end p-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 bg-white/80 hover:bg-white text-taupe-600 hover:text-rose-400 rounded-full transition-colors"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 bg-white/80 hover:bg-white text-taupe-600 hover:text-rose-400 rounded-full transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-taupe-800 truncate">{image.alt}</p>
                <p className="text-xs text-taupe-500">{image.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal pour ajouter/modifier une image */}
      <GalleryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingImage={editingImage}
        categories={galleryData.categories}
      />
    </div>
  );
};

export default GalleryManager;
