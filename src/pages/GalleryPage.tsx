import React from 'react';
import { Helmet } from 'react-helmet';
import Gallery from '../components/gallery/Gallery';
import { useGallery } from '../hooks/useGallery';

const GalleryPage: React.FC = () => {
  const { galleryData, loading } = useGallery();

  return (
    <>
      <Helmet>
        <title>Galerie | Naqi Création</title>
        <meta 
          name="description" 
          content="Découvrez nos réalisations de panneaux personnalisés pour mariages, fiançailles et événements dans notre galerie photos." 
        />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-beige-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">Notre Galerie</h1>
            <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
            <p className="text-lg text-taupe-600">
              Découvrez nos créations et laissez-vous inspirer pour votre prochain événement.
              Chaque panneau est unique et réalisé avec passion.
            </p>
          </div>
        </div>
      </section>
      
      {/* Gallery */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <Gallery images={galleryData.images} />
              
              <div className="mt-16 text-center">
                <p className="text-lg text-taupe-600 mb-6">
                  Vous aimez ce que vous voyez ? N'hésitez pas à nous contacter pour discuter de votre projet.
                </p>
                <a href="/contact" className="btn-primary">
                  Demander un devis
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default GalleryPage;