import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { netlifyGitService } from '../../services/netlifyGitService';
import { SETTINGS_UPDATED_EVENT } from './Logo';

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
  
  // Fonction de chargement des paramètres
  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await netlifyGitService.getJsonFile('site-settings.json');
      if (result.success && result.data) {
        console.log('Paramètres du site chargés dans SiteHead:', result.data);
        setSettings(result.data);
      } else {
        console.warn('Aucun paramètre de site trouvé ou erreur dans SiteHead:', result.error);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres du site:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les paramètres au chargement du composant
  useEffect(() => {
    loadSettings();
    
    // Écouter l'événement de mise à jour des paramètres
    const handleSettingsUpdate = () => {
      console.log('Rechargement des paramètres dans SiteHead suite à une mise à jour');
      loadSettings();
    };
    
    // Ajouter l'écouteur d'événement
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    
    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    };
  }, []);
  
  if (loading) {
    return null;
  }
  
  return (
    <Helmet>
      {settings?.siteTitle && (
        <title>{settings.siteTitle}</title>
      )}
      
      {settings?.siteDescription && (
        <meta name="description" content={settings.siteDescription} />
      )}
      
      {/* Gestion du favicon */}
      {settings?.favicon?.useCustomFavicon && settings.favicon.customFaviconUrl ? (
        <>
          {/* Utiliser le chemin direct vers le favicon personnalisé */}
          {(() => {
            let faviconPath = settings.favicon.customFaviconUrl;
            
            // Si le chemin est relatif, le convertir en chemin absolu
            if (!faviconPath.startsWith('http://') && !faviconPath.startsWith('https://')) {
              // Utiliser directement le chemin vers le fichier dans le dossier public
              faviconPath = '/images/favicons/site-favicon.png';
            }
            
            console.log('Utilisation du favicon personnalisé avec chemin corrigé:', faviconPath);
            
            return <link rel="icon" href={faviconPath} />;
          })()}
        </>
      ) : (
        // Utiliser le favicon par défaut
        <link rel="icon" href="/images/favicon.svg" />
      )}
    </Helmet>
  );
};

export default SiteHead;
