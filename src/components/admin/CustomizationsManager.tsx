import React, { useState } from 'react';
import { Trash2, Edit, Plus, Eye } from 'lucide-react';
import { useCustomizations, CustomItem } from '../../hooks/useCustomizations';
import CustomItemFormModal from './CustomItemFormModal';
import GlobalSaveButton from './GlobalSaveButton';

const CustomizationsManager: React.FC = () => {
  const { customItems, loading, error, addCustomItem, updateCustomItem, deleteCustomItem } = useCustomizations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomItem | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Ouvrir le modal pour ajouter une personnalisation
  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };
  
  // Ouvrir le modal pour modifier une personnalisation
  const handleEdit = (item: CustomItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  // Gérer la soumission du formulaire (ajout ou mise à jour)
  const handleFormSubmit = async (formData: Omit<CustomItem, 'id'> & { id?: string }) => {
    try {
      if (formData.id) {
        // Mettre à jour une personnalisation existante
        await updateCustomItem(formData.id, formData);
      } else {
        // Ajouter une nouvelle personnalisation
        await addCustomItem(formData);
      }
      
      // Indiquer qu'il y a des changements non enregistrés
      setHasUnsavedChanges(true);
      // Fermer le modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la personnalisation:", error);
    }
  };
  
  // Supprimer une personnalisation
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette personnalisation ?')) {
      try {
        await deleteCustomItem(id);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error("Erreur lors de la suppression de la personnalisation:", error);
      }
    }
  };
  
  // Prévisualiser une personnalisation
  const handlePreview = (item: CustomItem) => {
    // Ouvrir la page de personnalisation avec l'élément sélectionné
    window.open(`/personnalisation#${item.id}`, '_blank');
  };

  return (
    <div className="p-4 bg-beige-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-taupe-800 font-semibold">Gestion des personnalisations</h2>
        <button
          onClick={handleAddNew}
          className="btn-primary px-3 py-2 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Ajouter une personnalisation
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Erreur: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customItems.length === 0 ? (
            <p className="text-center py-8 text-taupe-600 col-span-2">
              Aucune personnalisation pour le moment.
            </p>
          ) : (
            customItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-beige-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex space-x-4">
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-beige-100 flex-shrink-0">
                    <img 
                      src={item.images[0]?.src || '/images/placeholder.jpg'} 
                      alt={item.images[0]?.alt || item.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-taupe-600 mb-1">
                          {item.featured && (
                            <span className="mr-2 inline-block bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded">
                              En vedette
                            </span>
                          )}
                          <span className="text-rose-500 font-medium">
                            {item.customPrice 
                              ? item.customPrice 
                              : item.price !== undefined 
                                ? `${item.price}€` 
                                : 'Prix non défini'}
                          </span>
                          <span className="text-taupe-500 text-xs ml-1">min. {item.minQuantity} pièces</span>
                        </p>
                        <p className="text-taupe-700 text-sm line-clamp-2">{item.shortDescription}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePreview(item)}
                          className="text-taupe-600 hover:text-taupe-800 p-1"
                          aria-label="Prévisualiser"
                          title="Prévisualiser"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-taupe-600 hover:text-taupe-800 p-1"
                          aria-label="Modifier"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                          aria-label="Supprimer"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Modal pour ajouter/modifier une personnalisation */}
      <CustomItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
      />
      
      {/* Bouton flottant pour enregistrer les modifications */}
      <GlobalSaveButton 
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveComplete={() => setHasUnsavedChanges(false)}
      />
    </div>
  );
};

export default CustomizationsManager;
