import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/admin/Tabs';
import AdminHeader from '../../components/admin/AdminHeader';
import TestimonialsManager from '../../components/admin/TestimonialsManager';
import CreationsManager from '../../components/admin/CreationsManager';
import CategoriesManager from '../../components/admin/CategoriesManager';
import GitSyncPanel from '../../components/admin/GitSyncPanel';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <>
      <Helmet>
        <title>Tableau de bord | Administration Naqi Création</title>
      </Helmet>
      
      <div className="min-h-screen bg-beige-50">
        <AdminHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-medium p-6">
            <h1 className="text-2xl font-display font-semibold mb-6">Tableau de bord</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
                <TabsTrigger value="creations">Créations</TabsTrigger>
                <TabsTrigger value="categories">Catégories</TabsTrigger>
                <TabsTrigger value="sync">Synchronisation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-beige-50 p-6 rounded-lg border border-beige-200">
                    <h3 className="text-lg font-semibold mb-2">Témoignages</h3>
                    <p className="text-3xl font-display">3</p>
                  </div>
                  
                  <div className="bg-beige-50 p-6 rounded-lg border border-beige-200">
                    <h3 className="text-lg font-semibold mb-2">Créations</h3>
                    <p className="text-3xl font-display">6</p>
                  </div>
                  
                  <div className="bg-beige-50 p-6 rounded-lg border border-beige-200">
                    <h3 className="text-lg font-semibold mb-2">Messages</h3>
                    <p className="text-3xl font-display">12</p>
                  </div>
                </div>
                
                <div className="bg-beige-50 p-6 rounded-lg border border-beige-200">
                  <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 mr-3"></div>
                      <div>
                        <p className="text-taupe-800">Nouveau témoignage ajouté</p>
                        <p className="text-sm text-taupe-600">Il y a 2 jours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 mr-3"></div>
                      <div>
                        <p className="text-taupe-800">Création modifiée : "Panneau Mariage Élégant"</p>
                        <p className="text-sm text-taupe-600">Il y a 3 jours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 mr-3"></div>
                      <div>
                        <p className="text-taupe-800">Nouveau message de contact reçu</p>
                        <p className="text-sm text-taupe-600">Il y a 5 jours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="testimonials" className="pt-6">
                <TestimonialsManager />
              </TabsContent>
              
              <TabsContent value="creations" className="pt-6">
                <CreationsManager />
              </TabsContent>
              
              <TabsContent value="categories" className="pt-6">
                <CategoriesManager />
              </TabsContent>
              
              <TabsContent value="sync" className="pt-6">
                <GitSyncPanel />
                <div className="mt-6 p-4 bg-beige-50 rounded-lg border border-beige-200">
                  <h3 className="text-lg font-semibold mb-2">À propos de la synchronisation Git</h3>
                  <p className="text-taupe-800 mb-2">
                    Cette fonctionnalité permet de synchroniser le contenu du site avec les données stockées dans le dépôt Git.
                  </p>
                  <p className="text-taupe-800 mb-2">
                    Les modifications apportées aux fichiers JSON dans le dépôt Git seront automatiquement reflétées sur le site après synchronisation.
                  </p>
                  <p className="text-sm text-taupe-600">
                    Note: Assurez-vous que les fichiers JSON dans le dépôt Git sont correctement formatés pour éviter les erreurs.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;