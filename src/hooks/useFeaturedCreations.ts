import { useState, useEffect } from 'react';

interface Creation {
  id: string;
  title: string;
  description: string;
  image: string;
  featured?: boolean;
  category?: string;
  price?: number;
  tag?: string;
}

export const useFeaturedCreations = () => {
  const [featuredCreations, setFeaturedCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreations = async () => {
      try {
        const response = await fetch('/data/creations.json');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des créations');
        }
        const data = await response.json();
        
        // Récupérer d'abord les créations en vedette, puis compléter si nécessaire
        let creations = data.creations || [];
        let featured = creations.filter((c: Creation) => c.featured).slice(0, 4);
        
        // Si on a moins de 4 créations en vedette, on complète avec d'autres
        if (featured.length < 4) {
          const remaining = 4 - featured.length;
          const nonFeatured = creations
            .filter((c: Creation) => !featured.some(fc => fc.id === c.id))
            .slice(0, remaining);
          featured = [...featured, ...nonFeatured];
        }
        
        // S'assurer qu'on a bien 4 éléments maximum
        setFeaturedCreations(featured.slice(0, 4));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Erreur lors du chargement des créations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreations();
  }, []);

  return { featuredCreations, loading, error };
};
