import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ArrowRight } from "lucide-react"; // Removed Globe, it's in Layout
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import img0031 from "../assets/images/home/IMG-20250604-WA0031.jpg";
import img0032 from "../assets/images/home/IMG-20250604-WA0032.jpg";
import img0033 from "../assets/images/home/IMG-20250604-WA0033.jpg";
import img0035 from "../assets/images/home/IMG-20250604-WA0035.jpg";
import img0036 from "../assets/images/home/IMG-20250604-WA0036.jpg";
import img0037 from "../assets/images/home/IMG-20250604-WA0037.jpg";
import img0026 from "../assets/images/home/IMG-20250604-WA0026.jpg";
import img0027 from "../assets/images/home/IMG-20250604-WA0027.jpg";
import img0028 from "../assets/images/home/IMG-20250604-WA0028.jpg";
import img0029 from "../assets/images/home/IMG-20250604-WA0029.jpg";
import img0030 from "../assets/images/home/IMG-20250604-WA0030.jpg";

// Base portfolio items with language-agnostic data
export const portfolioItemsData = [
  {
    id: "wedding",
    categoryKey: "wedding",
    image: img0031,
    folderPath: "חתונה",
  },
  {
    id: "bar-mitzvah",
    categoryKey: "bar-mitzvah",
    image: img0032,
    folderPath: "בר מצווה",
  },
  {
    id: "bat-mitzvah",
    categoryKey: "bat-mitzvah",
    image: img0033,
    folderPath: "בת מצווה",
  },
  {
    id: "circumcision",
    categoryKey: "circumcision",
    image: img0035,
    folderPath: "ברית",
  },
  {
    id: "tefilin",
    categoryKey: "tefilin",
    image: img0036,
    folderPath: "הנחת תפילין",
  },
  {
    id: "designs",
    categoryKey: "designs",
    image: img0037,
    folderPath: "עיצובים",
  },
  {
    id: "business",
    categoryKey: "business",
    image: img0026,
    folderPath: "אירועים עסקיים",
  },
  {
    id: "haircut",
    categoryKey: "haircut",
    image: img0027,
    folderPath: "חאלקה",
  },
  {
    id: "porpusal",
    categoryKey: "porpusal",
    image: img0028,
    folderPath: "הצעת נישואן",
  },
  {
    id: "engagement",
    categoryKey: "engagement",
    image: img0029,
    folderPath: "אירוסין",
  },
  {
    id: "torah",
    categoryKey: "torah",
    image: img0030,
    folderPath: "הכנסת ספר תורה",
  },
];

