import { useState, useEffect } from 'react';
import { contentUpdateService } from '../services/contentUpdateService';

export interface OrderProcess {
  step: number;
  title: string;
  description: string;
}

export interface Specifications {
  standardSize: string;
  deliveryTime: string;
  material: string;
  additionalInfo: string[];
}

export interface Creation {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date?: string;
  price: number;
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

export function useCreations() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les données au chargement du composant
  useEffect(() => {
    loadStaticData();
  }, []);
  
  // Fonction pour charger les données statiques (JSON locaux)
  const loadStaticData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les catégories
      const categoriesResult = await contentUpdateService.getFile('categories.json');
      
      // Charger les créations
      const creationsResult = await contentUpdateService.getFile('creations.json');
      
      if (categoriesResult.success && creationsResult.success) {
        setCategories(categoriesResult.data.categories || []);
        setCreations(creationsResult.data.creations || []);
      } else {
        throw new Error('Erreur lors du chargement des données');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des données statiques:', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
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
  
  // Fonction pour obtenir l'URL d'une image
  const getImageUrl = (imagePath: string): string => {
    return `/images/${imagePath}`;
  };
  
  // Fonction pour ajouter une création
  const addCreation = async (creation: Omit<Creation, 'id'>) => {
    try {
      // Générer un ID unique
      const newCreation: Creation = {
        ...creation,
        id: `creation-${Date.now()}`
      };
      
      const updatedCreations = [...creations, newCreation];
      setCreations(updatedCreations);
      return true;
    } catch (err) {
      setError('Erreur lors de l\'ajout de la création');
      return false;
    }
  };
  
  // Fonction pour mettre à jour une création
  const updateCreation = async (id: string, updatedCreation: Partial<Creation>) => {
    try {
      const updatedCreations = creations.map(creation =>
        creation.id === id ? { ...creation, ...updatedCreation } : creation
      );
      
      setCreations(updatedCreations);
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la création');
      return false;
    }
  };
  
  // Fonction pour supprimer une création
  const deleteCreation = async (id: string) => {
    try {
      const updatedCreations = creations.filter(creation => creation.id !== id);
      setCreations(updatedCreations);
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de la création');
      return false;
    }
  };
  
  // Fonction pour ajouter une catégorie
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory: Category = {
        ...category,
        id: category.name.toLowerCase().replace(/\s+/g, '-')
      };
      
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      return true;
    } catch (err) {
      setError('Erreur lors de l\'ajout de la catégorie');
      return false;
    }
  };
  
  // Fonction pour mettre à jour une catégorie
  const updateCategory = async (id: string, updatedCategory: Partial<Category>) => {
    try {
      const updatedCategories = categories.map(category =>
        category.id === id ? { ...category, ...updatedCategory } : category
      );
      
      // Si l'ID de la catégorie a été modifié, mettre à jour toutes les créations qui utilisent cette catégorie
      if (updatedCategory.id && updatedCategory.id !== id) {
        const updatedCreationsWithCategory = creations.map(creation =>
          creation.category === id ? { ...creation, category: updatedCategory.id! } : creation
        );
        setCreations(updatedCreationsWithCategory);
      }
      
      setCategories(updatedCategories);
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la catégorie');
      return false;
    }
  };
  
  // Fonction pour supprimer une catégorie
  const deleteCategory = async (id: string) => {
    try {
      // Ne pas permettre la suppression de la catégorie "all"
      if (id === 'all') {
        setError('La catégorie "Tous" ne peut pas être supprimée');
        return false;
      }
      
      // Réinitialiser la catégorie à "all" pour toutes les créations dans cette catégorie
      const updatedCreations = creations.map(creation =>
        creation.category === id ? { ...creation, category: 'all' } : creation
      );
      
      const updatedCategories = categories.filter(category => category.id !== id);
      setCreations(updatedCreations);
      setCategories(updatedCategories);
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de la catégorie');
      return false;
    }
  };
  
  return {
    creations,
    categories,
    loading,
    error,
    loadStaticData,
    getCreationById,
    getCategoryById,
    getCreationsByCategory,
    getImageUrl,
    addCreation,
    updateCreation,
    deleteCreation,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
