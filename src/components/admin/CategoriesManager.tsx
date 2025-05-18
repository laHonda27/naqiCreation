import React, { useState } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useCreations, Category } from '../../hooks/useCreations';
import CategoryFormModal from './CategoryFormModal';
import GlobalSaveButton from './GlobalSaveButton';

const CategoriesManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCreations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  // Supprimer une catégorie
  const handleDelete = async (id: string) => {
    if (id === 'all') {
      alert('La catégorie "Tous" ne peut pas être supprimée');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Les créations associées seront déplacées dans la catégorie "Tous".')) {
      try {
        await deleteCategory(id);
        setHasUnsavedChanges(true);
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
                          onClick={() => handleDelete(category.id)}
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
    </div>
  );
};

export default CategoriesManager;