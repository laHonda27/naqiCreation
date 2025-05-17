import { gitService } from './gitService';

/**
 * Fonction pour séparer les données de catégories et créations en deux fichiers distincts
 * Cette fonction est utile pour migrer d'un format où tout est dans un seul fichier
 * vers un format où chaque type de données a son propre fichier
 */
export const separateData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Récupérer le fichier creations.json qui contient à la fois les catégories et les créations
    const result = await gitService.getJsonFile('creations.json');
    
    if (!result.success || !result.data) {
      return {
        success: false,
        message: "Impossible de récupérer les données depuis le fichier creations.json"
      };
    }
    
    const data = result.data;
    
    // Vérifier si le fichier contient à la fois des catégories et des créations
    if (!data.categories || !data.creations) {
      return {
        success: false,
        message: "Le format du fichier creations.json n'est pas celui attendu"
      };
    }
    
    // Extraire les catégories
    const categories = data.categories;
    
    // Extraire les créations
    const creations = data.creations;
    
    // Écrire les catégories dans un fichier séparé
    const categoriesResult = await gitService.writeJsonFile('categories.json', { categories });
    
    if (!categoriesResult.success) {
      return {
        success: false,
        message: `Erreur lors de l'écriture du fichier categories.json: ${categoriesResult.error}`
      };
    }
    
    // Écrire les créations dans un fichier séparé (mais garder aussi le fichier original pour compatibilité)
    const creationsResult = await gitService.writeJsonFile('creations_only.json', { creations });
    
    if (!creationsResult.success) {
      return {
        success: false,
        message: `Erreur lors de l'écriture du fichier creations_only.json: ${creationsResult.error}`
      };
    }
    
    return {
      success: true,
      message: "Les données ont été séparées avec succès en deux fichiers distincts"
    };
  } catch (error: any) {
    console.error("Erreur lors de la séparation des données:", error);
    return {
      success: false,
      message: `Une erreur est survenue lors de la séparation des données: ${error.message || "Erreur inconnue"}`
    };
  }
};

/**
 * Fonction pour vérifier si les données sont déjà séparées
 */
export const checkDataSeparation = async (): Promise<boolean> => {
  try {
    // Vérifier si le fichier categories.json existe
    const categoriesResult = await gitService.getJsonFile('categories.json');
    
    // Si le fichier existe et contient des données, alors la séparation a déjà été effectuée
    return categoriesResult.success && categoriesResult.data && categoriesResult.data.categories;
  } catch (error) {
    return false;
  }
};
