import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { portfolioItemsData } from "./Portfolio";
import Masonry from "react-masonry-css";
import { getGalleryImages } from "../utils/imageUrls";

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

// Light (WebP) photo for the grid; width/height reserve space so the layout doesn't jump
const FastImage = ({ image, alt, onClick, index }) => {
  return (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index, 8) * 0.05,
      }}
      src={image.src}
      width={image.width}
      height={image.height}
      alt={alt}
      onClick={onClick}
      className="w-full h-auto rounded-md cursor-pointer hover:scale-105 transition-transform duration-300"
      loading={index < 6 ? "eager" : "lazy"}
      decoding="async"
    />
  );
};

// Lightbox photo: shows the light version instantly, then swaps in the
// full-quality original once it has downloaded.
const LightboxImage = ({ image, onClick }) => {
  const [loadedOriginal, setLoadedOriginal] = useState(null);
  const [failedOriginal, setFailedOriginal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => !cancelled && setLoadedOriginal(image.original);
    img.onerror = () => !cancelled && setFailedOriginal(image.original);
    img.src = image.original;
    return () => {
      cancelled = true;
    };
  }, [image.original]);

  const showOriginal = loadedOriginal === image.original;

  return (
    <div className="relative" onClick={onClick}>
      <motion.img
        key={image.src}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        src={showOriginal ? image.original : image.src}
        width={image.width}
        height={image.height}
        alt="Selected"
        className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
      />
      {!showOriginal && failedOriginal !== image.original && (
        <div className="absolute top-3 left-3 w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
    </div>
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
  const [selectedIndex, setSelectedIndex] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get("id");
  const lang = queryParams.get("lang") || "en";

  const t = pageTranslations[lang];
  const isRTL = lang === "he";

  // Photo list ships with the site (src/data/gallery.json) - no server round-trip
  const additionalImages = useMemo(
    () => (collection ? getGalleryImages(collection.folderPath) : []),
    [collection]
  );
  const selectedImage =
    selectedIndex === null ? null : additionalImages[selectedIndex];
  const closeLightbox = () => setSelectedIndex(null);
  const showNext = (step) =>
    setSelectedIndex(
      (i) => (i + step + additionalImages.length) % additionalImages.length
    );

  // Keyboard: arrows move between photos, Escape closes
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext(isRTL ? -1 : 1);
      if (e.key === "ArrowLeft") showNext(isRTL ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, isRTL, additionalImages.length]);

  useEffect(() => {
    const foundCollection = portfolioItemsData.find(
      (item) => item.id === collectionId
    );

    if (!foundCollection) {
      navigate(createPageUrl("Portfolio"));
      return;
    }
    setCollection(foundCollection);
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

        {/* Masonry Gallery */}
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
                    key={image.src}
                    className="relative overflow-hidden rounded-md cursor-pointer group mb-2"
                    onClick={() => setSelectedIndex(index)}
                  >
                    <FastImage
                      image={image}
                      alt={`${collectionTranslatedMeta.title} ${index + 1}`}
                      onClick={() => setSelectedIndex(index)}
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

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <button
                className={`absolute top-4 text-white hover:text-primary transition-colors z-10 ${
                  isRTL ? "left-4" : "right-4"
                }`}
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <X className="h-8 w-8" />
              </button>

              <LightboxImage
                image={selectedImage}
                onClick={(e) => e.stopPropagation()}
              />

              {additionalImages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      showNext(isRTL ? 1 : -1);
                    }}
                    aria-label={isRTL ? "Next image" : "Previous image"}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      showNext(isRTL ? -1 : 1);
                    }}
                    aria-label={isRTL ? "Previous image" : "Next image"}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                  <div
                    dir="ltr"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm tabular-nums"
                  >
                    {selectedIndex + 1} / {additionalImages.length}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
