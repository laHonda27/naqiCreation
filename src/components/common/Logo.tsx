import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12 w-auto" }) => {
  return (
    <div className={`text-taupe-800 font-display italic ${className}`}>
      <h1 className="text-2xl font-semibold">Naqi Création</h1>
      <p className="text-xs tracking-wide uppercase">Panneaux personnalisés</p>
    </div>
  );
};

export default Logo;