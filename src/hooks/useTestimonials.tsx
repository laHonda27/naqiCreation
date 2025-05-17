import { useState, useEffect } from 'react';

export interface BaseTestimonial {
  id: string;
  name: string;
  event: string;
  rating: number;
  type: 'text' | 'screenshot';
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

// Mock data for testimonials
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    type: 'text',
    name: 'Sophia Dupont',
    comment: 'Panneau de mariage magnifique ! Élégant et de qualité, il a été admiré par tous nos invités. Nous sommes ravis et recommandons Naqi Création sans hésiter.',
    rating: 5,
    event: 'Mariage',
    avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '2',
    type: 'text',
    name: 'Karim et Leila',
    comment: 'Service impeccable et résultat à la hauteur de nos attentes. Notre panneau de fiançailles était parfait et a ajouté une touche spéciale à notre événement.',
    rating: 5,
    event: 'Fiançailles',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '3',
    type: 'screenshot',
    name: 'Emma Martin',
    rating: 5,
    event: 'Baby Shower',
    imageUrl: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    caption: 'Témoignage reçu par message privé sur Instagram'
  },
  {
    id: '4',
    type: 'text',
    name: 'Emma Martin',
    comment: 'Créatif, professionnel et à l\'écoute de nos besoins. Le panneau de baptême de notre fils a été exactement comme nous le souhaitions.',
    rating: 4,
    event: 'Baptême',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '5',
    type: 'screenshot',
    name: 'Julie et Marc',
    rating: 5,
    event: 'Anniversaire de mariage',
    imageUrl: 'https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    caption: 'Message reçu après livraison du panneau anniversaire'
  }
];

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Simulate API fetch
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, this would fetch from an API
        setTestimonials(mockTestimonials);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des témoignages');
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTestimonial: Testimonial = {
        ...testimonial,
        id: Date.now().toString()
      };
      
      setTestimonials(prev => [...prev, newTestimonial]);
      return true;
    } catch (err) {
      setError('Erreur lors de l\'ajout du témoignage');
      return false;
    }
  };
  
  const updateTestimonial = async (id: string, updatedTestimonial: Partial<Testimonial>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === id ? { ...testimonial, ...updatedTestimonial } : testimonial
        )
      );
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour du témoignage');
      return false;
    }
  };
  
  const deleteTestimonial = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression du témoignage');
      return false;
    }
  };
  
  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
};