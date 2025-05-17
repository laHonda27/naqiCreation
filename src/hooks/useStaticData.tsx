import { useState, useEffect } from 'react';
import { staticDataService } from '../services/staticDataService';

export interface Creation {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface OrderProcess {
  step: number;
  completed: boolean;
}

export function useStaticData() {
  // États pour les données
  const [creations, setCreations] = useState<Creation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour le statut du chargement
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [jsonFiles, setJsonFiles] = useState<string[]>([]);
  const [filesStatus, setFilesStatus] = useState<{ name: string; status: 'idle' | 'loading' | 'success' | 'error' }[]>([]);
  
  // Fonction pour charger les données depuis les fichiers statiques
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSyncMessage('Chargement des données...');
      
      // Récupérer la liste des fichiers JSON disponibles
      const filesResult = await staticDataService.listJsonFiles();
      
      if (filesResult.success && filesResult.data) {
        setJsonFiles(filesResult.data);
        
        // Charger les créations
        const creationsResult = await staticDataService.getJsonFile('creations');
        if (creationsResult.success && creationsResult.data) {
          setCreations(creationsResult.data.creations || []);
        }
        
        // Charger les catégories
        const categoriesResult = await staticDataService.getJsonFile('categories');
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data.categories || []);
        }
        
        setSyncMessage('Données chargées avec succès');
      } else {
        setError('Impossible de récupérer la liste des fichiers');
      }
    } catch (err: any) {
      setError(`Erreur lors du chargement des données: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
      setIsInitializing(false);
    }
  };
  
  // Charger les données au chargement du composant
  useEffect(() => {
    loadData();
  }, []);
  
  // Fonction pour obtenir une création par son ID
  const getCreationById = (id: string): Creation | undefined => {
    return creations.find(creation => creation.id === id);
  };
  
  // Fonction pour obtenir une catégorie par son ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };
  
  // Fonction pour obtenir les créations d'une catégorie
  const getCreationsByCategory = (categoryId: string): Creation[] => {
    return creations.filter(creation => creation.category === categoryId);
  };
  
  // Fonction pour obtenir l'URL d'une image
  const getImageUrl = (imagePath: string): string => {
    return staticDataService.getImageUrl(imagePath);
  };
  
  return {
    creations,
    categories,
    loading,
    error,
    isInitializing,
    syncMessage,
    jsonFiles,
    filesStatus,
    getCreationById,
    getCategoryById,
    getCreationsByCategory,
    getImageUrl,
    refreshData: loadData
  };
}
