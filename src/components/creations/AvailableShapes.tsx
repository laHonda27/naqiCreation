import React from 'react';

const AvailableShapes: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6 md:p-8">
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-beige-50 p-4 rounded-lg text-center">
          <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 rounded-t-[40px] flex items-center justify-center text-white font-medium">
            <span>50x70 cm</span>
          </div>
          <p className="font-medium text-taupe-800">Arche orientale</p>
        </div>
        <div className="bg-beige-50 p-4 rounded-lg text-center">
          <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 rounded-t-[100px] flex items-center justify-center text-white font-medium">
            <span>50x70 cm</span>
          </div>
          <p className="font-medium text-taupe-800">Arche classique</p>
        </div>
        <div className="bg-beige-50 p-4 rounded-lg text-center">
          <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 flex items-center justify-center text-white font-medium">
            <span>50x70 cm</span>
          </div>
          <p className="font-medium text-taupe-800">Rectangle</p>
        </div>
        <div className="bg-beige-50 p-4 rounded-lg text-center">
          <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 rounded-[100%] flex items-center justify-center text-white font-medium">
            <span>50x70 cm</span>
          </div>
          <p className="font-medium text-taupe-800">Ovale</p>
        </div>
        <div className="bg-beige-50 p-4 rounded-lg text-center">
          <div className="aspect-[4/5] bg-taupe-300 mx-auto mb-3 rounded-[30px] flex items-center justify-center text-white font-medium">
            <span>50x70 cm</span>
          </div>
          <p className="font-medium text-taupe-800">Nuage</p>
        </div>
        <div className="bg-beige-50 p-4 rounded-lg text-center">
          <div className="aspect-[3/4] bg-taupe-300 mx-auto mb-3 flex items-center justify-center text-white font-medium">
            <span>30x40 cm</span>
          </div>
          <p className="font-medium text-taupe-800">Rectangle (petit)</p>
        </div>
        <div className="bg-beige-50 p-4 rounded-lg text-center">
          <div className="aspect-square bg-taupe-300 mx-auto mb-3 flex items-center justify-center text-white font-medium">
            <span>50x50 cm</span>
          </div>
          <p className="font-medium text-taupe-800">Carré</p>
        </div>
        <div className="bg-beige-50 p-4 rounded-lg text-center">
          <div className="aspect-square bg-taupe-300 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-medium">
            <span>50x50 cm</span>
          </div>
          <p className="font-medium text-taupe-800">Cercle</p>
        </div>
      </div>
      
      <div className="bg-beige-100 p-6 rounded-lg">
        <h3 className="text-lg font-display font-semibold mb-3">Informations importantes</h3>
        <ul className="space-y-2 text-taupe-700">
          <li className="flex items-start">
            <span className="text-rose-400 mr-2">•</span>
            <p>Les tailles indiquées sont standard, mais des dimensions personnalisées sont disponibles sur demande.</p>
          </li>
          <li className="flex items-start">
            <span className="text-rose-400 mr-2">•</span>
            <p>Toutes les formes sont réalisées dans du plexiglass de 3mm d'épaisseur pour garantir solidité et légèreté.</p>
          </li>
          <li className="flex items-start">
            <span className="text-rose-400 mr-2">•</span>
            <p>Chaque panneau est livré avec un support en bois adapté à sa forme.</p>
          </li>
          <li className="flex items-start">
            <span className="text-rose-400 mr-2">•</span>
            <p>Des formes sur mesure peuvent être réalisées selon vos besoins spécifiques (supplément possible).</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AvailableShapes;
