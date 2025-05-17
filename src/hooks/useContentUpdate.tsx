import { useState, useEffect } from 'react';
import { contentUpdateService } from '../services/contentUpdateService';

export interface ContentFile {
  name: string;
  path: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export function useContentUpdate() {
  // États pour les données
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [updateMessage, setUpdateMessage] = useState<string>('');
  
  // Charger la liste des fichiers au chargement du hook
  useEffect(() => {
    loadFiles();
  }, []);
  
  // Fonction pour charger la liste des fichiers
  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await contentUpdateService.listFiles();
      
      if (result.success && result.files) {
        setFiles(result.files.map(name => ({
          name,
          path: name,
          status: 'idle'
        })));
      } else {
        setError(result.error || 'Erreur lors du chargement des fichiers');
      }
    } catch (err: any) {
      setError(`Erreur: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour récupérer le contenu d'un fichier
  const getFileContent = async (path: string) => {
    try {
      setUpdateStatus('loading');
      setUpdateMessage(`Récupération du fichier ${path}...`);
      
      // Mettre à jour le statut du fichier
      setFiles(prevFiles => prevFiles.map(file => 
        file.path === path 
          ? { ...file, status: 'loading' } 
          : file
      ));
      
      const result = await contentUpdateService.getFile(path);
      
      // Mettre à jour le statut du fichier
      setFiles(prevFiles => prevFiles.map(file => 
        file.path === path 
          ? { 
              ...file, 
              status: result.success ? 'success' : 'error',
              message: result.error
            } 
          : file
      ));
      
      if (result.success) {
        setUpdateStatus('success');
        setUpdateMessage(`Fichier ${path} récupéré avec succès`);
        return result.data;
      } else {
        setUpdateStatus('error');
        setUpdateMessage(result.error || `Erreur lors de la récupération du fichier ${path}`);
        return null;
      }
    } catch (err: any) {
      setUpdateStatus('error');
      setUpdateMessage(`Erreur: ${err.message || 'Erreur inconnue'}`);
      
      // Mettre à jour le statut du fichier
      setFiles(prevFiles => prevFiles.map(file => 
        file.path === path 
          ? { 
              ...file, 
              status: 'error',
              message: err.message || 'Erreur inconnue'
            } 
          : file
      ));
      
      return null;
    }
  };
  
  // Fonction pour mettre à jour un fichier
  const updateFile = async (path: string, data: any, message?: string) => {
    try {
      setUpdateStatus('loading');
      setUpdateMessage(`Mise à jour du fichier ${path}...`);
      
      // Mettre à jour le statut du fichier
      setFiles(prevFiles => prevFiles.map(file => 
        file.path === path 
          ? { ...file, status: 'loading' } 
          : file
      ));
      
      const result = await contentUpdateService.updateFile(path, data, message);
      
      // Mettre à jour le statut du fichier
      setFiles(prevFiles => prevFiles.map(file => 
        file.path === path 
          ? { 
              ...file, 
              status: result.success ? 'success' : 'error',
              message: result.error
            } 
          : file
      ));
      
      if (result.success) {
        setUpdateStatus('success');
        setUpdateMessage(`Fichier ${path} mis à jour avec succès`);
        return true;
      } else {
        setUpdateStatus('error');
        setUpdateMessage(result.error || `Erreur lors de la mise à jour du fichier ${path}`);
        return false;
      }
    } catch (err: any) {
      setUpdateStatus('error');
      setUpdateMessage(`Erreur: ${err.message || 'Erreur inconnue'}`);
      
      // Mettre à jour le statut du fichier
      setFiles(prevFiles => prevFiles.map(file => 
        file.path === path 
          ? { 
              ...file, 
              status: 'error',
              message: err.message || 'Erreur inconnue'
            } 
          : file
      ));
      
      return false;
    }
  };
  
  return {
    files,
    loading,
    error,
    updateStatus,
    updateMessage,
    loadFiles,
    getFileContent,
    updateFile
  };
}