// Translations for the Portfolio page
const pageTranslations = {
  en: {
    title: "Our",
    titleHighlight: "Portfolio",
    subtitle:
      "Explore our diverse collection of photographic work across various genres and styles.",
    categories: {
      All: "All",
      wedding: "Wedding",
      "bar-mitzvah": "Bar Mitzvah",
      "bat-mitzvah": "Bat Mitzvah",
      circumcision: "Circumcision",
      tefilin: "Tefilin",
      designs: "Designs",
      business: "Business",
      haircut: "First Haircut",
      porpusal: "Proposal",
      engagement: "Engagement",
      torah: "Torah",
    },
    viewCollection: "View Collection",
    portfolioMeta: [
      {
        title: "Wedding",
        description: "Capturing your special day with elegance and style",
      },
      {
        title: "Bar Mitzvah",
        description: "Celebrating this important milestone in style",
      },
      {
        title: "Bat Mitzvah",
        description: "Documenting this significant celebration",
      },
      {
        title: "Circumcision Ceremony",
        description: "Preserving precious family moments",
      },
      {
        title: "Tefilin Ceremony",
        description: "Capturing spiritual moments with reverence",
      },
      {
        title: "Design Photography",
        description: "Showcasing artistic and creative compositions",
      },
      {
        title: "Business Events",
        description: "Professional coverage for corporate gatherings",
      },
      {
        title: "First Haircut",
        description: "Documenting this traditional celebration",
      },
      {
        title: "Proposal Photography",
        description: "Capturing the moment of a lifetime",
      },
      {
        title: "Engagement",
        description: "Preserving the joy of commitment",
      },
      {
        title: "Torah",
        description: "Documenting spiritual celebrations",
      },
    ],
  },
  he: {
    title: "תיק",
    titleHighlight: "העבודות שלנו",
    subtitle:
      "חקרו את האוסף המגוון שלנו של עבודות צילום בתחומים וסגנונות שונים.",
    categories: {
      All: "הכל",
      wedding: "חתונה",
      "bar-mitzvah": "בר מצווה",
      "bat-mitzvah": "בת מצווה",
      circumcision: "ברית מילה",
      tefilin: "תפילין",
      designs: "עיצובים",
      business: "אירועים עסקיים",
      haircut: "חלאקה",
      porpusal: "הצעות נישואין",
      engagement: "אירוסין",
      torah: "הכנסת ספר תורה",
    },
    viewCollection: "צפה באוסף",
    portfolioMeta: [
      {
        title: "חתונה",
        description: "תיעוד היום המיוחד שלכם באלגנטיות ובסטייל",
      },
      {
        title: "בר מצווה",
        description: "חגיגת אבן דרך משמעותית בסטייל",
      },
      {
        title: "בת מצווה",
        description: "תיעוד חגיגה משמעותית",
      },
      {
        title: "ברית מילה",
        description: "שימור רגעים יקרים במשפחה",
      },
      {
        title: "תפילין",
        description: "תיעוד רגעים רוחניים ביראת כבוד",
      },
      {
        title: "עיצוב",
        description: "הצגת קומפוזיציות אמנותיות ויצירתיות",
      },
      {
        title: "אירועים עסקיים",
        description: "כיסוי מקצועי למפגשים עסקיים",
      },
      {
        title: "חלאקה",
        description: "תיעוד חגיגה מסורתית",
      },
      {
        title: "הצעת נישואין",
        description: "תיעוד הרגע המרגש",
      },
      {
        title: "אירוסין",
        description: "שימור שמחת ההתחייבות",
      },
      {
        title: "הכנסת ספר תורה",
        description: "תיעוד חגיגות רוחניות",
      },
    ],
  },
};

export default function Portfolio({ lang = "en" }) {
  // Default lang if not passed
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("All"); // Store the key
  const [hoveredItem, setHoveredItem] = useState(null);
  const [autoScrollTo, setAutoScrollTo] = useState(null);
  const location = useLocation();

  const t = pageTranslations[lang];
  const isRTL = lang === "he";

  const categoryKeys = Object.keys(pageTranslations.en.categories); // Get keys from one lang

  const filteredItems = portfolioItemsData.filter(
    (item) =>
      selectedCategoryKey === "All" || item.categoryKey === selectedCategoryKey
  );

  // Auto-select collection if id is present in query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const collectionId = params.get("id");
    if (collectionId) {
      // Optionally, you could scroll to or highlight the collection
      setAutoScrollTo(collectionId);
    } else {
      setAutoScrollTo(null);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen py-20" dir={isRTL ? "rtl" : "ltr"}>
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
          <p className="text-lg opacity-80 max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`flex flex-wrap justify-center gap-4 mb-12 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
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
              } ${isRTL ? "flex-row-reverse" : ""}`}
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
              const isAutoScroll = autoScrollTo === item.id;
              const itemMeta = t.portfolioMeta[
                portfolioItemsData.findIndex((p) => p.id === item.id)
              ] || { title: item.id, description: "" };
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
                  ref={(el) => {
                    if (isAutoScroll && el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                >
                  <Link
                    to={
                      createPageUrl("Collection") +
                      "?id=" +
                      item.id +
                      "&lang=" +
                      lang
                    }
                  >
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
                      <p className="text-gray-300 mb-4">
                        {itemMeta.description}
                      </p>
                      <div
                        className={`flex items-center text-primary group-hover:text-white transition-colors ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        {!isRTL && (
                          <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        )}
                        <span>{t.viewCollection}</span>
                        {isRTL && (
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:-translate-x-1 transition-transform transform rotate-180" />
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
