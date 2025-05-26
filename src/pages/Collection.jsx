import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react"; // Removed ArrowRight as it's handled by RTL logic
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { createPageUrl } from "@/utils";
import { portfolioItemsData } from "./Portfolio"; // Using the base data

// Translations for Collection page (can be expanded)
const pageTranslations = {
  en: {
    backToPortfolio: "Back to Portfolio",
    // Collection title and description will come from portfolioItemsData + portfolioTranslations
  },
  he: {
    backToPortfolio: "חזרה לתיק העבודות",
  }
};

// Need to access Portfolio's translations for item titles/descriptions
const portfolioPageTranslations = { // Duplicating relevant part for Collection page context
  en: {
    portfolioMeta: [ 
      { title: "Desert Wedding", description: "An intimate celebration under the stars" },
      { title: "Fashion Week", description: "High-end fashion photography from the runway" },
      { title: "Mountain Vista", description: "Breathtaking landscapes from mountain peaks" },
      { title: "Corporate Event", description: "Professional coverage of business gatherings" }
    ]
  },
  he: {
    portfolioMeta: [
      { title: "חתונה במדבר", description: "חגיגה אינטימית תחת הכוכבים" },
      { title: "שבוע האופנה", description: "צילומי אופנה יוקרתיים מהמסלול" },
      { title: "נוף הרים", description: "נופים עוצרי נשימה מפסגות הרים" },
      { title: "אירוע עסקי", description: "כיסוי מקצועי של כנסים עסקיים" }
    ]
  }
};


export default function Collection() {
  const [collection, setCollection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // For accessing query params

  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get('id');
  const lang = queryParams.get('lang') || 'en'; // Get lang from query param or default

  const t = pageTranslations[lang];
  const currentPortfolioT = portfolioPageTranslations[lang];
  const isRTL = lang === 'he';

  useEffect(() => {
    const foundCollection = portfolioItemsData.find(item => item.id === collectionId);
    
    if (!foundCollection) {
      navigate(createPageUrl("Portfolio")); // Navigate to portfolio if not found
      return;
    }
    setCollection(foundCollection);
  }, [collectionId, navigate]);

  if (!collection) return null;

  const allImages = [collection.image, ...(collection.additionalImages || [])];
  const collectionMetaIndex = portfolioItemsData.findIndex(p => p.id === collection.id);
  const collectionTranslatedMeta = currentPortfolioT.portfolioMeta[collectionMetaIndex] || { title: collection.id, description: '' };


  return (
    <div className="min-h-screen py-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to={createPageUrl("Portfolio")}
            className={`inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 transform rotate-180' : 'mr-2'}`} />
            {t.backToPortfolio}
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{collectionTranslatedMeta.title}</h1>
            <p className="text-lg opacity-80">{collectionTranslatedMeta.description}</p>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {allImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedImage(image)}
              className="cursor-pointer group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={image}
                alt={`${collectionTranslatedMeta.title} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                {/* Simple indicator, can be an icon */}
                 <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                   <ArrowLeft className={`h-5 w-5 text-white transform ${isRTL ? 'rotate-0' : 'rotate-180' }`}/>
                 </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" // Increased z-index
              onClick={() => setSelectedImage(null)}
            >
              <button
                className={`absolute top-4 text-white hover:text-primary transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
                onClick={() => setSelectedImage(null)}
                aria-label="Close lightbox"
              >
                <X className="h-8 w-8" />
              </button>
              
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={selectedImage}
                alt="Selected"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
              />

              {/* Navigation dots for lightbox */}
              <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      selectedImage === image ? "bg-primary" : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}