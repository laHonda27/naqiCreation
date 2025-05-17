import React from 'react';
import { useStaticData } from '../../hooks/useStaticData';
import { RefreshCw, FileJson, CheckCircle, AlertCircle, Info } from 'lucide-react';

const StaticDataPanel: React.FC = () => {
  const { 
    loading, 
    error, 
    syncMessage, 
    jsonFiles, 
    refreshData 
  } = useStaticData();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FileJson size={20} className="mr-2 text-taupe-600" />
        Gestion des données statiques
      </h2>
      
      <div className="p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-md flex items-start mb-4">
        <Info size={20} className="mr-3 mt-0.5 flex-shrink-0 text-blue-600" />
        <div>
          <p className="font-semibold mb-1">Fichiers statiques sur Netlify</p>
          <p className="mb-2">
            Les données de l'application sont maintenant gérées via des fichiers JSON statiques hébergés directement sur Netlify.
            Pour modifier le contenu, mettez à jour les fichiers dans le dossier <code className="bg-beige-100 px-1.5 py-0.5 rounded">public/data/</code> et redéployez l'application.
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <button
          onClick={() => refreshData()}
          disabled={loading}
          className="flex items-center bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Chargement...' : 'Rafraîchir les données'}
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
      
      {syncMessage && !error && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          <p className="font-semibold flex items-center">
            <CheckCircle size={18} className="mr-2" />
            Statut
          </p>
          <p>{syncMessage}</p>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Fichiers JSON disponibles</h3>
        {jsonFiles.length > 0 ? (
          <ul className="space-y-2">
            {jsonFiles.map((file, index) => (
              <li key={index} className="flex items-center">
                <FileJson size={16} className="mr-2 text-taupe-500" />
                <span>{file}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-taupe-500">Aucun fichier JSON disponible</p>
        )}
      </div>
      
      <div className="mt-6 text-sm text-taupe-500 bg-beige-50 p-3 rounded-md">
        <p className="font-semibold mb-1">Comment mettre à jour les données :</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Modifiez les fichiers JSON dans le dossier <code className="bg-beige-100 px-1 py-0.5 rounded">public/data/</code></li>
          <li>Ajoutez des images dans le dossier <code className="bg-beige-100 px-1 py-0.5 rounded">public/images/</code></li>
          <li>Déployez les modifications sur Netlify en poussant les changements vers votre dépôt Git</li>
          <li>Netlify redéploiera automatiquement votre site avec les nouvelles données</li>
        </ol>
      </div>
    </div>
  );
};

export default StaticDataPanel;
