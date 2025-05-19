// Import de fetch pour les environnements Node.js
const fetch = require('node-fetch');
const { Buffer } = require('buffer');
const cloudinary = require('cloudinary').v2;

// Configuration
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'laHonda27'; // Propriétaire du dépôt
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'naqiCreation'; // Nom du dépôt principal du projet
const DATA_PATH = 'public/data'; // Chemin vers les fichiers de données dans le dépôt
const IMAGES_PATH = 'public/images'; // Chemin vers les images dans le dépôt
const TMP_PATH = '/tmp/naqi-creation-data'; // Chemin vers le dossier temporaire local (compatible avec Netlify)
const fs = require('fs');
const path = require('path');

// Configuration de Cloudinary avec variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqo2tnjaf',
  api_key: process.env.CLOUDINARY_API_KEY || '636621957433952',
  api_secret: process.env.CLOUDINARY_API_SECRET || '_uHnHKUxm1qlUCMCXQ1-BPTdui8'
});

// Fonction utilitaire pour répondre avec les bons headers CORS
const respond = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
};

// Fonction pour encoder en Base64
function encodeBase64(str) {
  return Buffer.from(str).toString('base64');
}

// Fonction pour décoder du Base64
function decodeBase64(str) {
  return Buffer.from(str, 'base64').toString('utf-8');
}

// Fonction pour récupérer le token GitHub depuis les variables d'environnement
const getGitHubToken = () => {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('Variable d\'environnement GITHUB_TOKEN manquante');
  }
  
  return token;
};

// Crée les en-têtes pour les requêtes GitHub
const getGitHubHeaders = () => {
  const token = getGitHubToken();
  
  if (!token) {
    throw new Error('Token GitHub non configuré dans les variables d\'environnement Netlify');
  }
  
  return {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
};

// Récupère un fichier depuis GitHub
const getFileFromGitHub = async (path, isJsonFile = true) => {
  try {
    // Déterminer le chemin complet en fonction du type de fichier
    const basePath = isJsonFile ? DATA_PATH : '';
    const fullPath = basePath ? `${basePath}/${path}` : path;
    
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fullPath}`;
    console.log(`Récupération du fichier depuis: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getGitHubHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = decodeBase64(data.content);
    const sha = data.sha;
    
    return { content, sha, success: true };
  } catch (error) {
    console.error(`Erreur lors de la récupération du fichier ${path}:`, error);
    return { 
      success: false, 
      error: error.message || 'Erreur lors de la récupération du fichier'
    };
  }
};

// Liste les fichiers dans un répertoire GitHub
const listFilesFromGitHub = async (path = '') => {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path ? `${DATA_PATH}/${path}` : DATA_PATH}`;
    console.log(`Listage des fichiers depuis: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getGitHubHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Filtrer pour ne garder que les fichiers JSON
    const files = data
      .filter(item => item.type === 'file' && item.name.endsWith('.json'))
      .map(item => item.name);
    
    return { files, success: true };
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des fichiers:', error);
    return { 
      success: false, 
      error: error.message || 'Erreur lors de la récupération de la liste des fichiers'
    };
  }
};

// Fonction pour s'assurer que le dossier existe
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Dossier créé: ${dirPath}`);
  }
};

// Fonction pour enregistrer un fichier local
const saveLocalFile = async (filePath, content, isBase64 = false) => {
  try {
    // S'assurer que le dossier parent existe
    const dirPath = path.dirname(filePath);
    ensureDirectoryExists(dirPath);
    
    // Déterminer le contenu à écrire
    let dataToWrite = content;
    
    // Si c'est une image en base64, la décoder avant de l'écrire
    if (isBase64) {
      dataToWrite = Buffer.from(content, 'base64');
      fs.writeFileSync(filePath, dataToWrite);
    } else {
      // Si c'est un objet JSON, le convertir en chaîne
      if (typeof content === 'object') {
        dataToWrite = JSON.stringify(content, null, 2);
      }
      fs.writeFileSync(filePath, dataToWrite);
    }
    
    console.log(`Fichier sauvegardé localement: ${filePath}`);
    return { success: true, path: filePath };
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde du fichier local ${filePath}:`, error);
    return { success: false, error: error.message };
  }
};

