import { useState, useEffect } from 'react';
import creationsData from '../data/creations.json';

export interface OrderProcess {
  step: number;
  title: string;
  description: string;
}

export interface Specifications {
  standardSize: string;
  deliveryTime: string;
  material: string;
  additionalInfo?: string[];
}

export interface Creation {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  // Détails techniques
  technicalDetails: string[];
  customizationOptions: string[];
  orderProcess: OrderProcess[];
  specifications: Specifications;
}

export interface Category {
  id: string;
  name: string;
}

export const useCreations = () => {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCreations = async () => {
      try {
        // Simulate API fetch
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if we have stored data in localStorage
        const storedCreations = localStorage.getItem('naqi_creations');
        const storedCategories = localStorage.getItem('naqi_categories');
        
        if (storedCreations && storedCategories) {
          setCreations(JSON.parse(storedCreations));
          setCategories(JSON.parse(storedCategories));
        } else {
          // Use default data from the JSON file
          setCreations(creationsData.creations);
          setCategories(creationsData.categories);
          
          // Store initial data in localStorage
          localStorage.setItem('naqi_creations', JSON.stringify(creationsData.creations));
          localStorage.setItem('naqi_categories', JSON.stringify(creationsData.categories));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des créations');
        setLoading(false);
      }
    };
    
    fetchCreations();
  }, []);
  
  const saveToLocalStorage = (updatedCreations: Creation[], updatedCategories: Category[]) => {
    // In a real app, this would be an API call
    // For demo, we'll just update the state
    // In a production app, you would save to a database or API
    
    // Optional: save to localStorage for persistence between sessions
    localStorage.setItem('naqi_creations', JSON.stringify(updatedCreations));
    localStorage.setItem('naqi_categories', JSON.stringify(updatedCategories));
  };
  
  const addCreation = async (creation: Omit<Creation, 'id'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCreation: Creation = {
        ...creation,
        id: Date.now().toString()
      };
      
      const updatedCreations = [...creations, newCreation];
      setCreations(updatedCreations);
      saveToLocalStorage(updatedCreations, categories);
      return true;
    } catch (err) {
      setError('Erreur lors de l\'ajout de la création');
      return false;
    }
  };
  
  const updateCreation = async (id: string, updatedCreation: Partial<Creation>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedCreations = creations.map(creation => 
        creation.id === id ? { ...creation, ...updatedCreation } : creation
      );
      
      setCreations(updatedCreations);
      saveToLocalStorage(updatedCreations, categories);
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la création');
      return false;
    }
  };
  
  const deleteCreation = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedCreations = creations.filter(creation => creation.id !== id);
      setCreations(updatedCreations);
      saveToLocalStorage(updatedCreations, categories);
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de la création');
      return false;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCategory: Category = {
        ...category,
        id: category.name.toLowerCase().replace(/\s+/g, '-')
      };
      
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      saveToLocalStorage(creations, updatedCategories);
      return true;
    } catch (err) {
      setError('Erreur lors de l\'ajout de la catégorie');
      return false;
    }
  };
  
  const updateCategory = async (id: string, updatedCategory: Partial<Category>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedCategories = categories.map(category => 
        category.id === id ? { ...category, ...updatedCategory } : category
      );
      
      // If the category ID was updated, also update all creations that use this category
      if (updatedCategory.id && updatedCategory.id !== id) {
        const updatedCreationsWithCategory = creations.map(creation => 
          creation.category === id ? { ...creation, category: updatedCategory.id! } : creation
        );
        setCreations(updatedCreationsWithCategory);
        saveToLocalStorage(updatedCreationsWithCategory, updatedCategories);
      } else {
        setCategories(updatedCategories);
        saveToLocalStorage(creations, updatedCategories);
      }
      
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la catégorie');
      return false;
    }
  };
  
  const deleteCategory = async (id: string) => {
    try {
      // Don't allow deletion of "all" category
      if (id === 'all') {
        setError('La catégorie "Tous" ne peut pas être supprimée');
        return false;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset category to "all" for all creations in this category
      const updatedCreations = creations.map(creation => 
        creation.category === id ? { ...creation, category: 'all' } : creation
      );
      
      const updatedCategories = categories.filter(category => category.id !== id);
      setCreations(updatedCreations);
      setCategories(updatedCategories);
      saveToLocalStorage(updatedCreations, updatedCategories);
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
    addCreation,
    updateCreation,
    deleteCreation,
    addCategory,
    updateCategory,
    deleteCategory
  };
};