import React, { useState, useEffect } from 'react';
import { netlifyGitService } from '../../services/netlifyGitService';
import { cloudinaryService } from '../../services/cloudinaryService';
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react';

// Déclaration pour le timeout de sauvegarde
declare global {
  interface Window {
    saveTimeout?: ReturnType<typeof setTimeout>;
  }
}

interface SiteSettings {
  favicon: {
    useCustomFavicon: boolean;
    customFaviconUrl: string;
  };
  logo: {
    useCustomLogo: boolean;
    customLogoUrl: string;
  };
  hero?: {
    useCustomImage: boolean;
    customImageUrl: string;
    title: string;
    subtitle: string;
  };
  colors?: {
    primary: string;
    secondary: string;
  };
}

const SiteCustomizationManager: React.FC = () => {
  // État principal pour les paramètres du site
  const [settings, setSettings] = useState<SiteSettings>({
    logo: {
      useCustomLogo: false,
      customLogoUrl: ''
    },
    favicon: {
      useCustomFavicon: false,
      customFaviconUrl: ''
    },
    hero: {
      useCustomImage: false,
      customImageUrl: '',
      title: 'Sublimez vos moments avec des créations uniques',
      subtitle: 'Des panneaux et accessoires sur mesure pour rendre vos mariages, fiançailles et célébrations véritablement exceptionnels.'
    },
    colors: {
      primary: '#e11d48',
      secondary: '#78716c'
    }
  });
  
  // États pour la gestion de l'interface utilisateur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // États séparés pour les cases à cocher (pour éviter les problèmes de synchronisation)
  const [useCustomLogo, setUseCustomLogo] = useState(false);
  const [useCustomFavicon, setUseCustomFavicon] = useState(false);
  const [useCustomHeroImage, setUseCustomHeroImage] = useState(false);
  
  // Charger les paramètres du site
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const result = await netlifyGitService.getJsonFile('site-settings.json');
        if (result.success && result.data) {
          // Gérer la rétro-compatibilité si nécessaire
          const cleanedData = { ...result.data };
          
          // Si siteIcon existe dans les données, on le supprime (obsolète)
          if (cleanedData.siteIcon) {
            delete cleanedData.siteIcon;
          }
          
          // Supprimer siteTitle et siteDescription qui sont gérés ailleurs
          if (cleanedData.siteTitle) {
            delete cleanedData.siteTitle;
          }
          
          if (cleanedData.siteDescription) {
            delete cleanedData.siteDescription;
          }
          
          setSettings(cleanedData);
          
          // Initialiser les états séparés pour les cases à cocher
          setUseCustomLogo(cleanedData.logo.useCustomLogo || false);
          setUseCustomFavicon(cleanedData.favicon.useCustomFavicon || false);
          
          // Initialiser l'état pour l'image du hero si elle existe
          if (cleanedData.hero) {
            setUseCustomHeroImage(cleanedData.hero.useCustomImage || false);
            
            // Toujours définir la prévisualisation si une URL existe, indépendamment de l'état de la case à cocher
            if (cleanedData.hero.customImageUrl) {
              setHeroImagePreview(cleanedData.hero.customImageUrl);
            }
          }
          
          // Toujours définir les prévisualisations si des URLs existent
          if (cleanedData.logo.customLogoUrl) {
            setLogoPreview(cleanedData.logo.customLogoUrl);
          }
          
          if (cleanedData.favicon.customFaviconUrl) {
            setFaviconPreview(cleanedData.favicon.customFaviconUrl);
          }
        } else {
          setError('Impossible de charger les paramètres du site');
        }
      } catch (err) {
        setError('Erreur lors du chargement des paramètres: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Synchroniser les états des cases à cocher avec l'état principal
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        useCustomLogo: useCustomLogo
      }
    }));
    
    // Si on décoche, réinitialiser le logo
    if (!useCustomLogo) {
      setLogoPreview(null);
      setLogoFile(null);
    }
  }, [useCustomLogo]);
  
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      favicon: {
        ...prev.favicon,
        useCustomFavicon: useCustomFavicon
      }
    }));
    
    // Si on décoche, réinitialiser le favicon
    if (!useCustomFavicon) {
      setFaviconPreview(null);
      setFaviconFile(null);
    }
  }, [useCustomFavicon]);
  
  
  // Synchroniser l'état de la case à cocher pour l'image du hero avec l'état principal
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        useCustomImage: useCustomHeroImage
      }
    }));
    
    // Si on décoche, réinitialiser l'image du hero
    if (!useCustomHeroImage) {
      setHeroImagePreview(null);
      setHeroImageFile(null);
    }
  }, [useCustomHeroImage]);
  
  // Gestionnaire pour le changement de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB
        alert('Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 2MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
          setLogoFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gestionnaire pour le changement de favicon
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 500 * 1024) { // 500KB
        alert('Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 500KB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFaviconPreview(event.target.result as string);
          setFaviconFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gestionnaire pour le changement d'image du hero
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB
        alert('Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 2MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHeroImagePreview(event.target.result as string);
          setHeroImageFile(file);
          
          // Mettre à jour l'état
          setSettings(prev => ({
            ...prev,
            hero: {
              ...prev.hero!,
              useCustomImage: true
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Réinitialiser le logo
  const resetLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    setSettings(prev => ({
      ...prev,
      logo: {
        useCustomLogo: false,
        customLogoUrl: ''
      }
    }));
  };
  
  // Réinitialiser le favicon
  const resetFavicon = () => {
    setFaviconPreview(null);
    setFaviconFile(null);
    setSettings(prev => ({
      ...prev,
      favicon: {
        useCustomFavicon: false,
        customFaviconUrl: ''
      }
    }));
  };
  
  // Réinitialiser l'image du hero
  const resetHeroImage = () => {
    setHeroImagePreview(null);
    setHeroImageFile(null);
    setSettings(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        useCustomImage: false,
        customImageUrl: ''
      }
    }));
  };
  
  // Fonction debounce pour éviter de sauvegarder trop fréquemment
  const saveSettingsDebounced = () => {
    if (window.saveTimeout) {
      clearTimeout(window.saveTimeout);
    }
    window.saveTimeout = setTimeout(() => {
      saveSettings();
    }, 2000); // Délai plus long pour laisser le temps de manipuler l'interface
  };
  
  // Enregistrer les paramètres
  const saveSettings = async () => {
    try {
      setSaveStatus('saving');
      let updatedSettings = { ...settings };
      
      // Télécharger les fichiers si nécessaire
      if (logoFile) {
        try {
          console.log('Début du téléchargement du logo via Cloudinary');
          // Télécharger le fichier logo vers Cloudinary
          const uploadLogoResult = await cloudinaryService.uploadImage(logoFile);
          
          if (uploadLogoResult.success && uploadLogoResult.imageUrl) {
            console.log('Logo téléchargé avec succès:', uploadLogoResult.imageUrl);
            
            // Mettre à jour les paramètres avec l'URL du logo téléchargé
            updatedSettings = {
              ...updatedSettings,
              logo: {
                useCustomLogo: true,
                customLogoUrl: uploadLogoResult.imageUrl
              }
            };
          } else {
            console.error('Erreur lors du téléchargement du logo:', uploadLogoResult.error);
            throw new Error('Erreur lors du téléchargement du logo: ' + 
              (uploadLogoResult.error || 'Erreur inconnue'));
          }
        } catch (error) {
          console.error('Exception lors du téléchargement du logo:', error);
          // Continuer sans mettre à jour le logo
        }
      }
      
      if (faviconFile) {
        try {
          console.log('Début du téléchargement du favicon via Cloudinary');
          // Télécharger le fichier favicon vers Cloudinary
          const uploadFaviconResult = await cloudinaryService.uploadImage(faviconFile);
          
          if (uploadFaviconResult.success && uploadFaviconResult.imageUrl) {
            console.log('Favicon téléchargé avec succès:', uploadFaviconResult.imageUrl);
            
            // Mettre à jour les paramètres avec l'URL du favicon téléchargé
            updatedSettings = {
              ...updatedSettings,
              favicon: {
                useCustomFavicon: true,
                customFaviconUrl: uploadFaviconResult.imageUrl
              }
            };
          } else {
            console.error('Erreur lors du téléchargement du favicon:', uploadFaviconResult.error);
            throw new Error('Erreur lors du téléchargement du favicon: ' + 
              (uploadFaviconResult.error || 'Erreur inconnue'));
          }
        } catch (error) {
          console.error('Exception lors du téléchargement du favicon:', error);
          // Continuer sans mettre à jour le favicon
        }
      }
      
      // Le bloc de gestion de siteIconFile a été supprimé car cette fonctionnalité est fusionnée avec le logo
      
      if (heroImageFile) {
        try {
          console.log('Début du téléchargement de l\'image du hero via Cloudinary');
          // Télécharger le fichier image du hero vers Cloudinary
          const uploadHeroImageResult = await cloudinaryService.uploadImage(heroImageFile);
          
          if (uploadHeroImageResult.success && uploadHeroImageResult.imageUrl) {
            console.log('Image du hero téléchargée avec succès:', uploadHeroImageResult.imageUrl);
            
            // Mettre à jour les paramètres avec l'URL de l'image du hero téléchargée
            updatedSettings = {
              ...updatedSettings,
              hero: {
                ...(updatedSettings.hero || {}),
                useCustomImage: true,
                customImageUrl: uploadHeroImageResult.imageUrl,
                title: settings.hero?.title || '',
                subtitle: settings.hero?.subtitle || ''
              }
            };
          } else {
            console.error('Erreur lors du téléchargement de l\'image du hero:', uploadHeroImageResult.error);
            throw new Error('Erreur lors du téléchargement de l\'image du hero: ' + 
              (uploadHeroImageResult.error || 'Erreur inconnue'));
          }
        } catch (error) {
          console.error('Exception lors du téléchargement de l\'image du hero:', error);
          // Continuer sans mettre à jour l'image du hero
        }
      }
      
      // Enregistrer les paramètres mis à jour
      console.log('Enregistrement des paramètres mis à jour:', updatedSettings);
      const result = await netlifyGitService.writeJsonFile('site-settings.json', updatedSettings, 'Mise à jour des paramètres du site');
      
      if (result.success) {
        console.log('Paramètres du site enregistrés avec succès');
        setSaveStatus('success');
        
        // Réinitialiser les états des fichiers, mais pas les prévisualisations
        setLogoFile(null);
        setFaviconFile(null);
        setHeroImageFile(null);
        
        // Réinitialiser le statut après 3 secondes
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'enregistrement des paramètres');
      }
    } catch (err: any) {
      console.error('Erreur lors de l\'enregistrement des paramètres:', err);
      setSaveStatus('error');
      setError(`Impossible de sauvegarder les paramètres du site: ${err.message}`);
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    }
  };
  // Mise à jour des champs textuels
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('hero.')) {
      // Gérer les champs de texte du hero
      const heroField = name.split('.')[1];
      setSettings(prev => ({
        ...prev,
        hero: {
          ...prev.hero!,
          [heroField]: value
        }
      }));
    } else {
      // Gérer les autres champs de texte
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    saveSettingsDebounced();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-taupe-900">Personnalisation du site</h2>
      
      {loading ? (
        <div className="flex items-center justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Notification d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Erreur</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {/* Notification de sauvegarde */}
          {saveStatus === 'saving' && (
            <div className="bg-beige-50 border border-beige-200 rounded-lg p-4 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500 mr-2"></div>
              <p className="text-taupe-700">Enregistrement des modifications...</p>
            </div>
          )}
          
          {saveStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">Modifications enregistrées avec succès.</p>
            </div>
          )}
          
          {/* La section Informations générales a été supprimée */}
          
          {/* Section du logo */}
          <div className="bg-beige-50 p-4 sm:p-6 rounded-lg border border-beige-200">
            <h3 className="font-semibold mb-4 text-taupe-800">Logo du site</h3>
            
            <div className="flex flex-col sm:flex-row items-start sm:space-x-4 md:space-x-8 space-y-4 sm:space-y-0">
              <div className="w-full sm:w-1/3">
                <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 w-full border border-beige-200">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Aperçu du logo" 
                      className="max-h-16 max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-taupe-400">
                      <Upload size={24} className="mx-auto mb-1" />
                      <p className="text-sm">Aucun logo personnalisé</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="useCustomLogo"
                    checked={useCustomLogo}
                    onChange={(e) => setUseCustomLogo(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="useCustomLogo" className="text-sm text-taupe-700">
                    Utiliser un logo personnalisé
                  </label>
                </div>
              </div>
              
              <div className="w-full sm:w-2/3 space-y-4">
                {useCustomLogo && (
                  <div>
                    <label className="block text-sm font-medium text-taupe-700 mb-1">
                      Télécharger un nouveau logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="block w-full text-sm text-taupe-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
                    />
                    <p className="mt-1 text-xs text-taupe-500">Format recommandé: PNG transparent, max 2MB</p>
                  </div>
                )}
                
                {logoPreview && (
                  <button
                    onClick={resetLogo}
                    className="text-rose-500 hover:text-rose-600 text-sm flex items-center"
                  >
                    <X size={16} className="mr-1" />
                    Supprimer le logo personnalisé
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Section de l'image du hero */}
          <div className="bg-beige-50 p-4 sm:p-6 rounded-lg border border-beige-200">
            <h3 className="font-semibold mb-4 text-taupe-800">Image d'en-tête (Hero)</h3>
            
            {/* La section de prévisualisation de l'image prend toute la largeur */}
            <div className="w-full mb-4">
              <div className="bg-white rounded-lg p-4 flex items-center justify-center h-48 w-full border border-beige-200">
                {heroImagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={heroImagePreview} 
                      alt="Aperçu de l'image d'en-tête" 
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      onClick={resetHeroImage}
                      className="absolute top-2 right-2 bg-white bg-opacity-70 p-1 rounded-full hover:bg-opacity-100 transition-all"
                      title="Supprimer l'image personnalisée"
                    >
                      <X size={20} className="text-rose-500" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-taupe-400">
                    <Upload size={32} className="mx-auto mb-2" />
                    <p className="text-sm">Aucune image d'en-tête personnalisée</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="useCustomHeroImage"
                    checked={useCustomHeroImage}
                    onChange={(e) => setUseCustomHeroImage(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="useCustomHeroImage" className="text-sm text-taupe-700">
                    Utiliser une image d'en-tête personnalisée
                  </label>
                </div>
                
                {useCustomHeroImage && (
                  <div>
                    <label className="block text-sm font-medium text-taupe-700 mb-1">
                      Télécharger une nouvelle image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageChange}
                      className="block w-full text-sm text-taupe-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
                    />
                    <p className="mt-1 text-xs text-taupe-500">Format recommandé: JPG/PNG, 1920x1080px, max 2MB</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="hero.title" className="block text-sm font-medium text-taupe-700 mb-1">
                    Titre de l'en-tête
                  </label>
                  <input
                    type="text"
                    id="hero.title"
                    name="hero.title"
                    value={settings.hero?.title || ''}
                    onChange={handleTextInputChange}
                    className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="hero.subtitle" className="block text-sm font-medium text-taupe-700 mb-1">
                    Sous-titre de l'en-tête
                  </label>
                  <textarea
                    id="hero.subtitle"
                    name="hero.subtitle"
                    value={settings.hero?.subtitle || ''}
                    onChange={handleTextInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Section Favicon */}
          <div className="bg-beige-50 p-4 sm:p-6 rounded-lg border border-beige-200">
              <h3 className="font-semibold mb-4 text-taupe-800">Favicon (icône d'onglet)</h3>
              
              <div className="flex flex-col sm:flex-row items-start sm:space-x-4 md:space-x-8 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-1/3">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 w-full border border-beige-200">
                    {faviconPreview ? (
                      <img 
                        src={faviconPreview} 
                        alt="Aperçu du favicon" 
                        className="max-h-16 max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-taupe-400">
                        <Upload size={24} className="mx-auto mb-1" />
                        <p className="text-sm">Aucun favicon personnalisé</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="useCustomFavicon"
                      checked={useCustomFavicon}
                      onChange={(e) => setUseCustomFavicon(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="useCustomFavicon" className="text-sm text-taupe-700">
                      Utiliser un favicon personnalisé
                    </label>
                  </div>
                </div>
                
                <div className="w-full sm:w-2/3 space-y-4">
                  {useCustomFavicon && (
                    <div>
                      <label className="block text-sm font-medium text-taupe-700 mb-1">
                        Télécharger un nouveau favicon
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconChange}
                        className="block w-full text-sm text-taupe-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
                      />
                      <p className="mt-1 text-xs text-taupe-500">Format recommandé: PNG carré, 32x32px, max 500KB</p>
                    </div>
                  )}
                  
                  {faviconPreview && (
                    <button
                      onClick={resetFavicon}
                      className="text-rose-500 hover:text-rose-600 text-sm flex items-center"
                    >
                      <X size={16} className="mr-1" />
                      Supprimer le favicon personnalisé
                    </button>
                  )}
                </div>
              </div>
            </div>
          
          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteCustomizationManager;
