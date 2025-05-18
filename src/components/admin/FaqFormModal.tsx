import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Modal from './Modal';
import { Faq } from '../../hooks/useFaqs';

interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Faq> & { id?: string }) => void;
  editingFaq?: Faq | null;
}

const FaqFormModal: React.FC<FaqFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingFaq
}) => {
  // État du formulaire
  const [formData, setFormData] = useState<Partial<Faq> & { id?: string }>({
    question: '',
    answer: ''
  });

  // Initialiser le formulaire avec les données de la FAQ en cours d'édition
  useEffect(() => {
    if (editingFaq) {
      setFormData({
        ...editingFaq
      });
    } else {
      // Réinitialiser le formulaire
      setFormData({
        question: '',
        answer: ''
      });
    }
  }, [editingFaq, isOpen]);

  // Gérer les changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      title={editingFaq ? 'Modifier la FAQ' : 'Ajouter une FAQ'}
      size="md"
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Question */}
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-taupe-700 mb-1">
            Question
          </label>
          <input
            id="question"
            name="question"
            type="text"
            value={formData.question || ''}
            onChange={handleChange}
            required
            className="input-field text-sm w-full"
            placeholder="Entrez la question..."
          />
        </div>

        {/* Réponse */}
        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-taupe-700 mb-1">
            Réponse
          </label>
          <textarea
            id="answer"
            name="answer"
            value={formData.answer || ''}
            onChange={handleChange}
            required
            rows={6}
            className="input-field text-sm w-full"
            placeholder="Entrez la réponse..."
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
            {editingFaq ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FaqFormModal;
