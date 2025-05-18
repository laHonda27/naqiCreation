import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { netlifyGitService } from '../../services/netlifyGitService';

interface SiteSettings {
  logo?: {
    useCustomLogo: boolean;
    customLogoUrl: string;
  };
  favicon?: {
    useCustomFavicon: boolean;
    customFaviconUrl: string;
  };
  siteTitle?: string;
  siteDescription?: string;
}

const SiteHead: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await netlifyGitService.getJsonFile('site-settings.json');
        if (result.success && result.data) {
          setSettings(result.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres du site:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  if (loading) {
    return (
      <Helmet>
        <title>Naqi Création - Panneaux personnalisés</title>
        <meta name="description" content="Créations personnalisées pour tous vos événements" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
    );
  }
  
  return (
    <Helmet>
      <title>{settings?.siteTitle || "Naqi Création - Panneaux personnalisés"}</title>
      <meta 
        name="description" 
        content={settings?.siteDescription || "Créations personnalisées pour tous vos événements"} 
      />
      {settings?.favicon?.useCustomFavicon && settings.favicon.customFaviconUrl ? (
        <link rel="icon" href={settings.favicon.customFaviconUrl} />
      ) : (
        <link rel="icon" href="/favicon.ico" />
      )}
    </Helmet>
  );
};

export default SiteHead;
