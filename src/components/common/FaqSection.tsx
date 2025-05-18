import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  const faqs = getFaqsByPage(pageType);
  
  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  
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
          <h2 className="text-3xl font-display font-semibold">{title}</h2>
          <div className="w-16 h-1 bg-rose-300 mx-auto my-6"></div>
          {subtitle && <p className="text-taupe-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-beige-50 rounded-lg shadow-soft overflow-hidden transition-all duration-300 hover:shadow-medium"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center"
                >
                  <h3 className="text-lg font-display font-semibold text-taupe-800">{faq.question}</h3>
                  <ChevronDown 
                    className={`text-rose-400 transition-transform duration-300 ${expandedFaq === faq.id ? 'transform rotate-180' : ''}`} 
                    size={20} 
                  />
                </button>
                
                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-taupe-600 border-t border-beige-200 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
