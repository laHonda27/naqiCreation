import React, { useState, useEffect } from 'react';

// Déclaration TypeScript pour les fonctions globales
declare global {
  interface Window {
    siteCustomizationSaveSettings?: () => Promise<void>;
  }
}
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/admin/Tabs';
import TestimonialsManager from '../../components/admin/TestimonialsManager';
import CreationsManager from '../../components/admin/CreationsManager';
import CategoriesManager from '../../components/admin/CategoriesManager';
import SiteCustomizationManager from '../../components/admin/SiteCustomizationManager';
import { RefreshCw, AlertCircle, CheckCircle, Info, LogOut, Home } from 'lucide-react';
import { netlifyGitService } from '../../services/netlifyGitService';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customization');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [tabLoading, setTabLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Code supprimé - déclaration déplacée au niveau racine
  
  // Fonction pour synchroniser les modifications avec le dépôt Git
  const handleSyncChanges = async () => {
    try {
      setSyncStatus('loading');
      setSyncMessage('Enregistrement des modifications en cours...');
      
      // D'abord, sauvegarder les modifications locales dans chaque gestionnaire
      // Ceci permet de s'assurer que les images et autres modifications sont bien enregistrées
      console.log('Sauvegarde des modifications locales avant synchronisation...');
      
      // Déclencher la sauvegarde des paramètres du site via la fonction globale
      try {
        if (window.siteCustomizationSaveSettings) {
          console.log('Sauvegarde des paramètres du site...');
          await window.siteCustomizationSaveSettings();
        }
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde des paramètres du site:', error);
      }
      
      // Synchroniser les modifications avec le dépôt Git
      console.log('Synchronisation avec le dépôt Git...');
      const result = await netlifyGitService.syncRepository();
      
      if (result.success) {
        setSyncStatus('success');
        setSyncMessage('Modifications enregistrées avec succès. Le site sera mis à jour dans quelques minutes.');
        
        // Réinitialiser le message après 10 secondes
        setTimeout(() => {
          setSyncStatus('idle');
          setSyncMessage('');
        }, 10000);
      } else {
        setSyncStatus('error');
        setSyncMessage(`Erreur lors de l'enregistrement des modifications: ${result.error || 'Erreur inconnue'}`);
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncMessage(`Erreur lors de l'enregistrement des modifications: ${err.message || 'Erreur inconnue'}`);
    }
  };
  
  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/admin/login');
  };
  
  // Charger les données nécessaires au tableau de bord
  useEffect(() => {
    // Aucune statistique à charger car l'onglet Vue d'ensemble a été supprimé
  }, []);

  // Gérer le changement d'onglet
  const onTabChange = () => {
    setTabLoading(true);
    // Désactiver le loader après un court délai
    setTimeout(() => {
      setTabLoading(false);
    }, 300);
  };

  return (
    <>
      <Helmet>
        <title>Tableau de bord d'administration | Naqi Création</title>
      </Helmet>
      
      <div className="min-h-screen bg-beige-50">
        <header className="bg-white shadow-sm border-b border-beige-200">
          <div className="flex justify-between items-center px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Logo className="h-10 w-auto mr-3" />
              <h1 className="text-xl font-bold text-rose-600">Tableau de bord d'administration</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-taupe-600 hover:text-rose-600"
              >
                <LogOut size={18} className="mr-1" />
                <span className="text-sm">Déconnexion</span>
              </button>
              
              <Link to="/" className="flex items-center text-taupe-600 hover:text-rose-600">
                <Home size={18} className="mr-1" />
                <span className="text-sm">Retour au site</span>
              </Link>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Messages d'état */}
            {syncStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 flex items-center">
                <CheckCircle size={20} className="text-green-500 mr-2" />
                <p>{syncMessage}</p>
              </div>
            )}
            
            {syncStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 flex items-center">
                <AlertCircle size={20} className="text-red-500 mr-2" />
                <p>{syncMessage}</p>
              </div>
            )}
            
            {/* Bouton de synchronisation global */}
            <div className="mb-6">
              <button
                onClick={handleSyncChanges}
                disabled={syncStatus === 'loading'}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium ${syncStatus === 'loading' ? 'bg-taupe-300 text-taupe-100 cursor-not-allowed' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
              >
                {syncStatus === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Synchronisation en cours...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} className="mr-2" />
                    Mettre à jour toutes les modifications
                  </>
                )}
              </button>
              <p className="text-xs text-center mt-2 text-taupe-500">Ce bouton permet de sauvegarder toutes les modifications et de mettre à jour le site.</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                onTabChange();
              }}>
              <div className="mb-6">
                <TabsList>
                  <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
                  <TabsTrigger value="creations">Créations</TabsTrigger>
                  <TabsTrigger value="categories">Catégories</TabsTrigger>
                  <TabsTrigger value="customization">Personnalisation</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="testimonials" className="pt-2 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous modifiez les <strong>témoignages</strong> qui apparaissent sur la page d'accueil du site.</p>
                    </div>
                    <TestimonialsManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="creations" className="pt-2 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous modifiez les <strong>créations</strong> qui apparaissent dans la galerie de votre site.</p>
                    </div>
                    <CreationsManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="categories" className="pt-2 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous modifiez les <strong>catégories</strong> qui permettent de classer vos créations dans la galerie.</p>
                    </div>
                    <CategoriesManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="customization" className="pt-2 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous personnalisez l'<strong>apparence</strong> de votre site (logo, favicon et couleurs).</p>
                    </div>
                    <SiteCustomizationManager />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;