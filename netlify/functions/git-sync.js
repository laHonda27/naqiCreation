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
    
    // Créer l'URL avec le token intégré
    const repoUrlWithAuth = REPO_URL.replace('https://', `https://${GIT_USERNAME}:${token}@`);
    
    // Initialiser Git avec le répertoire de travail
    const git = simpleGit({ baseDir: repoExists ? LOCAL_DIR : process.cwd() });

    if (repoExists) {
      // Mettre à jour le dépôt existant
      console.log('Mise à jour du dépôt existant...');
      await git.addConfig('user.name', 'Naqi Admin');
      await git.addConfig('user.email', 'admin@naqicreation.com');
      
      // Réinitialiser le dépôt si nécessaire
      try {
        // Utiliser l'URL avec authentification pour le fetch
        await git.remote(['set-url', 'origin', repoUrlWithAuth]);
        await git.fetch(['--all']);
        await git.reset(['--hard', 'origin/main']);
      } catch (fetchError) {
        console.error('Erreur lors du fetch/reset:', fetchError);
        throw new Error('Impossible de mettre à jour le dépôt: ' + fetchError.message);
      }
    } else {
      // Cloner le dépôt
      console.log('Clonage du dépôt...');
      try {
        // Utiliser l'URL avec authentification pour le clonage
        await git.clone(repoUrlWithAuth, LOCAL_DIR);
        
        // Après le clonage, configurer le dépôt
        const localGit = simpleGit({ baseDir: LOCAL_DIR });
        await localGit.addConfig('user.name', 'Naqi Admin');
        await localGit.addConfig('user.email', 'admin@naqicreation.com');
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
    const filePath = path.join(LOCAL_DIR, DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf8');
    
    // Commiter les changements
    const git = simpleGit({ baseDir: LOCAL_DIR });
    
    // Créer l'URL avec le token intégré
    const repoUrlWithAuth = REPO_URL.replace('https://', `https://${GIT_USERNAME}:${token}@`);
    
    // Configurer le remote avec l'URL authentifiée
    await git.remote(['set-url', 'origin', repoUrlWithAuth]);
    
    // Ajouter et commiter le fichier
    await git.add(filePath);
    await git.commit(commitMessage || `Mise à jour de ${filename}`);
    
    // Pousser les modifications
    await git.push('origin', 'main');
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier:', error);
    return { success: false, error: error.message };
  }
}

// Fonction pour télécharger un fichier d'icône dans le dépôt
async function uploadIconFile(filename, content, commitMessage, token) {
  try {
    // Vérifier que le contenu est une chaîne base64
    if (!content.startsWith('data:image')) {
      return { success: false, error: 'Format de contenu invalide' };
    }
    
    // Extraire le type MIME et le contenu base64
    const matches = content.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return { success: false, error: 'Format de contenu base64 invalide' };
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Déterminer l'extension du fichier en fonction du type MIME
    let extension = '';
    switch (mimeType) {
      case 'image/png':
        extension = '.png';
        break;
      case 'image/jpeg':
      case 'image/jpg':
        extension = '.jpg';
        break;
      case 'image/svg+xml':
        extension = '.svg';
        break;
      case 'image/x-icon':
      case 'image/vnd.microsoft.icon':
        extension = '.ico';
        break;
      default:
        extension = '.png'; // Par défaut
    }
    
    // Déterminer le type d'image (logo ou favicon) en fonction du nom de fichier
    const isLogo = filename.includes('logo');
    const isFavicon = filename.includes('favicon');
    
    // Créer un nom de fichier plus descriptif
    let formattedFilename = '';
    let subFolder = 'autres';
    
    if (isLogo) {
      formattedFilename = `site-logo-${Date.now()}${extension}`;
      subFolder = 'logos';
    } else if (isFavicon) {
      formattedFilename = `site-favicon-${Date.now()}${extension}`;
      subFolder = 'favicons';
    } else {
      formattedFilename = `${filename}-${Date.now()}${extension}`;
    }
    
    // Créer le nom de fichier complet avec sous-dossier
    const fullFilename = `${DATA_DIR}/images/${subFolder}/${formattedFilename}`;
    const fullPath = path.join(LOCAL_DIR, fullFilename);
    
    // Créer le dossier images et le sous-dossier s'ils n'existent pas
    const imagesBaseDir = path.join(LOCAL_DIR, DATA_DIR, 'images');
    const imagesSubDir = path.join(LOCAL_DIR, DATA_DIR, 'images', subFolder);
    
    try {
      await fs.mkdir(imagesBaseDir, { recursive: true });
      await fs.mkdir(imagesSubDir, { recursive: true });
    } catch (err) {
      console.log('Dossier images déjà existant ou erreur lors de la création:', err);
    }
    
    // Écrire le fichier
    await fs.writeFile(fullPath, buffer);
    
    // Ajouter le fichier au Git
    const git = simpleGit({ baseDir: LOCAL_DIR });
    await git.add(fullPath);
    
    // Commiter le fichier
    await git.commit(commitMessage || `Ajout de l'icône ${filename}`);
    
    console.log(`Fichier ${fullFilename} ajouté et commité avec succès`);
    
    // Créer l'URL avec le token intégré
    const repoUrlWithAuth = REPO_URL.replace('https://', `https://${GIT_USERNAME}:${token}@`);
    
    // Configurer le remote avec l'URL authentifiée
    await git.remote(['set-url', 'origin', repoUrlWithAuth]);
    
    // Pousser les modifications
    await git.push('origin', 'main');
    
    console.log(`Modifications poussées vers le dépôt distant`);
    
    return {
      success: true,
      data: {
        filename: fullFilename,
        url: `/${fullFilename}`
      }
    };
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    return {
      success: false,
      error: `Erreur lors du téléchargement du fichier: ${error.message || 'Erreur inconnue'}`
    };
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
        
      case 'upload':
        if (!params.filename || !params.content) {
          return respond(400, { success: false, error: 'Nom de fichier ou contenu manquant' });
        }
        // Synchroniser d'abord pour être sûr d'avoir les dernières versions
        await getRepository(token);
        const uploadResult = await uploadIconFile(
          params.filename,
          params.content,
          params.commitMessage,
          token
        );
        return respond(uploadResult.success ? 200 : 500, uploadResult);
        
      case 'commit':
        if (!params.message) {
          return respond(400, { success: false, error: 'Message de commit manquant' });
        }
        try {
          const git = simpleGit({ baseDir: LOCAL_DIR });
          
          // Créer l'URL avec le token intégré
          const repoUrlWithAuth = REPO_URL.replace('https://', `https://${GIT_USERNAME}:${token}@`);
          
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
          const git = simpleGit({ baseDir: LOCAL_DIR });
          
          // Créer l'URL avec le token intégré
          const repoUrlWithAuth = REPO_URL.replace('https://', `https://${GIT_USERNAME}:${token}@`);
          
          // Configurer le remote avec l'URL authentifiée
          await git.remote(['set-url', 'origin', repoUrlWithAuth]);
          
          // Pousser les modifications
          await git.push('origin', 'main');
          
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
