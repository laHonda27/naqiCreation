import React from 'react';
import { Helmet } from 'react-helmet';
import Gallery from '../components/gallery/Gallery';

// Gallery data
const galleryImages = [
  {
    id: 'g1',
    src: 'https://images.pexels.com/photos/1024981/pexels-photo-1024981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Panneau de bienvenue mariage',
    category: 'Mariage',
  },
  {
    id: 'g2',
    src: 'https://images.pexels.com/photos/949223/pexels-photo-949223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Panneau de direction',
    category: 'Mariage',
  },
  {
    id: 'g3',
    src: 'https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Panneau personnalisé fiançailles',
    category: 'Fiançailles',
  },
  {
    id: 'g4',
    src: 'https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Marque-place élégant',
    category: 'Décoration de table',
  },
  {
    id: 'g5',
    src: 'https://images.pexels.com/photos/1120575/pexels-photo-1120575.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Étiquettes de bouteille',
    category: 'Personnalisation',
  },
  {
    id: 'g6',
    src: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Panneau Baby Shower',
    category: 'Baby Shower',
  },
  {
    id: 'g7',
    src: 'https://images.pexels.com/photos/3171813/pexels-photo-3171813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Plan de table mariage',
    category: 'Mariage',
  },
  {
    id: 'g8',
    src: 'https://images.pexels.com/photos/3419728/pexels-photo-3419728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Cartons d\'invitation',
    category: 'Personnalisation',
  },
  {
    id: 'g9',
    src: 'https://images.pexels.com/photos/2253837/pexels-photo-2253837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Menu personnalisé',
    category: 'Décoration de table',
  }
];

const GalleryPage: React.FC = () => {
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
          <Gallery images={galleryImages} />
          
          <div className="mt-16 text-center">
            <p className="text-lg text-taupe-600 mb-6">
              Vous aimez ce que vous voyez ? N'hésitez pas à nous contacter pour discuter de votre projet.
            </p>
            <a href="/contact" className="btn-primary">
              Demander un devis
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default GalleryPage;