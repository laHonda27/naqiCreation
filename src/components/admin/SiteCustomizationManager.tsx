import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, X, CheckCircle, Save } from 'lucide-react';
import { netlifyGitService } from '../../services/netlifyGitService';
import { SETTINGS_UPDATED_EVENT } from '../common/Logo';

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
  siteTitle: string;
  siteDescription: string;
  colors: {
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
    siteTitle: 'Naqi Création - Panneaux personnalisés',
    siteDescription: 'Créations personnalisées pour tous vos événements',
    colors: {
      primary: '#e11d48', // Rose-600 par défaut (Tailwind)
      secondary: '#78716c'  // Taupe-500 par défaut (Tailwind)
    }
  });
  
  // États pour la gestion de l'interface utilisateur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // États séparés pour les cases à cocher (pour éviter les problèmes de synchronisation)
  const [useCustomLogo, setUseCustomLogo] = useState(false);
  const [useCustomFavicon, setUseCustomFavicon] = useState(false);
  
  // Charger les paramètres du site
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const result = await netlifyGitService.getJsonFile('site-settings.json');
        if (result.success && result.data) {
          setSettings(result.data);
          
          // Initialiser les états séparés pour les cases à cocher
          setUseCustomLogo(result.data.logo.useCustomLogo || false);
          setUseCustomFavicon(result.data.favicon.useCustomFavicon || false);
          
          if (result.data.logo.useCustomLogo && result.data.logo.customLogoUrl) {
            setLogoPreview(result.data.logo.customLogoUrl);
          }
          
          if (result.data.favicon.useCustomFavicon && result.data.favicon.customFaviconUrl) {
            setFaviconPreview(result.data.favicon.customFaviconUrl);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres:', err);
        setError('Impossible de charger les paramètres du site');
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
    
    // Indiquer qu'il y a des changements non sauvegardés
    markUnsavedChanges();
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
    
    // Indiquer qu'il y a des changements non sauvegardés
    markUnsavedChanges();
  }, [useCustomFavicon]);
  
  // Gérer le changement de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier le type de fichier
      if (!file.type.match('image.*')) {
        setError('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille du fichier (max 1MB)
      if (file.size > 1024 * 1024) {
        setError('L\'image est trop volumineuse. Taille maximum: 1MB');
        return;
      }
      
      setLogoFile(file);
      
      // Prévisualiser l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const result = e.target.result as string;
          setLogoPreview(result);
          
          // Mettre à jour les paramètres
          setSettings(prev => ({
            ...prev,
            logo: {
              ...prev.logo,
              useCustomLogo: true,
              customLogoUrl: result
            }
          }));
          
          // Cocher automatiquement la case
          setUseCustomLogo(true);
          
          // Indiquer qu'il y a des changements non sauvegardés
          markUnsavedChanges();
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gérer le changement de favicon
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier le type de fichier
      if (!file.type.match('image.*')) {
        setError('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille du fichier (max 500KB)
      if (file.size > 500 * 1024) {
        setError('L\'image est trop volumineuse. Taille maximum: 500KB');
        return;
      }
      
      setFaviconFile(file);
      
      // Prévisualiser l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const result = e.target.result as string;
          setFaviconPreview(result);
          
          // Mettre à jour les paramètres
          setSettings(prev => ({
            ...prev,
            favicon: {
              ...prev.favicon,
              useCustomFavicon: true,
              customFaviconUrl: result
            }
          }));
          
          // Cocher automatiquement la case
          setUseCustomFavicon(true);
          
          // Indiquer qu'il y a des changements non sauvegardés
          markUnsavedChanges();
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Réinitialiser le logo
  const resetLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    setUseCustomLogo(false);
    
    setSettings(prev => ({
      ...prev,
      logo: {
        useCustomLogo: false,
        customLogoUrl: ''
      }
    }));
    
    // Indiquer qu'il y a des changements non sauvegardés
    markUnsavedChanges();
  };
  
  // Réinitialiser le favicon
  const resetFavicon = () => {
    setFaviconPreview(null);
    setFaviconFile(null);
    setUseCustomFavicon(false);
    
    setSettings(prev => ({
      ...prev,
      favicon: {
        useCustomFavicon: false,
        customFaviconUrl: ''
      }
    }));
    
    // Indiquer qu'il y a des changements non sauvegardés
    markUnsavedChanges();
  };
  
  // Gérer les changements de texte
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Modification du champ ${name} avec la valeur: ${value}`);
    
    // S'assurer que les modifications sont correctement enregistrées
    setSettings(prev => {
      // Créer une copie profonde des paramètres
      const newSettings = { ...prev };
      
      // Mettre à jour la propriété appropriée en fonction du nom du champ
      if (name === 'siteTitle') {
        newSettings.siteTitle = value;
      } else if (name === 'siteDescription') {
        newSettings.siteDescription = value;
      }
      
      console.log('Nouveaux paramètres après modification:', newSettings);
      return newSettings;
    });
    
    // Pas de sauvegarde automatique
    markUnsavedChanges();
  };
  
  // Gérer les changements de couleur
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    if (parent === 'colors') {
      setSettings(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [child]: value
        }
      }));
    }
    
    // Pas de sauvegarde automatique
    markUnsavedChanges();
  };
  
  // Fonction pour indiquer qu'il y a des modifications non sauvegardées
  const markUnsavedChanges = () => {
    // Au lieu de sauvegarder automatiquement, on informe l'utilisateur qu'il y a des changements à sauvegarder
    setSaveStatus('idle');
  };
  
  // Enregistrer les paramètres - Exposer la fonction globalement pour le composant parent
  const saveSettings = async () => {
    // Rendre la fonction accessible globalement pour le tableau de bord
    (window as any).siteCustomizationSaveSettings = saveSettings;
    try {
      setSaveStatus('saving');
      let updatedSettings = { ...settings };
      
      // Mettre à jour les paramètres avec les valeurs actuelles
      console.log('Paramètres avant la mise à jour:', settings);
      
      updatedSettings = {
        logo: {
          useCustomLogo: settings.logo?.useCustomLogo || false,
          customLogoUrl: settings.logo?.customLogoUrl || ''
        },
        favicon: {
          useCustomFavicon: settings.favicon?.useCustomFavicon || false,
          customFaviconUrl: settings.favicon?.customFaviconUrl || ''
        },
        siteTitle: settings.siteTitle || '',
        siteDescription: settings.siteDescription || '',
        colors: {
          primary: settings.colors?.primary || '#e11d48',
          secondary: settings.colors?.secondary || '#78716c'
        }
      };
      
      console.log('Paramètres après la mise à jour:', updatedSettings);

      // Télécharger les fichiers si nécessaire
      if (logoFile) {
        try {
          // Utiliser un nom de fichier fixe pour le logo
          // Utiliser le chemin standard pour le logo
          const logoFilename = `public/images/logos/site-logo.png`;
          
          console.log('Début du téléchargement du logo:', logoFilename);
          // Télécharger le fichier logo vers le serveur avec la nouvelle fonction
          const uploadLogoResult = await netlifyGitService.callNetlifyFunction('upload', {
            path: logoFilename,
            content: logoPreview,
            message: 'Ajout du logo personnalisé'
          });
          
          if (uploadLogoResult.success && uploadLogoResult.data) {
            console.log('Logo téléchargé avec succès:', uploadLogoResult.data);
            
            // S'assurer que l'URL est absolue (commence par http:// ou https://)
            let logoUrl = uploadLogoResult.data.url;
            if (!logoUrl.startsWith('http://') && !logoUrl.startsWith('https://')) {
              // Si l'URL est relative, la convertir en URL GitHub absolue
              logoUrl = `https://raw.githubusercontent.com/laHonda27/naqiCreation/main/${logoFilename}`;
            }
            
            console.log('URL finale du logo:', logoUrl);
            
            // Stocker le chemin d'accès public pour le logo
            const publicLogoUrl = '/images/logos/site-logo.png';
            console.log('Mise à jour des paramètres avec l\'URL du logo:', publicLogoUrl);
            
            // Mettre à jour les paramètres avec l'URL du logo
            updatedSettings = {
              ...updatedSettings,
              logo: {
                useCustomLogo: true,
                customLogoUrl: publicLogoUrl
              }
            };
          } else {
            console.warn('Avertissement lors du téléchargement du logo:', uploadLogoResult.error || 'Erreur inconnue');
            // Continuer l'exécution sans bloquer en cas d'erreur
            updatedSettings = {
              ...updatedSettings,
              logo: {
                useCustomLogo: useCustomLogo,
                customLogoUrl: settings.logo.customLogoUrl
              }
            };
          }
        } catch (logoError) {
          console.warn('Erreur lors du téléchargement du logo:', logoError);
          // Continuer l'exécution sans bloquer en cas d'erreur
          updatedSettings = {
            ...updatedSettings,
            logo: {
              useCustomLogo: useCustomLogo,
              customLogoUrl: settings.logo.customLogoUrl 
            }
          };
        }
      } else {
        // Utiliser les paramètres existants du logo
        updatedSettings = {
          ...updatedSettings,
          logo: {
            useCustomLogo: useCustomLogo,
            customLogoUrl: settings.logo.customLogoUrl
          }
        };
      }
      
      if (faviconFile) {
        try {
          // Utiliser un nom de fichier fixe pour le favicon
          // Vérifier si le dossier favicons existe, sinon utiliser le dossier images principal
          const faviconFilename = `public/images/favicons/site-favicon.png`;
          
          console.log('Début du téléchargement du favicon:', faviconFilename);
          // Télécharger le fichier favicon vers le serveur avec la nouvelle fonction
          const uploadFaviconResult = await netlifyGitService.callNetlifyFunction('upload', {
            path: faviconFilename,
            content: faviconPreview,
            message: 'Ajout du favicon personnalisé'
          });
          
          if (uploadFaviconResult.success && uploadFaviconResult.data) {
            console.log('Favicon téléchargé avec succès:', uploadFaviconResult.data);
            
            // S'assurer que l'URL est absolue (commence par http:// ou https://)
            let faviconUrl = uploadFaviconResult.data.url;
            if (!faviconUrl.startsWith('http://') && !faviconUrl.startsWith('https://')) {
              // Si l'URL est relative, la convertir en URL GitHub absolue
              faviconUrl = `https://raw.githubusercontent.com/laHonda27/naqiCreation/main/${faviconFilename}`;
            }
            
            console.log('URL finale du favicon:', faviconUrl);
            
            // Mettre à jour les paramètres avec l'URL du favicon
            // Stocker le chemin d'accès public pour le favicon
            // Utiliser le chemin relatif pour faciliter la récupération
            const publicFaviconUrl = '/images/favicons/site-favicon.png';
            console.log('Mise à jour des paramètres avec l\'URL du favicon:', publicFaviconUrl);
            
            updatedSettings = {
              ...updatedSettings,
              favicon: {
                useCustomFavicon: true,
                customFaviconUrl: publicFaviconUrl
              }
            };
          } else {
            console.warn('Avertissement lors du téléchargement du favicon:', uploadFaviconResult.error || 'Erreur inconnue');
            // Continuer l'exécution sans bloquer en cas d'erreur
            updatedSettings = {
              ...updatedSettings,
              favicon: {
                useCustomFavicon: useCustomFavicon,
                customFaviconUrl: settings.favicon.customFaviconUrl
              }
            };
          }
        } catch (faviconError) {
          console.warn('Erreur lors du téléchargement du favicon:', faviconError);
          // Continuer l'exécution sans bloquer en cas d'erreur
          updatedSettings = {
            ...updatedSettings,
            favicon: {
              useCustomFavicon: useCustomFavicon,
              customFaviconUrl: settings.favicon.customFaviconUrl
            }
          };
        }
      } else {
        // Utiliser les paramètres existants du favicon
        updatedSettings = {
          ...updatedSettings,
          favicon: {
            useCustomFavicon: useCustomFavicon,
            customFaviconUrl: settings.favicon.customFaviconUrl
          }
        };
      }
      
      // Mettre à jour le fichier JSON avec les nouveaux paramètres
      console.log('Mise à jour du fichier site-settings.json avec:', updatedSettings);
      
      // Assurer que le fichier est correctement mis à jour en spécifiant explicitement le chemin
      console.log('Envoi de la requête de mise à jour pour site-settings.json');
      
      try {
        // 1. D'abord, écrire le fichier JSON
        const updateResult = await netlifyGitService.callNetlifyFunction('update', {
          path: 'site-settings.json',
          content: updatedSettings,
          message: 'Mise à jour des paramètres du site'
        });
        
        if (!updateResult.success) {
          console.error('Erreur lors de la mise à jour de site-settings.json:', updateResult.error);
          throw new Error(`Erreur lors de la mise à jour de site-settings.json: ${updateResult.error || 'Erreur inconnue'}`);
        }
        
        console.log('Fichier site-settings.json mis à jour avec succès');
        
        // 2. Ensuite, forcer un push pour s'assurer que les modifications sont bien envoyées au dépôt
        console.log('Synchronisation des modifications avec le dépôt Git');
        const pushResult = await netlifyGitService.callNetlifyFunction('push', {
          message: 'Synchronisation des paramètres du site'
        });
        
        if (!pushResult.success) {
          console.warn('Avertissement: La synchronisation avec le dépôt Git a échoué:', pushResult.error);
          // Continuer malgré l'erreur de push
        } else {
          console.log('Synchronisation avec le dépôt Git réussie');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour et de la synchronisation:', error);
        throw error;
      }
      
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
      
      // Déclencher l'événement de mise à jour des paramètres pour informer les autres composants
      console.log('Déclenchement de l\'\u00e9vénement de mise à jour des paramètres');
      window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
      
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personnalisation du site</h2>
      </div>
      
      <div className="space-y-6">
        {/* Bouton d'application des modifications */}
        <div className="bg-beige-50 p-4 rounded-lg border border-beige-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Personnalisation du site</h3>
            <p className="text-sm text-taupe-600 mt-1">Modifiez l'apparence de votre site et cliquez sur "Appliquer" pour voir les changements.</p>
          </div>
          <button 
            onClick={saveSettings}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Appliquer ces modifications
          </button>
        </div>
        
        {/* Erreur */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle size={18} className="mr-2" />
            <p>{error}</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Logo personnalisé */}
        <div className="bg-beige-50 p-6 rounded-lg border border-beige-200">
          <h3 className="font-semibold mb-4">Logo personnalisé</h3>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="useCustomLogo"
                checked={useCustomLogo}
                onChange={(e) => {
                  setUseCustomLogo(e.target.checked);
                  // La sauvegarde sera déclenchée par l'effet useEffect
                }}
                className="h-4 w-4 text-rose-500 rounded border-beige-300 focus:ring-rose-500"
              />
              <label htmlFor="useCustomLogo" className="text-sm font-medium text-taupe-700">
                Utiliser un logo personnalisé
              </label>
            </div>
            
            {settings.logo.useCustomLogo && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-beige-300 rounded-lg p-4 text-center relative">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img 
                        src={logoPreview} 
                        alt="Aperçu du logo" 
                        className="max-h-32 max-w-full mx-auto"
                      />
                      <button
                        onClick={resetLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        aria-label="Supprimer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="logoUpload" className="block cursor-pointer">
                      <Upload size={24} className="mx-auto text-taupe-400 mb-2" />
                      <p className="text-sm text-taupe-500 mb-2">
                        Glissez-déposez votre logo ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-taupe-400">
                        Format: PNG, JPG, SVG | Taille max: 1MB
                      </p>
                    </label>
                  )}
                  
                  <input
                    type="file"
                    id="logoUpload"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
                
                {!logoPreview && (
                  <div className="text-center">
                    <label 
                      htmlFor="logoUpload" 
                      className="btn-outline px-4 py-2 text-sm inline-flex items-center cursor-pointer"
                    >
                      <Upload size={16} className="mr-2" />
                      Sélectionner un fichier
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-beige-100 rounded-md">
            <p className="text-xs text-taupe-600">
              Le logo apparaît dans l'en-tête du site et sur les pages administratives.
              Si aucun logo personnalisé n'est défini, le texte "Naqi Création" sera utilisé.
            </p>
          </div>
        </div>
        
        {/* Favicon personnalisé */}
        <div className="bg-beige-50 p-6 rounded-lg border border-beige-200">
          <h3 className="font-semibold mb-4">Favicon personnalisé</h3>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="useCustomFavicon"
                checked={useCustomFavicon}
                onChange={(e) => {
                  setUseCustomFavicon(e.target.checked);
                  // La sauvegarde sera déclenchée par l'effet useEffect
                }}
                className="h-4 w-4 text-rose-500 rounded border-beige-300 focus:ring-rose-500"
              />
              <label htmlFor="useCustomFavicon" className="text-sm font-medium text-taupe-700">
                Utiliser un favicon personnalisé
              </label>
            </div>
            
            {settings.favicon.useCustomFavicon && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-beige-300 rounded-lg p-4 text-center relative">
                  {faviconPreview ? (
                    <div className="relative inline-block">
                      <img 
                        src={faviconPreview} 
                        alt="Aperçu du favicon" 
                        className="max-h-16 max-w-full mx-auto"
                      />
                      <button
                        onClick={resetFavicon}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        aria-label="Supprimer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="faviconUpload" className="block cursor-pointer">
                      <Upload size={24} className="mx-auto text-taupe-400 mb-2" />
                      <p className="text-sm text-taupe-500 mb-2">
                        Glissez-déposez votre favicon ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-taupe-400">
                        Format: PNG, ICO | Taille max: 500KB | Idéal: 32x32px
                      </p>
                    </label>
                  )}
                  
                  <input
                    type="file"
                    id="faviconUpload"
                    accept="image/*"
                    onChange={handleFaviconChange}
                    className="hidden"
                  />
                </div>
                
                {!faviconPreview && (
                  <div className="text-center">
                    <label 
                      htmlFor="faviconUpload" 
                      className="btn-outline px-4 py-2 text-sm inline-flex items-center cursor-pointer"
                    >
                      <Upload size={16} className="mr-2" />
                      Sélectionner un fichier
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-beige-100 rounded-md">
            <p className="text-xs text-taupe-600">
              Le favicon est la petite icône qui apparaît dans l'onglet du navigateur.
              Si aucun favicon personnalisé n'est défini, l'icône par défaut sera utilisée.
            </p>
          </div>
        </div>
      </div>
      
      {/* Informations du site */}
      <div className="bg-beige-50 p-6 rounded-lg border border-beige-200 mb-6">
        <h3 className="font-semibold mb-4">Informations du site</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="siteTitle" className="block text-sm font-medium text-taupe-700 mb-1">
              Titre du site
            </label>
            <input
              id="siteTitle"
              name="siteTitle"
              type="text"
              value={settings.siteTitle}
              onChange={handleTextChange}
              className="input-field text-sm w-full"
              placeholder="Naqi Création - Panneaux personnalisés"
            />
          </div>
          
          <div>
            <label htmlFor="siteDescription" className="block text-sm font-medium text-taupe-700 mb-1">
              Description du site
            </label>
            <input
              id="siteDescription"
              name="siteDescription"
              type="text"
              value={settings.siteDescription}
              onChange={handleTextChange}
              className="input-field text-sm w-full"
              placeholder="Créations personnalisées pour tous vos événements"
            />
          </div>
        </div>
      </div>
      
      {/* Couleurs du site */}
      <div className="bg-beige-50 p-6 rounded-lg border border-beige-200 mb-6">
        <h3 className="font-semibold mb-4">Couleurs du site</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-taupe-700 mb-1">
              Couleur primaire
            </label>
            <div className="flex items-center gap-4">
              <input
                id="primaryColor"
                name="colors.primary"
                type="color"
                value={settings.colors.primary}
                onChange={handleColorChange}
                className="w-12 h-8 rounded overflow-hidden cursor-pointer"
              />
              <input
                type="text"
                value={settings.colors.primary}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('#') && (value.length === 4 || value.length === 7)) {
                    setSettings(prev => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        primary: value
                      }
                    }));
                    markUnsavedChanges();
                  }
                }}
                className="input-field text-sm w-32"
                placeholder="#e11d48"
              />
              <div className="flex-1">
                <div 
                  className="h-8 w-full rounded" 
                  style={{ backgroundColor: settings.colors.primary }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-taupe-500 mt-1">La couleur principale utilisée pour les boutons et accents</p>
          </div>
          
          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-taupe-700 mb-1">
              Couleur secondaire
            </label>
            <div className="flex items-center gap-4">
              <input
                id="secondaryColor"
                name="colors.secondary"
                type="color"
                value={settings.colors.secondary}
                onChange={handleColorChange}
                className="w-12 h-8 rounded overflow-hidden cursor-pointer"
              />
              <input
                type="text"
                value={settings.colors.secondary}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('#') && (value.length === 4 || value.length === 7)) {
                    setSettings(prev => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        secondary: value
                      }
                    }));
                    markUnsavedChanges();
                  }
                }}
                className="input-field text-sm w-32"
                placeholder="#78716c"
              />
              <div className="flex-1">
                <div 
                  className="h-8 w-full rounded" 
                  style={{ backgroundColor: settings.colors.secondary }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-taupe-500 mt-1">La couleur secondaire utilisée pour les textes et éléments secondaires</p>
          </div>
          
          <div className="pt-2">
            <button 
              onClick={() => {
                setSettings(prev => ({
                  ...prev,
                  colors: {
                    primary: '#e11d48',
                    secondary: '#78716c'
                  }
                }));
                saveSettings();
              }}
              className="text-rose-500 hover:text-rose-600 text-sm font-medium"
            >
              Réinitialiser les couleurs par défaut
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-beige-100 rounded-md">
            <p className="text-xs text-taupe-600">
              Ces couleurs seront appliquées automatiquement à votre site. Vous pouvez les modifier à tout moment.
            </p>
          </div>
        </div>
      </div>
      
      {/* Statut de sauvegarde */}
      {saveStatus !== 'idle' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-3 rounded-md shadow-lg flex items-center ${
            saveStatus === 'saving' ? 'bg-taupe-600 text-white' :
            saveStatus === 'success' ? 'bg-green-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Enregistrement en cours...</span>
              </>
            ) : saveStatus === 'success' ? (
              <>
                <CheckCircle size={18} className="mr-2" />
                <span>Modifications enregistrées</span>
              </>
            ) : (
              <>
                <AlertCircle size={18} className="mr-2" />
                <span>Erreur lors de l'enregistrement</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteCustomizationManager;
