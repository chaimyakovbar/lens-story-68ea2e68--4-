import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { portfolioItemsData } from "./Portfolio";
import { ImageList, ImageListItem } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for MUI
const StyledImageList = styled(ImageList)(({ theme }) => ({
  width: "100%",
  height: "auto",
  overflow: "hidden",
  "& .MuiImageListItem-root": {
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    "&:hover": {
      "& img": {
        transform: "scale(1.05)",
      },
      "& .overlay": {
        opacity: 1,
      },
    },
  },
  "& img": {
    transition: "transform 0.5s ease-in-out",
  },
}));

const ImageOverlay = styled("div")({
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
});

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

// Enhanced Sequential image loading component with better performance
const SequentialImage = ({
  src,
  alt,
  onClick,
  shouldLoad,
  onLoad,
  index = 0,
  loadingMethod = "sequential",
  intersectionOptions = {},
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(loadingMethod !== "intersection");
  const elementRef = useRef();

  // Intersection Observer for viewport-based loading
  const { entries, observe } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
    ...intersectionOptions,
  });

  // Handle intersection observer
  useEffect(() => {
    if (loadingMethod === "intersection" && elementRef.current) {
      observe(elementRef.current);
    }
  }, [observe, loadingMethod]);

  useEffect(() => {
    if (loadingMethod === "intersection") {
      const entry = entries.find((e) => e.target === elementRef.current);
      if (entry && entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    }
  }, [entries, isVisible, loadingMethod]);

  // Handle image loading
  useEffect(() => {
    if (!shouldLoad || !isVisible) return;

    const img = new Image();

    img.onload = () => {
      setImageLoaded(true);
      onLoad?.(); // Notify parent that this image has loaded
    };

    img.onerror = () => {
      setHasError(true);
      onLoad?.(); // Still notify parent to continue with next image
    };

    img.src = src;
  }, [shouldLoad, isVisible, src, onLoad]);

  // Placeholder component
  const Placeholder = ({ children }) => (
    <div
      ref={elementRef}
      style={{
        width: "100%",
        aspectRatio: "4/3",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
      }}
    >
      {children}
    </div>
  );

  if (!isVisible || (!shouldLoad && loadingMethod === "sequential")) {
    return (
      <Placeholder>
        <div className="animate-pulse w-8 h-8 bg-gray-300 rounded"></div>
      </Placeholder>
    );
  }

  if (hasError) {
    return (
      <Placeholder>
        <div style={{ color: "#dc2626", backgroundColor: "#fee2e2" }}>
          Failed to load
        </div>
      </Placeholder>
    );
  }

  if (!imageLoaded) {
    return (
      <Placeholder>
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
      </Placeholder>
    );
  }

  return (
    <motion.img
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: loadingMethod === "sequential" ? index * 0.1 : 0,
        ease: "easeOut",
      }}
      src={src}
      alt={alt}
      onClick={onClick}
      style={{ width: "100%", height: "auto" }}
    />
  );
};

// Loading configuration options
const LOADING_METHODS = {
  SEQUENTIAL: "sequential",
  INTERSECTION: "intersection",
  BATCH: "batch",
};

