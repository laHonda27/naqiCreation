import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Trash2, Link as LinkIcon, Check, Edit } from 'lucide-react';
import { useContentManager } from '../../hooks/useContentManager';
import { Creation, OrderProcess, Category, Specifications } from '../../types';
import { imageUploadService } from '../../services/imageUploadService';

const CreationsManager: React.FC = () => {
  const { creations, categories, addCreation, updateCreation, deleteCreation } = useContentManager();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [imageSourceType, setImageSourceType] = useState<'url' | 'upload'>('url');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Creation, 'id'>>({
    title: '',
    description: '',
    price: 0,
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
    }
  });
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
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
      }
    });
    setActiveSection(null);
  };
  
  // Toggle a section's visibility
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };
  
  // Handle form input changes for basic fields
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
        [name]: parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Fonction pour gérer l'upload d'image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      setUploadError('Le fichier doit être une image');
      return;
    }
    
    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setUploadError('L\'image est trop volumineuse (max 5MB)');
      return;
    }
    
    try {
      setUploadStatus('loading');
      setUploadError('');
      
      // Utiliser la catégorie actuelle ou 'divers' si aucune n'est sélectionnée
      const categoryId = formData.category || 'divers';
      
      // Uploader l'image
      const imagePath = await imageUploadService.uploadCreationImage(file, categoryId);
      
      // Mettre à jour le formulaire avec le chemin de l'image
      setFormData(prev => ({
        ...prev,
        image: imagePath
      }));
      
      setUploadStatus('success');
    } catch (error: any) {
      setUploadStatus('error');
      setUploadError(error.message || 'Erreur lors du téléchargement de l\'image');
    }
  };
  
  // Handle array field changes (technical details, customization options)
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
  
  // Add a new entry to an array field
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
  
  // Remove an entry from an array field
  const removeArrayField = (index: number, fieldName: 'technicalDetails' | 'customizationOptions' | 'additionalInfo') => {
    if (fieldName === 'additionalInfo') {
      setFormData(prev => {
        const updatedAdditionalInfo = [...(prev.specifications.additionalInfo || [])];
        updatedAdditionalInfo.splice(index, 1);
        
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
        updatedArray.splice(index, 1);
        
        return {
          ...prev,
          [fieldName]: updatedArray
        };
      });
    }
  };
  
  // Handle specifications changes
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
  
  // Handle order process changes
  const handleOrderProcessChange = (index: number, field: keyof OrderProcess, value: string | number) => {
    setFormData(prev => {
      const updatedOrderProcess = [...prev.orderProcess];
      updatedOrderProcess[index] = {
        ...updatedOrderProcess[index],
        [field]: field === 'step' ? Number(value) : value
      };
      
      return {
        ...prev,
        orderProcess: updatedOrderProcess
      };
    });
  };
  
  // Add a new order process step
  const addOrderProcessStep = () => {
    setFormData(prev => {
      const nextStep = prev.orderProcess.length + 1;
      return {
        ...prev,
        orderProcess: [
          ...prev.orderProcess,
          { step: nextStep, title: '', description: '' }
        ]
      };
    });
  };
  
  // Remove an order process step
  const removeOrderProcessStep = (index: number) => {
    setFormData(prev => {
      const updatedOrderProcess = [...prev.orderProcess];
      updatedOrderProcess.splice(index, 1);
      
      // Update step numbers
      return {
        ...prev,
        orderProcess: updatedOrderProcess.map((step, idx) => ({
          ...step,
          step: idx + 1
        }))
      };
    });
  };
  
  // Render technical details fields
  const renderTechnicalDetailsFields = () => {
    return formData.technicalDetails.map((detail: string, index: number) => (
      <div key={`technical-detail-${index}`} className="flex items-center mb-2">
        <input
          type="text"
          value={detail}
          onChange={(e) => handleArrayFieldChange(index, e.target.value, 'technicalDetails')}
          className="input-field text-sm flex-grow"
          placeholder="Détail technique"
        />
        <button 
          type="button" 
          onClick={() => removeArrayField(index, 'technicalDetails')}
          className="ml-2 text-taupe-500 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ));
  };
  
  // Render customization options fields
  const renderCustomizationOptionsFields = () => {
    return formData.customizationOptions.map((option: string, index: number) => (
      <div key={`customization-option-${index}`} className="flex items-center mb-2">
        <input
          type="text"
          value={option}
          onChange={(e) => handleArrayFieldChange(index, e.target.value, 'customizationOptions')}
          className="input-field text-sm flex-grow"
          placeholder="Option de personnalisation"
        />
        <button 
          type="button" 
          onClick={() => removeArrayField(index, 'customizationOptions')}
          className="ml-2 text-taupe-500 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ));
  };
  
  // Render additional info fields
  const renderAdditionalInfoFields = () => {
    return formData.specifications.additionalInfo.map((info: string, index: number) => (
      <div key={`additional-info-${index}`} className="flex items-center mb-2">
        <input
          type="text"
          value={info}
          onChange={(e) => handleArrayFieldChange(index, e.target.value, 'additionalInfo')}
          className="input-field text-sm flex-grow"
          placeholder="Information supplémentaire"
        />
        <button 
          type="button" 
          onClick={() => removeArrayField(index, 'additionalInfo')}
          className="ml-2 text-taupe-500 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ));
  };
  
  // Start editing a creation
  const handleEdit = (creation: Creation) => {
    setFormData({
      title: creation.title,
      description: creation.description,
      price: creation.price,
      image: creation.image,
      category: creation.category,
      featured: creation.featured,
      technicalDetails: creation.technicalDetails,
      customizationOptions: creation.customizationOptions,
      orderProcess: creation.orderProcess,
      specifications: creation.specifications
    });
    setEditingId(creation.id);
    setIsAdding(true);
  };
  
  // Cancel adding/editing
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };
  
  // Submit the form (add or update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty array entries
    const cleanedFormData = {
      ...formData,
      technicalDetails: formData.technicalDetails.filter((detail: string) => detail.trim() !== ''),
      customizationOptions: formData.customizationOptions.filter((option: string) => option.trim() !== ''),
      specifications: {
        ...formData.specifications,
        additionalInfo: formData.specifications.additionalInfo.filter((info: string) => info.trim() !== '')
      }
    };
    
    if (editingId) {
      // Update existing creation
      updateCreation({
        id: editingId,
        title: cleanedFormData.title,
        description: cleanedFormData.description,
        price: cleanedFormData.price,
        image: cleanedFormData.image,
        category: cleanedFormData.category,
        featured: cleanedFormData.featured,
        technicalDetails: cleanedFormData.technicalDetails,
        customizationOptions: cleanedFormData.customizationOptions,
        orderProcess: cleanedFormData.orderProcess,
        specifications: cleanedFormData.specifications,
        date: new Date().toISOString().split('T')[0]
      });
    } else {
      // Add new creation
      addCreation({
        id: `creation-${Date.now()}`, // Générer un ID unique
        title: cleanedFormData.title,
        description: cleanedFormData.description,
        price: cleanedFormData.price,
        image: cleanedFormData.image,
        category: cleanedFormData.category,
        featured: cleanedFormData.featured,
        technicalDetails: cleanedFormData.technicalDetails,
        customizationOptions: cleanedFormData.customizationOptions,
        orderProcess: cleanedFormData.orderProcess,
        specifications: cleanedFormData.specifications,
        date: new Date().toISOString().split('T')[0]
      });
    }
    
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };
  
  // Delete a creation
  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette création ?')) {
      deleteCreation(id);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des créations</h2>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary px-4 py-2 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une création
          </button>
        )}
      </div>
      
      {isAdding ? (
        <div className="bg-beige-50 p-6 rounded-lg border border-beige-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">
              {editingId ? 'Modifier la création' : 'Ajouter une création'}
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
            {/* Section 1: Informations de base */}
            <div className="bg-white p-4 rounded-lg border border-beige-200">
              <button 
                type="button" 
                className="flex justify-between w-full items-center text-left font-medium text-taupe-800 mb-2"
                onClick={() => toggleSection('basic')}
              >
                <span>Informations de base</span>
                {activeSection === 'basic' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {activeSection === 'basic' && (
                <div className="pt-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="input-field text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-taupe-700 mb-1">
                        Catégorie
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="input-field text-sm"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.filter(cat => cat.id !== 'all').map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-taupe-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="input-field text-sm resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-taupe-700 mb-1">
                        Prix (€)
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="input-field text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-taupe-700 mb-1">
                        Image
                      </label>
                      <div className="space-y-2">
                        {/* Afficher l'image actuelle si elle existe */}
                        {formData.image && (
                          <div className="mb-2">
                            <img 
                              src={formData.image.startsWith('http') 
                                ? formData.image 
                                : `https://raw.githubusercontent.com/laHonda27/naqiCreation/main/public${formData.image}`} 
                              alt="Aperçu" 
                              className="h-24 w-auto object-cover rounded-md border border-beige-200" 
                              onError={(e) => {
                                // Fallback en cas d'erreur de chargement de l'image
                                e.currentTarget.src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Options pour l'image */}
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <input
                              id="useUrl"
                              name="imageSourceType"
                              type="radio"
                              checked={imageSourceType === 'url'}
                              onChange={() => setImageSourceType('url')}
                              className="h-4 w-4 text-rose-400 focus:ring-rose-300 border-beige-300 rounded"
                            />
                            <label htmlFor="useUrl" className="ml-2 block text-sm text-taupe-700">
                              Utiliser une URL
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="uploadImage"
                              name="imageSourceType"
                              type="radio"
                              checked={imageSourceType === 'upload'}
                              onChange={() => setImageSourceType('upload')}
                              className="h-4 w-4 text-rose-400 focus:ring-rose-300 border-beige-300 rounded"
                            />
                            <label htmlFor="uploadImage" className="ml-2 block text-sm text-taupe-700">
                              Télécharger une image
                            </label>
                          </div>
                        </div>
                        
                        {/* Champ URL ou upload selon l'option choisie */}
                        {imageSourceType === 'url' ? (
                          <div className="flex">
                            <input
                              id="image"
                              name="image"
                              type="url"
                              value={formData.image}
                              onChange={handleChange}
                              className="input-field text-sm rounded-r-none flex-grow"
                              placeholder="https://example.com/image.jpg"
                            />
                            <div className="bg-beige-200 px-3 flex items-center rounded-r-md">
                              <LinkIcon size={18} className="text-taupe-600" />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <input
                              id="imageFile"
                              name="imageFile"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="block w-full text-sm text-taupe-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
                            />
                            {uploadStatus === 'loading' && (
                              <div className="text-sm text-taupe-600 flex items-center">
                                <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin mr-2"></div>
                                Téléchargement en cours...
                              </div>
                            )}
                            {uploadStatus === 'success' && (
                              <div className="text-sm text-green-600 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Image téléchargée avec succès
                              </div>
                            )}
                            {uploadStatus === 'error' && (
                              <div className="text-sm text-red-600">
                                Erreur: {uploadError}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-rose-400 focus:ring-rose-300 border-beige-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-taupe-700">
                      Mettre en avant sur la page d'accueil
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Section 2: Spécifications techniques */}
            <div className="bg-white p-4 rounded-lg border border-beige-200">
              <button 
                type="button" 
                className="flex justify-between w-full items-center text-left font-medium text-taupe-800 mb-2"
                onClick={() => toggleSection('specs')}
              >
                <span>Spécifications techniques</span>
                {activeSection === 'specs' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {activeSection === 'specs' && (
                <div className="pt-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="standardSize" className="block text-sm font-medium text-taupe-700 mb-1">
                        Taille standard
                      </label>
                      <input
                        id="standardSize"
                        name="standardSize"
                        type="text"
                        value={formData.specifications.standardSize}
                        onChange={handleSpecificationsChange}
                        required
                        className="input-field text-sm"
                        placeholder="ex: 50 x 70 cm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="deliveryTime" className="block text-sm font-medium text-taupe-700 mb-1">
                        Délai de livraison
                      </label>
                      <input
                        id="deliveryTime"
                        name="deliveryTime"
                        type="text"
                        value={formData.specifications.deliveryTime}
                        onChange={handleSpecificationsChange}
                        required
                        className="input-field text-sm"
                        placeholder="ex: 2-3 semaines"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="material" className="block text-sm font-medium text-taupe-700 mb-1">
                        Matériau
                      </label>
                      <input
                        id="material"
                        name="material"
                        type="text"
                        value={formData.specifications.material}
                        onChange={handleSpecificationsChange}
                        required
                        className="input-field text-sm"
                        placeholder="ex: Bois massif"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-taupe-700 mb-1">
                      Informations supplémentaires
                    </label>
                    {renderAdditionalInfoFields()}
                    <button
                      type="button"
                      onClick={() => addArrayField('additionalInfo')}
                      className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center mt-1"
                    >
                      <Plus size={16} className="mr-1" />
                      Ajouter une information
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Section 3: Détails techniques */}
            <div className="bg-white p-4 rounded-lg border border-beige-200">
              <button 
                type="button" 
                className="flex justify-between w-full items-center text-left font-medium text-taupe-800 mb-2"
                onClick={() => toggleSection('details')}
              >
                <span>Détails techniques</span>
                {activeSection === 'details' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {activeSection === 'details' && (
                <div className="pt-2">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-taupe-700 mb-1">
                      Détails techniques
                    </label>
                    {renderTechnicalDetailsFields()}
                    <button
                      type="button"
                      onClick={() => addArrayField('technicalDetails')}
                      className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center mt-1"
                    >
                      <Plus size={16} className="mr-1" />
                      Ajouter un détail
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-taupe-700 mb-1">
                      Options de personnalisation
                    </label>
                    {renderCustomizationOptionsFields()}
                    <button
                      type="button"
                      onClick={() => addArrayField('customizationOptions')}
                      className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center mt-1"
                    >
                      <Plus size={16} className="mr-1" />
                      Ajouter une option
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Section 4: Processus de commande */}
            <div className="bg-white p-4 rounded-lg border border-beige-200">
              <button 
                type="button" 
                className="flex justify-between w-full items-center text-left font-medium text-taupe-800 mb-2"
                onClick={() => toggleSection('order')}
              >
                <span>Processus de commande</span>
                {activeSection === 'order' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {activeSection === 'order' && (
                <div className="pt-2">
                  {formData.orderProcess.map((step, index) => (
                    <div key={index} className="mb-4 p-3 bg-beige-50 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-sm">Étape {step.step}</h4>
                        {formData.orderProcess.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOrderProcessStep(index)}
                            className="text-red-500 hover:text-red-600 p-1"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-taupe-700 mb-1">
                            Titre
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleOrderProcessChange(index, 'title', e.target.value)}
                            className="input-field text-sm"
                            placeholder="ex: Consultation"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-taupe-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={step.description}
                            onChange={(e) => handleOrderProcessChange(index, 'description', e.target.value)}
                            className="input-field text-sm"
                            placeholder="ex: Discussion de vos besoins"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOrderProcessStep}
                    className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center mt-1"
                  >
                    <Plus size={16} className="mr-1" />
                    Ajouter une étape
                  </button>
                </div>
              )}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creations.length === 0 ? (
          <p className="text-center py-8 text-taupe-600 col-span-2">
            Aucune création pour le moment.
          </p>
        ) : (
          creations.map(creation => (
            <div key={creation.id} className="bg-white p-4 rounded-lg border border-beige-200 shadow-sm">
              <div className="flex space-x-4">
                <div className="w-24 h-24 rounded-md overflow-hidden bg-beige-100 flex-shrink-0">
                  <img 
                    src={creation.image.startsWith('http') 
                      ? creation.image 
                      : `https://raw.githubusercontent.com/laHonda27/naqiCreation/main/public${creation.image}`} 
                    alt={creation.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      // Fallback en cas d'erreur de chargement de l'image
                      e.currentTarget.src = '/placeholder-image.jpg';
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
                      <p className="text-rose-500 font-medium mt-1">{creation.price}€</p>
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
    </div>
  );
};

export default CreationsManager;
