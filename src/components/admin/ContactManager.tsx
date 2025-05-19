import React, { useState, useEffect } from 'react';
import { useContactInfo, ContactInfo } from '../../hooks/useContactInfo';
import { Mail, Phone, MapPin, Instagram, Eye, EyeOff } from 'lucide-react';
import GlobalSaveButton from './GlobalSaveButton';

const ContactManager: React.FC = () => {
  const { contactInfo, loading, error, updateContactInfo, togglePhoneVisibility } = useContactInfo();
  
  const [formData, setFormData] = useState<ContactInfo>({
    email: '',
    phone: '',
    showPhone: true,
    address: '',
    instagram: ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  
  // Mettre à jour le formulaire lorsque les données sont chargées
  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setHasChanges(true);
  };
  
  // Cette fonction est appelée automatiquement lorsque le formulaire est soumis
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Nous ne faisons rien ici car les modifications sont enregistrées via le bouton flottant
  };
  
  // Cette fonction est appelée lorsque le bouton flottant est cliqué
  const handleSaveChanges = async () => {
    try {
      const success = await updateContactInfo(formData);
      return success;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des informations de contact:', err);
      return false;
    }
  };
  

  
  const handleTogglePhoneVisibility = async () => {
    try {
      await togglePhoneVisibility();
      setFormData(prev => ({
        ...prev,
        showPhone: !prev.showPhone
      }));
      setHasChanges(true);
    } catch (err) {
      console.error('Erreur lors du changement de visibilité du téléphone:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-500 text-center">
          <p>Erreur: {error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-taupe-800">Informations de contact</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-taupe-700 mb-2">
            <div className="flex items-center">
              <Mail size={18} className="mr-2 text-rose-400" />
              <span>Email</span>
            </div>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-taupe-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="contact@naqicreation.com"
            required
          />
        </div>
        
        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-taupe-700 mb-2">
            <div className="flex items-center">
              <Phone size={18} className="mr-2 text-rose-400" />
              <span>Téléphone</span>
            </div>
          </label>
          <div className="flex flex-col space-y-4">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-taupe-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="+33 6 12 34 56 78"
            />
            
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer" onClick={() => handleTogglePhoneVisibility()}>
                <div className="relative inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={formData.showPhone}
                    readOnly
                    id="phoneVisibility"
                  />
                  <div className="relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer"
                    style={{
                      backgroundColor: formData.showPhone ? '#f43f5e' : '#e5e7eb',
                    }}
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-0.5">
                      <span 
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${formData.showPhone ? 'translate-x-5' : 'translate-x-0'}`}
                      ></span>
                    </span>
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-taupe-700">
                  {formData.showPhone ? "Téléphone visible" : "Téléphone masqué"}
                </span>
              </div>
            </div>
            
            <div className={`p-3 rounded-md ${formData.showPhone ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
              <div className="flex items-start">
                {formData.showPhone ? (
                  <Eye size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <EyeOff size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm">
                  {formData.showPhone 
                    ? "Le numéro de téléphone sera affiché dans le pied de page et sur la page de contact." 
                    : "Le numéro de téléphone sera masqué sur tout le site."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-taupe-700 mb-2">
            <div className="flex items-center">
              <MapPin size={18} className="mr-2 text-rose-400" />
              <span>Adresse</span>
            </div>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-taupe-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="Paris, France"
          />
        </div>
        
        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-taupe-700 mb-2">
            <div className="flex items-center">
              <Instagram size={18} className="mr-2 text-rose-400" />
              <span>Instagram</span>
            </div>
          </label>
          <div className="flex items-center">
            <span className="text-taupe-500 mr-2">@</span>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-taupe-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="naqicreation"
            />
          </div>
          <p className="mt-1 text-sm text-taupe-500">
            Votre nom d'utilisateur Instagram sans le "@"
          </p>
        </div>
        

        

        
        {/* Bouton flottant pour enregistrer les modifications */}
        <GlobalSaveButton 
          hasUnsavedChanges={hasChanges}
          onSaveComplete={() => setHasChanges(false)}
          onSave={handleSaveChanges}
        />
      </form>
    </div>
  );
};

export default ContactManager;
