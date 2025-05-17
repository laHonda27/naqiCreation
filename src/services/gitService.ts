import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import * as BrowserFS from 'browserfs';

// Configuration du système de fichiers virtuel
const setupFS = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    BrowserFS.configure({
      fs: 'IndexedDB',
      options: {}
    }, (err: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(BrowserFS.BFSRequire('fs'));
    });
  });
};

// URL du dépôt Git dédié aux données JSON
const REPO_URL = 'https://github.com/laHonda27/naqiCreationDatas.git';
const LOCAL_DIR = '/naqi-creation-data';
const DATA_DIR = 'datajson'; // Dossier contenant les fichiers JSON
// Remarque: Les images sont stockées dans le dossier 'images' mais ne sont pas utilisées dans cette version

// Fichiers JSON par défaut pour la démo si la synchronisation échoue
const DEFAULT_JSON_FILES = ['creations.json', 'testimonials.json', 'categories.json'];

// Configuration de l'authentification GitHub
// IMPORTANT: Remplacez cette valeur par votre token personnel GitHub
const GITHUB_TOKEN = localStorage.getItem('github_token') || '';

// Configuration de l'auteur pour les commits
const AUTHOR = {
  name: 'Naqi Admin',
  email: 'admin@naqicreation.com'
};

interface GitServiceResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Fonction utilitaire pour vérifier si un token est renseigné dans le localStorage
const getToken = (): string => {
  const token = localStorage.getItem('github_token') || '';
  return token.trim();
};

// Met à jour le token en temps réel
const updateToken = (): void => {
  const token = getToken();
  if (token !== GITHUB_TOKEN) {
    console.log('Mise à jour du token GitHub');
    Object.defineProperty(window, 'GITHUB_TOKEN', { value: token });
  }
};

