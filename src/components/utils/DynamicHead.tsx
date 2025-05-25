import React, { useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

/**
 * Composant qui met à jour dynamiquement les éléments de l'en-tête HTML
 * comme le favicon, le titre, etc. en fonction des paramètres du site
 */
const DynamicHead: React.FC = () => {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (loading || !settings) return;

    // Mettre à jour le favicon si un favicon personnalisé est défini
    if (settings.favicon?.useCustomFavicon && settings.favicon?.customFaviconUrl) {
      const existingFavicon = document.querySelector('link[rel="icon"]');
      
      if (existingFavicon) {
        // Mettre à jour le favicon existant
        existingFavicon.setAttribute('href', settings.favicon.customFaviconUrl);
        
        // Mettre à jour le type MIME en fonction de l'extension du fichier
        const fileExtension = settings.favicon.customFaviconUrl.split('.').pop()?.toLowerCase();
        
        if (fileExtension) {
          let mimeType = 'image/x-icon'; // Par défaut
          
          if (fileExtension === 'svg') {
            mimeType = 'image/svg+xml';
          } else if (fileExtension === 'png') {
            mimeType = 'image/png';
          } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
            mimeType = 'image/jpeg';
          } else if (fileExtension === 'gif') {
            mimeType = 'image/gif';
          } else if (fileExtension === 'webp') {
            mimeType = 'image/webp';
          }
          
          existingFavicon.setAttribute('type', mimeType);
        }
      } else {
        // Créer un nouveau lien favicon s'il n'existe pas
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = settings.favicon.customFaviconUrl;
        document.head.appendChild(newFavicon);
      }
      
      console.log('Favicon mis à jour avec succès:', settings.favicon.customFaviconUrl);
    } else {
      // Réinitialiser au favicon par défaut si aucun favicon personnalisé n'est défini
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon) {
        existingFavicon.setAttribute('href', '/favicon.svg');
        existingFavicon.setAttribute('type', 'image/svg+xml');
      }
    }
    
    // Mettre à jour d'autres éléments d'en-tête si nécessaire
    // Par exemple, le titre du site, la description, etc.
    
  }, [settings, loading]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default DynamicHead;
