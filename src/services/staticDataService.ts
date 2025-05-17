/**
 * Service pour gérer les données statiques (JSON et images) hébergées sur Netlify
 */

// Type pour les résultats des opérations
export interface StaticDataResult {
  success: boolean;
  data?: any;
  error?: string;
}

// URL de base pour accéder aux fichiers statiques
const BASE_URL = import.meta.env.PROD ? '' : '';

const staticDataService = {
  /**
   * Récupère un fichier JSON depuis le dossier /data
   * @param filename Nom du fichier JSON (sans l'extension)
   */
  async getJsonFile(filename: string): Promise<StaticDataResult> {
    try {
      const response = await fetch(`/data/${filename}.json`);
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du fichier ${filename}.json (${response.status})`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du fichier ${filename}.json:`, error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue'
      };
    }
  },
  
  /**
   * Liste tous les fichiers JSON disponibles dans le dossier /data
   * Note: Cette fonction nécessite un fichier index.json qui liste tous les fichiers disponibles
   */
  async listJsonFiles(): Promise<StaticDataResult> {
    try {
      const response = await fetch('/data/index.json');
      
      if (!response.ok) {
        throw new Error(`Impossible de récupérer la liste des fichiers (${response.status})`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.files || []
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la liste des fichiers:', error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue'
      };
    }
  },
  
  /**
   * Obtient l'URL d'une image
   * @param imagePath Chemin de l'image dans le dossier /images
   */
  getImageUrl(imagePath: string): string {
    return `/images/${imagePath}`;
  }
};

export { staticDataService };
