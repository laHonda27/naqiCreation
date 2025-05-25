import { useState, useEffect } from 'react';

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

        // Charger les formes
        const shapesResponse = await fetch('/data/shapes.json');
        if (!shapesResponse.ok) {
          throw new Error(`Erreur lors du chargement des formes: ${shapesResponse.status}`);
        }
        const shapesData = await shapesResponse.json();
        setShapes(shapesData.shapes || []);

        // Charger les couleurs
        const colorsResponse = await fetch('/data/colors.json');
        if (!colorsResponse.ok) {
          throw new Error(`Erreur lors du chargement des couleurs: ${colorsResponse.status}`);
        }
        const colorsData = await colorsResponse.json();
        setPanelColors(colorsData.panelColors || []);
        setTextColors(colorsData.textColors || []);
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
