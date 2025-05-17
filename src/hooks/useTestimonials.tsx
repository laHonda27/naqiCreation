import { useState, useEffect } from 'react';
import { netlifyGitService } from '../services/netlifyGitService';

export interface BaseTestimonial {
  id: string;
  name: string;
  event: string;
  rating: number;
  type: 'text' | 'screenshot';
  dateAdded?: string;
  dateModified?: string;
}

export interface TextTestimonial extends BaseTestimonial {
  type: 'text';
  comment: string;
  avatar?: string;
}

export interface ScreenshotTestimonial extends BaseTestimonial {
  type: 'screenshot';
  imageUrl: string;
  caption?: string;
}

export type Testimonial = TextTestimonial | ScreenshotTestimonial;

// Structure pour les témoignages dans customizations.json
export interface CustomizationsData {
  testimonials?: Testimonial[];
  customItems?: any[];
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customizationsData, setCustomizationsData] = useState<CustomizationsData>({ testimonials: [], customItems: [] });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        // Récupérer les données depuis le fichier customizations.json via le service Git
        const result = await netlifyGitService.getJsonFile('customizations.json');

        if (result.success && result.data) {
          const data: CustomizationsData = result.data;
          setCustomizationsData(data);

          // Si le tableau de témoignages existe, l'utiliser, sinon créer un tableau vide
          if (data.testimonials && Array.isArray(data.testimonials)) {
            setTestimonials(data.testimonials);
          } else {
            // Initialiser le tableau de témoignages s'il n'existe pas
            setTestimonials([]);
          }
        } else {
          setError('Erreur lors du chargement des témoignages: ' + (result.error || 'Données non disponibles'));
          setTestimonials([]);
        }
      } catch (err: any) {
        setError('Erreur lors du chargement des témoignages: ' + (err.message || 'Erreur inconnue'));
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      const now = new Date().toISOString();
      const newTestimonial: Testimonial = {
        ...testimonial,
        id: Date.now().toString(),
        dateAdded: now,
        dateModified: now
      };

      // Ajouter le nouveau témoignage à la liste locale
      const updatedTestimonials = [...testimonials, newTestimonial];
      setTestimonials(updatedTestimonials);

      // Mettre à jour le fichier customizations.json
      const updatedData: CustomizationsData = {
        ...customizationsData,
        testimonials: updatedTestimonials
      };

      // Enregistrer les modifications dans le fichier via le service Git
      const result = await netlifyGitService.writeJsonFile(
        'customizations.json',
        updatedData,
        `Ajout d'un nouveau témoignage de ${testimonial.name}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      setCustomizationsData(updatedData);
      return true;
    } catch (err: any) {
      setError(`Erreur lors de l'ajout du témoignage: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  const updateTestimonial = async (id: string, updatedTestimonial: Partial<Testimonial>) => {
    try {
      // Ajouter la date de modification
      const now = new Date().toISOString();
      const updates = {
        ...updatedTestimonial,
        dateModified: now
      };

      // Mettre à jour le témoignage localement
      const updatedTestimonials = testimonials.map(testimonial =>
        testimonial.id === id ? { ...testimonial, ...updates } : testimonial
      );

      setTestimonials(updatedTestimonials);

      // Mettre à jour le fichier customizations.json
      const updatedData: CustomizationsData = {
        ...customizationsData,
        testimonials: updatedTestimonials
      };

      // Enregistrer les modifications dans le fichier via le service Git
      const result = await netlifyGitService.writeJsonFile(
        'customizations.json',
        updatedData,
        `Mise à jour du témoignage de ${testimonials.find(t => t.id === id)?.name || id}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      setCustomizationsData(updatedData);
      return true;
    } catch (err: any) {
      setError(`Erreur lors de la mise à jour du témoignage: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      // Récupérer le nom du témoignage pour le message de commit
      const testimonialName = testimonials.find(t => t.id === id)?.name || id;

      // Supprimer le témoignage localement
      const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
      setTestimonials(updatedTestimonials);

      // Mettre à jour le fichier customizations.json
      const updatedData: CustomizationsData = {
        ...customizationsData,
        testimonials: updatedTestimonials
      };

      // Enregistrer les modifications dans le fichier via le service Git
      const result = await netlifyGitService.writeJsonFile(
        'customizations.json',
        updatedData,
        `Suppression du témoignage de ${testimonialName}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      setCustomizationsData(updatedData);
      return true;
    } catch (err: any) {
      setError(`Erreur lors de la suppression du témoignage: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    customizationsData
  };
};