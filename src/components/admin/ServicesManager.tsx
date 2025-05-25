import React, { useState, useEffect } from 'react';
import { Edit, Trash, Plus, AlertCircle } from 'lucide-react';
import { netlifyGitService } from '../../services/netlifyGitService';
import { ServiceDetail, getIconComponent } from '../../hooks/useServiceDetails';
import GlobalSaveButton from './GlobalSaveButton';
import ServiceFormModal from './ServiceFormModal';
import ConfirmationModal from './ConfirmationModal';



const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // États pour les modals
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<ServiceDetail | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  // Charger les services au démarrage
  useEffect(() => {
    fetchServices();
  }, []);

  // Récupérer les services depuis le fichier JSON
  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Synchroniser d'abord le dépôt pour s'assurer d'avoir les dernières données
      await netlifyGitService.syncRepository();
      
      // Tenter de récupérer depuis le dépôt Git
      const result = await netlifyGitService.getJsonFile('services.json');
      console.log('Résultat de getJsonFile:', result);
      
      // Vérifier si nous avons des données dans le résultat
      if (result.success) {
        let parsedData;
        
        if (typeof result.content === 'string') {
          // Si nous avons une chaîne JSON, la parser
          console.log('Parsing du contenu JSON:', result.content);
          parsedData = JSON.parse(result.content);
        } else if (result.data) {
          // Si nous avons déjà un objet data, l'utiliser directement
          console.log('Utilisation directe des données:', result.data);
          parsedData = result.data;
        }
        
        if (parsedData && parsedData.services && Array.isArray(parsedData.services)) {
          console.log('Services chargés depuis Git:', parsedData.services);
          setServices(parsedData.services);
          return; // Sortir de la fonction si nous avons récupéré les données
        }
      }
      
      // Essayer de charger depuis le fichier statique
      console.log('Tentative de chargement depuis le fichier statique');
      try {
        const response = await fetch('/data/services.json');
        if (response.ok) {
          const data = await response.json();
          console.log('Services chargés depuis le fichier statique:', data.services);
          setServices(data.services || []);
          return;
        }
      } catch (staticErr) {
        console.error('Erreur lors du chargement du fichier statique:', staticErr);
      }
      
      // Fallback sur les données par défaut si aucune méthode ne fonctionne
      console.log('Utilisation des services par défaut');
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
    } catch (err) {
      console.error('Erreur lors du chargement des services:', err);
      setError("Impossible de charger les services. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les services dans le fichier JSON
  const saveServices = async (): Promise<boolean> => {
    try {
      // Limiter à 3 services maximum pour la section d'accueil
      const servicesData = {
        services: services.slice(0, 3)
      };
      
      // Utiliser writeJsonFile pour écrire le fichier avec un message de commit
      const writeResult = await netlifyGitService.writeJsonFile(
        'services.json',
        servicesData,
        'Mise à jour des services sur la page d\'accueil'
      );
      
      if (!writeResult.success) {
        setError(writeResult.error || "Erreur lors de l'enregistrement");
        setTimeout(() => setError(null), 5000);
        return false;
      }
      
      // Forcer un push explicite pour s'assurer que les modifications sont envoyées au dépôt distant
      const pushResult = await netlifyGitService.pushChanges();
      
      if (pushResult.success) {
        return true;
      } else {
        setError(pushResult.error || "Erreur lors du push vers Git");
        setTimeout(() => setError(null), 5000);
        return false;
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des services:", err);
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
      setTimeout(() => setError(null), 5000);
      return false;
    }
  };

  // Ouvrir le modal pour ajouter un service
  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour modifier un service
  const handleEdit = (service: ServiceDetail) => {
    setEditingService({...service});
    setIsModalOpen(true);
  };
  
  // Ouvrir la modal de confirmation pour supprimer un service
  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setIsConfirmModalOpen(true);
  };



  // Gérer la soumission du formulaire (ajout ou mise à jour)
  const handleFormSubmit = (formData: Omit<ServiceDetail, 'id'> & { id?: string }) => {
    try {
      if (formData.id) {
        // Mettre à jour un service existant
        setServices(services.map(s => 
          s.id === formData.id ? { ...formData as ServiceDetail } : s
        ));
      } else {
        // Ajouter un nouveau service avec un ID généré
        const newService: ServiceDetail = {
          ...formData as Omit<ServiceDetail, 'id'>,
          id: `service_${Date.now()}`
        };
        setServices([...services, newService]);
      }
      
      // Indiquer qu'il y a des changements non enregistrés
      setHasUnsavedChanges(true);
      // Fermer le modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du service:", error);
      setError("Une erreur est survenue lors de l'enregistrement du service.");
    }
  };

  // Supprimer un service après confirmation
  const handleDelete = () => {
    if (serviceToDelete) {
      if (services.length <= 1) {
        setError("Vous devez conserver au moins un service.");
        setIsConfirmModalOpen(false);
        return;
      }
      
      try {
        const updatedServices = services.filter(s => s.id !== serviceToDelete);
        setServices(updatedServices);
        setHasUnsavedChanges(true);
        setServiceToDelete(null);
        setIsConfirmModalOpen(false);
      } catch (error) {
        console.error("Erreur lors de la suppression du service:", error);
        setError("Une erreur est survenue lors de la suppression du service.");
      }
    }
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
      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
          <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Liste des services */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-taupe-800">Services sur la page d'accueil</h3>
          {services.length < 3 && (
            <button 
              onClick={handleAddNew}
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
                      {getIconComponent(service.iconType, "w-6 h-6 text-rose-400")}
                    </div>
                    <div>
                      <h4 className="font-medium text-taupe-800">{service.title}</h4>
                      <p className="text-sm text-taupe-600 line-clamp-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleEdit(service)}
                      className="p-1 rounded-md text-taupe-600 hover:bg-beige-200"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => confirmDelete(service.id)}
                      disabled={services.length <= 1}
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
      

      
      {/* Bouton flottant pour enregistrer les modifications */}
      <GlobalSaveButton 
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveComplete={() => setHasUnsavedChanges(false)}
        onSave={saveServices}
      />
      
      {/* Modal pour ajouter/modifier un service */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingService={editingService}
      />
      
      {/* Modal de confirmation pour la suppression */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
};

export default ServicesManager;
