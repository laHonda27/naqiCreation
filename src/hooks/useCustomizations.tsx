import { useState, useEffect } from 'react';
import { contentUpdateService } from '../services/contentUpdateService';

export interface CustomizationImage {
  src: string;
  alt: string;
}

export interface CustomItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  minQuantity: number;
  priceInfo: string;
  materials: string[];
  dimensions: string[];
  images: CustomizationImage[];
  examples: string[];
  featured: boolean;
}

export function useCustomizations() {
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les données au chargement du composant
  useEffect(() => {
    loadCustomItems();
  }, []);
  
  // Fonction pour charger les personnalisations
  const loadCustomItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les personnalisations
      const result = await contentUpdateService.getFile('customizations.json');
      
      if (result.success) {
        setCustomItems(result.data.customItems || []);
      } else {
        throw new Error('Erreur lors du chargement des personnalisations');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des personnalisations:', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour ajouter une personnalisation
  const addCustomItem = async (item: Omit<CustomItem, 'id'>) => {
    try {
      // Générer un ID unique
      const newItem: CustomItem = {
        ...item,
        id: `custom-${Date.now()}`
      };
      
      const updatedItems = [...customItems, newItem];
      
      // Mettre à jour le fichier JSON
      const result = await contentUpdateService.updateFile(
        'customizations.json',
        { customItems: updatedItems },
        'Ajout d\'une nouvelle personnalisation'
      );
      
      if (result.success) {
        setCustomItems(updatedItems);
        return true;
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour du fichier');
      }
    } catch (err: any) {
      setError('Erreur lors de l\'ajout de la personnalisation: ' + (err.message || 'Erreur inconnue'));
      return false;
    }
  };
  
  // Fonction pour mettre à jour une personnalisation
  const updateCustomItem = async (id: string, updatedItem: Partial<CustomItem>) => {
    try {
      const updatedItems = customItems.map(item =>
        item.id === id ? { ...item, ...updatedItem } : item
      );
      
      // Mettre à jour le fichier JSON
      const result = await contentUpdateService.updateFile(
        'customizations.json',
        { customItems: updatedItems },
        `Mise à jour de la personnalisation: ${id}`
      );
      
      if (result.success) {
        setCustomItems(updatedItems);
        return true;
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour du fichier');
      }
    } catch (err: any) {
      setError('Erreur lors de la mise à jour de la personnalisation: ' + (err.message || 'Erreur inconnue'));
      return false;
    }
  };
  
  // Fonction pour supprimer une personnalisation
  const deleteCustomItem = async (id: string) => {
    try {
      const updatedItems = customItems.filter(item => item.id !== id);
      
      // Mettre à jour le fichier JSON
      const result = await contentUpdateService.updateFile(
        'customizations.json',
        { customItems: updatedItems },
        `Suppression de la personnalisation: ${id}`
      );
      
      if (result.success) {
        setCustomItems(updatedItems);
        return true;
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour du fichier');
      }
    } catch (err: any) {
      setError('Erreur lors de la suppression de la personnalisation: ' + (err.message || 'Erreur inconnue'));
      return false;
    }
  };
  
  return {
    customItems,
    loading,
    error,
    loadCustomItems,
    addCustomItem,
    updateCustomItem,
    deleteCustomItem
  };
}