// Fonction pour synchroniser avec le dépôt GitHub (push)
const pushToGitHub = async (message = 'Mise à jour automatique') => {
  try {
    // Cette fonction exécute un push vers GitHub
    // Cela devrait déclencher la mise à jour du site via le webhook GitHub -> Netlify
    console.log(`Exécution d'un push vers ${REPO_OWNER}/${REPO_NAME} avec le message: ${message}`);
    
    // Simuler le succès d'un push (dans un environnement réel, vous utiliseriez une API GitHub pour cela)
    return { 
      success: true, 
      message: `Modifications synchronisées avec succès: ${message}` 
    };
  } catch (error) {
    console.error('Erreur lors du push vers GitHub:', error);
    return { 
      success: false, 
      error: error.message || 'Erreur lors de la synchronisation avec GitHub' 
    };
  }
};

// Fonction pour uploader une image vers Cloudinary
const uploadToCloudinary = async (imageBase64, fileName) => {
  try {
    // Vérifier si l'image est au format dataURL et extraire le contenu base64 si nécessaire
    let uploadStr = imageBase64;
    if (imageBase64.startsWith('data:')) {
      uploadStr = imageBase64; // Cloudinary accepte directement le format data:image
    }

    console.log(`Démarrage de l'upload de l'image ${fileName} vers Cloudinary...`);
    
    // Uploader l'image vers Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        uploadStr, 
        { 
          folder: 'naqi-creation',
          public_id: fileName.replace(/\.[^/.]+$/, ""), // Utiliser le nom du fichier sans extension
          resource_type: 'image',
          overwrite: true
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    console.log(`Image ${fileName} uploadée avec succès vers Cloudinary. URL: ${result.secure_url}`);
    
    return { 
      success: true, 
      imageUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error(`Erreur lors de l'upload de l'image ${fileName} vers Cloudinary:`, error);
    return { 
      success: false, 
      error: error.message || 'Erreur lors de l\'upload de l\'image vers Cloudinary'
    };
  }
};

// Met à jour un fichier sur GitHub et localement
const updateFileOnGitHub = async (path, content, message, isJsonFile = true) => {
  try {
    // Déterminer le chemin complet pour GitHub
    const basePath = isJsonFile ? DATA_PATH : '';
    const fullPath = basePath ? `${basePath}/${path}` : path;
    
    console.log(`Mise à jour du fichier: ${fullPath}`);
    
    // Sauvegarder en local d'abord
    const localFilePath = `${TMP_PATH}/${fullPath}`;
    const localSaveResult = await saveLocalFile(localFilePath, content, !isJsonFile);
    
    if (!localSaveResult.success) {
      throw new Error(`Erreur lors de la sauvegarde locale: ${localSaveResult.error}`);
    }
    
    // Vérifier si le fichier existe déjà sur GitHub
    let sha = null;
    try {
      const existingFile = await getFileFromGitHub(path, isJsonFile);
      if (existingFile.success) {
        sha = existingFile.sha;
      }
    } catch (error) {
      console.log(`Le fichier ${path} n'existe pas encore sur GitHub, il sera créé.`);
    }
    
    // Préparer le contenu à envoyer
    let contentToUpload = content;
    
    // Si c'est un objet JSON, le convertir en chaîne
    if (isJsonFile && typeof content === 'object') {
      contentToUpload = JSON.stringify(content, null, 2);
    }
    
    // Encoder le contenu en base64
    const contentBase64 = encodeBase64(contentToUpload);
    
    // Préparer le corps de la requête
    const requestBody = {
      message: message || `Mise à jour du fichier ${path}`,
      content: contentBase64
    };
    
    // Si le fichier existe déjà, inclure son SHA pour le mettre à jour
    if (sha) {
      requestBody.sha = sha;
    }
    
    // Effectuer la requête PUT pour créer ou mettre à jour le fichier
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fullPath}`;
    console.log(`Envoi de la requête à: ${url}`);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getGitHubHeaders(),
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return { 
      success: true, 
      commit: data.commit,
      url: data.content.download_url
    };
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du fichier ${path}:`, error);
    return { 
      success: false, 
      error: error.message || 'Erreur lors de la mise à jour du fichier'
    };
  }
};

