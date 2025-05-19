import React, { useState, useEffect } from 'react';
import { useContactInfo, ContactInfo } from '../../hooks/useContactInfo';
import { Mail, Phone, MapPin, Instagram, Facebook, Save, Eye, EyeOff } from 'lucide-react';

const ContactManager: React.FC = () => {
  const { contactInfo, loading, error, updateContactInfo, togglePhoneVisibility } = useContactInfo();
  
  const [formData, setFormData] = useState<ContactInfo>({
    email: '',
    phone: '',
    showPhone: true,
    address: '',
    instagram: '',
    facebook: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
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
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const success = await updateContactInfo(formData);
      
      if (success) {
        setSaveMessage({
          type: 'success',
          text: 'Informations de contact mises à jour avec succès'
        });
      } else {
        setSaveMessage({
          type: 'error',
          text: 'Erreur lors de la mise à jour des informations de contact'
        });
      }
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: err.message || 'Une erreur est survenue'
      });
    } finally {
      setIsSaving(false);
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };
  
  const handleTogglePhoneVisibility = async () => {
    setIsSaving(true);
    
    try {
      await togglePhoneVisibility();
      setFormData(prev => ({
        ...prev,
        showPhone: !prev.showPhone
      }));
    } catch (err) {
      console.error('Erreur lors du changement de visibilité du téléphone:', err);
    } finally {
      setIsSaving(false);
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
      <h2 className="text-2xl font-semibold text-taupe-800 mb-6">Informations de contact</h2>
      
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
          <div className="flex">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-taupe-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="+33 6 12 34 56 78"
            />
            <button
              type="button"
              onClick={handleTogglePhoneVisibility}
              className={`px-4 py-2 rounded-r-md ${formData.showPhone ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
              title={formData.showPhone ? "Le téléphone est visible" : "Le téléphone est masqué"}
              disabled={isSaving}
            >
              {formData.showPhone ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <p className="mt-1 text-sm text-taupe-500">
            {formData.showPhone 
              ? "Le numéro de téléphone est visible sur le site" 
              : "Le numéro de téléphone est masqué sur le site"}
          </p>
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
        </div>
        
        {/* Facebook */}
        <div>
          <label className="block text-sm font-medium text-taupe-700 mb-2">
            <div className="flex items-center">
              <Facebook size={18} className="mr-2 text-rose-400" />
              <span>Facebook</span>
            </div>
          </label>
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-taupe-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="naqicreation"
          />
        </div>
        
        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-rose-500 text-white rounded-md hover:bg-rose-600 flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Enregistrer
              </>
            )}
          </button>
        </div>
        
        {/* Message de sauvegarde */}
        {saveMessage && (
          <div className={`mt-4 p-3 rounded-md ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {saveMessage.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactManager;
