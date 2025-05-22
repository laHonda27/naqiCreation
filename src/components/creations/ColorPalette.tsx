import React from 'react';

const ColorPalette: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6 md:p-8">
      
      <div className="mb-8">
        <h3 className="text-xl font-display mb-4">Couleurs pour le fond du panneau</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#F5F2E6]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Beige</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#FFD4DC]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Rose bonbon</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#DEA5A4]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Rose pantone</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#722F37]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Bordeaux</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#00533E]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Vert émeraude</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#D0ECF7]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Bleu clair</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#97A595]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Vert sauge</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-white"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Blanc</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#E9ECF2] flex items-center justify-center">
              <span className="text-taupe-500 text-sm">Transparent</span>
            </div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Transparent</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#F0DC9E] bg-gradient-to-br from-[#F0DC9E] to-[#D2AF44]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Doré - effet miroir</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#E0E0E2] bg-gradient-to-br from-[#E0E0E2] to-[#AAACB1]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Argenté - effet miroir</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#D4D6D8] bg-opacity-50"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Givré</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-display mb-4">Couleurs pour les inscriptions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#D2AF44]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Doré</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-white"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Blanc</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#C0C2C4]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800">Argenté</p>
            </div>
          </div>
          <div className="bg-white border border-beige-200 rounded-lg overflow-hidden">
            <div className="h-24 bg-[#222222]"></div>
            <div className="p-3 text-center">
              <p className="font-medium text-taupe-800 text-black">Noir</p>
            </div>
          </div>
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