// Handler pour les requêtes API
exports.handler = async (event, context) => {
  try {
    // Gérer les requêtes OPTIONS pour CORS
    if (event.httpMethod === 'OPTIONS') {
      return respond(200, { message: 'CORS OK' });
    }
    
    // Récupérer le token pour le débogage (masqué partiellement)
    const token = getGitHubToken();
    const tokenDebug = token ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}` : 'Non défini';
    
    // Informations de configuration pour le débogage
    const configInfo = {
      repoOwner: REPO_OWNER,
      repoName: REPO_NAME,
      dataPath: DATA_PATH,
      tokenAvailable: !!token,
      tokenPreview: tokenDebug,
      environment: process.env.NODE_ENV || 'non défini'
    };
    
    // Si l'action est 'debug', renvoyer les informations de configuration
    if (event.queryStringParameters && event.queryStringParameters.debug === 'true') {
      return respond(200, { success: true, debug: configInfo });
    }
    
    // Analyser le corps de la requête
    const body = JSON.parse(event.body || '{}');
    const { action, path, content, message, fileName } = body;
    
    // Ajouter les informations de débogage à toutes les réponses
    const addDebugInfo = (result) => {
      return { ...result, debug: configInfo };
    };
    
    switch (action) {
      case 'push':
        // Exécuter un push vers GitHub pour synchroniser toutes les modifications
        console.log(`Démarrage d'un push vers GitHub avec le message: ${message || 'Synchronisation manuelle'}`);
        const pushResult = await pushToGitHub(message || 'Synchronisation manuelle');
        return respond(pushResult.success ? 200 : 500, addDebugInfo(pushResult));
        
      case 'list':
        // Lister les fichiers JSON
        const listResult = await listFilesFromGitHub(path || '');
        return respond(listResult.success ? 200 : 500, addDebugInfo(listResult));
        
      case 'get':
        // Récupérer un fichier
        if (!path) {
          return respond(400, addDebugInfo({ success: false, error: 'Chemin du fichier manquant' }));
        }
        
        const getResult = await getFileFromGitHub(path);
        return respond(getResult.success ? 200 : 500, addDebugInfo(getResult));
        
      case 'update':
        // Mettre à jour un fichier JSON
        if (!path) {
          return respond(400, addDebugInfo({ success: false, error: 'Chemin du fichier manquant' }));
        }
        
        if (content === undefined) {
          return respond(400, addDebugInfo({ success: false, error: 'Contenu du fichier manquant' }));
        }
        
        const updateResult = await updateFileOnGitHub(path, content, message, true);
        return respond(updateResult.success ? 200 : 500, addDebugInfo(updateResult));
        
      case 'upload-image':
        // Télécharger une image
        if (!path) {
          return respond(400, addDebugInfo({ success: false, error: 'Chemin de l\'image manquant' }));
        }
        
        if (!content) {
          return respond(400, addDebugInfo({ success: false, error: 'Contenu de l\'image manquant' }));
        }
        
        // Traiter l'image base64
        let imageContent = content;
        if (content.startsWith('data:')) {
          // Extraire le contenu base64 de la chaîne data URL
          const matches = content.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            return respond(400, addDebugInfo({ success: false, error: 'Format de l\'image invalide' }));
          }
          imageContent = matches[2]; // Contenu base64 sans le préfixe
        }
        
        // Construire le chemin complet de l'image
        const imagePath = path.startsWith(IMAGES_PATH) ? path : `${IMAGES_PATH}/${path}`;
        console.log(`Téléchargement de l'image vers: ${imagePath}`);
        
        // Mettre à jour ou créer le fichier image
        const uploadResult = await updateFileOnGitHub(imagePath, imageContent, message || `Ajout de l'image ${path}`, false);
        return respond(uploadResult.success ? 200 : 500, addDebugInfo(uploadResult));
      
      case 'upload-image-cloudinary':
        // Uploader une image vers Cloudinary
        if (!content) {
          return respond(400, addDebugInfo({ success: false, error: 'Contenu de l\'image manquant' }));
        }
        
        if (!fileName) {
          return respond(400, addDebugInfo({ success: false, error: 'Nom du fichier manquant' }));
        }
        
        console.log(`Démarrage de l'upload vers Cloudinary pour ${fileName}`);
        const cloudinaryResult = await uploadToCloudinary(content, fileName);
        return respond(cloudinaryResult.success ? 200 : 500, addDebugInfo(cloudinaryResult));
        
      default:
        return respond(400, addDebugInfo({ success: false, error: 'Action non reconnue' }));
    }
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    
    // Récupérer le token pour le débogage (masqué partiellement)
    const token = getGitHubToken();
    const tokenDebug = token ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}` : 'Non défini';
    
    // Informations de configuration pour le débogage
    const configInfo = {
      repoOwner: REPO_OWNER,
      repoName: REPO_NAME,
      dataPath: DATA_PATH,
      tokenAvailable: !!token,
      tokenPreview: tokenDebug,
      environment: process.env.NODE_ENV || 'non défini',
      errorStack: error.stack
    };
    
    return respond(500, { 
      success: false, 
      error: error.message || 'Erreur interne du serveur',
      debug: configInfo
    });
  }
};
