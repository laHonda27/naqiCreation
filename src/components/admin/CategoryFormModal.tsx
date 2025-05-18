import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Modal from './Modal';
import type { Category } from '../../hooks/useCreations';

// Vérifier la structure de Category pour s'assurer que nous avons les bons champs

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Category> & { id?: string }) => void;
  editingCategory?: Category | null;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCategory
}) => {
  // État du formulaire
  const [formData, setFormData] = useState<Partial<Category> & { id?: string }>({
    name: ''
  });

  // Initialiser le formulaire avec les données de la catégorie en cours d'édition
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        ...editingCategory
      });
    } else {
      // Réinitialiser le formulaire
      setFormData({
        name: ''
      });
    }
  }, [editingCategory, isOpen]);

  // Gérer les changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
      size="sm"
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
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
            className="input-field text-sm w-full"
            placeholder="Ex: Bijoux, Accessoires, etc."
          />
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
            {editingCategory ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
