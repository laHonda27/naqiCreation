// Types pour les créations
export interface Creation {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  date?: string;
  technicalDetails: string[];
  customizationOptions: string[];
  orderProcess: OrderProcess[];
  specifications: Specifications;
}

// Type pour les étapes du processus de commande
export interface OrderProcess {
  step: number;
  title: string;
  description: string;
}

// Type pour les spécifications
export interface Specifications {
  standardSize: string;
  deliveryTime: string;
  material: string;
  additionalInfo: string[];
}

// Type pour les catégories
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Type pour les témoignages
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  image?: string;
  rating?: number;
}
