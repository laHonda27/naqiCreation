import React, { useState } from 'react';
import { Trash2, Edit, Plus, X, Check } from 'lucide-react';
import { useCreations, Category } from '../../hooks/useCreations';

const CategoriesManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCreations();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: ''
  });
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: ''
    });
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Start editing a category
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name
    });
    setEditingId(category.id);
    setIsAdding(true);
  };
  
  // Cancel adding/editing
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };
  
  // Submit the form (add or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing category
      await updateCategory(editingId, formData);
      setEditingId(null);
    } else {
      // Add new category
      await addCategory(formData);
    }
    
    setIsAdding(false);
    resetForm();
  };
  
  // Delete a category
  const handleDelete = async (id: string) => {
    if (id === 'all') {
      alert('La catégorie "Tous" ne peut pas être supprimée');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Les créations associées seront déplacées dans la catégorie "Tous".')) {
      await deleteCategory(id);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des catégories</h2>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary px-4 py-2 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une catégorie
          </button>
        )}
      </div>
      
      {isAdding ? (
        <div className="bg-beige-50 p-6 rounded-lg border border-beige-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">
              {editingId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-taupe-600 hover:text-taupe-800"
              aria-label="Annuler"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-taupe-700 mb-1">
                Nom de la catégorie
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-outline px-4 py-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary px-4 py-2 flex items-center"
              >
                <Check size={18} className="mr-2" />
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
      
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
    </div>
  );
};

export default CategoriesManager;