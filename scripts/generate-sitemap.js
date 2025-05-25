const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://naqi-creation.com';
const CURRENT_DATE = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

// Pages du site avec leurs priorités et fréquences de changement
const PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/creations', priority: '0.9', changefreq: 'weekly' },
  { path: '/personnalisation', priority: '0.8', changefreq: 'weekly' },
  { path: '/temoignages', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/galerie', priority: '0.8', changefreq: 'weekly' },
];

// Génération du contenu XML
const generateSitemapXML = () => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Ajouter chaque page
  PAGES.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${CURRENT_DATE}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
};

// Écriture du fichier
const writeSitemap = () => {
  const sitemapContent = generateSitemapXML();
  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemapContent);
  console.log(`Sitemap généré avec succès à : ${outputPath}`);
};

// Exécution
writeSitemap();
