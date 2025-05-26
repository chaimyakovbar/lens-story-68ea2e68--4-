import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ArrowRight } from "lucide-react"; // Removed Globe, it's in Layout
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Base portfolio items with language-agnostic data
export const portfolioItemsData = [ // Renamed to avoid conflict with component name
  {
    id: "desert-wedding",
    categoryKey: "Weddings", // Use a key for category lookup
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    additionalImages: [ /* ... */ ]
  },
  {
    id: "fashion-week",
    categoryKey: "Fashion",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    additionalImages: [ /* ... */ ]
  },
  {
    id: "mountain-vista",
    categoryKey: "Nature",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    additionalImages: [ /* ... */ ]
  },
  {
    id: "corporate-event",
    categoryKey: "Events",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    additionalImages: [ /* ... */ ]
  },
];

// Translations for the Portfolio page
const pageTranslations = {
  en: {
    title: "Our",
    titleHighlight: "Portfolio",
    subtitle: "Explore our diverse collection of photographic work across various genres and styles.",
    categories: {
      All: "All",
      Weddings: "Weddings",
      Events: "Events",
      Fashion: "Fashion",
      Nature: "Nature"
    },
    viewCollection: "View Collection",
    portfolioMeta: [ // Array of translated metadata, matching portfolioItemsData order
      { title: "Desert Wedding", description: "An intimate celebration under the stars" },
      { title: "Fashion Week", description: "High-end fashion photography from the runway" },
      { title: "Mountain Vista", description: "Breathtaking landscapes from mountain peaks" },
      { title: "Corporate Event", description: "Professional coverage of business gatherings" }
    ]
  },
  he: {
    title: "תיק",
    titleHighlight: "העבודות שלנו",
    subtitle: "חקרו את האוסף המגוון שלנו של עבודות צילום בתחומים וסגנונות שונים.",
    categories: {
      All: "הכל",
      Weddings: "חתונות",
      Events: "אירועים",
      Fashion: "אופנה",
      Nature: "טבע"
    },
    viewCollection: "צפה באוסף",
    portfolioMeta: [
      { title: "חתונה במדבר", description: "חגיגה אינטימית תחת הכוכבים" },
      { title: "שבוע האופנה", description: "צילומי אופנה יוקרתיים מהמסלול" },
      { title: "נוף הרים", description: "נופים עוצרי נשימה מפסגות הרים" },
      { title: "אירוע עסקי", description: "כיסוי מקצועי של כנסים עסקיים" }
    ]
  }
};


export default function Portfolio({ lang = 'en' }) { // Default lang if not passed
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("All"); // Store the key
  const [hoveredItem, setHoveredItem] = useState(null);

  const t = pageTranslations[lang];
  const isRTL = lang === 'he';

  const categoryKeys = Object.keys(pageTranslations.en.categories); // Get keys from one lang

  const filteredItems = portfolioItemsData.filter(
    item => selectedCategoryKey === "All" || item.categoryKey === selectedCategoryKey
  );

  return (
    <div className="min-h-screen py-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t.title} <span className="text-primary">{t.titleHighlight}</span>
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`flex flex-wrap justify-center gap-4 mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {categoryKeys.map((key, index) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategoryKey(key)}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
                selectedCategoryKey === key
                  ? "bg-primary text-white"
                  : "bg-accent"
              } ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {key === "All" && <Filter className="h-4 w-4" />}
              <span>{t.categories[key]}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const itemMeta = t.portfolioMeta[portfolioItemsData.findIndex(p => p.id === item.id)] || { title: item.id, description: ''};
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-square group"
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link to={createPageUrl("Collection") + "?id=" + item.id + "&lang=" + lang}>
                    <img
                      src={item.image}
                      alt={itemMeta.title}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-black/60 rounded-lg p-6 flex flex-col justify-end"
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {itemMeta.title}
                      </h3>
                      <p className="text-gray-300 mb-4">{itemMeta.description}</p>
                      <div className={`flex items-center text-primary group-hover:text-white transition-colors ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}>
                        {!isRTL && <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />}
                        <span>{t.viewCollection}</span>
                        {isRTL && <ArrowRight className="h-4 w-4 ml-2 group-hover:-translate-x-1 transition-transform transform rotate-180" />}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}