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
  featuredInHero?: boolean;
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
  // Variable pour stocker les données brutes du fichier JSON (utilisée dans les fonctions de mise à jour)
  const [, setTestimonialsFile] = useState<{ testimonials: Testimonial[] }>({ testimonials: [] });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        // Synchroniser d'abord le dépôt pour s'assurer d'avoir les dernières données
        await netlifyGitService.syncRepository();
        
        // Récupérer les données depuis le fichier testimonials.json via le service Git
        const result = await netlifyGitService.getJsonFile('testimonials.json');

        if (result.success) {
          // La réponse peut contenir 'content' (chaîne JSON) ou 'data' (objet déjà parsé)
          try {
            let parsedData;
            
            if (typeof result.content === 'string') {
              // Si nous avons une chaîne JSON, la parser
              parsedData = JSON.parse(result.content);
            } else if (result.data) {
              // Si nous avons déjà un objet data, l'utiliser directement
              parsedData = result.data;
            } else {
              // Fallback sur un objet vide
              parsedData = { testimonials: [] };
            }
            
            setTestimonialsFile(parsedData);

            // Si le tableau de témoignages existe, l'utiliser, sinon créer un tableau vide
            if (parsedData.testimonials && Array.isArray(parsedData.testimonials)) {
              setTestimonials(parsedData.testimonials as Testimonial[]);
            } else {
              // Initialiser le tableau de témoignages s'il n'existe pas
              setTestimonials([]);
            }
          } catch (parseError: any) {
            console.error('Erreur lors du parsing JSON:', parseError);
            setError(`Erreur lors du parsing JSON: ${parseError.message || 'Erreur inconnue'}`);
            setTestimonials([]);
          }
        } else {
          console.error('Erreur lors du chargement des témoignages:', result.error);
          setError('Erreur lors du chargement des témoignages: ' + (result.error || 'Données non disponibles'));
          setTestimonials([]);
        }
      } catch (err: any) {
        console.error('Exception lors du chargement des témoignages:', err);
        setError('Erreur lors du chargement des témoignages: ' + (err.message || 'Erreur inconnue'));
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []); // Appelé uniquement au montage du composant

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      const now = new Date().toISOString();
      // Créer un nouveau témoignage avec le bon type
      const newTestimonial = {
        ...testimonial,
        id: Date.now().toString(),
        // Utiliser la date fournie ou la date actuelle
        dateAdded: testimonial.dateAdded || now,
        dateModified: now
      } as Testimonial;

      let updatedTestimonials;
      
      // Si le nouveau témoignage est mis en avant dans le hero, désactiver cette option pour tous les autres
      if (testimonial.featuredInHero) {
        // Désactiver featuredInHero pour tous les témoignages existants
        updatedTestimonials = testimonials.map(t => ({ ...t, featuredInHero: false }));
        // Ajouter le nouveau témoignage avec featuredInHero = true
        updatedTestimonials = [...updatedTestimonials, newTestimonial] as Testimonial[];
      } else {
        // Ajouter simplement le nouveau témoignage sans modifier les autres
        updatedTestimonials = [...testimonials, newTestimonial] as Testimonial[];
      }
      
      setTestimonials(updatedTestimonials);

      // Mettre à jour le fichier testimonials.json
      const updatedData = {
        testimonials: updatedTestimonials
      };

      // Enregistrer les modifications dans le fichier via le service Git
      const result = await netlifyGitService.writeJsonFile(
        'testimonials.json',
        updatedData,
        `Ajout d'un nouveau témoignage de ${testimonial.name}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      setTestimonialsFile(updatedData);
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

      // Si ce témoignage est mis en avant dans le hero, désactiver cette option pour tous les autres
      let updatedTestimonials;
      if (updatedTestimonial.featuredInHero) {
        updatedTestimonials = testimonials.map(testimonial => {
          if (testimonial.id === id) {
            return { ...testimonial, ...updates };
          } else {
            // Désactiver featuredInHero pour tous les autres témoignages
            return { ...testimonial, featuredInHero: false };
          }
        }) as Testimonial[];
      } else {
        // Mise à jour normale sans changer le statut featuredInHero des autres témoignages
        updatedTestimonials = testimonials.map(testimonial =>
          testimonial.id === id ? { ...testimonial, ...updates } : testimonial
        ) as Testimonial[];
      }

      setTestimonials(updatedTestimonials);

      // Mettre à jour le fichier testimonials.json
      const updatedData = {
        testimonials: updatedTestimonials
      };

      // Enregistrer les modifications dans le fichier via le service Git
      const result = await netlifyGitService.writeJsonFile(
        'testimonials.json',
        updatedData,
        `Mise à jour du témoignage de ${testimonials.find(t => t.id === id)?.name || id}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      setTestimonialsFile(updatedData);
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
      const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id) as Testimonial[];
      setTestimonials(updatedTestimonials);

      // Mettre à jour le fichier testimonials.json
      const updatedData = {
        testimonials: updatedTestimonials
      };

      // Enregistrer les modifications dans le fichier via le service Git
      const result = await netlifyGitService.writeJsonFile(
        'testimonials.json',
        updatedData,
        `Suppression du témoignage de ${testimonialName}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      setTestimonialsFile(updatedData);
      return true;
    } catch (err: any) {
      setError(`Erreur lors de la suppression du témoignage: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  // Fonction pour récupérer le témoignage mis en avant dans le hero
  const getFeaturedTestimonial = () => {
    return testimonials.find(t => t.featuredInHero) || null;
  };

  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getFeaturedTestimonial
  };
};