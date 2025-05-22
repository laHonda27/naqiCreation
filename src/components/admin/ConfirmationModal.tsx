import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning'
}) => {
  // Définir les couleurs en fonction du type
  const colors = {
    danger: {
      icon: 'text-red-500',
      button: 'bg-red-500 hover:bg-red-600',
      border: 'border-red-200',
      bg: 'bg-red-50'
    },
    warning: {
      icon: 'text-amber-500',
      button: 'bg-amber-500 hover:bg-amber-600',
      border: 'border-amber-200',
      bg: 'bg-amber-50'
    },
    info: {
      icon: 'text-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600',
      border: 'border-blue-200',
      bg: 'bg-blue-50'
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={title}
      size="sm"
      preventCloseOnContentClick={true}
    >
      <div className={`p-4 rounded-lg ${colors[type].bg} ${colors[type].border} border mb-4 w-full`}>
        <div className="flex items-start">
          <div className={`mr-3 flex-shrink-0 ${colors[type].icon}`}>
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-taupe-700 break-words">{message}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white border border-beige-200 rounded-md text-taupe-700 hover:bg-beige-50 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 text-white rounded-md ${colors[type].button} transition-colors`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
