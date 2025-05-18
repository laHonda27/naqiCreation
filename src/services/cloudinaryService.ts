/**
 * Service pour gérer les uploads d'images vers Cloudinary via la fonction serverless content-update
 */

// Type pour les résultats des opérations d'upload
export interface CloudinaryUploadResult {
  success: boolean;
  imageUrl?: string;
  publicId?: string;
  error?: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Service pour gérer les uploads d'images vers Cloudinary
 */
const cloudinaryService = {
  /**
   * Upload une image vers Cloudinary
   * @param file Fichier image à uploader
   * @returns Résultat de l'upload avec l'URL de l'image
   */
  async uploadImage(file: File): Promise<CloudinaryUploadResult> {
    try {
      // Valider le type de fichier
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Le fichier doit être une image'
        };
      }

      // Convertir l'image en base64
      const base64Image = await this.convertFileToBase64(file);

      // Utiliser la fonction serverless pour uploader l'image
      const response = await fetch(`/.netlify/functions/content-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'upload-image-cloudinary',
          content: base64Image,
          fileName: file.name
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'upload de l'image (${response.status})`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erreur inconnue lors de l'upload");
      }

      return {
        success: true,
        imageUrl: result.imageUrl,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error: any) {
      console.error("Erreur lors de l'upload de l'image:", error);
      return {
        success: false,
        error: error.message || "Erreur inconnue"
      };
    }
  },

  /**
   * Convertit un fichier en base64
   * @param file Fichier à convertir
   * @returns Chaîne base64 représentant le fichier
   */
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
};

export { cloudinaryService };
