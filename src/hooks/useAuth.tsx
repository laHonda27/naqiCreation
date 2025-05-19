import { useState, useEffect, createContext, useContext, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentative de connexion en cours...');
      
      // Vérification basique des champs
      if (!username || !password) {
        console.log('Nom d\'utilisateur ou mot de passe vide');
        return false;
      }

      // Récupérer les identifiants depuis les variables d'environnement
      const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      
      // Vérification des variables d'environnement
      if (!adminUsername || !adminPassword) {
        console.error('Variables d\'environnement non définies pour l\'authentification');
        return false;
      }

      // Vérification des identifiants avec les variables d'environnement
      if (username.trim() === adminUsername && password.trim() === adminPassword) {
        console.log('Identifiants valides, connexion en cours...');
        const token = 'naqi_auth_' + Date.now();
        localStorage.setItem('auth_token', token);
        setIsAuthenticated(true);
        console.log('Connexion réussie !');
        return true;
      }
      
      console.log('Échec de la connexion: identifiants incorrects');
      return false;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  }, []);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);