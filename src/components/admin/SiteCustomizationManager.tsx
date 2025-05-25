import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, X, CheckCircle } from 'lucide-react';
import { netlifyGitService } from '../../services/netlifyGitService';

// Déclaration pour le timeout de sauvegarde
declare global {
  interface Window {
    saveTimeout?: ReturnType<typeof setTimeout>;
  }
}

interface SiteSettings {
  logo: {
    useCustomLogo: boolean;
    customLogoUrl: string;
  };
  favicon: {
    useCustomFavicon: boolean;
    customFaviconUrl: string;
  };
  siteIcon: {
    useCustomIcon: boolean;
    customIconUrl: string;
  };
  hero?: {
    useCustomImage: boolean;
    customImageUrl: string;
    title: string;
    subtitle: string;
  };
  siteTitle: string;
  siteDescription: string;
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
    siteIcon: {
      useCustomIcon: false,
      customIconUrl: ''
    },
    hero: {
      useCustomImage: false,
      customImageUrl: '',
      title: 'Sublimez vos moments avec des créations uniques',
      subtitle: 'Des panneaux et accessoires sur mesure pour rendre vos mariages, fiançailles et célébrations véritablement exceptionnels.'
    },
    siteTitle: 'Naqi Création - Panneaux personnalisés',
    siteDescription: 'Créations personnalisées pour tous vos événements',
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
  const [siteIconPreview, setSiteIconPreview] = useState<string | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [siteIconFile, setSiteIconFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // États séparés pour les cases à cocher (pour éviter les problèmes de synchronisation)
  const [useCustomLogo, setUseCustomLogo] = useState(false);
  const [useCustomFavicon, setUseCustomFavicon] = useState(false);
  const [useCustomSiteIcon, setUseCustomSiteIcon] = useState(false);
  const [useCustomHeroImage, setUseCustomHeroImage] = useState(false);
  
  // Charger les paramètres du site
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const result = await netlifyGitService.getJsonFile('site-settings.json');
        if (result.success && result.data) {
          // Vérifier si siteIcon existe, sinon l'ajouter
          if (!result.data.siteIcon) {
            result.data.siteIcon = {
              useCustomIcon: false,
              customIconUrl: ''
            };
          }
          
          setSettings(result.data);
          
          // Initialiser les états séparés pour les cases à cocher
          setUseCustomLogo(result.data.logo.useCustomLogo || false);
          setUseCustomFavicon(result.data.favicon.useCustomFavicon || false);
          setUseCustomSiteIcon(result.data.siteIcon.useCustomIcon || false);
          
          // Initialiser l'état pour l'image du hero si elle existe
          if (result.data.hero) {
            setUseCustomHeroImage(result.data.hero.useCustomImage || false);
            
            if (result.data.hero.useCustomImage && result.data.hero.customImageUrl) {
              setHeroImagePreview(result.data.hero.customImageUrl);
            }
          }
          
          if (result.data.logo.useCustomLogo && result.data.logo.customLogoUrl) {
            setLogoPreview(result.data.logo.customLogoUrl);
          }
          
          if (result.data.favicon.useCustomFavicon && result.data.favicon.customFaviconUrl) {
            setFaviconPreview(result.data.favicon.customFaviconUrl);
          }
          
          if (result.data.siteIcon.useCustomIcon && result.data.siteIcon.customIconUrl) {
            setSiteIconPreview(result.data.siteIcon.customIconUrl);
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
      if (file.size > 1024 * 1024) { // 1MB
        alert('Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 1MB.');
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
  
  // Gestionnaire pour le changement d'icône du site
  const handleSiteIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) { // 1MB
        alert('Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 1MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSiteIconPreview(event.target.result as string);
          setSiteIconFile(file);
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
  
  // Réinitialiser le site icon
  const resetSiteIcon = () => {
    setSiteIconPreview(null);
    setSiteIconFile(null);
    setSettings(prev => ({
      ...prev,
      siteIcon: {
        useCustomIcon: false,
        customIconUrl: ''
      }
    }));
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
        // Générer un nom de fichier unique pour le logo
        const logoFilename = `logos/site-logo-${Date.now()}.png`;
        
        console.log('Début du téléchargement du logo:', logoFilename);
        // Télécharger le fichier logo vers le serveur avec la nouvelle fonction
        const uploadLogoResult = await netlifyGitService.callNetlifyFunction('upload', {
          path: logoFilename,
          content: logoPreview,
          message: 'Ajout du logo personnalisé'
        });
        
        if (uploadLogoResult.success && uploadLogoResult.data) {
          console.log('Logo téléchargé avec succès:', uploadLogoResult.data);
          
          // Mettre à jour les paramètres avec l'URL du logo téléchargé
          updatedSettings = {
            ...updatedSettings,
            logo: {
              useCustomLogo: true,
              customLogoUrl: uploadLogoResult.data.url
            }
          };
        } else {
          throw new Error('Erreur lors du téléchargement du logo: ' + 
            (uploadLogoResult.error || 'Erreur inconnue'));
        }
      }
      
      if (faviconFile) {
        // Générer un nom de fichier unique pour le favicon
        const faviconFilename = `favicons/site-favicon-${Date.now()}.png`;
        
        console.log('Début du téléchargement du favicon:', faviconFilename);
        // Télécharger le fichier favicon vers le serveur avec la nouvelle fonction
        const uploadFaviconResult = await netlifyGitService.callNetlifyFunction('upload', {
          path: faviconFilename,
          content: faviconPreview,
          message: 'Ajout du favicon personnalisé'
        });
        
        if (uploadFaviconResult.success && uploadFaviconResult.data) {
          console.log('Favicon téléchargé avec succès:', uploadFaviconResult.data);
          
          // Mettre à jour les paramètres avec l'URL du favicon téléchargé
          updatedSettings = {
            ...updatedSettings,
            favicon: {
              useCustomFavicon: true,
              customFaviconUrl: uploadFaviconResult.data.url
            }
          };
        } else {
          throw new Error('Erreur lors du téléchargement du favicon: ' + 
            (uploadFaviconResult.error || 'Erreur inconnue'));
        }
      }
      
      if (siteIconFile) {
        // Générer un nom de fichier unique pour l'icône du site
        const siteIconFilename = `icons/site-icon-${Date.now()}.png`;
        
        console.log('Début du téléchargement de l\'icône du site:', siteIconFilename);
        // Télécharger le fichier icône vers le serveur
        const uploadSiteIconResult = await netlifyGitService.callNetlifyFunction('upload', {
          path: siteIconFilename,
          content: siteIconPreview,
          message: 'Ajout de l\'icône du site personnalisée'
        });
        
        if (uploadSiteIconResult.success && uploadSiteIconResult.data) {
          console.log('Icône du site téléchargée avec succès:', uploadSiteIconResult.data);
          
          // Mettre à jour les paramètres avec l'URL de l'icône du site téléchargée
          updatedSettings = {
            ...updatedSettings,
            siteIcon: {
              useCustomIcon: true,
              customIconUrl: uploadSiteIconResult.data.url
            }
          };
        } else {
          throw new Error('Erreur lors du téléchargement de l\'icône du site: ' + 
            (uploadSiteIconResult.error || 'Erreur inconnue'));
        }
      }
      
      if (heroImageFile) {
        // Générer un nom de fichier unique pour l'image du hero
        const heroImageFilename = `hero/hero-image-${Date.now()}.jpg`;
        
        console.log('Début du téléchargement de l\'image du hero:', heroImageFilename);
        // Télécharger le fichier image du hero vers le serveur
        const uploadHeroImageResult = await netlifyGitService.callNetlifyFunction('upload', {
          path: heroImageFilename,
          content: heroImagePreview,
          message: 'Ajout de l\'image du hero personnalisée'
        });
        
        if (uploadHeroImageResult.success && uploadHeroImageResult.data) {
          console.log('Image du hero téléchargée avec succès:', uploadHeroImageResult.data);
          
          // Mettre à jour les paramètres avec l'URL de l'image du hero téléchargée
          updatedSettings = {
            ...updatedSettings,
            hero: {
              ...updatedSettings.hero!,
              useCustomImage: true,
              customImageUrl: uploadHeroImageResult.data.url
            }
          };
        } else {
          throw new Error('Erreur lors du téléchargement de l\'image du hero: ' + 
            (uploadHeroImageResult.error || 'Erreur inconnue'));
        }
      }
      
      // Mettre à jour le fichier JSON avec les nouveaux paramètres
      console.log('Mise à jour du fichier site-settings.json avec:', updatedSettings);
      await netlifyGitService.writeJsonFile('site-settings.json', updatedSettings, 'Mise à jour des paramètres du site');
      
      // Mettre à jour index.json pour inclure site-settings.json
      const indexResult = await netlifyGitService.getJsonFile('index.json');
      if (indexResult.success && indexResult.data) {
        const indexData = indexResult.data;
        if (!indexData.files.includes('site-settings.json')) {
          indexData.files.push('site-settings.json');
          await netlifyGitService.writeJsonFile('index.json', indexData, 'Ajout de site-settings.json à l\'index');
        }
      }
      
      // Mettre à jour l'état local avec les nouveaux paramètres
      setSettings(updatedSettings);
      setLogoFile(null);
      setFaviconFile(null);
      
      setSaveStatus('success');
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des paramètres:', err);
      setSaveStatus('error');
      setError('Impossible de sauvegarder les paramètres du site: ' + 
        (err instanceof Error ? err.message : 'Erreur inconnue'));
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-taupe-800">Personnalisation du site</h2>
        
        <button
          onClick={saveSettings}
          disabled={saveStatus === 'saving'}
          className={`px-6 py-2 rounded-full font-medium flex items-center ${saveStatus === 'saving' ? 'bg-taupe-300 text-taupe-500 cursor-not-allowed' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="w-4 h-4 border-2 border-taupe-200 border-t-taupe-400 rounded-full animate-spin mr-2"></div>
              Enregistrement...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <CheckCircle size={18} className="mr-2" />
              Enregistré
            </>
          ) : (
            'Enregistrer les modifications'
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5" size={18} />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        
        {/* Section Favicon */}
        <div className="bg-beige-50 p-6 rounded-lg border border-beige-200 mb-6">
          <h3 className="font-semibold mb-4 text-taupe-800">Favicon (icône d'onglet)</h3>
          
          <div className="flex items-start space-x-8">
            <div className="w-1/3">
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
            
            <div className="w-2/3 space-y-4">
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
                  <p className="mt-1 text-xs text-taupe-500">Format recommandé: PNG carré, 32x32 ou 64x64 pixels, max 500KB</p>
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
        
        {/* Section Icône du site */}
        <div className="bg-beige-50 p-6 rounded-lg border border-beige-200 mb-6">
          <h3 className="font-semibold mb-4 text-taupe-800">Icône du site</h3>
          
          <div className="flex items-start space-x-8">
            <div className="w-1/3">
              <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 w-full border border-beige-200">
                {siteIconPreview ? (
                  <img 
                    src={siteIconPreview} 
                    alt="Aperçu de l'icône du site" 
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-taupe-400">
                    <Upload size={24} className="mx-auto mb-1" />
                    <p className="text-sm">Aucune icône personnalisée</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="useCustomSiteIcon"
                  checked={useCustomSiteIcon}
                  onChange={(e) => setUseCustomSiteIcon(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="useCustomSiteIcon" className="text-sm text-taupe-700">
                  Utiliser une icône personnalisée
                </label>
              </div>
            </div>
            
            <div className="w-2/3 space-y-4">
              {useCustomSiteIcon && (
                <div>
                  <label className="block text-sm font-medium text-taupe-700 mb-1">
                    Télécharger une nouvelle icône
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSiteIconChange}
                    className="block w-full text-sm text-taupe-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
                  />
                  <p className="mt-1 text-xs text-taupe-500">Format recommandé: PNG ou SVG, 192x192 pixels, max 1MB</p>
                </div>
              )}
              
              {siteIconPreview && (
                <button
                  onClick={resetSiteIcon}
                  className="text-rose-500 hover:text-rose-600 text-sm flex items-center"
                >
                  <X size={16} className="mr-1" />
                  Supprimer l'icône personnalisée
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Section Image du Hero */}
        <div className="bg-beige-50 p-6 rounded-lg border border-beige-200 mb-6">
          <h3 className="font-semibold mb-4 text-taupe-800">Image du Hero (page d'accueil)</h3>
          
          <div className="flex items-start space-x-8">
            <div className="w-1/3">
              <div className="bg-white rounded-lg p-4 flex items-center justify-center h-40 w-full border border-beige-200">
                {heroImagePreview ? (
                  <img 
                    src={heroImagePreview} 
                    alt="Aperçu de l'image du hero" 
                    className="max-h-40 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-taupe-400">
                    <Upload size={36} className="mx-auto mb-2" />
                    <p>Aucune image personnalisée</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="useCustomHeroImage"
                  checked={useCustomHeroImage}
                  onChange={(e) => setUseCustomHeroImage(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="useCustomHeroImage" className="text-sm text-taupe-700">
                  Utiliser une image personnalisée
                </label>
              </div>
            </div>
            
            <div className="w-2/3 space-y-4">
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
                  <p className="mt-1 text-xs text-taupe-500">Format recommandé: JPG ou PNG haute qualité, ratio 3:4, max 2MB</p>
                </div>
              )}
              
              {heroImagePreview && (
                <button
                  onClick={resetHeroImage}
                  className="text-rose-500 hover:text-rose-600 text-sm flex items-center"
                >
                  <X size={16} className="mr-1" />
                  Supprimer l'image personnalisée
                </button>
              )}
              
              <div className="pt-4">
                <label className="block text-sm font-medium text-taupe-700 mb-1">
                  Titre du Hero
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={settings.hero?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    hero: {
                      ...prev.hero!,
                      title: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border border-taupe-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Sublimez vos moments avec des créations uniques"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-taupe-700 mb-1">
                  Sous-titre du Hero
                </label>
                <textarea
                  name="heroSubtitle"
                  value={settings.hero?.subtitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    hero: {
                      ...prev.hero!,
                      subtitle: e.target.value
                    }
                  }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-taupe-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Des panneaux et accessoires sur mesure pour rendre vos mariages, fiançailles et célébrations véritablement exceptionnels."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default SiteCustomizationManager;
