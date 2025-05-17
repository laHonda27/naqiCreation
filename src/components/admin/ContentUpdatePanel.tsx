import React, { useState } from 'react';
import { useContentUpdate } from '../../hooks/useContentUpdate';
import { RefreshCw, FileJson, CheckCircle, AlertCircle, Edit, Save } from 'lucide-react';

const ContentUpdatePanel: React.FC = () => {
  const { 
    files, 
    loading, 
    error, 
    updateStatus, 
    updateMessage,
    loadFiles, 
    getFileContent, 
    updateFile 
  } = useContentUpdate();
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Fonction pour sélectionner et charger un fichier
  const handleSelectFile = async (path: string) => {
    setSelectedFile(path);
    const content = await getFileContent(path);
    setFileContent(content);
    setEditedContent(JSON.stringify(content, null, 2));
    setIsEditing(false);
  };
  
  // Fonction pour commencer l'édition d'un fichier
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  
  // Fonction pour sauvegarder les modifications
  const handleSaveChanges = async () => {
    try {
      let parsedContent;
      
      try {
        parsedContent = JSON.parse(editedContent);
      } catch (err) {
        alert('Le contenu JSON n\'est pas valide. Veuillez corriger les erreurs avant de sauvegarder.');
        return;
      }
      
      const success = await updateFile(
        selectedFile as string, 
        parsedContent, 
        `Mise à jour de ${selectedFile} depuis le panneau d'administration`
      );
      
      if (success) {
        setFileContent(parsedContent);
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };
  
  // Fonction pour annuler les modifications
  const handleCancelEditing = () => {
    setEditedContent(JSON.stringify(fileContent, null, 2));
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FileJson size={20} className="mr-2 text-taupe-600" />
        Mise à jour du contenu
      </h2>
      
      <div className="mb-4">
        <button
          onClick={() => loadFiles()}
          disabled={loading}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Chargement...' : 'Rafraîchir la liste des fichiers'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-semibold flex items-center">
            <AlertCircle size={18} className="mr-2" />
            Erreur
          </p>
          <p>{error}</p>
        </div>
      )}
      
      {updateStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          <p className="font-semibold flex items-center">
            <CheckCircle size={18} className="mr-2" />
            Succès
          </p>
          <p>{updateMessage}</p>
        </div>
      )}
      
      {updateStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-semibold flex items-center">
            <AlertCircle size={18} className="mr-2" />
            Erreur
          </p>
          <p>{updateMessage}</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Liste des fichiers */}
        <div className="w-full md:w-1/3">
          <h3 className="font-semibold text-lg mb-2">Fichiers disponibles</h3>
          {files.length > 0 ? (
            <ul className="space-y-2 border rounded-md p-3">
              {files.map((file, index) => (
                <li 
                  key={index} 
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    selectedFile === file.path 
                      ? 'bg-rose-100 text-rose-700' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelectFile(file.path)}
                >
                  <FileJson size={16} className="mr-2 text-taupe-500" />
                  <span>{file.name}</span>
                  {file.status === 'loading' && (
                    <RefreshCw size={14} className="ml-auto animate-spin text-taupe-500" />
                  )}
                  {file.status === 'success' && (
                    <CheckCircle size={14} className="ml-auto text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <div title={file.message}>
                      <AlertCircle size={14} className="ml-auto text-red-500" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-taupe-500">Aucun fichier disponible</p>
          )}
        </div>
        
        {/* Éditeur de contenu */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">
              {selectedFile ? `Édition de ${selectedFile}` : 'Sélectionnez un fichier'}
            </h3>
            
            {selectedFile && !isEditing && (
              <button
                onClick={handleStartEditing}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors text-sm"
              >
                <Edit size={14} className="mr-1" />
                Modifier
              </button>
            )}
            
            {selectedFile && isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors text-sm"
                >
                  <Save size={14} className="mr-1" />
                  Sauvegarder
                </button>
                <button
                  onClick={handleCancelEditing}
                  className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors text-sm"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
          
          {selectedFile ? (
            isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-96 font-mono text-sm p-3 border border-taupe-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            ) : (
              <pre className="w-full h-96 overflow-auto bg-gray-100 p-4 rounded-md">
                {fileContent ? JSON.stringify(fileContent, null, 2) : 'Chargement...'}
              </pre>
            )
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-taupe-500">Sélectionnez un fichier pour voir son contenu</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-taupe-500 bg-beige-50 p-3 rounded-md">
        <p className="font-semibold mb-1">Comment mettre à jour le contenu :</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Sélectionnez un fichier dans la liste</li>
          <li>Cliquez sur "Modifier" pour éditer le contenu</li>
          <li>Apportez vos modifications (assurez-vous que le JSON reste valide)</li>
          <li>Cliquez sur "Sauvegarder" pour envoyer les modifications</li>
          <li>Les modifications seront automatiquement déployées sur votre site</li>
        </ol>
      </div>
    </div>
  );
};

export default ContentUpdatePanel;
