// Import des modules requis pour les opérations Git
const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const REPO_URL = 'https://github.com/laHonda27/naqiCreationDatas.git';
const LOCAL_DIR = '/tmp/naqi-creation-data'; // Répertoire temporaire sur Netlify
const DATA_DIR = 'datajson'; // Dossier contenant les fichiers JSON
const GIT_USERNAME = 'x-access-token';

// Configuration CORS pour permettre l'accès depuis votre domaine
const headers = {
  'Access-Control-Allow-Origin': '*', // À remplacer par votre domaine en production
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Fonction utilitaire pour gérer les réponses
const respond = (statusCode, body) => {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
};

// Fonction pour cloner ou mettre à jour le dépôt
async function getRepository(token) {
  try {
    const git = simpleGit();
    
    // Créer le répertoire si nécessaire
    try {
      await fs.mkdir(LOCAL_DIR, { recursive: true });
    } catch (err) {
      console.log('Dossier déjà existant ou erreur lors de la création:', err);
    }

    // Vérifier si le dépôt est déjà cloné
    let repoExists = false;
    try {
      await fs.access(path.join(LOCAL_DIR, '.git'));
      repoExists = true;
    } catch (err) {
      // Le dépôt n'existe pas encore
    }

    // Configurer les options d'authentification
    const authOptions = {
      username: GIT_USERNAME,
      password: token
    };

    if (repoExists) {
      // Mettre à jour le dépôt existant
      console.log('Mise à jour du dépôt existant...');
      await git.cwd(LOCAL_DIR);
      await git.addConfig('user.name', 'Naqi Admin');
      await git.addConfig('user.email', 'admin@naqicreation.com');
      
      // Réinitialiser le dépôt si nécessaire
      try {
        await git.fetch(['--all'], authOptions);
        await git.reset(['--hard', 'origin/main']);
      } catch (fetchError) {
        console.error('Erreur lors du fetch/reset:', fetchError);
        throw new Error('Impossible de mettre à jour le dépôt: ' + fetchError.message);
      }
    } else {
      // Cloner le dépôt
      console.log('Clonage du dépôt...');
      try {
        await git.clone(REPO_URL, LOCAL_DIR, [
          '--depth', '1', 
          '--single-branch'
        ], authOptions);
        
        await git.cwd(LOCAL_DIR);
        await git.addConfig('user.name', 'Naqi Admin');
        await git.addConfig('user.email', 'admin@naqicreation.com');
      } catch (cloneError) {
        console.error('Erreur lors du clonage:', cloneError);
        throw new Error('Impossible de cloner le dépôt: ' + cloneError.message);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la synchronisation Git:', error);
    return { success: false, error: error.message };
  }
}

// Fonction pour lister les fichiers dans le dépôt
async function listFiles() {
  try {
    const dataDir = path.join(LOCAL_DIR, DATA_DIR);
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    return { success: true, files: jsonFiles };
  } catch (error) {
    console.error('Erreur lors de la lecture des fichiers:', error);
    return { success: false, error: error.message };
  }
}

// Fonction pour lire un fichier JSON
async function readJsonFile(filename) {
  try {
    const filePath = path.join(LOCAL_DIR, DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    return { success: true, data };
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filename}:`, error);
    return { success: false, error: error.message };
  }
}

// Fonction pour écrire un fichier JSON et le commiter
async function writeJsonFile(filename, content, commitMessage, token) {
  try {
    const git = simpleGit(LOCAL_DIR);
    const filePath = path.join(LOCAL_DIR, DATA_DIR, filename);
    
    // Écrire le fichier
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf8');
    
    // Configurer les options d'authentification
    const authOptions = {
      username: GIT_USERNAME,
      password: token
    };
    
    // Ajouter, commiter et pousser les modifications
    await git.add(path.join(DATA_DIR, filename));
    await git.commit(commitMessage || `Mise à jour de ${filename}`);
    
    try {
      await git.push('origin', 'main', authOptions);
    } catch (pushError) {
      console.error('Erreur lors du push:', pushError);
      throw new Error('Impossible de pousser les modifications: ' + pushError.message);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Erreur lors de l'écriture du fichier ${filename}:`, error);
    return { success: false, error: error.message };
  }
}

// Récupère le token GitHub depuis les variables d'environnement
const getGitHubToken = () => {
  // Utiliser la variable d'environnement GITHUB_TOKEN définie dans Netlify
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('Variable d\'environnement GITHUB_TOKEN manquante');
  }
  
  return token;
};

// Handler pour les requêtes API
exports.handler = async (event, context) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (event.httpMethod === 'OPTIONS') {
    return respond(200, {});
  }
  
  // Récupérer le token d'authentification depuis les variables d'environnement
  const token = getGitHubToken();
  
  if (!token) {
    return respond(401, { 
      success: false, 
      error: 'Token GitHub non configuré dans les variables d\'environnement Netlify'
    });
  }
  
  try {
    const params = JSON.parse(event.body || '{}');
    const action = params.action || '';
    
    switch (action) {
      case 'sync':
        const syncResult = await getRepository(token);
        return respond(syncResult.success ? 200 : 500, syncResult);
        
      case 'list':
        // Synchroniser d'abord pour être sûr d'avoir les dernières versions
        await getRepository(token);
        const listResult = await listFiles();
        return respond(listResult.success ? 200 : 500, listResult);
        
      case 'read':
        if (!params.filename) {
          return respond(400, { success: false, error: 'Nom de fichier manquant' });
        }
        // Synchroniser d'abord pour être sûr d'avoir les dernières versions
        await getRepository(token);
        const readResult = await readJsonFile(params.filename);
        return respond(readResult.success ? 200 : 500, readResult);
        
      case 'write':
        if (!params.filename || !params.content) {
          return respond(400, { success: false, error: 'Nom de fichier ou contenu manquant' });
        }
        // Synchroniser d'abord pour être sûr d'avoir les dernières versions
        await getRepository(token);
        const writeResult = await writeJsonFile(
          params.filename,
          params.content,
          params.commitMessage,
          token
        );
        return respond(writeResult.success ? 200 : 500, writeResult);
        
      case 'commit':
        if (!params.message) {
          return respond(400, { success: false, error: 'Message de commit manquant' });
        }
        try {
          const git = simpleGit(LOCAL_DIR);
          
          // Configurer les options d'authentification
          const authOptions = {
            username: GIT_USERNAME,
            password: token
          };
          
          // Vérifier s'il y a des changements à commiter
          const status = await git.status();
          
          if (status.files.length === 0) {
            return respond(200, { success: true, data: { message: 'Aucun changement à commiter' } });
          }
          
          // Ajouter tous les fichiers modifiés
          await git.add('.');
          
          // Créer le commit
          await git.commit(params.message);
          
          return respond(200, { 
            success: true, 
            data: { 
              message: 'Commit créé avec succès', 
              filesChanged: status.files.length 
            } 
          });
        } catch (error) {
          console.error('Erreur lors du commit:', error);
          return respond(500, { success: false, error: error.message });
        }
        
      case 'push':
        try {
          const git = simpleGit(LOCAL_DIR);
          
          // Configurer les options d'authentification
          const authOptions = {
            username: GIT_USERNAME,
            password: token
          };
          
          // Pousser les modifications
          await git.push('origin', 'main', authOptions);
          
          return respond(200, { 
            success: true, 
            data: { message: 'Modifications poussées avec succès' } 
          });
        } catch (error) {
          console.error('Erreur lors du push:', error);
          return respond(500, { success: false, error: error.message });
        }
        
      default:
        return respond(400, { success: false, error: 'Action non reconnue' });
    }
  } catch (error) {
    console.error('Erreur dans le handler:', error);
    return respond(500, { success: false, error: error.message });
  }
};
