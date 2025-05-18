import { netlifyGitService } from './netlifyGitService';

export const imageUploadService = {
  async uploadCreationImage(file: File, categoryId: string): Promise<string> {
    try {
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
      const fileName = `${timestamp}-${safeFileName}`;
      
      // Créer un dossier par catégorie pour organiser les images
      const safeCategoryId = categoryId || 'divers';
      
      // Chemin dans le dépôt (sans le dossier public/images car il est déjà inclus dans la fonction serverless)
      const imagePath = `creations/${safeCategoryId}/${fileName}`;
      
      // Lire le fichier comme base64
      const base64Content = await this.fileToBase64(file);
      
      // Envoyer à la fonction serverless
      const result = await netlifyGitService.uploadImage(imagePath, base64Content);
      
      if (result.success) {
        // Retourner le chemin relatif de l'image pour l'utiliser dans le JSON
        return `/images/creations/${safeCategoryId}/${fileName}`;
      } else {
        throw new Error(result.error || "Échec de l'upload de l'image");
      }
    } catch (error: any) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    }
  },
  
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
};
