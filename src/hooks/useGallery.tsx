import { useState, useEffect } from 'react';
import { netlifyGitService } from '../services/netlifyGitService';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  dateAdded: string;
  dateModified?: string;
}

export interface GalleryData {
  images: GalleryImage[];
  categories: string[];
}

export const useGallery = () => {
  const [galleryData, setGalleryData] = useState<GalleryData>({ 
    images: [], 
    categories: [] 
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);

        // Synchroniser d'abord le dépôt pour s'assurer d'avoir les dernières données
        await netlifyGitService.syncRepository();
        
        // Récupérer les données depuis le fichier gallery.json via le service Git
        const result = await netlifyGitService.getJsonFile('gallery.json');

        if (result.success) {
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
              parsedData = { images: [], categories: [] };
            }

            // Si les données existent, les utiliser, sinon créer un tableau vide
            if (parsedData.images) {
              setGalleryData(parsedData);
            } else {
              // Initialiser les données s'ils n'existent pas
              setGalleryData({ images: [], categories: [] });
            }
          } catch (parseError: any) {
            console.error('Erreur lors du parsing JSON:', parseError);
            setError(`Erreur lors du parsing JSON: ${parseError.message || 'Erreur inconnue'}`);
            setGalleryData({ images: [], categories: [] });
          }
        } else {
          console.error('Erreur lors du chargement de la galerie:', result.error);
          setError('Erreur lors du chargement de la galerie: ' + (result.error || 'Données non disponibles'));
          setGalleryData({ images: [], categories: [] });
        }
      } catch (err: any) {
        console.error('Exception lors du chargement de la galerie:', err);
        setError('Erreur lors du chargement de la galerie: ' + (err.message || 'Erreur inconnue'));
        setGalleryData({ images: [], categories: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []); // Appelé uniquement au montage du composant

  const addImage = async (image: Omit<GalleryImage, 'id' | 'dateAdded'>) => {
    try {
      const newId = `g${Date.now()}`;
      const newImage: GalleryImage = {
        ...image,
        id: newId,
        dateAdded: new Date().toISOString()
      };

      // Ajouter la nouvelle image à la liste locale
      const updatedGalleryData = { 
        ...galleryData,
        images: [...galleryData.images, newImage]
      };
      
      setGalleryData(updatedGalleryData);

      // Mettre à jour le fichier gallery.json
      const result = await netlifyGitService.writeJsonFile(
        'gallery.json',
        updatedGalleryData,
        `Ajout d'une nouvelle image à la galerie`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(`Erreur lors de l'ajout de l'image: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  const updateImage = async (id: string, updatedImage: Partial<GalleryImage>) => {
    try {
      // Mettre à jour l'image localement
      const updatedImages = galleryData.images.map(image =>
        image.id === id ? { 
          ...image, 
          ...updatedImage, 
          dateModified: new Date().toISOString() 
        } : image
      );

      const updatedGalleryData = {
        ...galleryData,
        images: updatedImages
      };

      setGalleryData(updatedGalleryData);

      // Mettre à jour le fichier gallery.json
      const result = await netlifyGitService.writeJsonFile(
        'gallery.json',
        updatedGalleryData,
        `Mise à jour d'une image dans la galerie`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(`Erreur lors de la mise à jour de l'image: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      // Supprimer l'image localement
      const updatedImages = galleryData.images.filter(image => image.id !== id);

      const updatedGalleryData = {
        ...galleryData,
        images: updatedImages
      };

      setGalleryData(updatedGalleryData);

      // Mettre à jour le fichier gallery.json
      const result = await netlifyGitService.writeJsonFile(
        'gallery.json',
        updatedGalleryData,
        `Suppression d'une image de la galerie`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(`Erreur lors de la suppression de l'image: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  const addCategory = async (category: string) => {
    try {
      // Vérifier si la catégorie existe déjà
      if (galleryData.categories.includes(category)) {
        return true; // La catégorie existe déjà, pas besoin de l'ajouter
      }

      // Ajouter la nouvelle catégorie à la liste locale
      const updatedGalleryData = { 
        ...galleryData,
        categories: [...galleryData.categories, category]
      };
      
      setGalleryData(updatedGalleryData);

      // Mettre à jour le fichier gallery.json
      const result = await netlifyGitService.writeJsonFile(
        'gallery.json',
        updatedGalleryData,
        `Ajout d'une nouvelle catégorie à la galerie`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(`Erreur lors de l'ajout de la catégorie: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  return {
    galleryData,
    loading,
    error,
    addImage,
    updateImage,
    deleteImage,
    addCategory
  };
};
