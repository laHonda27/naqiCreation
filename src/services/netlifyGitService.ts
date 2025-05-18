/**
 * Service pour interagir avec les fonctions Netlify qui gèrent les opérations Git
 */

// URL de base pour les fonctions Netlify (automatiquement résolu en production)
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8888/.netlify/functions' // URL pour le développement local avec netlify dev
  : '/.netlify/functions';

interface GitServiceResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const netlifyGitService = {
  /**
   * Initialise le système et vérifie l'accès au dépôt
   */
  async initialize(): Promise<GitServiceResult> {
    return this.syncRepository();
  },

  /**
   * Met à jour le dépôt local avec les dernières modifications
   */
  async pullLatestChanges(): Promise<GitServiceResult> {
    return this.syncRepository();
  },

  /**
   * Vérifie la connexion au dépôt et liste les fichiers disponibles
   */
  async checkConnection(): Promise<GitServiceResult> {
    try {
      const result = await this.listJsonFiles();
      if (result.success) {
        return {
          success: true,
          data: {
            connected: true,
            filesCount: result.data.files.length,
            files: result.data.files
          }
        };
      }
      return {
        success: false,
        error: result.error || 'Erreur lors de la vérification de la connexion'
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Erreur lors de la vérification de la connexion: ${error?.message || 'Erreur inconnue'}`
      };
    }
  },

  /**
   * Réinitialise complètement le dépôt
   */
  async resetRepository(): Promise<GitServiceResult> {
    // Pour les fonctions Netlify, il suffit de synchroniser à nouveau
    // car le système de fichiers est éphémère
    return this.syncRepository();
  },

  /**
   * Dans l'environnement de production Netlify, le token est géré via les variables d'environnement
   * Cette fonction existe uniquement pour la compatibilité avec l'ancien code
   */
  getToken(): string {
    // Cette fonction n'est plus utilisée car le token est géré via les variables d'environnement Netlify
    return 'TOKEN_MANAGED_BY_NETLIFY';
  },

  /**
   * Effectue une requête vers une fonction Netlify
   * 
   * Note: Le token GitHub est maintenant géré par les variables d'environnement de Netlify
   * C'est la fonction Netlify elle-même qui accède au token, et non le frontend
   */
  async callNetlifyFunction(action: string, params: any = {}): Promise<GitServiceResult> {
    try {
      // En mode développement local, nous allons d'abord tester la fonction hello
      // pour vérifier que les fonctions Netlify sont correctement configurées
      if (process.env.NODE_ENV === 'development' && action === 'test') {
        const testResponse = await fetch(`${BASE_URL}/hello`, {
          method: 'GET',
        });
        return await testResponse.json();
      }
      
      // Déterminer quelle fonction Netlify appeler en fonction de l'action
      let functionName = 'content-update';
      let actionName = action;
      
      // Mapper les anciennes actions vers les nouvelles
      switch (action) {
        case 'sync':
          // Pour sync, on veut déclencher un push pour s'assurer que toutes les modifications sont sauvegardées
          actionName = 'push';
          break;
        case 'push':
          // Pour forcer un push explicite
          actionName = 'push';
          break;
        case 'read':
          actionName = 'get';
          break;
        case 'write':
          actionName = 'update';
          break;
        case 'upload':
          actionName = 'upload-image';
          break;
      }
      
      console.log(`Appel de la fonction ${functionName} avec l'action ${actionName}`, params);
      
      const response = await fetch(`${BASE_URL}/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Le token est géré par Netlify via les variables d'environnement
          // Nous n'avons plus besoin de l'envoyer dans les headers
        },
        body: JSON.stringify({
          action: actionName,
          ...params
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error(`Erreur lors de l'appel à la fonction Netlify (${action}):`, result);
      }
      
      return result;
    } catch (error: any) {
      console.error(`Erreur lors de l'appel à la fonction Netlify (${action}):`, error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue'
      };
    }
  },

  /**
   * Synchronise le dépôt Git
   */
  async syncRepository(): Promise<GitServiceResult> {
    return this.callNetlifyFunction('sync');
  },

  /**
   * Liste les fichiers JSON disponibles dans le dépôt
   */
  async listJsonFiles(): Promise<GitServiceResult> {
    return this.callNetlifyFunction('list');
  },

  /**
   * Récupère le contenu d'un fichier JSON spécifique
   */
  async getJsonFile(filename: string): Promise<GitServiceResult> {
    return this.callNetlifyFunction('read', { filename });
  },

  /**
   * Écrit le contenu dans un fichier JSON et le commit dans le dépôt
   */
  async writeJsonFile(filename: string, content: any, commitMessage?: string): Promise<GitServiceResult> {
    return this.callNetlifyFunction('write', {
      filename,
      content,
      commitMessage
    });
  },
  
  /**
   * Crée un commit avec les modifications actuelles
   */
  async commitChanges(commitMessage: string): Promise<GitServiceResult> {
    return this.callNetlifyFunction('commit', {
      message: commitMessage
    });
  },
  
  /**
   * Pousse les modifications vers le dépôt distant
   */
  async pushChanges(): Promise<GitServiceResult> {
    return this.callNetlifyFunction('push');
  },
  
  /**
   * Met à jour un fichier JSON et le synchronise avec le dépôt
   */
  async updateFile(filename: string, content: any): Promise<GitServiceResult> {
    // Écrire le fichier JSON
    const writeResult = await this.writeJsonFile(filename, content, `Mise à jour de ${filename}`);
    
    if (!writeResult.success) {
      return writeResult;
    }
    
    // Synchroniser les modifications avec le dépôt distant
    return this.syncRepository();
  },

  /**
   * Télécharge une image vers le dépôt Git
   * 
   * @param path Chemin de l'image dans le dépôt
   * @param base64Content Contenu de l'image en base64
   * @param message Message de commit (optionnel)
   */
  async uploadImage(path: string, base64Content: string, message?: string): Promise<GitServiceResult> {
    try {
      // Appeler la fonction Netlify pour télécharger l'image
      const result = await this.callNetlifyFunction('upload', {
        path,
        content: base64Content,
        message: message || `Ajout de l'image ${path.split('/').pop()}`
      });
      
      return result;
    } catch (error: any) {
      console.error("Erreur lors de l'upload de l'image:", error);
      return { 
        success: false, 
        error: error.message || "Erreur lors de l'upload de l'image" 
      };
    }
  }
};
