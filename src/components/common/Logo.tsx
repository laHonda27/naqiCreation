import React, { useState, useEffect } from 'react';
import { netlifyGitService } from '../../services/netlifyGitService';

// Événement global pour la mise à jour des paramètres
export const SETTINGS_UPDATED_EVENT = 'settings-updated';

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
  
  // Fonction de chargement des paramètres
  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await netlifyGitService.getJsonFile('site-settings.json');
      if (result.success && result.data) {
        console.log('Paramètres du site chargés dans Logo:', result.data);
        setSettings(result.data);
      } else {
        console.warn('Aucun paramètre de site trouvé ou erreur:', result.error);
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
      console.log('Rechargement des paramètres suite à une mise à jour');
      loadSettings();
    };
    
    // Ajouter l'écouteur d'événement
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    
    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    };
  }, []);
  
  // Si un logo personnalisé est configuré, l'utiliser
  if (!loading && settings?.logo?.useCustomLogo && settings.logo.customLogoUrl) {
    // Construire le chemin correct vers le logo
    let logoPath = settings.logo.customLogoUrl;
    
    // Si le chemin est relatif, le convertir en chemin absolu
    if (!logoPath.startsWith('http://') && !logoPath.startsWith('https://')) {
      // Vérifier si le chemin est déjà dans le format /logos/site-logo.png
      if (logoPath.includes('site-logo.png')) {
        // Utiliser directement le chemin vers le fichier dans le dossier public
        logoPath = '/images/logos/site-logo.png';
      }
    }
    
    console.log('Affichage du logo personnalisé avec chemin corrigé:', logoPath);
    
    return (
      <div className={className}>
        <img 
          src={logoPath} 
          alt={settings.siteTitle || "Naqi Création"} 
          className="h-full w-auto"
          onError={(e) => {
            console.error('Erreur de chargement du logo:', e);
            // Fallback en cas d'erreur de chargement de l'image
            e.currentTarget.style.display = 'none';
            // Afficher le logo texte par défaut
            const container = e.currentTarget.parentElement;
            if (container) {
              container.innerHTML = `
                <h1 class="text-2xl font-semibold font-display italic">${settings?.siteTitle?.split(' - ')[0] || "Naqi Création"}</h1>
                <p class="text-xs tracking-wide uppercase font-display italic">Panneaux personnalisés</p>
              `;
            }
          }}
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