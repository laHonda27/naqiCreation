import React, { useState } from 'react';
import { netlifyGitService } from '../../services/netlifyGitService';

const TestNetlifyFunction: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testNetlifyFunction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel de la fonction de test
      const result = await netlifyGitService.callNetlifyFunction('test');
      
      setTestResult(JSON.stringify(result, null, 2));
    } catch (err: any) {
      setError(`Erreur: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Test des fonctions Netlify</h2>
      
      <p className="text-taupe-600 mb-4">
        Cliquez sur le bouton ci-dessous pour tester si les fonctions Netlify sont correctement configurées.
      </p>
      
      <button
        onClick={testNetlifyFunction}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mb-4"
      >
        {loading ? 'Test en cours...' : 'Tester les fonctions Netlify'}
      </button>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          <p className="font-semibold">Erreur:</p>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div>
          <h3 className="font-medium mb-2">Résultat du test:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
            {testResult}
          </pre>
        </div>
      )}

      <div className="mt-6 text-sm text-taupe-500 bg-beige-50 p-3 rounded-md">
        <p className="font-semibold mb-1">Comment tester les fonctions Netlify en local:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Créez un fichier <code>.env.local</code> à la racine avec votre token: <code>GITHUB_TOKEN=votre_token_ici</code></li>
          <li>Lancez le serveur local Netlify avec <code>npx netlify dev</code></li>
          <li>Vérifiez que le serveur s'ouvre sur <code>http://localhost:8888</code></li>
          <li>Utilisez ce composant pour tester la connexion</li>
        </ol>
      </div>
    </div>
  );
};

export default TestNetlifyFunction;
