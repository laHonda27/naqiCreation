import { useState, useEffect } from 'react';
import { netlifyGitService } from '../services/netlifyGitService';

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
        const result = await netlifyGitService.getJsonFile('site-settings.json');
        if (result.success && result.data) {
          setSettings(result.data);
          setError(null);
        } else {
          setError(result.error || 'Erreur lors du chargement des paramètres du site');
          console.error('Erreur lors du chargement des paramètres du site:', result.error);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des paramètres du site');
        console.error('Erreur lors du chargement des paramètres du site:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: SiteSettings) => {
    try {
      setLoading(true);
      const result = await netlifyGitService.updateFile('site-settings.json', newSettings);
      if (result.success) {
        setSettings(newSettings);
        setError(null);
        return { success: true };
      } else {
        setError(result.error || 'Erreur lors de la mise à jour des paramètres du site');
        console.error('Erreur lors de la mise à jour des paramètres du site:', result.error);
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour des paramètres du site';
      setError(errorMessage);
      console.error('Erreur lors de la mise à jour des paramètres du site:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, updateSettings };
};
