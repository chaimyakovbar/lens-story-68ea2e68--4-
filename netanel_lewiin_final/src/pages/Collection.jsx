import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { portfolioItemsData } from "./Portfolio";
import Masonry from "react-masonry-css";

// Add minimal CSS for react-masonry-css
const masonryStyles = `
.masonry-grid {
  display: flex;
  margin-left: -8px; /* gutter size offset */
  width: auto;
}
.masonry-grid_column {
  padding-left: 8px; /* gutter size */
  background-clip: padding-box;
}
.masonry-grid_column > div {
  margin-bottom: 8px;
}
`;
if (
  typeof document !== "undefined" &&
  !document.getElementById("masonry-css")
) {
  const style = document.createElement("style");
  style.id = "masonry-css";
  style.innerHTML = masonryStyles;
  document.head.appendChild(style);
}

// Simple CSS classes for the image grid
const styles = {
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    width: "100%",
    margin: "0 auto",
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (max-width: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },
  imageItem: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "0.5rem",
    cursor: "pointer",
    aspectRatio: "1",
    "&:hover img": {
      transform: "scale(1.05)",
    },
    "&:hover .overlay": {
      opacity: 1,
    },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease-in-out",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

// Hook for Intersection Observer
const useIntersectionObserver = (options = {}) => {
  const [entries, setEntries] = useState([]);
  const observer = useRef();

  const observe = useCallback(
    (element) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((observedEntries) => {
        setEntries(observedEntries);
      }, options);

      if (element) observer.current.observe(element);
    },
    [JSON.stringify(options)]
  );

  const unobserve = useCallback((element) => {
    if (observer.current && element) {
      observer.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return { entries, observe, unobserve };
};

// Simple fast image component
const FastImage = ({ src, alt, onClick, index }) => {
  return (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        delay: index * 0.05,
      }}
      src={src}
      alt={alt}
      onClick={onClick}
      className="w-full h-full object-cover rounded-md cursor-pointer hover:scale-105 transition-transform duration-300"
      loading="lazy"
    />
  );
};

// Translations for Collection page (same as original)
const pageTranslations = {
  en: {
    backToPortfolio: "Back to Portfolio",
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
        title: "First Haircut Ceremony",
        description: "Documenting this traditional celebration",
      },
      {
        title: "Proposal Photography",
        description: "Capturing the moment of a lifetime",
      },
      {
        title: "Engagement Ceremony",
        description: "Preserving the joy of commitment",
      },
      {
        title: "Torah Ceremony",
        description: "Documenting spiritual celebrations",
      },
    ],
  },
  he: {
    backToPortfolio: "חזרה לגלריה",
    portfolioMeta: [
      {
        title: "חתונה",
        description: "תיעוד היום המיוחד שלכם באלגנטיות ובסטייל",
      },
      { title: "בר מצווה", description: "חגיגת אבן דרך משמעותית בסטייל" },
      { title: "בת מצווה", description: "תיעוד חגיגה משמעותית" },
      { title: "ברית מילה", description: "שימור רגעים יקרים במשפחה" },
      { title: "הנחת תפילין", description: "תיעוד רגעים רוחניים ביראת כבוד" },
      {
        title: "עיצוב",
        description: "הצגת קומפוזיציות אמנותיות ויצירתיות",
      },
      { title: "אירועים עסקיים", description: "כיסוי מקצועי למפגשים עסקיים" },
      { title: "חלאקה", description: "תיעוד חגיגה מסורתית" },
      { title: "הצעת נישואין", description: "תיעוד הרגע המרגש" },
      { title: "אירוסין", description: "שימור שמחת ההתחייבות" },
      { title: "הכנסת ספר תורה", description: "תיעוד חגיגות רוחניות" },
    ],
  },
};

// Add this function before the Collection component
const calculateImageSize = (image, index, totalImages) => {
  // Get image dimensions
  const img = new Image();
  img.src = image;

  // Determine base size based on image orientation
  const isPortrait = img.height > img.width;
  const isLandscape = img.width > img.height;

  // Calculate size class based on image orientation and position
  if (isPortrait) {
    return "row-span-2"; // Tall images take 2 rows
  } else if (isLandscape) {
    return index % 3 === 0 ? "col-span-2" : "col-span-1"; // Every 3rd landscape image is wider
  }
  return "col-span-1"; // Square images take 1 column
};

