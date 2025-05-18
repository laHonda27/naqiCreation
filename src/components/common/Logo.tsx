import React, { useState, useEffect } from 'react';
import { netlifyGitService } from '../../services/netlifyGitService';

interface LogoProps {
  className?: string;
}

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

const Logo: React.FC<LogoProps> = ({ className = "h-12 w-auto" }) => {
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
  
  // Si un logo personnalisé est configuré, l'utiliser
  if (!loading && settings?.logo?.useCustomLogo && settings.logo.customLogoUrl) {
    return (
      <div className={className}>
        <img 
          src={settings.logo.customLogoUrl} 
          alt={settings.siteTitle || "Naqi Création"} 
          className="h-full w-auto"
        />
      </div>
    );
  }
  
  // Sinon, utiliser le logo par défaut (texte)
  return (
    <div className={`text-taupe-800 font-display italic ${className}`}>
      <h1 className="text-2xl font-semibold">{settings?.siteTitle?.split(' - ')[0] || "Naqi Création"}</h1>
      <p className="text-xs tracking-wide uppercase">Panneaux personnalisés</p>
    </div>
  );
};

export default Logo;