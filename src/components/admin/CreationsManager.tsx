import React, { useState } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useContentManager } from '../../hooks/useContentManager';
import type { Creation } from '../../hooks/useContentManager';
import CreationFormModal from './CreationFormModal';
import GlobalSaveButton from './GlobalSaveButton';

const CreationsManager: React.FC = () => {
  const { creations, categories, addCreation, updateCreation, deleteCreation } = useContentManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCreation, setEditingCreation] = useState<Creation | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Ouvrir le modal pour ajouter une création
  const handleAddNew = () => {
    setEditingCreation(null);
    setIsModalOpen(true);
  };
  
  // Ouvrir le modal pour modifier une création
  const handleEdit = (creation: Creation) => {
    setEditingCreation(creation);
    setIsModalOpen(true);
  };
  
  // Gérer la soumission du formulaire (ajout ou mise à jour)
  const handleFormSubmit = async (formData: Omit<Creation, 'id'> & { id?: string }) => {
    try {
      if (formData.id) {
        // Mettre à jour une création existante
        await updateCreation({
          ...formData,
          id: formData.id
        } as Creation);
      } else {
        // Ajouter une nouvelle création
        await addCreation({
          ...formData,
          id: crypto.randomUUID() // Générer un nouvel ID
        } as Creation);
      }
      
      // Indiquer qu'il y a des changements non enregistrés
      setHasUnsavedChanges(true);
      // Fermer le modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la création:", error);
    }
  };
  
  // Supprimer une création
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette création ?')) {
      try {
        await deleteCreation(id);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error("Erreur lors de la suppression de la création:", error);
      }
    }
  };

  return (
    <div className="p-4 bg-beige-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-taupe-800 font-semibold">Gestion des créations</h2>
        <button
          onClick={handleAddNew}
          className="btn-primary px-3 py-2 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Ajouter une création
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creations.length === 0 ? (
          <p className="text-center py-8 text-taupe-600 col-span-2">
            Aucune création pour le moment.
          </p>
        ) : (
          creations.map(creation => (
            <div key={creation.id} className="bg-white p-4 rounded-lg border border-beige-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex space-x-4">
                <div className="w-24 h-24 rounded-md overflow-hidden bg-beige-100 flex-shrink-0">
                  <img 
                    src={creation.image} 
                    alt={creation.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+non+disponible';
                    }}
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{creation.title}</h3>
                      <p className="text-sm text-taupe-600 mb-1">
                        {categories.find(c => c.id === creation.category)?.name || creation.category}
                        {creation.featured && (
                          <span className="ml-2 inline-block bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded">
                            En vedette
                          </span>
                        )}
                      </p>
                      <p className="text-taupe-700 text-sm line-clamp-2">{creation.description}</p>
                      <p className="text-rose-500 font-medium mt-1">
                        {creation.customPrice 
                          ? creation.customPrice 
                          : creation.price !== undefined 
                            ? `${creation.price}€` 
                            : 'Prix non défini'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(creation)}
                        className="text-taupe-600 hover:text-taupe-800 p-1"
                        aria-label="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(creation.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        aria-label="Supprimer"
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

      {/* Modal pour ajouter/modifier une création */}
      <CreationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingCreation={editingCreation}
        categories={categories}
      />
      
      {/* Bouton flottant pour enregistrer les modifications */}
      <GlobalSaveButton 
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveComplete={() => setHasUnsavedChanges(false)}
      />
    </div>
  );
};

export default CreationsManager;
