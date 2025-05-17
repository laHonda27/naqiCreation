import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="text-center">
        <h1 className="text-6xl font-display font-semibold text-taupe-800">404</h1>
        <div className="w-16 h-1 bg-rose-300 mx-auto my-6"></div>
        <h2 className="text-2xl md:text-3xl font-display mb-4">Page introuvable</h2>
        <p className="text-taupe-600 mb-8 max-w-md mx-auto">
          Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <ArrowLeft size={18} className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;