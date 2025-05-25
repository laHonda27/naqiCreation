import React, { useState, useEffect } from 'react';
import { PenTool, Palette, Box, Edit, Trash, Plus, X, Check, AlertCircle } from 'lucide-react';
import { netlifyGitService } from '../../services/netlifyGitService';
import { ServiceDetail } from '../../hooks/useServiceDetails';

// Icônes disponibles pour les services
const availableIcons = [
  { id: 'PenTool', label: 'Stylo', component: <PenTool size={20} /> },
  { id: 'Palette', label: 'Palette', component: <Palette size={20} /> },
  { id: 'Box', label: 'Boîte', component: <Box size={20} /> }
];

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<ServiceDetail | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Charger les services au démarrage
  useEffect(() => {
    fetchServices();
  }, []);

  // Récupérer les services depuis le fichier JSON
  const fetchServices = async () => {
    try {
      setLoading(true);
      const result = await netlifyGitService.getJsonFile('services.json');
      
      if (result.success && result.data) {
        setServices(result.data.services || []);
      } else {
        // Fallback sur les données par défaut si le fichier n'existe pas encore
        setServices([
          {
            id: 'welcome',
            iconType: 'PenTool',
            title: "Panneaux de bienvenue",
            description: "Des panneaux élégants et personnalisés pour accueillir vos invités avec style. Chaque création est unique et reflète parfaitement l'ambiance de votre événement.",
            features: [
              "Plexiglass premium de 3mm",
              "Finitions soignées et polies",
              "Support en bois inclus",
              "Design sur mesure"
            ],
            link: "/prestations"
          },
          {
            id: 'custom',
            iconType: 'Palette',
            title: "Personnalisation complète",
            description: "Choisissez parmi une large gamme de couleurs, polices et designs pour créer des panneaux qui correspondent parfaitement à l'esthétique de votre événement.",
            features: [
              "Plus de 15 couleurs disponibles",
              "Polices variées et élégantes",
              "Motifs exclusifs",
              "Formes personnalisables"
            ],
            link: "/prestations#informations-techniques"
          },
          {
            id: 'accessories',
            iconType: 'Box',
            title: "Accessoires assortis",
            description: "Complétez votre décoration avec des accessoires parfaitement coordonnés à vos panneaux pour une ambiance cohérente et raffinée.",
            features: [
              "Étiquettes de bouteilles",
              "Menus personnalisés",
              "Marque-places élégants",
              "Cartons d'invitation"
            ],
            link: "/personnalisation"
          }
        ]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des services:', err);
      setError("Impossible de charger les services. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les services dans le fichier JSON
  const saveServices = async () => {
    try {
      setSaving(true);
      
      // Limiter à 3 services maximum pour la section d'accueil
      const servicesData = {
        services: services.slice(0, 3)
      };
      
      const result = await netlifyGitService.updateFile('services.json', servicesData);
      
      if (result.success) {
        setSuccess("Les services ont été enregistrés avec succès!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des services:', err);
      setError("Impossible d'enregistrer les services. Veuillez réessayer plus tard.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Commencer l'édition d'un service
  const startEditing = (service: ServiceDetail) => {
    setEditingService({...service});
    setIsCreating(false);
  };

  // Commencer la création d'un nouveau service
  const startCreating = () => {
    setEditingService({
      id: `service_${Date.now()}`,
      iconType: 'PenTool',
      title: "",
      description: "",
      features: [""],
      link: "/prestations"
    });
    setIsCreating(true);
  };

  // Annuler l'édition
  const cancelEditing = () => {
    setEditingService(null);
    setIsCreating(false);
  };

  // Mettre à jour un champ du service en édition
  const updateEditingField = (field: keyof ServiceDetail, value: any) => {
    if (!editingService) return;
    
    setEditingService({
      ...editingService,
      [field]: value
    });
  };

  // Ajouter ou mettre à jour une fonctionnalité dans le service en édition
  const updateFeature = (index: number, value: string) => {
    if (!editingService) return;
    
    const newFeatures = [...editingService.features];
    newFeatures[index] = value;
    
    setEditingService({
      ...editingService,
      features: newFeatures
    });
  };

  // Ajouter une nouvelle fonctionnalité vide
  const addFeature = () => {
    if (!editingService) return;
    
    setEditingService({
      ...editingService,
      features: [...editingService.features, ""]
    });
  };

  // Supprimer une fonctionnalité
  const removeFeature = (index: number) => {
    if (!editingService) return;
    
    const newFeatures = [...editingService.features];
    newFeatures.splice(index, 1);
    
    setEditingService({
      ...editingService,
      features: newFeatures
    });
  };

  // Sauvegarder les modifications du service en édition
  const saveServiceChanges = () => {
    if (!editingService) return;
    
    // Validation de base
    if (!editingService.title.trim() || !editingService.description.trim()) {
      setError("Le titre et la description sont obligatoires.");
      return;
    }
    
    // Filtrer les fonctionnalités vides
    const filteredFeatures = editingService.features.filter(f => f.trim() !== '');
    if (filteredFeatures.length === 0) {
      setError("Au moins une fonctionnalité est requise.");
      return;
    }
    
    // Mettre à jour les services
    if (isCreating) {
      setServices([...services, {...editingService, features: filteredFeatures}]);
    } else {
      setServices(services.map(s => 
        s.id === editingService.id ? {...editingService, features: filteredFeatures} : s
      ));
    }
    
    // Réinitialiser l'état
    setEditingService(null);
    setIsCreating(false);
    setError(null);
    
    // Sauvegarder les changements
    saveServices();
  };

  // Supprimer un service
  const deleteService = (serviceId: string) => {
    if (services.length <= 1) {
      setError("Vous devez conserver au moins un service.");
      return;
    }
    
    const updatedServices = services.filter(s => s.id !== serviceId);
    setServices(updatedServices);
    saveServices();
  };

  // Déplacer un service vers le haut dans la liste
  const moveServiceUp = (index: number) => {
    if (index <= 0) return;
    
    const newServices = [...services];
    [newServices[index], newServices[index - 1]] = [newServices[index - 1], newServices[index]];
    
    setServices(newServices);
    saveServices();
  };

  // Déplacer un service vers le bas dans la liste
  const moveServiceDown = (index: number) => {
    if (index >= services.length - 1) return;
    
    const newServices = [...services];
    [newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]];
    
    setServices(newServices);
    saveServices();
  };

  // Obtenir le composant d'icône correspondant au type
  const getIconById = (iconType: string) => {
    const iconObj = availableIcons.find(icon => icon.id === iconType);
    return iconObj ? iconObj.component : <PenTool size={20} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="services-manager">
      {/* Messages d'erreur ou de succès */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
          <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 flex items-start">
          <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      {/* Liste des services */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-taupe-800">Services sur la page d'accueil</h3>
          {services.length < 3 && (
            <button 
              onClick={startCreating}
              disabled={saving || Boolean(editingService)}
              className="btn-primary py-2 px-4 rounded-md text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter un service
            </button>
          )}
        </div>
        
        {services.length === 0 ? (
          <p className="text-taupe-600 italic">Aucun service configuré. Ajoutez-en un pour commencer.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={service.id} className="bg-beige-50 border border-beige-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center border border-beige-200">
                      {getIconById(service.iconType)}
                    </div>
                    <div>
                      <h4 className="font-medium text-taupe-800">{service.title}</h4>
                      <p className="text-sm text-taupe-600 line-clamp-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => moveServiceUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded-md ${index === 0 ? 'text-taupe-400 cursor-not-allowed' : 'text-taupe-600 hover:bg-beige-200'}`}
                      title="Déplacer vers le haut"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveServiceDown(index)}
                      disabled={index === services.length - 1}
                      className={`p-1 rounded-md ${index === services.length - 1 ? 'text-taupe-400 cursor-not-allowed' : 'text-taupe-600 hover:bg-beige-200'}`}
                      title="Déplacer vers le bas"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => startEditing(service)}
                      disabled={Boolean(editingService)}
                      className="p-1 rounded-md text-taupe-600 hover:bg-beige-200"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteService(service.id)}
                      disabled={Boolean(editingService) || services.length <= 1}
                      className="p-1 rounded-md text-rose-600 hover:bg-rose-100"
                      title="Supprimer"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Formulaire d'édition */}
      {editingService && (
        <div className="bg-white border border-beige-200 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-taupe-800 mb-4">
            {isCreating ? "Ajouter un nouveau service" : "Modifier le service"}
          </h3>
          
          <div className="space-y-4">
            {/* Sélection d'icône */}
            <div>
              <label className="block text-taupe-700 text-sm font-medium mb-2">Icône</label>
              <div className="flex space-x-2">
                {availableIcons.map(icon => (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => updateEditingField('iconType', icon.id)}
                    className={`p-2 rounded-md ${editingService.iconType === icon.id ? 'bg-rose-100 text-rose-500' : 'bg-beige-100 text-taupe-600'}`}
                    title={icon.label}
                  >
                    {icon.component}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Titre */}
            <div>
              <label className="block text-taupe-700 text-sm font-medium mb-2">Titre</label>
              <input
                type="text"
                value={editingService.title}
                onChange={(e) => updateEditingField('title', e.target.value)}
                className="w-full p-2 border border-beige-300 rounded-md"
                placeholder="Titre du service"
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-taupe-700 text-sm font-medium mb-2">Description</label>
              <textarea
                value={editingService.description}
                onChange={(e) => updateEditingField('description', e.target.value)}
                className="w-full p-2 border border-beige-300 rounded-md"
                rows={3}
                placeholder="Description du service"
              ></textarea>
            </div>
            
            {/* Lien */}
            <div>
              <label className="block text-taupe-700 text-sm font-medium mb-2">Lien</label>
              <input
                type="text"
                value={editingService.link}
                onChange={(e) => updateEditingField('link', e.target.value)}
                className="w-full p-2 border border-beige-300 rounded-md"
                placeholder="/prestations"
              />
            </div>
            
            {/* Fonctionnalités */}
            <div>
              <label className="block text-taupe-700 text-sm font-medium mb-2">Fonctionnalités</label>
              <div className="space-y-2">
                {editingService.features.map((feature, index) => (
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
                      disabled={editingService.features.length <= 1}
                      className={`p-2 rounded-md ${editingService.features.length <= 1 ? 'text-taupe-400 bg-beige-100 cursor-not-allowed' : 'text-rose-500 bg-rose-100 hover:bg-rose-200'}`}
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
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 border border-beige-300 text-taupe-700 rounded-md hover:bg-beige-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={saveServiceChanges}
                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
