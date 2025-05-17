import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminHeader: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  
  return (
    <header className="bg-taupe-900 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display">Administration Naqi Création</h1>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Link
            to="/admin"
            className={`hover:text-rose-300 transition-colors ${
              location.pathname === '/admin' ? 'text-rose-300' : ''
            }`}
          >
            Tableau de bord
          </Link>
          <Link
            to="/admin/testimonials"
            className={`hover:text-rose-300 transition-colors ${
              location.pathname === '/admin/testimonials' ? 'text-rose-300' : ''
            }`}
          >
            Témoignages
          </Link>
          <Link
            to="/admin/creations"
            className={`hover:text-rose-300 transition-colors ${
              location.pathname === '/admin/creations' ? 'text-rose-300' : ''
            }`}
          >
            Créations
          </Link>
          <Link
            to="/admin/categories"
            className={`hover:text-rose-300 transition-colors ${
              location.pathname === '/admin/categories' ? 'text-rose-300' : ''
            }`}
          >
            Catégories
          </Link>
          <button 
            onClick={logout}
            className="flex items-center text-rose-200 hover:text-rose-100 transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;