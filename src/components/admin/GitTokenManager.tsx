import React from 'react';
import { Key, Info } from 'lucide-react';

const GitTokenManager: React.FC = () => {

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Key size={20} className="mr-2 text-taupe-600" />
        Configuration du Token GitHub
      </h2>
      
      <div className="p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-md flex items-start mb-4">
        <Info size={20} className="mr-3 mt-0.5 flex-shrink-0 text-blue-600" />
        <div>
          <p className="font-semibold mb-1">Mise à jour du système d'authentification</p>
          <p className="mb-2">
            Le token GitHub est maintenant géré via les variables d'environnement Netlify pour une meilleure sécurité.
            Il n'est plus nécessaire de le saisir ici.
          </p>
        </div>
      </div>
      
      <h3 className="font-semibold text-lg mt-4 mb-2">Configuration sur Netlify</h3>
      <ol className="list-decimal pl-5 space-y-2 text-taupe-600">
        <li>Connectez-vous à votre compte Netlify</li>
        <li>Accédez à votre projet déployé</li>
        <li>Allez dans <strong>Site settings</strong> &gt; <strong>Environment variables</strong></li>
        <li>Ajoutez une variable nommée <code className="bg-beige-100 px-1.5 py-0.5 rounded">GITHUB_TOKEN</code> avec votre token GitHub</li>
        <li>Cliquez sur <strong>Save</strong></li>
        <li>Redéployez votre site pour appliquer les changements</li>
      </ol>

      <div className="mt-6 text-sm text-taupe-500 bg-beige-50 p-3 rounded-md">
        <p className="font-semibold mb-1">Comment obtenir un token GitHub :</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Allez sur GitHub et connectez-vous</li>
          <li>Cliquez sur votre photo de profil en haut à droite</li>
          <li>Sélectionnez "Settings" (Paramètres)</li>
          <li>Dans le menu de gauche, cliquez sur "Developer settings" (Paramètres développeur)</li>
          <li>Cliquez sur "Personal access tokens" puis "Tokens (classic)"</li>
          <li>Cliquez sur "Generate new token" puis "Generate new token (classic)"</li>
          <li>Donnez un nom à votre token et sélectionnez les autorisations 'repo'</li>
          <li>Cliquez sur "Generate token" en bas de la page</li>
          <li>Copiez le token généré et ajoutez-le dans vos variables d'environnement Netlify</li>
        </ol>
      </div>
    </div>
  );
};

export default GitTokenManager;
