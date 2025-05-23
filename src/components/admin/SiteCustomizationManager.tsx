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
  siteTitle: string;
  siteDescription: string;
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
    siteDescription: 'Créations personnalisées pour tous vos événements'
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
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setLogoPreview(e.target.result as string);
          setSettings(prev => ({
            ...prev,
            logo: {
              ...prev.logo,
              useCustomLogo: true
            }
          }));
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
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setFaviconPreview(e.target.result as string);
          setSettings(prev => ({
            ...prev,
            favicon: {
              ...prev.favicon,
              useCustomFavicon: true
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
  
  // Gérer les changements de texte
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Sauvegarder automatiquement après un court délai
    saveSettingsDebounced();
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personnalisation du site</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
          <div>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="text-red-500 hover:text-red-700 text-sm mt-1"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      
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
