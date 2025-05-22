import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, X } from 'lucide-react';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import type { Creation, Category, OrderProcess } from '../../hooks/useCreations';

interface CreationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<Creation, 'id'> & { id?: string }) => void;
  editingCreation?: Creation | null;
  categories: Category[];
}

const CreationFormModal: React.FC<CreationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCreation,
  categories
}) => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Onglets du formulaire
  const tabs = [
    { id: 'general', label: 'Informations générales' },
    { id: 'details', label: 'Détails techniques' },
    { id: 'customization', label: 'Options de personnalisation' },
    { id: 'process', label: 'Processus de commande' },
    { id: 'examples', label: 'Images d\'exemple' }
  ];

  // État du formulaire
  const [formData, setFormData] = useState<Omit<Creation, 'id'> & { id?: string }>({
    title: '',
    description: '',
    price: 0,
    customPrice: '',
    image: '',
    category: '',
    featured: false,
    technicalDetails: [''],
    customizationOptions: [''],
    orderProcess: [
      { step: 1, title: '', description: '' }
    ],
    specifications: {
      standardSize: '',
      deliveryTime: '',
      material: '',
      additionalInfo: ['']
    },
    exampleImages: []
  });

  // Initialiser le formulaire avec les données de la création en cours d'édition
  useEffect(() => {
    if (editingCreation) {
      setFormData({
        ...editingCreation
      });
    } else {
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        description: '',
        price: 0,
        customPrice: '',
        image: '',
        category: '',
        featured: false,
        technicalDetails: [''],
        customizationOptions: [''],
        orderProcess: [
          { step: 1, title: '', description: '' }
        ],
        specifications: {
          standardSize: '',
          deliveryTime: '',
          material: '',
          additionalInfo: ['']
        },
        exampleImages: []
      });
    }
  }, [editingCreation, isOpen]);

  // Gérer les changements de champs de base
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Gérer les changements d'image principale
  const handleImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }));
  };

  // Gérer les changements d'images d'exemple
  const handleExampleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
    setFormData(prev => {
      const updatedImages = [...(prev.exampleImages || [])];
      if (!updatedImages[index]) {
        updatedImages[index] = { src: '', alt: '' };
      }
      updatedImages[index] = { ...updatedImages[index], [field]: value };
      return {
        ...prev,
        exampleImages: updatedImages
      };
    });
  };

  // Ajouter une image d'exemple
  const addExampleImage = () => {
    setFormData(prev => ({
      ...prev,
      exampleImages: [...(prev.exampleImages || []), { src: '', alt: '' }]
    }));
  };

  // Supprimer une image d'exemple
  const removeExampleImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exampleImages: (prev.exampleImages || []).filter((_, i) => i !== index)
    }));
  };

  // Gérer les changements de tableaux (technicalDetails, customizationOptions)
  const handleArrayFieldChange = (index: number, value: string, fieldName: 'technicalDetails' | 'customizationOptions' | 'additionalInfo') => {
    if (fieldName === 'additionalInfo') {
      setFormData(prev => {
        const updatedAdditionalInfo = [...(prev.specifications.additionalInfo || [])];
        updatedAdditionalInfo[index] = value;
        
        return {
          ...prev,
          specifications: {
            ...prev.specifications,
            additionalInfo: updatedAdditionalInfo
          }
        };
      });
    } else {
      setFormData(prev => {
        const updatedArray = [...prev[fieldName]];
        updatedArray[index] = value;
        
        return {
          ...prev,
          [fieldName]: updatedArray
        };
      });
    }
  };

  // Ajouter un élément à un tableau
  const addArrayField = (fieldName: 'technicalDetails' | 'customizationOptions' | 'additionalInfo') => {
    if (fieldName === 'additionalInfo') {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          additionalInfo: [...(prev.specifications.additionalInfo || []), '']
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], '']
      }));
    }
  };

  // Supprimer un élément d'un tableau
  const removeArrayField = (index: number, fieldName: 'technicalDetails' | 'customizationOptions' | 'additionalInfo') => {
    if (fieldName === 'additionalInfo') {
      setFormData(prev => {
        const updatedAdditionalInfo = [...(prev.specifications.additionalInfo || [])];
        if (updatedAdditionalInfo.length > 1) {
          updatedAdditionalInfo.splice(index, 1);
        }
        
        return {
          ...prev,
          specifications: {
            ...prev.specifications,
            additionalInfo: updatedAdditionalInfo
          }
        };
      });
    } else {
      setFormData(prev => {
        const updatedArray = [...prev[fieldName]];
        if (updatedArray.length > 1) {
          updatedArray.splice(index, 1);
        }
        
        return {
          ...prev,
          [fieldName]: updatedArray
        };
      });
    }
  };

  // Gérer les changements de spécifications
  const handleSpecificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  // Gérer les changements d'étapes de processus de commande
  const handleOrderProcessChange = (index: number, field: keyof OrderProcess, value: string | number) => {
    setFormData(prev => {
      const updatedProcess = [...prev.orderProcess];
      updatedProcess[index] = {
        ...updatedProcess[index],
        [field]: field === 'step' ? Number(value) : value
      };
      
      return {
        ...prev,
        orderProcess: updatedProcess
      };
    });
  };

  // Ajouter une étape au processus de commande
  const addOrderProcessStep = () => {
    setFormData(prev => {
      const newStep = prev.orderProcess.length + 1;
      
      return {
        ...prev,
        orderProcess: [
          ...prev.orderProcess,
          { step: newStep, title: '', description: '' }
        ]
      };
    });
  };

  // Supprimer une étape du processus de commande
  const removeOrderProcessStep = (index: number) => {
    setFormData(prev => {
      if (prev.orderProcess.length <= 1) {
        return prev;
      }
      
      const updatedProcess = prev.orderProcess.filter((_, idx) => idx !== index);
      
      // Réorganiser les numéros d'étapes
      const renumberedProcess = updatedProcess.map((step, idx) => ({
        ...step,
        step: idx + 1
      }));
      
      return {
        ...prev,
        orderProcess: renumberedProcess
      };
    });
  };

  // Soumettre le formulaire
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation : vérifier qu'au moins un des deux champs (prix ou prix personnalisé) est renseigné
    const newErrors: Record<string, string> = {};
    
    if ((formData.price === undefined || formData.price <= 0) && !formData.customPrice) {
      newErrors.price = 'Veuillez spécifier un prix ou un message de prix personnalisé';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={editingCreation ? 'Modifier la création' : 'Ajouter une création'} 
      size="lg"
      preventCloseOnContentClick={true}
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Navigation par onglets - version mobile optimisée */}
        <div className="flex space-x-2 mb-4 border-b border-beige-200 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'text-rose-500 border-b-2 border-rose-500' : 'text-taupe-600 hover:text-taupe-800'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu de l'onglet "Informations générales" */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium mb-1">Titre de la création</label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder="Nom de la création"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                  required
                  placeholder="Description détaillée de la création"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Prix (en €)</label>
                <input 
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price === undefined ? '' : formData.price}
                  onChange={handleChange}
                  className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                  min="0"
                  step="0.01"
                  placeholder="Laisser vide pour un prix personnalisé"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label htmlFor="customPrice" className="block text-sm font-medium mb-1">Prix personnalisé (texte)</label>
                <input 
                  type="text"
                  id="customPrice"
                  name="customPrice"
                  value={formData.customPrice || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ex: Sur devis, Nous consulter"
                />
                <p className="text-xs text-taupe-500 mt-1">Si renseigné, remplace le prix numérique</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories
                    .filter(category => category.id !== 'all')
                    .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center h-full pt-6">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-rose-600 border-beige-300 rounded focus:ring-rose-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-taupe-700">
                    En vedette sur la page d'accueil
                  </label>
                </div>
              </div>
            </div>

            {/* Le champ description a été déplacé dans la section au-dessus */}

            <ImageUploader
              value={formData.image}
              onChange={handleImageChange}
              placeholder="URL de l'image ou importer"
            />
          </div>
        )}

        {/* Contenu de l'onglet "Détails techniques" */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Détails techniques</label>
              <div className="space-y-2">
                {formData.technicalDetails.map((detail, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => handleArrayFieldChange(index, e.target.value, 'technicalDetails')}
                      className="input-field"
                      placeholder="ex: Support en bois inclus pour une présentation élégante"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'technicalDetails')}
                      className="ml-2 text-taupe-400 hover:text-red-500"
                      disabled={formData.technicalDetails.length <= 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayField('technicalDetails')}
                className="mt-2 text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Ajouter un détail technique
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Taille standard</label>
              <input
                type="text"
                name="standardSize"
                value={formData.specifications.standardSize}
                onChange={handleSpecificationsChange}
                className="input-field"
                placeholder="ex: 30 x 30 cm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Matériau</label>
              <input
                type="text"
                name="material"
                value={formData.specifications.material}
                onChange={handleSpecificationsChange}
                className="input-field"
                placeholder="ex: Plexiglass 3mm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Délai de livraison</label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.specifications.deliveryTime}
                onChange={handleSpecificationsChange}
                className="input-field"
                placeholder="ex: 1-2 semaines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Informations additionnelles</label>
              <div className="space-y-2">
                {formData.specifications.additionalInfo.map((info, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={info}
                      onChange={(e) => handleArrayFieldChange(index, e.target.value, 'additionalInfo')}
                      className="input-field"
                      placeholder="ex: Emballage sécurisé pour la livraison"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'additionalInfo')}
                      className="ml-2 text-taupe-400 hover:text-red-500"
                      disabled={formData.specifications.additionalInfo.length <= 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayField('additionalInfo')}
                className="mt-2 text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Ajouter une information additionnelle
              </button>
            </div>
          </div>
        )}

        {/* Contenu de l'onglet "Options personnalisation" */}
        {activeTab === 'customization' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-3">Options de personnalisation</label>
            <div className="space-y-2">
              {formData.customizationOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, 'customizationOptions')}
                    className="input-field"
                    placeholder="ex: Choix de la couleur du fond (voir nuancier)"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField(index, 'customizationOptions')}
                    className="ml-2 text-taupe-400 hover:text-red-500"
                    disabled={formData.customizationOptions.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayField('customizationOptions')}
              className="mt-2 text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter une option de personnalisation
            </button>
          </div>
        )}

        {/* Contenu de l'onglet "Processus de commande" */}
        {activeTab === 'process' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-3">Étapes du processus de commande</label>
            <div className="space-y-4">
              {formData.orderProcess.map((step, index) => (
                <div key={index} className="p-4 bg-beige-50 rounded-lg border border-beige-200 relative">
                  <button
                    type="button"
                    onClick={() => removeOrderProcessStep(index)}
                    className="absolute top-2 right-2 text-taupe-400 hover:text-red-500"
                    disabled={formData.orderProcess.length <= 1}
                  >
                    <X size={16} />
                  </button>
                  
                  <div className="grid grid-cols-12 gap-2 sm:gap-4">
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-xs font-medium mb-1 text-taupe-600">Étape</label>
                      <input
                        type="number"
                        value={step.step}
                        onChange={(e) => handleOrderProcessChange(index, 'step', parseInt(e.target.value))}
                        className="input-field text-center"
                        min="1"
                      />
                    </div>
                    
                    <div className="col-span-9 sm:col-span-4 mb-2 sm:mb-0">
                      <label className="block text-xs font-medium mb-1 text-taupe-600">Titre</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleOrderProcessChange(index, 'title', e.target.value)}
                        className="input-field"
                        placeholder="ex: Consultation"
                      />
                    </div>
                    
                    <div className="col-span-12 sm:col-span-6">
                      <label className="block text-xs font-medium mb-1 text-taupe-600">Description</label>
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) => handleOrderProcessChange(index, 'description', e.target.value)}
                        className="input-field"
                        placeholder="ex: Discussion de vos besoins"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addOrderProcessStep}
              className="mt-2 text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter une étape
            </button>
          </div>
        )}

        {/* Contenu de l'onglet "Images d'exemple" */}
        {activeTab === 'examples' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Images d'exemple</label>
              <button
                type="button"
                onClick={addExampleImage}
                className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Ajouter une image
              </button>
            </div>
            
            {formData.exampleImages && formData.exampleImages.length === 0 && (
              <div className="text-center py-8 bg-beige-50 rounded-lg border border-dashed border-beige-200">
                <p className="text-taupe-500">Aucune image d'exemple ajoutée</p>
                <button
                  type="button"
                  onClick={addExampleImage}
                  className="mt-2 text-rose-500 hover:text-rose-600 text-sm font-medium inline-flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter une image
                </button>
              </div>
            )}
            
            <div className="space-y-4">
              {formData.exampleImages && formData.exampleImages.map((image, index) => (
                <div key={index} className="p-4 bg-beige-50 rounded-lg border border-beige-200 relative">
                  <button
                    type="button"
                    onClick={() => removeExampleImage(index)}
                    className="absolute top-2 right-2 text-taupe-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-taupe-600">Image {index + 1}</label>
                      <ImageUploader
                        value={image.src}
                        onChange={(url) => handleExampleImageChange(index, 'src', url)}
                        placeholder="URL de l'image"
                        defaultMode="upload"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1 text-taupe-600">Texte alternatif</label>
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => handleExampleImageChange(index, 'alt', e.target.value)}
                        className="input-field"
                        placeholder="Description de l'image"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
            {editingCreation ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreationFormModal;
