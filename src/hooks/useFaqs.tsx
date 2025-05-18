import { useState, useEffect } from 'react';
import { netlifyGitService } from '../services/netlifyGitService';

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface FaqsData {
  faqs: {
    home: Faq[];
    contact: Faq[];
    services: Faq[];
    customization: Faq[];
    [key: string]: Faq[];
  };
}

export type FaqPageType = 'home' | 'contact' | 'services' | 'customization';

export const useFaqs = () => {
  const [faqs, setFaqs] = useState<FaqsData>({ faqs: { home: [], contact: [], services: [], customization: [] } });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);

        // Synchroniser d'abord le dépôt pour s'assurer d'avoir les dernières données
        await netlifyGitService.syncRepository();
        
        // Récupérer les données depuis le fichier faqs.json via le service Git
        const result = await netlifyGitService.getJsonFile('faqs.json');

        if (result.success) {
          try {
            let parsedData;
            
            if (typeof result.content === 'string') {
              // Si nous avons une chaîne JSON, la parser
              parsedData = JSON.parse(result.content);
            } else if (result.data) {
              // Si nous avons déjà un objet data, l'utiliser directement
              parsedData = result.data;
            } else {
              // Fallback sur un objet vide
              parsedData = { faqs: { home: [], contact: [], services: [], customization: [] } };
            }

            // Si les FAQs existent, les utiliser, sinon créer un tableau vide
            if (parsedData.faqs) {
              setFaqs(parsedData);
            } else {
              // Initialiser les FAQs s'ils n'existent pas
              setFaqs({ faqs: { home: [], contact: [], services: [], customization: [] } });
            }
          } catch (parseError: any) {
            console.error('Erreur lors du parsing JSON:', parseError);
            setError(`Erreur lors du parsing JSON: ${parseError.message || 'Erreur inconnue'}`);
            setFaqs({ faqs: { home: [], contact: [], services: [], customization: [] } });
          }
        } else {
          console.error('Erreur lors du chargement des FAQs:', result.error);
          setError('Erreur lors du chargement des FAQs: ' + (result.error || 'Données non disponibles'));
          setFaqs({ faqs: { home: [], contact: [], services: [], customization: [] } });
        }
      } catch (err: any) {
        console.error('Exception lors du chargement des FAQs:', err);
        setError('Erreur lors du chargement des FAQs: ' + (err.message || 'Erreur inconnue'));
        setFaqs({ faqs: { home: [], contact: [], services: [], customization: [] } });
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []); // Appelé uniquement au montage du composant

  const getFaqsByPage = (page: FaqPageType): Faq[] => {
    return faqs.faqs[page] || [];
  };

  const addFaq = async (page: FaqPageType, faq: Omit<Faq, 'id'>) => {
    try {
      const newId = `${page}-${Date.now()}`;
      const newFaq: Faq = {
        ...faq,
        id: newId
      };

      // Ajouter la nouvelle FAQ à la liste locale
      const updatedFaqs = { 
        ...faqs,
        faqs: {
          ...faqs.faqs,
          [page]: [...(faqs.faqs[page] || []), newFaq]
        }
      };
      
      setFaqs(updatedFaqs);

      // Mettre à jour le fichier faqs.json
      const result = await netlifyGitService.writeJsonFile(
        'faqs.json',
        updatedFaqs,
        `Ajout d'une nouvelle FAQ à la page ${page}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(`Erreur lors de l'ajout de la FAQ: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  const updateFaq = async (page: FaqPageType, id: string, updatedFaq: Partial<Faq>) => {
    try {
      // Mettre à jour la FAQ localement
      const updatedPageFaqs = faqs.faqs[page].map(faq =>
        faq.id === id ? { ...faq, ...updatedFaq } : faq
      );

      const updatedFaqs = {
        ...faqs,
        faqs: {
          ...faqs.faqs,
          [page]: updatedPageFaqs
        }
      };

      setFaqs(updatedFaqs);

      // Mettre à jour le fichier faqs.json
      const result = await netlifyGitService.writeJsonFile(
        'faqs.json',
        updatedFaqs,
        `Mise à jour d'une FAQ sur la page ${page}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(`Erreur lors de la mise à jour de la FAQ: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  const deleteFaq = async (page: FaqPageType, id: string) => {
    try {
      // Supprimer la FAQ localement
      const updatedPageFaqs = faqs.faqs[page].filter(faq => faq.id !== id);

      const updatedFaqs = {
        ...faqs,
        faqs: {
          ...faqs.faqs,
          [page]: updatedPageFaqs
        }
      };

      setFaqs(updatedFaqs);

      // Mettre à jour le fichier faqs.json
      const result = await netlifyGitService.writeJsonFile(
        'faqs.json',
        updatedFaqs,
        `Suppression d'une FAQ de la page ${page}`
      );

      if (!result.success) {
        setError(`Erreur lors de l'enregistrement: ${result.error || 'Erreur inconnue'}`);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(`Erreur lors de la suppression de la FAQ: ${err.message || 'Erreur inconnue'}`);
      return false;
    }
  };

  return {
    faqs,
    loading,
    error,
    getFaqsByPage,
    addFaq,
    updateFaq,
    deleteFaq
  };
};
