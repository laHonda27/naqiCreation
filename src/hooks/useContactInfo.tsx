import { useState, useEffect } from 'react';
import { contentUpdateService } from '../services/contentUpdateService';

export interface ContactInfo {
  email: string;
  phone: string;
  showPhone: boolean;
  address: string;
  instagram: string;
}

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    showPhone: true,
    address: '',
    instagram: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les données au chargement du composant
  useEffect(() => {
    loadContactInfo();
  }, []);
  
  // Fonction pour charger les informations de contact
  const loadContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les informations de contact
      const contactResult = await contentUpdateService.getFile('contact.json');
      
      if (contactResult.success) {
        setContactInfo(contactResult.data.contactInfo || {
          email: '',
          phone: '',
          showPhone: true,
          address: '',
          instagram: ''
        });
      } else {
        throw new Error('Erreur lors du chargement des informations de contact');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des informations de contact:', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour mettre à jour les informations de contact
  const updateContactInfo = async (updatedInfo: Partial<ContactInfo>) => {
    try {
      const newContactInfo = {
        ...contactInfo,
        ...updatedInfo
      };
      
      // Mettre à jour le fichier JSON
      const result = await contentUpdateService.updateFile(
        'contact.json',
        { contactInfo: newContactInfo },
        'Mise à jour des informations de contact'
      );
      
      if (result.success) {
        setContactInfo(newContactInfo);
        return true;
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour du fichier');
      }
    } catch (err: any) {
      setError('Erreur lors de la mise à jour des informations de contact: ' + (err.message || 'Erreur inconnue'));
      return false;
    }
  };
  
  // Fonction pour basculer l'affichage du numéro de téléphone
  const togglePhoneVisibility = async () => {
    return updateContactInfo({ showPhone: !contactInfo.showPhone });
  };
  
  return {
    contactInfo,
    loading,
    error,
    loadContactInfo,
    updateContactInfo,
    togglePhoneVisibility
  };
}
