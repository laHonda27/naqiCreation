// Composant principal de l'application
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import CustomizationPage from './pages/CustomizationPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SiteHead from './components/common/SiteHead';

function App() {
  return (
    <>
      <SiteHead />
      <Helmet>
        <meta name="theme-color" content="#f3ece0" />
        <meta property="og:image" content="/images/og-image.jpg" />
      </Helmet>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="prestations" element={<ServicesPage />} />
          <Route path="personnalisation" element={<CustomizationPage />} />
          <Route path="galerie" element={<GalleryPage />} />
          <Route path="avis" element={<TestimonialsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;