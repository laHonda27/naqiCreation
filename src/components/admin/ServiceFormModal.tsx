import React, { useState, useEffect } from 'react';
import { Check, Plus, X } from 'lucide-react';
import Modal from './Modal';
import { ServiceDetail } from '../../hooks/useServiceDetails';
import { PenTool, Palette, Box } from 'lucide-react';

// Icônes disponibles pour les services
const availableIcons = [
  { id: 'PenTool', label: 'Stylo', component: <PenTool size={20} /> },
  { id: 'Palette', label: 'Palette', component: <Palette size={20} /> },
  { id: 'Box', label: 'Boîte', component: <Box size={20} /> }
];

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<ServiceDetail, 'id'> & { id?: string }) => void;
  editingService?: ServiceDetail | null;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingService
}) => {
  // État du formulaire
  const [formData, setFormData] = useState<Omit<ServiceDetail, 'id'> & { id?: string }>({
    iconType: 'PenTool',
    title: '',
    description: '',
    features: [''],
    link: '/prestations' // Le lien est conservé dans les données mais n'est pas modifiable via l'interface
  });

  // Initialiser le formulaire avec les données du service en cours d'édition
  useEffect(() => {
    if (editingService) {
      setFormData({
        ...editingService
      });
    } else {
      // Réinitialiser le formulaire
      setFormData({
        iconType: 'PenTool',
        title: '',
        description: '',
        features: [''],
        link: '/prestations' // Valeur par défaut pour le lien
      });
    }
  }, [editingService, isOpen]);

  // Gérer les changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mettre à jour une fonctionnalité
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  // Ajouter une nouvelle fonctionnalité vide
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  // Supprimer une fonctionnalité
  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  // Soumettre le formulaire
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de base
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Le titre et la description sont obligatoires.");
      return;
    }
    
    // Filtrer les fonctionnalités vides
    const filteredFeatures = formData.features.filter(f => f.trim() !== '');
    if (filteredFeatures.length === 0) {
      alert("Au moins une fonctionnalité est requise.");
      return;
    }
    
    // Soumettre les données avec les fonctionnalités filtrées
    onSubmit({
      ...formData,
      features: filteredFeatures
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingService ? 'Modifier le service' : 'Ajouter un service'}
      size="lg"
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Sélection d'icône */}
        <div>
          <label className="block text-sm font-medium text-taupe-700 mb-2">Icône</label>
          <div className="flex space-x-2">
            {availableIcons.map(icon => (
              <button
                key={icon.id}
                type="button"
                onClick={() => setFormData({...formData, iconType: icon.id})}
                className={`p-2 rounded-md ${formData.iconType === icon.id ? 'bg-rose-100 text-rose-500' : 'bg-beige-100 text-taupe-600'}`}
                title={icon.label}
              >
                {icon.component}
              </button>
            ))}
          </div>
        </div>
        
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-taupe-700 mb-1">
            Titre
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field text-sm w-full"
            placeholder="Titre du service"
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-taupe-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="input-field text-sm w-full"
            placeholder="Description du service"
          />
        </div>
        
        {/* Fonctionnalités */}
        <div>
          <label className="block text-sm font-medium text-taupe-700 mb-2">Fonctionnalités</label>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 p-2 border border-beige-300 rounded-md"
                  placeholder="Caractéristique du service"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length <= 1}
                  className={`p-2 rounded-md ${formData.features.length <= 1 ? 'text-taupe-400 bg-beige-100 cursor-not-allowed' : 'text-rose-500 bg-rose-100 hover:bg-rose-200'}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="text-sm text-rose-500 hover:text-rose-600 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter une fonctionnalité
            </button>
          </div>
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
            {editingService ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ServiceFormModal;
