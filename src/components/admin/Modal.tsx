import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  preventCloseOnContentClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  preventCloseOnContentClick = false
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fermer le modal en cliquant à l'extérieur
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && !preventCloseOnContentClick) {
      onClose();
    }
  };

  // Fermer le modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Animation d'entrée
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.classList.add('modal-enter');
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.classList.remove('modal-enter');
        }
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Classes de taille
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden modal-content`}
      >
        <div className="flex items-center justify-between border-b border-beige-200 p-4">
          <h2 className="text-xl font-semibold text-taupe-800">{title}</h2>
          <button 
            onClick={onClose}
            className="text-taupe-500 hover:text-taupe-700 transition-colors p-1 rounded-full hover:bg-beige-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-3 sm:p-6 max-h-[calc(90vh-8rem)] overflow-x-hidden w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
