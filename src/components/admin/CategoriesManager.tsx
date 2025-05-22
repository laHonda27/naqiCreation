import React, { useState } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useCreations, Category } from '../../hooks/useCreations';
import CategoryFormModal from './CategoryFormModal';
import GlobalSaveButton from './GlobalSaveButton';
import ConfirmationModal from './ConfirmationModal';

const CategoriesManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCreations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // État pour la modal de confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ouvrir le modal pour ajouter une catégorie
  const handleAddNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour modifier une catégorie
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Gérer la soumission du formulaire (ajout ou mise à jour)
  const handleFormSubmit = async (formData: Partial<Category> & { id?: string }) => {
    try {
      if (formData.id) {
        // Mettre à jour une catégorie existante
        await updateCategory(formData.id, formData);
      } else {
        // Ajouter une nouvelle catégorie
        await addCategory(formData);
      }

      // Indiquer qu'il y a des changements non enregistrés
      setHasUnsavedChanges(true);
      // Fermer le modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la catégorie:", error);
    }
  };

  // Ouvrir la modal de confirmation pour supprimer une catégorie
  const confirmDelete = (id: string) => {
    if (id === 'all') {
      setErrorMessage('La catégorie "Tous" ne peut pas être supprimée');
      setIsConfirmModalOpen(true);
      return;
    }
    
    setCategoryToDelete(id);
    setErrorMessage(null);
    setIsConfirmModalOpen(true);
  };
  
  // Supprimer une catégorie après confirmation
  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete);
        setHasUnsavedChanges(true);
        setCategoryToDelete(null);
      } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des catégories</h2>

        <button
          onClick={handleAddNew}
          className="btn-primary px-4 py-2 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Ajouter une catégorie
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-beige-200">
                <th className="py-3 px-4 font-medium">ID</th>
                <th className="py-3 px-4 font-medium">Nom</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-taupe-600">
                    Aucune catégorie disponible.
                  </td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id} className="border-b border-beige-100 hover:bg-beige-50">
                    <td className="py-3 px-4 text-taupe-700">{category.id}</td>
                    <td className="py-3 px-4 font-medium">{category.name}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-taupe-600 hover:text-taupe-800 p-1"
                          aria-label="Modifier"
                          disabled={category.id === 'all'}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(category.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                          aria-label="Supprimer"
                          disabled={category.id === 'all'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour ajouter/modifier une catégorie */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingCategory={editingCategory}
      />
      
      {/* Bouton flottant pour enregistrer les modifications */}
      <GlobalSaveButton 
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveComplete={() => setHasUnsavedChanges(false)}
      />
      
      {/* Modal de confirmation pour la suppression */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setCategoryToDelete(null);
          setErrorMessage(null);
        }}
        onConfirm={errorMessage ? () => setIsConfirmModalOpen(false) : handleDelete}
        title={errorMessage ? "Action impossible" : "Confirmer la suppression"}
        message={errorMessage || "\u00cates-vous s\u00fbr de vouloir supprimer cette cat\u00e9gorie ? Les cr\u00e9ations associ\u00e9es seront d\u00e9plac\u00e9es dans la cat\u00e9gorie \"Tous\"."}
        confirmText={errorMessage ? "J'ai compris" : "Supprimer"}
        cancelText={errorMessage ? undefined : "Annuler"}
        type={errorMessage ? "warning" : "danger"}
      />
    </div>
  );
};

export default CategoriesManager;