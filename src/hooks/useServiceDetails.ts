import React, { useState, useEffect } from 'react';
import { netlifyGitService } from '../services/netlifyGitService';
import { PenTool, Palette, Box } from 'lucide-react';

// Type pour les détails de service
export interface ServiceDetail {
  id: string;
  iconType: string; // 'PenTool' | 'Palette' | 'Box' | etc.
  title: string;
  description: string;
  features: string[];
  link: string;
}

// Fonction pour convertir le type d'icône en composant React
export const getIconComponent = (iconType: string, className: string = "w-10 h-10 text-rose-400") => {
  switch (iconType) {
    case 'PenTool':
      return React.createElement(PenTool, { className });
    case 'Palette':
      return React.createElement(Palette, { className });
    case 'Box':
      return React.createElement(Box, { className });
    default:
      return React.createElement(PenTool, { className });
  }
};

export const useServiceDetails = () => {
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        
        // Synchroniser d'abord le dépôt pour s'assurer d'avoir les dernières données
        await netlifyGitService.syncRepository();
        
        // Tenter de récupérer depuis le dépôt Git
        const result = await netlifyGitService.getJsonFile('services.json');
        
        // Vérifier si nous avons des données dans le résultat
        if (result.success) {
          let parsedData;
          
          if (typeof result.content === 'string') {
            // Si nous avons une chaîne JSON, la parser
            parsedData = JSON.parse(result.content);
          } else if (result.data) {
            // Si nous avons déjà un objet data, l'utiliser directement
            parsedData = result.data;
          }
          
          if (parsedData && parsedData.services && Array.isArray(parsedData.services)) {
            console.log('Services chargés depuis Git:', parsedData.services);
            setServiceDetails(parsedData.services);
            setLoading(false);
            return; // Sortir de la fonction si nous avons récupéré les données
          }
        }
        
        // Fallback: charger depuis le fichier statique si le Git échoue
        console.log('Tentative de chargement depuis le fichier statique');
        const response = await fetch('/data/services.json');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des services');
        }
        const data = await response.json();
        console.log('Services chargés depuis le fichier statique:', data.services);
        setServiceDetails(data.services || []);
      } catch (err) {
        console.error('Erreur lors du chargement des services:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        
        // Utiliser les données par défaut en cas d'erreur
        const defaultServices = [
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
        ];
        console.log('Utilisation des services par défaut');
        setServiceDetails(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, []);

  return { serviceDetails, loading, error };
};
