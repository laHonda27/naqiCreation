import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/admin/Tabs';
import TestimonialsManager from '../../components/admin/TestimonialsManager';
import CreationsManager from '../../components/admin/CreationsManager';
import CategoriesManager from '../../components/admin/CategoriesManager';
import SiteCustomizationManager from '../../components/admin/SiteCustomizationManager';
import { Save, RefreshCw, AlertCircle, CheckCircle, Info, LogOut, Home } from 'lucide-react';
import { netlifyGitService } from '../../services/netlifyGitService';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [stats, setStats] = useState({
    testimonials: 0,
    creations: 0,
    categories: 0
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [recentActivities, setRecentActivities] = useState<{title: string; date: string}[]>([]);
  const [tabLoading, setTabLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fonction pour synchroniser les modifications avec le dépôt Git
  const handleSyncChanges = async () => {
    try {
      setSyncStatus('loading');
      setSyncMessage('Enregistrement des modifications en cours...');
      
      // Synchroniser les modifications avec le dépôt Git
      const result = await netlifyGitService.syncRepository();
      
      if (result.success) {
        setSyncStatus('success');
        setSyncMessage('Modifications enregistrées avec succès. Le site sera mis à jour dans quelques minutes.');
        
        // Recharger les statistiques
        loadStats();
        
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
  
  // Charger les statistiques
  const loadStats = async () => {
    try {
      // Charger les données des témoignages
      const testimonialsResult = await netlifyGitService.getJsonFile('customizations.json');
      if (testimonialsResult.success && testimonialsResult.data) {
        const testimonials = testimonialsResult.data.testimonials || [];
        setStats(prev => ({ ...prev, testimonials: testimonials.length }));
      }
      
      // Charger les données des créations
      const creationsResult = await netlifyGitService.getJsonFile('creations.json');
      if (creationsResult.success && creationsResult.data) {
        const creations = creationsResult.data.creations || [];
        setStats(prev => ({ ...prev, creations: creations.length }));
        
        // Créer des activités récentes basées sur les créations
        const activities = creations.slice(0, 3).map((creation: any) => ({
          title: `Création: ${creation.title}`,
          date: new Date().toLocaleDateString('fr-FR')
        }));
        setRecentActivities(activities);
      }
      
      // Charger les données des catégories
      const categoriesResult = await netlifyGitService.getJsonFile('categories.json');
      if (categoriesResult.success && categoriesResult.data) {
        const categories = categoriesResult.data.categories || [];
        setStats(prev => ({ ...prev, categories: categories.length - 1 })); // -1 pour exclure la catégorie "Tous"
      }
      
      // Charger la date de dernière mise à jour
      const indexResult = await netlifyGitService.getJsonFile('index.json');
      if (indexResult.success && indexResult.data && indexResult.data.lastUpdated) {
        const date = new Date(indexResult.data.lastUpdated);
        setLastUpdated(date.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };
  
  // Charger les statistiques au chargement du composant
  useEffect(() => {
    loadStats();
  }, []);
  
  // Gérer le changement d'onglet avec un loader
  const handleTabChange = (value: string) => {
    setTabLoading(true);
    setActiveTab(value);
    
    // Simuler un délai de chargement pour montrer le loader
    setTimeout(() => {
      setTabLoading(false);
    }, 500);
  };

  return (
    <>
      <Helmet>
        <title>Tableau de bord | Administration Naqi Création</title>
      </Helmet>
      
      <div className="min-h-screen bg-beige-50">

        <header className="bg-beige-50 text-taupe-800 py-3 px-4 sticky top-0 z-10 shadow-md border-b border-beige-200">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Logo className="h-10 w-auto" />
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="bg-rose-100 text-rose-600 px-2 py-1 rounded-md text-xs font-medium hidden sm:block">
                Mode Admin
              </div>
              <Link to="/" className="text-taupe-700 hover:text-rose-500 transition-colors flex items-center p-2 rounded-md hover:bg-beige-100">
                <Home size={16} className="sm:mr-1" />
                <span className="hidden sm:inline text-sm">Voir le site</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-taupe-700 hover:text-rose-500 transition-colors flex items-center p-2 rounded-md hover:bg-beige-100"
              >
                <LogOut size={16} className="sm:mr-1" />
                <span className="hidden sm:inline text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
          <div className="bg-white rounded-lg shadow-medium p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-display font-semibold">Tableau de bord</h1>
              
              <button
                onClick={handleSyncChanges}
                disabled={syncStatus === 'loading'}
                className="flex items-center bg-rose-500 hover:bg-rose-600 text-white px-3 sm:px-4 py-2 rounded-md transition-colors w-full sm:w-auto justify-center sm:justify-start text-sm sm:text-base"
              >
                {syncStatus === 'loading' ? (
                  <RefreshCw size={16} className="mr-1 sm:mr-2 animate-spin" />
                ) : (
                  <Save size={16} className="mr-1 sm:mr-2" />
                )}
                {syncStatus === 'loading' ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
            
            {syncStatus === 'success' && (
              <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md flex items-start">
                <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{syncMessage}</p>
              </div>
            )}
            
            {syncStatus === 'error' && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{syncMessage}</p>
              </div>
            )}
            
            <div className="p-3 sm:p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-md flex flex-col sm:flex-row items-start mb-4 sm:mb-6 text-sm">
              <Info size={18} className="mr-3 mt-0.5 flex-shrink-0 text-blue-600 hidden sm:block" />
              <div>
                <p className="font-semibold mb-1 flex items-center">
                  <Info size={16} className="mr-2 flex-shrink-0 text-blue-600 sm:hidden" />
                  Comment utiliser le panneau d'administration
                </p>
                <p className="mb-2 text-xs sm:text-sm">
                  Ce panneau vous permet de gérer le contenu de votre site facilement sans connaissances techniques.
                </p>
                <ol className="list-decimal pl-4 sm:pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Utilisez les onglets ci-dessous pour accéder aux différentes sections</li>
                  <li>Modifiez le contenu selon vos besoins</li>
                  <li>Cliquez sur le bouton <strong>Enregistrer les modifications</strong> en haut</li>
                  <li>Attendez quelques minutes pour que les changements soient visibles sur votre site</li>
                </ol>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="mb-2">
                <TabsList>
                  <div className="grid grid-cols-4 gap-1 w-full">
                    <TabsTrigger value="overview"><span className="text-[10px] sm:text-sm">Vue d'ensemble</span></TabsTrigger>
                    <TabsTrigger value="testimonials"><span className="text-[10px] sm:text-sm">Témoignages</span></TabsTrigger>
                    <TabsTrigger value="creations"><span className="text-[10px] sm:text-sm">Créations</span></TabsTrigger>
                    <TabsTrigger value="categories"><span className="text-[10px] sm:text-sm">Catégories</span></TabsTrigger>
                    <TabsTrigger value="customization"><span className="text-[10px] sm:text-sm">Personnalisation</span></TabsTrigger>
                  </div>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="pt-6 relative">
                {tabLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
                  <div className="bg-beige-50 p-4 sm:p-6 rounded-lg border border-beige-200 shadow-sm">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Témoignages</h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-display">{stats.testimonials}</p>
                  </div>
                  
                  <div className="bg-beige-50 p-4 sm:p-6 rounded-lg border border-beige-200 shadow-sm">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Créations</h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-display">{stats.creations}</p>
                  </div>
                  
                  <div className="bg-beige-50 p-4 sm:p-6 rounded-lg border border-beige-200 shadow-sm">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Catégories</h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-display">{stats.categories}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
                  <div className="bg-beige-50 p-4 sm:p-6 rounded-lg border border-beige-200 shadow-sm">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4">Activité récente</h3>
                    
                    {recentActivities.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 mr-3"></div>
                            <div>
                              <p className="text-taupe-800 text-xs sm:text-sm">{activity.title}</p>
                              <p className="text-xs text-taupe-600">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-taupe-600 italic">Aucune activité récente</p>
                    )}
                  </div>
                  
                  <div className="bg-beige-50 p-4 sm:p-6 rounded-lg border border-beige-200 shadow-sm">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4">Informations</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-taupe-600">Dernière mise à jour</p>
                        <p className="text-xs sm:text-sm text-taupe-800">{lastUpdated || 'Non disponible'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-taupe-600">Prochaine étape</p>
                        <p className="text-xs sm:text-sm text-taupe-800">Personnaliser vos témoignages</p>
                      </div>
                      
                      <div className="pt-2">
                        <button 
                          onClick={handleSyncChanges}
                          className="text-rose-500 hover:text-rose-600 text-xs sm:text-sm font-medium"
                        >
                          Rafraîchir les statistiques
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="testimonials" className="pt-6 relative">
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
              
              <TabsContent value="creations" className="pt-6 relative">
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
              
              <TabsContent value="categories" className="pt-6 relative">
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
              
              <TabsContent value="customization" className="pt-6 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous personnalisez l'<strong>apparence</strong> de votre site (logo, favicon et informations générales).</p>
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