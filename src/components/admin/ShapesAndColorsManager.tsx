import React, { useState, useEffect } from 'react';
import { useContentUpdate } from '../../hooks/useContentUpdate';
import { Trash2, Edit, Plus } from 'lucide-react';
import { Shape, Color } from '../../hooks/useShapesAndColors';
import ShapeFormModal from './ShapeFormModal';
import ColorFormModal from './ColorFormModal';
import GlobalSaveButton from './GlobalSaveButton';
import ConfirmationModal from './ConfirmationModal';

const ShapesAndColorsManager: React.FC = () => {
  const { getFileContent, updateFile } = useContentUpdate();
  
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [panelColors, setPanelColors] = useState<Color[]>([]);
  const [textColors, setTextColors] = useState<Color[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // États pour les modaux
  const [isShapeModalOpen, setIsShapeModalOpen] = useState<boolean>(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState<boolean>(false);
  const [editingShape, setEditingShape] = useState<Shape | null>(null);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [isTextColorMode, setIsTextColorMode] = useState<boolean>(false);
  
  // États pour la confirmation de suppression
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'shape' | 'panelColor' | 'textColor'} | null>(null);
  
  // Chargement initial des données
  useEffect(() => {
    loadData();
  }, []);
  
  // Fonction pour charger les données
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les formes
      const shapesResult = await getFileContent('shapes.json');
      if (shapesResult) {
        setShapes(shapesResult.shapes || []);
      }
      
      // Charger les couleurs
      const colorsResult = await getFileContent('colors.json');
      if (colorsResult) {
        setPanelColors(colorsResult.panelColors || []);
        setTextColors(colorsResult.textColors || []);
      }
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données');
      setLoading(false);
    }
  };
  
  // Fonction pour sauvegarder les formes et couleurs
  const saveData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sauvegarder les formes
      const shapesResult = await updateFile(
        'shapes.json',
        { shapes },
        'Mise à jour des formes depuis le panneau d\'administration'
      );
      
      // Sauvegarder les couleurs
      const colorsResult = await updateFile(
        'colors.json',
        { panelColors, textColors },
        'Mise à jour des couleurs depuis le panneau d\'administration'
      );
      
      setLoading(false);
      
      // Vérifier si les deux opérations ont réussi
      return shapesResult && colorsResult;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde des données');
      setLoading(false);
      return false;
    }
  };
  
  // Fonctions pour les formes
  const handleAddShape = () => {
    setEditingShape(null);
    setIsShapeModalOpen(true);
  };
  
  const handleEditShape = (shape: Shape) => {
    setEditingShape(shape);
    setIsShapeModalOpen(true);
  };
  
  const handleShapeSubmit = (formData: Omit<Shape, 'id'> & { id?: string }) => {
    // Vérifier si l'ID est déjà défini, sinon en générer un
    const shapeData = { ...formData };
    if (!shapeData.id) {
      const slug = shapeData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      shapeData.id = slug;
    }

    if (editingShape) {
      // Mise à jour d'une forme existante
      setShapes(prev => prev.map(shape => 
        shape.id === editingShape.id ? { ...shapeData, id: editingShape.id } as Shape : shape
      ));
    } else {
      // Ajout d'une nouvelle forme
      setShapes(prev => [...prev, shapeData as Shape]);
    }
    
    setIsShapeModalOpen(false);
    setHasUnsavedChanges(true);
  };
  
  const confirmDeleteShape = (id: string) => {
    setItemToDelete({ id, type: 'shape' });
    setIsConfirmModalOpen(true);
  };
  
  // Fonctions pour les couleurs
  const handleAddPanelColor = () => {
    setEditingColor(null);
    setIsTextColorMode(false);
    setIsColorModalOpen(true);
  };
  
  const handleAddTextColor = () => {
    setEditingColor(null);
    setIsTextColorMode(true);
    setIsColorModalOpen(true);
  };
  
  const handleEditColor = (color: Color, isText: boolean) => {
    setEditingColor(color);
    setIsTextColorMode(isText);
    setIsColorModalOpen(true);
  };
  
  const handleColorSubmit = (formData: Omit<Color, 'id'> & { id?: string }) => {
    // Vérifier si l'ID est déjà défini, sinon en générer un
    const colorData = { ...formData };
    if (!colorData.id) {
      const slug = colorData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      colorData.id = slug;
    }

    if (editingColor) {
      // Mise à jour d'une couleur existante
      if (isTextColorMode) {
        setTextColors(prev => prev.map(color => 
          color.id === editingColor.id ? { ...colorData, id: editingColor.id } as Color : color
        ));
      } else {
        setPanelColors(prev => prev.map(color => 
          color.id === editingColor.id ? { ...colorData, id: editingColor.id } as Color : color
        ));
      }
    } else {
      // Ajout d'une nouvelle couleur
      if (isTextColorMode) {
        setTextColors(prev => [...prev, colorData as Color]);
      } else {
        setPanelColors(prev => [...prev, colorData as Color]);
      }
    }
    
    setIsColorModalOpen(false);
    setHasUnsavedChanges(true);
  };
  
  const confirmDeleteColor = (id: string, isText: boolean) => {
    setItemToDelete({ id, type: isText ? 'textColor' : 'panelColor' });
    setIsConfirmModalOpen(true);
  };
  
  // Fonction pour supprimer un élément
  const handleDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'shape') {
      setShapes(prev => prev.filter(shape => shape.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'panelColor') {
      setPanelColors(prev => prev.filter(color => color.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'textColor') {
      setTextColors(prev => prev.filter(color => color.id !== itemToDelete.id));
    }
    
    setIsConfirmModalOpen(false);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="p-4 bg-beige-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-taupe-800 font-semibold">Gestion des formes et couleurs</h2>
      </div>
      
      {/* Section des formes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-taupe-700">Formes disponibles</h3>
          <button
            onClick={handleAddShape}
            className="btn-primary px-3 py-2 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une forme
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shapes.length === 0 ? (
            <p className="text-center py-8 text-taupe-600 col-span-full">
              Aucune forme pour le moment.
            </p>
          ) : (
            shapes.map(shape => (
              <div key={shape.id} className="bg-white p-4 rounded-lg border border-beige-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex space-x-4">
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-beige-100 flex-shrink-0">
                    <img 
                      src={shape.image} 
                      alt={shape.name} 
                      className="w-full h-full object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{shape.name}</h4>
                        <p className="text-sm text-taupe-600 mb-1">{shape.size}</p>
                        <p className="text-taupe-700 text-sm line-clamp-2">{shape.description}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditShape(shape)}
                          className="text-taupe-600 hover:text-taupe-800 p-1"
                          aria-label="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDeleteShape(shape.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Section des couleurs de panneau */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-taupe-700">Couleurs pour le fond du panneau</h3>
          <button
            onClick={handleAddPanelColor}
            className="btn-primary px-3 py-2 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une couleur
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {panelColors.length === 0 ? (
            <p className="text-center py-8 text-taupe-600 col-span-full">
              Aucune couleur pour le moment.
            </p>
          ) : (
            panelColors.map(color => (
              <div key={color.id} className="bg-white p-4 rounded-lg border border-beige-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div 
                  className="h-24 mb-3 rounded-md"
                  style={{ 
                    background: color.hexCode,
                    opacity: color.opacity || 1
                  }}
                >
                  {color.id === 'transparent' && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-taupe-500">Transparent</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{color.name}</h4>
                    <p className="text-sm text-taupe-600">{color.hexCode}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditColor(color, false)}
                      className="text-taupe-600 hover:text-taupe-800 p-1"
                      aria-label="Modifier"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => confirmDeleteColor(color.id, false)}
                      className="text-red-500 hover:text-red-600 p-1"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Section des couleurs de texte */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-taupe-700">Couleurs pour les inscriptions</h3>
          <button
            onClick={handleAddTextColor}
            className="btn-primary px-3 py-2 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une couleur
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {textColors.length === 0 ? (
            <p className="text-center py-8 text-taupe-600 col-span-full">
              Aucune couleur pour le moment.
            </p>
          ) : (
            textColors.map(color => (
              <div key={color.id} className="bg-white p-4 rounded-lg border border-beige-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div 
                  className="h-24 mb-3 rounded-md"
                  style={{ background: color.hexCode }}
                ></div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{color.name}</h4>
                    <p className="text-sm text-taupe-600">{color.hexCode}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditColor(color, true)}
                      className="text-taupe-600 hover:text-taupe-800 p-1"
                      aria-label="Modifier"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => confirmDeleteColor(color.id, true)}
                      className="text-red-500 hover:text-red-600 p-1"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Modaux */}
      <ShapeFormModal
        isOpen={isShapeModalOpen}
        onClose={() => setIsShapeModalOpen(false)}
        onSubmit={handleShapeSubmit}
        editingShape={editingShape}
      />
      
      <ColorFormModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSubmit={handleColorSubmit}
        editingColor={editingColor}
        isTextColor={isTextColorMode}
      />
      
      {/* Modal de confirmation pour la suppression */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
      
      {/* Bouton flottant pour enregistrer les modifications */}
      <GlobalSaveButton 
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={saveData}
        onSaveComplete={() => setHasUnsavedChanges(false)}
      />
    </div>
  );
};

export default ShapesAndColorsManager;