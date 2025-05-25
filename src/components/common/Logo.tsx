import React from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface LogoProps {
  className?: string;
}

// Utilisation de l'interface SiteSettings du hook useSiteSettings

const Logo: React.FC<LogoProps> = ({ className = "h-12 w-auto" }) => {
  // Utilisation du hook useSiteSettings pour récupérer les paramètres du site
  const { settings, loading } = useSiteSettings();
  
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