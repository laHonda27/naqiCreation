import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/admin/Tabs';
import TestimonialsManager from '../../components/admin/TestimonialsManager';
// Import du gestionnaire de créations
import CreationsManager from '../../components/admin/CreationsManager';
import CategoriesManager from '../../components/admin/CategoriesManager';
import FaqsManager from '../../components/admin/FaqsManager';
import GalleryManager from '../../components/admin/GalleryManager';
import ContactManager from '../../components/admin/ContactManager';
import CustomizationsManager from '../../components/admin/CustomizationsManager';
import ShapesAndColorsManager from '../../components/admin/ShapesAndColorsManager';
import ServicesManager from '../../components/admin/ServicesManager';
import SiteCustomizationManagerV2 from '../../components/admin/SiteCustomizationManagerV2';
import { Info, LogOut, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('creations');
  const [tabLoading, setTabLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/admin/login');
  };
  
  // Gérer le changement d'onglet avec un loader
  const handleTabChange = (value: string) => {
    setTabLoading(true);
    setActiveTab(value);
    
    // Simuler un temps de chargement pour une meilleure UX
    setTimeout(() => {
      setTabLoading(false);
    }, 300);
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
              </div>
            
            {/* Les messages de statut de synchronisation sont gérés par le GlobalSaveButton */}
            
            <div className="p-3 sm:p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-md flex flex-col sm:flex-row items-start mb-4 sm:mb-6 text-sm">
              <Info size={18} className="mr-3 mt-0.5 flex-shrink-0 text-blue-600 hidden sm:block" />
              <div>
                <p className="font-semibold mb-1 flex items-center">
                  <Info size={16} className="mr-2 flex-shrink-0 text-blue-600 sm:hidden" />
                  Comment utiliser le panneau d'administration
                </p>
                <p className="mb-2 text-xs sm:text-sm">
                  Ce panneau vous permet de gérer le contenu de votre site facilement. La nouvelle interface utilise un système moderne avec des fenêtres modales.
                </p>
                <ol className="list-decimal pl-4 sm:pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Utilisez les onglets ci-dessous pour accéder aux différentes sections</li>
                  <li>Pour <strong>ajouter</strong> un contenu, cliquez sur le bouton correspondant</li>
                  <li>Pour <strong>modifier</strong> un contenu existant, cliquez sur l'icône de crayon</li>
                  <li>Effectuez vos modifications dans la fenêtre qui s'ouvre</li>
                  <li>Une fois toutes vos modifications terminées, cliquez sur le bouton flottant <strong>Enregistrer les modifications</strong> pour les publier</li>
                </ol>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="mb-6 overflow-x-auto">
                <TabsList className="flex flex-wrap border-b border-beige-200 mb-6">
                  <TabsTrigger value="creations" onClick={() => handleTabChange('creations')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Créations</TabsTrigger>
                  <TabsTrigger value="testimonials" onClick={() => handleTabChange('testimonials')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Témoignages</TabsTrigger>
                  <TabsTrigger value="categories" onClick={() => handleTabChange('categories')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Catégories</TabsTrigger>
                  <TabsTrigger value="faqs" onClick={() => handleTabChange('faqs')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">FAQs</TabsTrigger>
                  <TabsTrigger value="gallery" onClick={() => handleTabChange('gallery')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Galerie</TabsTrigger>
                  <TabsTrigger value="customizations" onClick={() => handleTabChange('customizations')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Personnalisations</TabsTrigger>
                  <TabsTrigger value="shapes_colors" onClick={() => handleTabChange('shapes_colors')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Formes & Couleurs</TabsTrigger>
                  <TabsTrigger value="services" onClick={() => handleTabChange('services')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Services d'accueil</TabsTrigger>
                  <TabsTrigger value="site_settings" onClick={() => handleTabChange('site_settings')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Apparence du site</TabsTrigger>
                  <TabsTrigger value="contact" onClick={() => handleTabChange('contact')} className="px-4 py-2 font-medium text-taupe-600 border-b-2 border-transparent hover:text-rose-500 hover:border-rose-300 data-[state=active]:text-rose-500 data-[state=active]:border-rose-500">Contact</TabsTrigger>
                </TabsList>
              </div>
              
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
              

              
              <TabsContent value="faqs" className="pt-6 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous gérez les <strong>questions fréquentes (FAQ)</strong> qui apparaissent sur les différentes pages du site.</p>
                    </div>
                    <FaqsManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="gallery" className="pt-6 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous gérez les <strong>images de la galerie</strong> qui apparaissent sur la page galerie du site.</p>
                    </div>
                    <GalleryManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="customizations" className="pt-6 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous gérez les <strong>options de personnalisation</strong> qui apparaissent sur la page de personnalisation.</p>
                    </div>
                    <CustomizationsManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="shapes_colors" className="pt-6 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous gérez les <strong>formes et couleurs</strong> qui apparaissent sur la page des services et qui sont utilisées pour les personnalisations.</p>
                    </div>
                    <ShapesAndColorsManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="services" className="pt-6 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous gérez les <strong>services présentés sur la page d'accueil</strong> dans la section "Une gamme complète de créations".</p>
                    </div>
                    <ServicesManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="contact" className="pt-6 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous gérez les <strong>informations de contact</strong> qui apparaissent sur la page contact et dans le pied de page.</p>
                    </div>
                    <ContactManager />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="site_settings" className="pt-6 relative">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-6 flex items-center">
                      <Info size={20} className="text-rose-500 mr-2" />
                      <p className="text-sm text-rose-700">Vous modifiez l'<strong>apparence du site</strong>, notamment le logo, l'image du hero et les textes principaux.</p>
                    </div>
                    <SiteCustomizationManagerV2 />
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