import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Récupérer les identifiants depuis les variables d'environnement
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    // Vérification avec les variables d'environnement ou les identifiants de secours
    const isValidCredentials = 
      // Vérification avec les variables d'environnement
      (adminUsername && adminPassword && 
       username === adminUsername && 
       password === adminPassword) ||
      // Identifiants de secours pour le développement local
      ((!adminUsername || !adminPassword) && 
       username === 'admin_naqi' && 
       password === 'N@q1Cr3@t10n2025');
    
    if (isValidCredentials) {
      // Stockage du token
      localStorage.setItem('auth_token', 'naqi_admin_' + Date.now());
      
      // Délai court avant la redirection pour montrer l'animation de chargement
      setTimeout(() => {
        setIsLoading(false);
        navigate('/admin');
      }, 500);
    } else {
      setTimeout(() => {
        setError('Identifiants invalides');
        setIsLoading(false);
      }, 500);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Administration | Naqi Création</title>
      </Helmet>
      
      <div className="min-h-screen bg-beige-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-medium max-w-md w-full p-8"
        >
          <div className="text-center mb-8">
            <div className="mx-auto bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Lock size={28} className="text-rose-500" />
            </div>
            <h1 className="text-2xl font-display font-semibold">Connexion à l'administration</h1>
            <p className="text-taupe-600 mt-2">
              Veuillez vous identifier pour accéder à l'interface d'administration
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-taupe-800 font-medium mb-2">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-taupe-800 font-medium mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-taupe-600 hover:text-rose-400 transition-colors">
              Retour au site
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLoginPage;