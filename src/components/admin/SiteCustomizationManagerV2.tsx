import React, { useState, useEffect } from 'react';
import { cloudinaryService } from '../../services/cloudinaryService';
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

// Structure des paramètres du site
interface SiteSettings {
  favicon: {
    useCustomFavicon: boolean;
    customFaviconUrl: string;
  };
  logo: {
    useCustomLogo: boolean;
    customLogoUrl: string;
  };
  hero: {
    useCustomImage: boolean;
    customImageUrl: string;
    title: string;
    subtitle: string;
  };
  colors: {
    primary: string;
    secondary: string;
  };
}

// État initial par défaut
const defaultSettings: SiteSettings = {
  favicon: {
    useCustomFavicon: false,
    customFaviconUrl: ''
  },
  logo: {
    useCustomLogo: false,
    customLogoUrl: ''
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
};

const SiteCustomizationManagerV2: React.FC = () => {
  // Utilisation du hook useSiteSettings pour gérer les paramètres du site
  const { settings: siteSettings, loading: siteLoading, error: siteError, updateSettings } = useSiteSettings();
  
  // États pour les données et l'interface
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // États pour les prévisualisations et fichiers
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  // Mettre à jour les paramètres locaux lorsque les paramètres du site sont chargés
  useEffect(() => {
    if (siteSettings) {
      console.log('Paramètres du site chargés via hook:', siteSettings);
      
      // Fusionner les données reçues avec les valeurs par défaut
      const mergedSettings = {
        ...defaultSettings,
        ...siteSettings,
        // Assurer que les objets imbriqués sont également fusionnés correctement
        logo: { ...defaultSettings.logo, ...(siteSettings.logo || {}) },
        favicon: { ...defaultSettings.favicon, ...(siteSettings.favicon || {}) },
        hero: { ...defaultSettings.hero, ...(siteSettings.hero || {}) },
        colors: { ...defaultSettings.colors, ...(siteSettings.colors || {}) }
      };
      
      console.log('Paramètres fusionnés:', mergedSettings);
      setSettings(mergedSettings);
      setLoading(false);
    }
  }, [siteSettings]);
  
  // Mettre à jour l'état de chargement et d'erreur
  useEffect(() => {
    setLoading(siteLoading);
    if (siteError) {
      setErrorMessage(siteError);
    }
  }, [siteLoading, siteError]);

  // Fonction pour sauvegarder les paramètres
  const saveSettings = async () => {
    try {
      setSaveStatus('saving');
      console.log('Sauvegarde des paramètres du site...');
      
      // Copier les paramètres actuels
      const updatedSettings = { ...settings };
      
      // Traiter les fichiers s'ils existent
      if (logoFile) {
        const uploadResult = await uploadImage(logoFile);
        if (uploadResult.success && uploadResult.imageUrl) {
          updatedSettings.logo.customLogoUrl = uploadResult.imageUrl;
          updatedSettings.logo.useCustomLogo = true;
        }
      }
      
      if (faviconFile) {
        const uploadResult = await uploadImage(faviconFile);
        if (uploadResult.success && uploadResult.imageUrl) {
          updatedSettings.favicon.customFaviconUrl = uploadResult.imageUrl;
          updatedSettings.favicon.useCustomFavicon = true;
        }
      }
      
      if (heroImageFile) {
        const uploadResult = await uploadImage(heroImageFile);
        if (uploadResult.success && uploadResult.imageUrl) {
          updatedSettings.hero.customImageUrl = uploadResult.imageUrl;
          updatedSettings.hero.useCustomImage = true;
        }
      }
      
      // Sauvegarder les paramètres mis à jour
      await updateSettings(updatedSettings);
      
      // Réinitialiser les fichiers après la sauvegarde
      setLogoFile(null);
      setFaviconFile(null);
      setHeroImageFile(null);
      
      // Mettre à jour l'état
      setSettings(updatedSettings);
      setSaveStatus('success');
      
      // Réinitialiser le statut après quelques secondes
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      setErrorMessage('Une erreur est survenue lors de la sauvegarde des paramètres.');
      setSaveStatus('error');
    }
  };

  // Fonction utilitaire pour télécharger une image
  const uploadImage = async (file: File): Promise<{success: boolean, imageUrl?: string}> => {
    try {
      const result = await cloudinaryService.uploadImage(file);
      if (result.success && result.imageUrl) {
        return { success: true, imageUrl: result.imageUrl };
      }
      return { success: false };
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      setErrorMessage('Erreur lors du téléchargement de l\'image.');
      return { success: false };
    }
  };

  // Gestionnaires d'événements pour les changements d'entrée
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteSettings],
        [field]: value
      }
    }));
  };

  // Gérer les changements de cases à cocher
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [section, field] = name.split('.');
    
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteSettings],
        [field]: checked
      }
    }));
  };

  // Gestionnaires pour les changements de fichier
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Créer une URL pour la prévisualisation
      const objectUrl = URL.createObjectURL(file);
      setSettings(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          customLogoUrl: objectUrl
        }
      }));
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaviconFile(file);
      
      const objectUrl = URL.createObjectURL(file);
      setSettings(prev => ({
        ...prev,
        favicon: {
          ...prev.favicon,
          customFaviconUrl: objectUrl
        }
      }));
    }
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroImageFile(file);
      
      const objectUrl = URL.createObjectURL(file);
      setSettings(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          customImageUrl: objectUrl
        }
      }));
    }
  };

  // Fonctions pour réinitialiser les images
  const resetLogo = () => {
    setLogoFile(null);
    setSettings(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        customLogoUrl: '',
        useCustomLogo: false
      }
    }));
  };

  const resetFavicon = () => {
    setFaviconFile(null);
    setSettings(prev => ({
      ...prev,
      favicon: {
        ...prev.favicon,
        customFaviconUrl: '',
        useCustomFavicon: false
      }
    }));
  };

  const resetHeroImage = () => {
    setHeroImageFile(null);
    setSettings(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        customImageUrl: '',
        useCustomImage: false
      }
    }));
  };

  return (
    <div className="w-full mx-auto p-0">
      <h2 className="text-2xl font-semibold text-taupe-800 mb-6">Personnalisation du site</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        <div className="p-0 m-0">
          {/* Notifications */}
          <div className="mb-4">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">Erreur</h3>
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              </div>
            )}
            
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
          </div>
          
          {/* Bouton de sauvegarde en haut */}
          <div className="flex justify-end mb-4">
            <button
              onClick={saveSettings}
              className="px-6 py-2.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors shadow-sm font-medium flex items-center"
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
          
          {/* Conteneur principal */}
          <div className="p-0 m-0">
            {/* Nouvelle disposition avec Hero à gauche et Logo/Favicon à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-0 m-0">
              {/* Section Hero (occupe 2/3 de l'espace) */}
              <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <h3 className="font-semibold mb-4 text-taupe-800 text-lg border-b pb-3 border-beige-100">Image d'en-tête (Hero)</h3>
                
                <div className="flex flex-col gap-6">
                  {/* Aperçu simple de l'image hero */}
                  <div className="w-full">
                    <div className="bg-beige-50 rounded-lg overflow-hidden border border-beige-200">
                      <div className="relative overflow-auto max-h-[400px] flex items-center justify-center p-2">
                        {settings.hero.customImageUrl ? (
                          <>
                            <img 
                              src={settings.hero.customImageUrl} 
                              alt="Aperçu de l'image d'en-tête" 
                              className="max-w-full max-h-[380px] object-contain"
                            />
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full bg-beige-100 text-taupe-400">
                            <div className="text-center p-4">
                              <Upload size={32} className="mx-auto mb-2" />
                              <p className="text-sm">Aucune image personnalisée</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        id="hero.useCustomImage"
                        name="hero.useCustomImage"
                        checked={settings.hero.useCustomImage}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-rose-500 border-beige-300 rounded mr-2 focus:ring-rose-500"
                      />
                      <label htmlFor="hero.useCustomImage" className="text-sm font-medium text-taupe-700">
                        Utiliser une image d'en-tête personnalisée
                      </label>
                      
                      {settings.hero.customImageUrl && (
                        <button
                          onClick={resetHeroImage}
                          className="ml-auto px-3 py-1.5 text-rose-500 hover:text-rose-600 text-sm flex items-center bg-rose-50 hover:bg-rose-100 rounded-md transition-all"
                        >
                          <X size={16} className="mr-1" />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Paramètres du hero */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="hero.title" className="block text-sm font-medium text-taupe-700 mb-2">
                        Titre de l'en-tête
                      </label>
                      <input
                        type="text"
                        id="hero.title"
                        name="hero.title"
                        value={settings.hero.title}
                        onChange={handleTextChange}
                        className="w-full px-4 py-2.5 border border-beige-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="hero.subtitle" className="block text-sm font-medium text-taupe-700 mb-2">
                        Sous-titre de l'en-tête
                      </label>
                      <textarea
                        id="hero.subtitle"
                        name="hero.subtitle"
                        value={settings.hero.subtitle}
                        onChange={handleTextChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-beige-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm"
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Upload d'image */}
                  {settings.hero.useCustomImage && (
                    <div className="bg-beige-50 p-4 rounded-md border border-beige-200">
                      <label className="block text-sm font-medium text-taupe-700 mb-2">
                        Télécharger une nouvelle image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="block w-full text-sm text-taupe-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
                      />
                      <p className="mt-2 text-xs text-taupe-500">Format recommandé: JPG/PNG, 1920x1080px</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Colonne de droite pour Logo et Favicon (occupe 1/3 de l'espace) */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                {/* Section du logo */}
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                  <h3 className="font-semibold mb-4 text-taupe-800 text-lg border-b pb-3 border-beige-100">Logo du site</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-beige-50 rounded-lg p-4 flex items-center justify-center h-32 w-full border border-beige-200">
                      {settings.logo.customLogoUrl ? (
                        <img 
                          src={settings.logo.customLogoUrl} 
                          alt="Aperçu du logo" 
                          className="max-h-24 max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-taupe-400">
                          <Upload size={24} className="mx-auto mb-2" />
                          <p className="text-sm">Aucun logo personnalisé</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="logo.useCustomLogo"
                          name="logo.useCustomLogo"
                          checked={settings.logo.useCustomLogo}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-rose-500 border-beige-300 rounded mr-2 focus:ring-rose-500"
                        />
                        <label htmlFor="logo.useCustomLogo" className="text-sm text-taupe-700">
                          Utiliser un logo personnalisé
                        </label>
                      </div>
                      
                      {settings.logo.customLogoUrl && (
                        <button
                          onClick={resetLogo}
                          className="px-3 py-1.5 text-rose-500 text-sm flex items-center bg-rose-50 hover:bg-rose-100 rounded-md"
                        >
                          <X size={16} className="mr-1" />
                          Supprimer
                        </button>
                      )}
                    </div>
                    
                    {settings.logo.useCustomLogo && (
                      <div className="bg-beige-50 p-3 rounded-md border border-beige-200">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="block w-full text-sm text-taupe-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
                        />
                        <p className="mt-2 text-xs text-taupe-500">Format recommandé: PNG transparent</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Section Favicon */}
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                  <h3 className="font-semibold mb-4 text-taupe-800 text-lg border-b pb-3 border-beige-100">Favicon (icône d'onglet)</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-beige-50 rounded-lg p-4 flex items-center justify-center h-32 w-full border border-beige-200">
                      {settings.favicon.customFaviconUrl ? (
                        <img 
                          src={settings.favicon.customFaviconUrl} 
                          alt="Aperçu du favicon" 
                          className="max-h-20 max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-taupe-400">
                          <Upload size={24} className="mx-auto mb-2" />
                          <p className="text-sm">Aucun favicon personnalisé</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="favicon.useCustomFavicon"
                          name="favicon.useCustomFavicon"
                          checked={settings.favicon.useCustomFavicon}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-rose-500 border-beige-300 rounded mr-2 focus:ring-rose-500"
                        />
                        <label htmlFor="favicon.useCustomFavicon" className="text-sm text-taupe-700">
                          Utiliser un favicon personnalisé
                        </label>
                      </div>
                      
                      {settings.favicon.customFaviconUrl && (
                        <button
                          onClick={resetFavicon}
                          className="px-3 py-1.5 text-rose-500 text-sm flex items-center bg-rose-50 hover:bg-rose-100 rounded-md"
                        >
                          <X size={16} className="mr-1" />
                          Supprimer
                        </button>
                      )}
                    </div>
                    
                    {settings.favicon.useCustomFavicon && (
                      <div className="bg-beige-50 p-3 rounded-md border border-beige-200">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconChange}
                          className="block w-full text-sm text-taupe-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100"
                        />
                        <p className="mt-2 text-xs text-taupe-500">Format recommandé: PNG carré, 32x32px</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteCustomizationManagerV2;
