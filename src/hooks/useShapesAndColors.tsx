import { useState, useEffect } from 'react';
import { contentUpdateService } from '../services/contentUpdateService';

// Types pour les formes
export interface Shape {
  id: string;
  name: string;
  image: string;
  size: string;
  description: string;
}

// Types pour les couleurs
export interface Color {
  id: string;
  name: string;
  hexCode: string;
  image: string;
  opacity?: number;
}

export function useShapesAndColors() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [panelColors, setPanelColors] = useState<Color[]>([]);
  const [textColors, setTextColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les formes depuis le dépôt Git
        const shapesResult = await contentUpdateService.getFile('shapes.json');
        if (shapesResult.success && shapesResult.data) {
          setShapes(shapesResult.data.shapes || []);
        } else {
          throw new Error(shapesResult.error || 'Erreur lors du chargement des formes');
        }

        // Charger les couleurs depuis le dépôt Git
        const colorsResult = await contentUpdateService.getFile('colors.json');
        if (colorsResult.success && colorsResult.data) {
          setPanelColors(colorsResult.data.panelColors || []);
          setTextColors(colorsResult.data.textColors || []);
        } else {
          throw new Error(colorsResult.error || 'Erreur lors du chargement des couleurs');
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
        
        // Valeurs par défaut en cas d'erreur
        setShapes([]);
        setPanelColors([]);
        setTextColors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    shapes,
    panelColors,
    textColors,
    loading,
    error
  };
}
