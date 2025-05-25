import React from 'react';
import { useShapesAndColors } from '../../hooks/useShapesAndColors';

const ColorPalette: React.FC = () => {
  const { panelColors, textColors, loading } = useShapesAndColors();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-6 md:p-8 flex justify-center items-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-6 md:p-8">
      
      <div className="mb-8">
        <h3 className="text-xl font-display mb-4">Couleurs pour le fond du panneau</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {panelColors.length === 0 ? (
            <p className="col-span-full text-center text-taupe-600 py-4">Aucune couleur disponible</p>
          ) : (
            panelColors.map(color => (
              <div key={color.id} className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                {color.image ? (
                  <div className="h-24 relative">
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        backgroundColor: color.hexCode,
                        opacity: color.opacity || 1
                      }}
                    ></div>
                    <img 
                      src={color.image} 
                      alt={color.name} 
                      className="h-full w-full object-cover relative z-10 mix-blend-overlay"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div 
                    className="h-24"
                    style={{ 
                      backgroundColor: color.hexCode,
                      opacity: color.opacity || 1
                    }}
                  >
                    {color.id === 'transparent' && (
                      <span className="flex h-full items-center justify-center text-taupe-500 text-sm">Transparent</span>
                    )}
                  </div>
                )}
                <div className="p-3 text-center">
                  <p className="font-medium text-taupe-800">{color.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-display mb-4">Couleurs pour les inscriptions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {textColors.length === 0 ? (
            <p className="col-span-full text-center text-taupe-600 py-4">Aucune couleur disponible</p>
          ) : (
            textColors.map(color => (
              <div key={color.id} className="bg-white border border-beige-200 rounded-lg overflow-hidden">
                {color.image ? (
                  <div className="h-24 relative">
                    <div 
                      className="absolute inset-0" 
                      style={{ backgroundColor: color.hexCode }}
                    ></div>
                    <img 
                      src={color.image} 
                      alt={color.name} 
                      className="h-full w-full object-cover relative z-10 mix-blend-overlay"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div 
                    className="h-24"
                    style={{ backgroundColor: color.hexCode }}
                  ></div>
                )}
                <div className="p-3 text-center">
                  <p className="font-medium text-taupe-800">{color.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-beige-200">
        <p className="text-taupe-600 italic text-center">
          Ces couleurs sont présentées à titre indicatif. De légères variations peuvent exister entre l'affichage à l'écran et le rendu final.
        </p>
      </div>
    </div>
  );
};

export default ColorPalette;
