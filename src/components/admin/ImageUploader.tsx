import React, { useState, useRef, DragEvent } from 'react';
import { Upload, Link, X, Loader } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinaryService';

interface ImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
  initialImage?: string;
  onImageChange?: (url: string) => void;
  required?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value, 
  onChange, 
  placeholder = "URL de l'image", 
  initialImage, 
  onImageChange,
  required = false
}) => {
  // Utiliser value ou initialImage selon ce qui est fourni
  const imageValue = value || initialImage || '';
  
  // Fonction pour gérer les changements d'image
  const handleImageChange = (url: string) => {
    if (onChange) onChange(url);
    if (onImageChange) onImageChange(url);
  };
  const [mode, setMode] = useState<'url' | 'upload'>(imageValue ? 'url' : 'upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestion du drag & drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  // Gestion de l'upload de fichier
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUploadFile(file);
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      const result = await cloudinaryService.uploadImage(file);
      
      if (result.success && result.imageUrl) {
        handleImageChange(result.imageUrl);
      } else {
        setError(result.error || "Erreur lors de l'upload de l'image");
      }
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.value);
  };

  const clearImage = () => {
    handleImageChange('');
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-taupe-700">Image</label>
        <div className="flex bg-beige-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center text-xs px-3 py-1 rounded-md ${
              mode === 'url' 
                ? 'bg-white text-taupe-800 shadow-sm' 
                : 'text-taupe-600 hover:text-taupe-800'
            }`}
          >
            <Link size={12} className="mr-1" />
            URL externe
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center text-xs px-3 py-1 rounded-md ${
              mode === 'upload' 
                ? 'bg-white text-taupe-800 shadow-sm' 
                : 'text-taupe-600 hover:text-taupe-800'
            }`}
          >
            <Upload size={12} className="mr-1" />
            Importer
          </button>
        </div>
      </div>
      
      {mode === 'url' ? (
        <div className="relative">
          <input
            type="text"
            value={imageValue}
            required={required}
            onChange={handleUrlChange}
            className="input-field pl-4 pr-10"
            placeholder={placeholder}
          />
          {imageValue && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`image-upload-container ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleSelectFile}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {isUploading ? (
            <div className="py-6">
              <Loader size={24} className="animate-spin mx-auto mb-2 text-rose-500" />
              <p className="text-taupe-600">Upload en cours...</p>
            </div>
          ) : imageValue ? (
            <div className="relative w-full py-2">
              <div className="relative w-32 h-32 mx-auto rounded overflow-hidden border border-beige-200">
                <img
                  src={imageValue}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  onError={() => setError("Impossible de charger l'aperçu")}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-beige-100"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-taupe-500 mt-2 text-center">
                Cliquez pour changer d'image
              </p>
            </div>
          ) : (
            <div className="py-6">
              <Upload size={24} className="mx-auto mb-2 text-taupe-400" />
              <p className="text-taupe-600">Cliquez ou déposez une image ici</p>
              <p className="text-xs text-taupe-400 mt-1">PNG, JPG, GIF jusqu'à 10MB</p>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      
      {required && !imageValue && (
        <p className="text-red-500 text-xs mt-1">Une image est requise</p>
      )}
      
      {imageValue && mode === 'upload' && (
        <div className="flex justify-between text-xs text-taupe-500">
          <span>Image uploadée vers Cloudinary</span>
          <button
            type="button" 
            onClick={() => setMode('url')} 
            className="text-rose-500 hover:text-rose-600"
          >
            Modifier l'URL manuellement
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
