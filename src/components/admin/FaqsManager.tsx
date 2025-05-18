import React, { useState } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useFaqs, FaqPageType, Faq } from '../../hooks/useFaqs';
import FaqFormModal from './FaqFormModal';
import GlobalSaveButton from './GlobalSaveButton';

const FaqsManager: React.FC = () => {
  const { getFaqsByPage, addFaq, updateFaq, deleteFaq } = useFaqs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activePage, setActivePage] = useState<FaqPageType>('home');
  
  // Ouvrir le modal pour ajouter une FAQ
  const handleAddNew = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };
  
  // Ouvrir le modal pour modifier une FAQ
  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };
  
  // Gérer la soumission du formulaire (ajout ou mise à jour)
  const handleFormSubmit = async (formData: Partial<Faq> & { id?: string }) => {
    try {
      setHasUnsavedChanges(true);
      
      if (formData.id) {
        // Mettre à jour une FAQ existante
        await updateFaq(activePage, formData.id, formData);
      } else {
        // Ajouter une nouvelle FAQ
        await addFaq(activePage, {
          question: formData.question || '',
          answer: formData.answer || ''
        });
      }
      
      setIsModalOpen(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };
  
  // Supprimer une FAQ
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) {
      try {
        setHasUnsavedChanges(true);
        await deleteFaq(activePage, id);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Erreur lors de la suppression de la FAQ:', error);
      }
    }
  };
  
  // Obtenir les FAQs pour la page active
  const pageFaqs = getFaqsByPage(activePage);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-taupe-800">Gestion des FAQs</h2>
        
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
            onClick={() => setActivePage('home')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activePage === 'home' 
                ? 'bg-rose-400 text-white' 
                : 'bg-beige-100 text-taupe-600 hover:bg-beige-200'
            }`}
          >
            Page d'accueil
          </button>
          <button
            onClick={() => setActivePage('contact')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activePage === 'contact' 
                ? 'bg-rose-400 text-white' 
                : 'bg-beige-100 text-taupe-600 hover:bg-beige-200'
            }`}
          >
            Page de contact
          </button>
          <button
            onClick={() => setActivePage('services')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activePage === 'services' 
                ? 'bg-rose-400 text-white' 
                : 'bg-beige-100 text-taupe-600 hover:bg-beige-200'
            }`}
          >
            Page de prestations
          </button>
          <button
            onClick={() => setActivePage('customization')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activePage === 'customization' 
                ? 'bg-rose-400 text-white' 
                : 'bg-beige-100 text-taupe-600 hover:bg-beige-200'
            }`}
          >
            Page de personnalisation
          </button>
        </div>
        
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-500 px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={16} />
          <span>Ajouter une FAQ</span>
        </button>
      </div>
      
      {pageFaqs.length === 0 ? (
        <div className="text-center py-8 bg-beige-50 rounded-lg">
          <p className="text-taupe-600">Aucune FAQ pour cette page. Cliquez sur "Ajouter une FAQ" pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pageFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-beige-50 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-taupe-800">{faq.question}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-1 text-taupe-500 hover:text-rose-400 transition-colors"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1 text-taupe-500 hover:text-rose-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-taupe-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal pour ajouter/modifier une FAQ */}
      <FaqFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingFaq={editingFaq}
      />
    </div>
  );
};

export default FaqsManager;
