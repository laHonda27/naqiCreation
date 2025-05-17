/**
 * Service pour gérer les mises à jour de contenu via la fonction serverless Netlify
 */

// Type pour les résultats des opérations
export interface ContentUpdateResult {
  success: boolean;
  data?: any;
  error?: string;
  files?: string[];
  content?: string;
  commit?: any;
}

// URL de base pour accéder à la fonction serverless
const BASE_URL = '/.netlify/functions';

const contentUpdateService = {
  /**
   * Liste les fichiers JSON disponibles dans le dépôt
   * @param path Chemin optionnel pour filtrer les fichiers
   */
  async listFiles(path?: string): Promise<ContentUpdateResult> {
    try {
      const response = await fetch(`${BASE_URL}/content-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'list',
          path
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de la liste des fichiers (${response.status})`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la liste des fichiers:', error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue'
      };
    }
  },
  
  /**
   * Récupère un fichier JSON depuis le dépôt
   * @param path Chemin du fichier à récupérer
   */
  async getFile(path: string): Promise<ContentUpdateResult> {
    try {
      const response = await fetch(`${BASE_URL}/content-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get',
          path
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du fichier ${path} (${response.status})`);
      }
      
      const result = await response.json();
      
      if (result.success && result.content) {
        try {
          // Essayer de parser le contenu JSON
          result.data = JSON.parse(result.content);
        } catch (parseError) {
          console.warn(`Le contenu de ${path} n'est pas un JSON valide:`, parseError);
        }
      }
      
      return result;
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du fichier ${path}:`, error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue'
      };
    }
  },
  
  /**
   * Met à jour un fichier JSON dans le dépôt
   * @param path Chemin du fichier à mettre à jour
   * @param data Données à écrire dans le fichier (objet qui sera converti en JSON)
   * @param message Message de commit optionnel
   */
  async updateFile(path: string, data: any, message?: string): Promise<ContentUpdateResult> {
    try {
      // Convertir les données en chaîne JSON formatée
      const content = JSON.stringify(data, null, 2);
      
      const response = await fetch(`${BASE_URL}/content-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          path,
          content,
          message: message || `Mise à jour de ${path}`
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour du fichier ${path} (${response.status})`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du fichier ${path}:`, error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue'
      };
    }
  }
};

export { contentUpdateService };