export default function Collection() {
  const [collection, setCollection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get("id");
  const lang = queryParams.get("lang") || "en";

  const t = pageTranslations[lang];
  const isRTL = lang === "he";

  // Function to fetch images from S3 dynamically
  const fetchCollectionImages = async (folderPath) => {
    try {
      setIsLoadingImages(true);

      // Use environment variable for API endpoint with production fallback
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        "https://lens-story-68ea2e68-4.onrender.com";
      console.log("Using API endpoint:", API_BASE_URL);

      const response = await fetch(`${API_BASE_URL}/api/images/${folderPath}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.images) {
        console.log(`Loaded ${data.images.length} images for ${folderPath}`);
        return data.images.map((img) => img.url);
      } else {
        console.error("Failed to fetch images:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching collection images:", error);
      return [];
    } finally {
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    const foundCollection = portfolioItemsData.find(
      (item) => item.id === collectionId
    );

    if (!foundCollection) {
      navigate(createPageUrl("Portfolio"));
      return;
    }
    setCollection(foundCollection);

    // Fetch images dynamically from S3
    const loadImages = async () => {
      const collectionImages = await fetchCollectionImages(
        foundCollection.folderPath
      );

      // Filter out the header image if it exists in the collection
      const filteredImages = collectionImages.filter(
        (img) => img !== foundCollection.image
      );

      setAdditionalImages(filteredImages);
    };

    loadImages();
  }, [collectionId, navigate]);

  if (!collection) return null;

  const collectionMetaIndex = portfolioItemsData.findIndex(
    (p) => p.id === collection.id
  );
  const collectionTranslatedMeta = t.portfolioMeta[collectionMetaIndex] || {
    title: collection.id,
    description: "",
  };

  return (
    <div className="min-h-screen py-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link
            to={createPageUrl("Portfolio")}
            className={`inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeft
              className={`h-4 w-4 ${
                isRTL ? "ml-2 transform rotate-180" : "mr-2"
              }`}
            />
            {t.backToPortfolio}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {collectionTranslatedMeta.title}
            </h1>
            <p className="text-lg opacity-80">
              {collectionTranslatedMeta.description}
            </p>
          </motion.div>
        </div>

        {/* Header Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 relative"
        >
          {/* Header image content can go here if needed */}
        </motion.div>

        {/* Loading State for Images */}
        {isLoadingImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              {isRTL ? "טוען תמונות מהשרת..." : "Loading images from server..."}
            </p>
          </motion.div>
        )}

        {/* Masonry Gallery with Enhanced Loading */}
        {!isLoadingImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            {/* <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {isRTL ? "גלריית תמונות" : "Photo Gallery"}
            </h3> */}

            {/* Masonry breakpoints */}
            {/**
             * 3 columns for >= 1024px
             * 2 columns for >= 640px
             * 1 column for < 640px
             */}
            <Masonry
              breakpointCols={{
                default: 3,
                1024: 2,
                640: 1,
              }}
              className="masonry-grid"
              columnClassName="masonry-grid_column"
            >
              {additionalImages.map((image, index) => {
                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-md cursor-pointer group mb-2"
                    onClick={() => setSelectedImage(image)}
                  >
                    <FastImage
                      src={image}
                      alt={`${collectionTranslatedMeta.title} ${index + 1}`}
                      onClick={() => setSelectedImage(image)}
                      index={index}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                        <ArrowLeft
                          className={`h-5 w-5 text-white transform ${
                            isRTL ? "rotate-0" : "rotate-180"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </Masonry>
          </motion.div>
        )}

        {/* Loading Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        ></motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className={`absolute top-4 text-white hover:text-primary transition-colors z-10 ${
                  isRTL ? "left-4" : "right-4"
                }`}
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
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation dots for lightbox */}
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {additionalImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      selectedImage === image
                        ? "bg-primary"
                        : "bg-white/50 hover:bg-white/75"
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
