import { useState, useEffect } from 'react';
import { contentUpdateService } from '../services/contentUpdateService';

export interface SiteSettings {
  logo?: {
    useCustomLogo: boolean;
    customLogoUrl: string;
  };
  favicon?: {
    useCustomFavicon: boolean;
    customFaviconUrl: string;
  };
  hero?: {
    useCustomImage: boolean;
    customImageUrl: string;
    title: string;
    subtitle: string;
  };
  siteTitle?: string;
  siteDescription?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        console.log('Chargement des paramètres du site via contentUpdateService...');
        
        // Utiliser contentUpdateService au lieu de netlifyGitService
        const result = await contentUpdateService.getFile('site-settings.json');
        console.log('Résultat du chargement:', result);
        
        if (result.success && result.data) {
          console.log('Données chargées avec succès:', result.data);
          setSettings(result.data);
          setError(null);
        } else {
          console.error('Erreur lors du chargement des paramètres du site:', result.error);
          setError(result.error || 'Erreur lors du chargement des paramètres du site');
        }
      } catch (err: any) {
        console.error('Exception lors du chargement des paramètres du site:', err);
        setError(err.message || 'Erreur lors du chargement des paramètres du site');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: SiteSettings) => {
    try {
      setLoading(true);
      console.log('Mise à jour des paramètres du site via contentUpdateService...');
      
      // Utiliser contentUpdateService au lieu de netlifyGitService
      const result = await contentUpdateService.updateFile(
        'site-settings.json', 
        newSettings, 
        'Mise à jour des paramètres du site depuis le panneau d\'administration'
      );
      
      if (result.success) {
        console.log('Paramètres mis à jour avec succès');
        setSettings(newSettings);
        setError(null);
        return { success: true };
      } else {
        console.error('Erreur lors de la mise à jour des paramètres du site:', result.error);
        setError(result.error || 'Erreur lors de la mise à jour des paramètres du site');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour des paramètres du site';
      console.error('Exception lors de la mise à jour des paramètres du site:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, updateSettings };
};
