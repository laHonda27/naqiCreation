import React from 'react';
import { useFaqs, FaqPageType } from '../../hooks/useFaqs';

interface FaqSectionProps {
  pageType: FaqPageType;
  title?: string;
  subtitle?: string;
}

const FaqSection: React.FC<FaqSectionProps> = ({ 
  pageType, 
  title = "Questions fréquentes", 
  subtitle = "Retrouvez les réponses aux questions les plus courantes concernant nos services."
}) => {
  const { getFaqsByPage, loading } = useFaqs();
  const faqs = getFaqsByPage(pageType);
  
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-semibold">{title}</h2>
            <div className="w-16 h-1 bg-rose-300 mx-auto my-6"></div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-beige-50 p-6 rounded-lg shadow-soft animate-pulse">
                  <div className="h-6 bg-beige-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-beige-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-beige-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (faqs.length === 0) {
    return null;
  }
  
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">{title}</h2>
          <div className="w-16 h-1 bg-rose-300 mx-auto mb-6"></div>
          {subtitle && <p className="text-taupe-600 max-w-2xl mx-auto mb-6">{subtitle}</p>}
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-beige-50 p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <h3 className="text-xl font-display font-semibold mb-2">{faq.question}</h3>
                <p className="text-taupe-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
