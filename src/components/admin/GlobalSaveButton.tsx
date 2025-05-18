import React, { useState } from 'react';
import { Save, Loader, Check } from 'lucide-react';
import { netlifyGitService } from '../../services/netlifyGitService';

interface GlobalSaveButtonProps {
  hasUnsavedChanges: boolean;
  onSaveComplete?: () => void;
}

const GlobalSaveButton: React.FC<GlobalSaveButtonProps> = ({ 
  hasUnsavedChanges,
  onSaveComplete
}) => {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSave = async () => {
    if (status === 'saving') return;
    
    try {
      setStatus('saving');
      setMessage('Enregistrement des modifications...');
      
      const result = await netlifyGitService.syncRepository();
      
      if (result.success) {
        setStatus('success');
        setMessage('Modifications enregistrées avec succès!');
        
        if (onSaveComplete) {
          onSaveComplete();
        }
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(`Erreur: ${result.error || 'Erreur inconnue'}`);
        
        // Réinitialiser après 5 secondes en cas d'erreur
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(`Erreur: ${err.message || 'Erreur inconnue'}`);
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  // Ne pas afficher le bouton s'il n'y a pas de modifications
  if (!hasUnsavedChanges && status === 'idle') {
    return null;
  }

  return (
    <>
      <button 
        className="floating-save-btn"
        onClick={handleSave}
        disabled={status === 'saving' || status === 'success'}
      >
        {status === 'idle' && (
          <>
            <Save size={24} />
            {hasUnsavedChanges && <span className="unsaved-changes-badge">!</span>}
          </>
        )}
        {status === 'saving' && <Loader size={24} className="animate-spin" />}
        {status === 'success' && <Check size={24} />}
        {status === 'error' && <Save size={24} />}
      </button>
      
      {/* Message toast */}
      {message && (
        <div className={`fixed bottom-20 right-6 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
          status === 'idle' ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
        } ${
          status === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' 
          : status === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
          : 'bg-beige-100 text-taupe-800 border-l-4 border-taupe-500'
        }`}>
          {message}
        </div>
      )}
    </>
  );
};

export default GlobalSaveButton;
