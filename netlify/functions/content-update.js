// Import de fetch pour les environnements Node.js
const fetch = require('node-fetch');
const { Buffer } = require('buffer');

// Configuration
const REPO_OWNER = 'laHonda27'; // Propriétaire du dépôt
const REPO_NAME = 'naqiCreation'; // Nom du dépôt principal du projet
const DATA_PATH = 'public/data'; // Chemin vers les fichiers de données dans le dépôt

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
const getFileFromGitHub = async (path) => {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}/${path}`;
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

// Met à jour un fichier sur GitHub
const updateFileOnGitHub = async (path, content, message) => {
  try {
    // D'abord récupérer le SHA du fichier existant
    const fileInfo = await getFileFromGitHub(path);
    
    if (!fileInfo.success) {
      return fileInfo; // Propager l'erreur
    }
    
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}/${path}`;
    console.log(`Mise à jour du fichier: ${url}`);
    
    // Préparer le corps de la requête
    const requestBody = {
      message: message || `Mise à jour de ${path}`,
      content: encodeBase64(content),
      sha: fileInfo.sha
    };
    
    // Mettre à jour le fichier
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
      commit: data.commit
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
  // Gestion des requêtes OPTIONS pour CORS
  if (event.httpMethod === 'OPTIONS') {
    return respond(200, {});
  }
  
  try {
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
    const { action, path, content, message } = body;
    
    // Ajouter les informations de débogage à toutes les réponses
    const addDebugInfo = (result) => {
      return { ...result, debug: configInfo };
    };
    
    switch (action) {
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
        // Mettre à jour un fichier
        if (!path) {
          return respond(400, addDebugInfo({ success: false, error: 'Chemin du fichier manquant' }));
        }
        
        if (content === undefined) {
          return respond(400, addDebugInfo({ success: false, error: 'Contenu du fichier manquant' }));
        }
        
        const updateResult = await updateFileOnGitHub(path, content, message);
        return respond(updateResult.success ? 200 : 500, addDebugInfo(updateResult));
        
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