export const gitService = {
  /**
   * Initialise le système de fichiers et clone le dépôt si nécessaire
   */
  async initialize(): Promise<GitServiceResult> {
    try {
      // Mettre à jour le token à partir du localStorage
      const token = getToken();
      console.log('Token présent:', token ? 'Oui' : 'Non');
      
      const fs = await setupFS();
      
      // Vérifier si le dépôt existe déjà localement
      try {
        await fs.promises.access(`${LOCAL_DIR}/.git`);
        console.log('Dépôt déjà cloné, mise à jour...');
        return await this.pullLatestChanges();
      } catch (e) {
        // Le dépôt n'existe pas, on le clone
        console.log('Clonage du dépôt...');
        try {
          // Créer le répertoire s'il n'existe pas
          await fs.promises.mkdir(LOCAL_DIR, { recursive: true });
          
          // Options de clonage avec authentification si un token est disponible
          const cloneOptions: any = {
            fs,
            http,
            dir: LOCAL_DIR,
            url: REPO_URL,
            singleBranch: true,
            depth: 1 // On ne récupère que le dernier commit pour optimiser les performances
          };
          
          // Ajouter l'authentification si un token est disponible
          if (GITHUB_TOKEN) {
            console.log('Utilisation du token GitHub pour l\'authentification');
            cloneOptions.onAuth = () => ({
              username: 'x-access-token', // Nom d'utilisateur standard pour l'authentification par token
              password: GITHUB_TOKEN     // Le token doit être utilisé comme mot de passe
            });
            console.log('Configuration d\'authentification ajoutée');
          } else {
            console.log('Aucun token GitHub trouvé, tentative de clonage sans authentification');
          }
          
          // Cloner le dépôt
          await git.clone(cloneOptions);
          
          return {
            success: true,
            data: 'Dépôt cloné avec succès'
          };
        } catch (cloneError: any) {
          console.error('Erreur détaillée lors du clonage:', cloneError);
          return {
            success: false,
            error: `Erreur lors du clonage: ${cloneError?.message || 'Erreur inconnue'}`
          };
        }
      }
    } catch (error: any) {
      console.error('Erreur détaillée lors de l\'initialisation:', error);
      return {
        success: false,
        error: `Erreur d'initialisation: ${error?.message || 'Erreur inconnue'}`
      };
    }
  },
  
  /**
   * Met à jour le dépôt local avec les dernières modifications
   */
  async pullLatestChanges(): Promise<GitServiceResult> {
    try {
      const fs = await setupFS();
      
      // Options de pull avec authentification si un token est disponible
      const pullOptions: any = {
        fs,
        http,
        dir: LOCAL_DIR,
        author: AUTHOR,
        singleBranch: true,
        fastForwardOnly: true // Pour éviter les conflits de merge
      };
      
      // Ajouter l'authentification si un token est disponible
      if (GITHUB_TOKEN) {
        console.log('Utilisation du token GitHub pour l\'authentification lors du pull');
        pullOptions.onAuth = () => ({
          username: 'x-access-token', // Nom d'utilisateur standard pour l'authentification par token
          password: GITHUB_TOKEN     // Le token doit être utilisé comme mot de passe
        });
        console.log('Configuration d\'authentification ajoutée pour le pull');
      } else {
        console.log('Aucun token GitHub trouvé, tentative de pull sans authentification');
      }
      
      await git.pull(pullOptions);
      
      return {
        success: true,
        data: 'Dépôt mis à jour avec succès'
      };
    } catch (error: any) {
      console.error('Erreur détaillée lors du pull:', error);
      return {
        success: false,
        error: `Erreur lors de la mise à jour: ${error?.message || 'Erreur inconnue'}`
      };
    }
  },
  
  /**
   * Réinitialise complètement le dépôt local en le supprimant
   * Utile en cas de problème persistant avec l'authentification
   */
  async resetRepository(): Promise<GitServiceResult> {
    try {
      const fs = await setupFS();
      
      try {
        // Vérifier si le dossier du dépôt existe
        await fs.promises.access(LOCAL_DIR);
        
        // Fonction récursive pour supprimer un dossier et son contenu
        const rmDir = async (dirPath: string) => {
          try {
            const files = await fs.promises.readdir(dirPath);
            
            for (const file of files) {
              const curPath = `${dirPath}/${file}`;
              
              try {
                const stat = await fs.promises.stat(curPath);
                if (stat.isDirectory()) {
                  await rmDir(curPath);
                } else {
                  await fs.promises.unlink(curPath);
                }
              } catch (err) {
                console.error(`Erreur lors de la suppression du fichier ${curPath}:`, err);
              }
            }
            
            await fs.promises.rmdir(dirPath);
          } catch (err) {
            console.error(`Erreur lors de la suppression du dossier ${dirPath}:`, err);
          }
        };
        
        // Supprimer le dossier du dépôt
        await rmDir(LOCAL_DIR);
        
        console.log('Dépôt local supprimé avec succès');
        return {
          success: true,
          data: 'Dépôt local réinitialisé avec succès'
        };
      } catch (e) {
        console.log('Le dépôt local n\'existe pas, aucune réinitialisation nécessaire');
        return {
          success: true,
          data: 'Aucun dépôt local à réinitialiser'
        };
      }
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation du dépôt:', error);
      return {
        success: false,
        error: `Erreur lors de la réinitialisation du dépôt: ${error?.message || 'Erreur inconnue'}`
      };
    }
  },
  
  /**
   * Vérifie si le dépôt Git est correctement connecté
   * et accessible avec les autorisations actuelles
   */
  async checkConnection(): Promise<GitServiceResult> {
    try {
      const fs = await setupFS();
      
      // Vérifier si le dépôt existe localement
      try {
        await fs.promises.access(`${LOCAL_DIR}/.git`);
        
        // Essayer de lister les fichiers dans le dossier de données
        try {
          const files = await fs.promises.readdir(`${LOCAL_DIR}/${DATA_DIR}`);
          return {
            success: true,
            data: {
              connected: true,
              filesCount: files.length,
              files: files
            }
          };
        } catch (readError: any) {
          console.error(`Erreur lors de la lecture du dossier ${DATA_DIR}:`, readError);
          return {
            success: false,
            error: `Le dépôt est cloné mais le dossier ${DATA_DIR} n'est pas accessible: ${readError.message}`
          };
        }
      } catch (e: any) {
        return {
          success: false,
          error: `Le dépôt n'est pas cloné ou n'est pas accessible localement: ${e.message}`
        };
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification de la connexion:', error);
      return {
        success: false,
        error: `Erreur lors de la vérification de la connexion: ${error?.message || 'Erreur inconnue'}`
      };
    }
  },

  /**
   * Récupère un fichier JSON spécifique du dépôt
   */
  async getJsonFile(filename: string): Promise<GitServiceResult> {
    try {
      const fs = await setupFS();
      const filePath = `${LOCAL_DIR}/${DATA_DIR}/${filename}`;
      
      console.log(`Tentative de lecture du fichier: ${filePath}`);
      
      try {
        // Vérifier si le fichier existe
        await fs.promises.access(filePath);
        console.log(`Le fichier ${filename} existe`);
        
        // Lire le contenu du fichier
        const content = await fs.promises.readFile(filePath, { encoding: 'utf8' });
        console.log(`Contenu lu pour ${filename}, taille: ${content.length} caractères`);
        
        try {
          // Parser le contenu JSON
          const data = JSON.parse(content);
          
          return {
            success: true,
            data
          };
        } catch (parseError: any) {
          console.error(`Erreur de parsing JSON pour ${filename}:`, parseError);
          return {
            success: false,
            error: `Erreur lors de l'analyse du fichier JSON ${filename}: ${parseError.message}`
          };
        }
      } catch (fileError: any) {
        console.error(`Fichier ${filename} non trouvé ou erreur de lecture:`, fileError);
        return {
          success: false,
          error: `Le fichier ${filename} n'existe pas dans le dépôt ou n'est pas accessible: ${fileError.message}`
        };
      }
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du fichier ${filename}:`, error);
      return {
        success: false,
        error: `Erreur générale lors de la récupération du fichier ${filename}: ${error?.message || 'Erreur inconnue'}`
      };
    }
  },
  
  /**
   * Liste tous les fichiers JSON disponibles dans le dépôt
   */
  async listJsonFiles(): Promise<GitServiceResult> {
    try {
      const fs = await setupFS();
      const dirPath = `${LOCAL_DIR}/${DATA_DIR}`;
      
      try {
        // Lire le contenu du répertoire
        const files = await fs.promises.readdir(dirPath);
        
        // Filtrer pour ne garder que les fichiers JSON
        const jsonFiles = files.filter((file: string) => file.endsWith('.json'));
        
        if (jsonFiles.length > 0) {
          return {
            success: true,
            data: jsonFiles
          };
        } else {
          console.log('Aucun fichier JSON trouvé dans le dépôt, utilisation des fichiers par défaut');
          return {
            success: true,
            data: DEFAULT_JSON_FILES
          };
        }
      } catch (dirError: any) {
        console.log('Erreur lors de la lecture du répertoire, utilisation des fichiers par défaut');
        return {
          success: true, // On retourne success: true pour que l'interface continue de fonctionner
          data: DEFAULT_JSON_FILES
        };
      }
    } catch (error: any) {
      console.log('Erreur lors de la récupération des fichiers, utilisation des fichiers par défaut');
      return {
        success: true, // On retourne success: true pour que l'interface continue de fonctionner
        data: DEFAULT_JSON_FILES
      };
    }
  },

  /**
   * Écrit un fichier JSON dans le dépôt Git
   * Note: Cette fonction ne peut pas réellement écrire dans le dépôt distant sans authentification
   * Elle écrit seulement dans le système de fichiers local et met à jour le localStorage
   */
  async writeJsonFile(filename: string, data: any): Promise<GitServiceResult> {
    try {
      const fs = await setupFS();
      const filePath = `${LOCAL_DIR}/${DATA_DIR}/${filename}`;
      
      try {
        // Créer le répertoire s'il n'existe pas
        try {
          await fs.promises.mkdir(`${LOCAL_DIR}/${DATA_DIR}`, { recursive: true });
        } catch (mkdirError) {
          // Ignorer l'erreur si le répertoire existe déjà
        }
        
        // Écrire le fichier
        const content = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(filePath, content, 'utf8');
        
        console.log(`Fichier ${filename} écrit avec succès dans le système de fichiers local`);
        
        // Mettre à jour le localStorage pour refléter les changements
        if (filename === 'creations.json') {
          localStorage.setItem('naqi_creations', JSON.stringify(data.creations));
          localStorage.setItem('naqi_categories', JSON.stringify(data.categories));
        }
        
        return {
          success: true,
          data: `Fichier ${filename} mis à jour avec succès`
        };
      } catch (writeError: any) {
        console.error(`Erreur lors de l'écriture du fichier ${filename}:`, writeError);
        return {
          success: false,
          error: `Erreur lors de l'écriture du fichier: ${writeError?.message || 'Erreur inconnue'}`
        };
      }
    } catch (error: any) {
      console.error(`Erreur lors de l'écriture du fichier ${filename}:`, error);
      return {
        success: false,
        error: `Erreur lors de l'écriture du fichier: ${error?.message || 'Erreur inconnue'}`
      };
    }
  },
  
  /**
   * Effectue un commit des modifications locales
   */
  async commitChanges(message: string): Promise<GitServiceResult> {
    try {
      if (!GITHUB_TOKEN) {
        return {
          success: false,
          error: 'Token GitHub non configuré. Veuillez configurer un token d\'accès personnel.'
        };
      }
      
      const fs = await setupFS();
      
      // Ajouter tous les fichiers modifiés
      await git.add({
        fs,
        dir: LOCAL_DIR,
        filepath: `${DATA_DIR}/*`
      });
      
      // Créer un commit
      await git.commit({
        fs,
        dir: LOCAL_DIR,
        message,
        author: AUTHOR
      });
      
      console.log('Commit créé avec succès');
      
      return {
        success: true,
        data: 'Commit créé avec succès'
      };
    } catch (error: any) {
      console.error('Erreur lors du commit:', error);
      return {
        success: false,
        error: `Erreur lors du commit: ${error?.message || 'Erreur inconnue'}`
      };
    }
  },
  
  /**
   * Pousse les modifications vers le dépôt distant
   */
  async pushChanges(): Promise<GitServiceResult> {
    try {
      if (!GITHUB_TOKEN) {
        return {
          success: false,
          error: 'Token GitHub non configuré. Veuillez configurer un token d\'accès personnel.'
        };
      }
      
      const fs = await setupFS();
      
      // Pousser les modifications vers le dépôt distant
      await git.push({
        fs,
        http,
        dir: LOCAL_DIR,
        remote: 'origin',
        ref: 'main', // ou 'master' selon la branche par défaut de votre dépôt
        onAuth: () => ({ username: GITHUB_TOKEN })
      });
      
      console.log('Modifications poussées avec succès vers le dépôt distant');
      
      return {
        success: true,
        data: 'Modifications poussées avec succès vers le dépôt distant'
      };
    } catch (error: any) {
      console.error('Erreur lors du push:', error);
      return {
        success: false,
        error: `Erreur lors du push: ${error?.message || 'Erreur inconnue'}`
      };
    }
  }
};
