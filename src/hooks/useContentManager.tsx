import { useState, useEffect } from 'react';
import { contentUpdateService } from '../services/contentUpdateService';

export interface Creation {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date?: string;
  price?: number;
  customPrice?: string;
  featured: boolean;
  technicalDetails: string[];
  customizationOptions: string[];
  orderProcess: OrderProcess[];
  specifications: Specifications;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Specifications {
  standardSize: string;
  deliveryTime: string;
  material: string;
  additionalInfo: string[];
}

export interface OrderProcess {
  step: number;
  title: string;
  description: string;
}

export function useContentManager() {
  // États pour les données
  const [creations, setCreations] = useState<Creation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour le statut du chargement
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Charger les données au chargement du composant
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // Fonction pour charger toutes les données
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSyncStatus('idle');
      setSyncMessage('Chargement des données...');
      
      // Charger les créations
      await fetchCreations();
      
      // Charger les catégories
      await fetchCategories();
      
      setSyncStatus('success');
      setSyncMessage('Données chargées avec succès');
    } catch (err: any) {
      setError(`Erreur lors du chargement des données: ${err.message || 'Erreur inconnue'}`);
      setSyncStatus('error');
      setSyncMessage(`Erreur: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
      setIsInitializing(false);
    }
  };
  
  // Fonction pour charger les créations
  const fetchCreations = async () => {
    try {
      const result = await contentUpdateService.getFile('creations.json');
      
      if (result.success && result.data) {
        setCreations(result.data.creations || []);
      } else {
        throw new Error(result.error || 'Erreur lors du chargement des créations');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des créations:', err);
      throw err;
    }
  };
  
  // Fonction pour charger les catégories
  const fetchCategories = async () => {
    try {
      const result = await contentUpdateService.getFile('categories.json');
      
      if (result.success && result.data) {
        setCategories(result.data.categories || []);
      } else {
        throw new Error(result.error || 'Erreur lors du chargement des catégories');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des catégories:', err);
      throw err;
    }
  };
  
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
  
  // Fonction pour sauvegarder les créations
  const saveCreations = async (updatedCreations: Creation[]) => {
    try {
      setSyncStatus('idle');
      setSyncMessage('Sauvegarde des créations...');
      
      const result = await contentUpdateService.updateFile('creations.json', { creations: updatedCreations }, 'Mise à jour des créations');
      
      if (result.success) {
        setCreations(updatedCreations);
        setSyncStatus('success');
        setSyncMessage('Créations sauvegardées avec succès');
      } else {
        setSyncStatus('error');
        setSyncMessage(result.error || 'Erreur lors de la sauvegarde des créations');
        throw new Error(result.error || 'Erreur lors de la sauvegarde des créations');
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncMessage(`Erreur: ${err.message || 'Erreur inconnue'}`);
      throw err;
    }
  };
  
  // Fonction pour sauvegarder les catégories
  const saveCategories = async (updatedCategories: Category[]) => {
    try {
      setSyncStatus('idle');
      setSyncMessage('Sauvegarde des catégories...');
      
      const result = await contentUpdateService.updateFile('categories.json', { categories: updatedCategories }, 'Mise à jour des catégories');
      
      if (result.success) {
        setCategories(updatedCategories);
        setSyncStatus('success');
        setSyncMessage('Catégories sauvegardées avec succès');
      } else {
        setSyncStatus('error');
        setSyncMessage(result.error || 'Erreur lors de la sauvegarde des catégories');
        throw new Error(result.error || 'Erreur lors de la sauvegarde des catégories');
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncMessage(`Erreur: ${err.message || 'Erreur inconnue'}`);
      throw err;
    }
  };
  
  // Fonction pour ajouter une création
  const addCreation = async (creation: Creation) => {
    const newCreations = [...creations, creation];
    await saveCreations(newCreations);
  };
  
  // Fonction pour mettre à jour une création
  const updateCreation = async (creation: Creation) => {
    const newCreations = creations.map(c => c.id === creation.id ? creation : c);
    await saveCreations(newCreations);
  };
  
  // Fonction pour supprimer une création
  const deleteCreation = async (id: string) => {
    const newCreations = creations.filter(c => c.id !== id);
    await saveCreations(newCreations);
  };
  
  // Fonction pour ajouter une catégorie
  const addCategory = async (category: Category) => {
    const newCategories = [...categories, category];
    await saveCategories(newCategories);
  };
  
  // Fonction pour mettre à jour une catégorie
  const updateCategory = async (category: Category) => {
    const newCategories = categories.map(c => c.id === category.id ? category : c);
    await saveCategories(newCategories);
  };
  
  // Fonction pour supprimer une catégorie
  const deleteCategory = async (id: string) => {
    const newCategories = categories.filter(c => c.id !== id);
    await saveCategories(newCategories);
  };
  
  // Fonction pour obtenir l'URL d'une image
  const getImageUrl = (imagePath: string): string => {
    return `/images/${imagePath}`;
  };
  
  return {
    creations,
    categories,
    loading,
    error,
    isInitializing,
    syncMessage,
    syncStatus,
    fetchAllData,
    getCreationById,
    getCategoryById,
    getCreationsByCategory,
    addCreation,
    updateCreation,
    deleteCreation,
    addCategory,
    updateCategory,
    deleteCategory,
    getImageUrl
  };
}