// Batch loading hook
const useBatchLoading = (items, batchSize = 5, delay = 1000) => {
  const [loadedBatches, setLoadedBatches] = useState(0);

  const loadNextBatch = useCallback(() => {
    setLoadedBatches((prev) =>
      Math.min(prev + 1, Math.ceil(items.length / batchSize))
    );
  }, [items.length, batchSize]);

  const shouldItemLoad = useCallback(
    (index) => {
      const batchIndex = Math.floor(index / batchSize);
      return batchIndex < loadedBatches;
    },
    [batchSize, loadedBatches]
  );

  useEffect(() => {
    if (loadedBatches === 0) {
      // Load first batch immediately
      setLoadedBatches(1);
      return;
    }

    if (loadedBatches < Math.ceil(items.length / batchSize)) {
      const timer = setTimeout(loadNextBatch, delay);
      return () => clearTimeout(timer);
    }
  }, [loadedBatches, items.length, batchSize, delay, loadNextBatch]);

  return {
    shouldItemLoad,
    loadedBatches,
    totalBatches: Math.ceil(items.length / batchSize),
  };
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

export default function Collection() {
  const [collection, setCollection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loadedImageIndex, setLoadedImageIndex] = useState(0);
  const [loadingMethod, setLoadingMethod] = useState(
    LOADING_METHODS.SEQUENTIAL
  );

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get("id");
  const lang = queryParams.get("lang") || "en";

  const t = pageTranslations[lang];
  const isRTL = lang === "he";

  // Batch loading hook
  const { shouldItemLoad, loadedBatches, totalBatches } = useBatchLoading(
    additionalImages,
    6, // Load 6 images per batch
    2000 // 2 second delay between batches
  );

  useEffect(() => {
    const foundCollection = portfolioItemsData.find(
      (item) => item.id === collectionId
    );

    if (!foundCollection) {
      navigate(createPageUrl("Portfolio"));
      return;
    }
    setCollection(foundCollection);

    // Dynamically import all images from the collection's folder
    const importImages = async () => {
      try {
        const imageContext = import.meta.glob("../assets/**/*.{jpg,jpeg,png}", {
          eager: true,
        });
        const folderImages = Object.entries(imageContext)
          .filter(([path]) => {
            return path.includes(foundCollection.folderPath);
          })
          .map(([path, module]) => {
            return module.default;
          });

        // Filter out the header image if it exists in the folder
        const filteredImages = folderImages.filter(
          (img) => img !== foundCollection.image
        );

        setAdditionalImages(filteredImages);
        setLoadedImageIndex(0); // Reset loading state
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    importImages();
  }, [collectionId, navigate]);

  // Handle sequential image loading
  const handleImageLoad = useCallback(() => {
    setLoadedImageIndex((prev) => prev + 1);
  }, []);

  // Determine if image should load based on method
  const shouldImageLoad = useCallback(
    (index) => {
      switch (loadingMethod) {
        case LOADING_METHODS.SEQUENTIAL:
          return loadedImageIndex >= index;
        case LOADING_METHODS.BATCH:
          return shouldItemLoad(index);
        case LOADING_METHODS.INTERSECTION:
          return true; // Intersection observer handles this internally
        default:
          return true;
      }
    },
    [loadingMethod, loadedImageIndex, shouldItemLoad]
  );

  if (!collection) return null;

  const collectionMetaIndex = portfolioItemsData.findIndex(
    (p) => p.id === collection.id
  );
  const collectionTranslatedMeta = t.portfolioMeta[collectionMetaIndex] || {
    title: collection.id,
    description: "",
  };

  const getProgressInfo = () => {
    switch (loadingMethod) {
      case LOADING_METHODS.SEQUENTIAL:
        return {
          current: loadedImageIndex,
          total: additionalImages.length,
          label: isRTL ? "טוען תמונות" : "Loading images",
        };
      case LOADING_METHODS.BATCH:
        return {
          current: loadedBatches,
          total: totalBatches,
          label: isRTL ? "טוען חבילות" : "Loading batches",
        };
      default:
        return null;
    }
  };

  const progressInfo = getProgressInfo();

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

        {/* Loading Method Selector */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg p-2 shadow-md">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setLoadingMethod(LOADING_METHODS.SEQUENTIAL);
                  setLoadedImageIndex(0);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  loadingMethod === LOADING_METHODS.SEQUENTIAL
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isRTL ? "רציף" : "Sequential"}
              </button>
              <button
                onClick={() => setLoadingMethod(LOADING_METHODS.BATCH)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  loadingMethod === LOADING_METHODS.BATCH
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isRTL ? "חבילות" : "Batch"}
              </button>
              <button
                onClick={() => setLoadingMethod(LOADING_METHODS.INTERSECTION)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  loadingMethod === LOADING_METHODS.INTERSECTION
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isRTL ? "גלילה" : "Viewport"}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {progressInfo && progressInfo.current < progressInfo.total && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 max-w-md mx-auto"
          >
            <div className="text-center mb-2">
              <div className="text-sm text-gray-600">
                {progressInfo.label} ({progressInfo.current}/
                {progressInfo.total})
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (progressInfo.current / progressInfo.total) * 100
                  }%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Header Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 relative"
        >
          {/* Header image content can go here if needed */}
        </motion.div>

        {/* Masonry Gallery with Enhanced Loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {isRTL ? "גלריית תמונות" : "Photo Gallery"}
          </h3>

          <StyledImageList variant="masonry" cols={3} gap={16}>
            {additionalImages.map((image, index) => (
              <ImageListItem
                key={index}
                onClick={
                  shouldImageLoad(index) &&
                  (loadingMethod === LOADING_METHODS.INTERSECTION ||
                    loadedImageIndex > index)
                    ? () => setSelectedImage(image)
                    : undefined
                }
                style={{
                  cursor:
                    shouldImageLoad(index) &&
                    (loadingMethod === LOADING_METHODS.INTERSECTION ||
                      loadedImageIndex > index)
                      ? "pointer"
                      : "default",
                }}
              >
                <SequentialImage
                  src={image}
                  alt={`${collectionTranslatedMeta.title} ${index + 1}`}
                  onClick={
                    shouldImageLoad(index) &&
                    (loadingMethod === LOADING_METHODS.INTERSECTION ||
                      loadedImageIndex > index)
                      ? () => setSelectedImage(image)
                      : undefined
                  }
                  shouldLoad={shouldImageLoad(index)}
                  onLoad={
                    loadingMethod === LOADING_METHODS.SEQUENTIAL
                      ? handleImageLoad
                      : undefined
                  }
                  index={index}
                  loadingMethod={loadingMethod}
                  intersectionOptions={{
                    threshold: 0.1,
                    rootMargin: "50px",
                  }}
                />
                {shouldImageLoad(index) &&
                  (loadingMethod === LOADING_METHODS.INTERSECTION ||
                    loadedImageIndex > index) && (
                    <ImageOverlay className="overlay">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                        <ArrowLeft
                          className={`h-5 w-5 text-white transform ${
                            isRTL ? "rotate-0" : "rotate-180"
                          }`}
                        />
                      </div>
                    </ImageOverlay>
                  )}
              </ImageListItem>
            ))}
          </StyledImageList>
        </motion.div>

        {/* Loading Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-6 bg-white rounded-lg p-4 shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {loadingMethod === LOADING_METHODS.SEQUENTIAL
                  ? loadedImageIndex
                  : loadingMethod === LOADING_METHODS.BATCH
                  ? loadedBatches * 6
                  : additionalImages.length}
              </div>
              <div className="text-sm text-gray-600">
                {isRTL ? "נטענו" : "Loaded"}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {additionalImages.length}
              </div>
              <div className="text-sm text-gray-600">
                {isRTL ? "סה״כ" : "Total"}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {loadingMethod === LOADING_METHODS.INTERSECTION
                  ? "Auto"
                  : loadingMethod === LOADING_METHODS.BATCH
                  ? `${6}/${2}s`
                  : "1x1"}
              </div>
              <div className="text-sm text-gray-600">
                {isRTL ? "שיטה" : "Method"}
              </div>
            </div>
          </div>
        </motion.div>

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

        {/* Method Information Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              {isRTL ? "מידע על שיטת הטעינה" : "Loading Method Info"}
            </h4>
            <div className="text-sm text-gray-700">
              {loadingMethod === LOADING_METHODS.SEQUENTIAL && (
                <p>
                  {isRTL
                    ? "טעינה רציפה: תמונות נטענות אחת אחרי השנייה בסדר קבוע. אידיאלי לשליטה בעומס השרת ויצירת אנימציות חלקות."
                    : "Sequential Loading: Images load one after another in a controlled sequence. Ideal for controlling server load and creating smooth loading animations."}
                </p>
              )}
              {loadingMethod === LOADING_METHODS.BATCH && (
                <p>
                  {isRTL
                    ? "טעינה בחבילות: תמונות נטענות בקבוצות של 6 עם השהיה של 2 שניות בין חבילות. מאזן בין ביצועים לחוויית משתמש."
                    : "Batch Loading: Images load in groups of 6 with a 2-second delay between batches. Balances performance with user experience."}
                </p>
              )}
              {loadingMethod === LOADING_METHODS.INTERSECTION && (
                <p>
                  {isRTL
                    ? "טעינה בגלילה: תמונות נטענות רק כשהן נכנסות לתחום הראייה. מושלם לגלריות גדולות וחיסכון ברוחב פס."
                    : "Viewport Loading: Images load only when they enter the viewport. Perfect for large galleries and bandwidth conservation."}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
