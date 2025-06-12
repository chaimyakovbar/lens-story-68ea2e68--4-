import { useState, useEffect } from "react";
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

// Sequential image loading component
const SequentialImage = ({ src, alt, onClick, shouldLoad, onLoad }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!shouldLoad) return;

    const img = new Image();
    
    img.onload = () => {
      setImageLoaded(true);
      onLoad(); // Notify parent that this image has loaded
    };
    
    img.onerror = () => {
      setHasError(true);
      onLoad(); // Still notify parent to continue with next image
    };
    
    img.src = src;
  }, [shouldLoad, src, onLoad]);

  if (!shouldLoad) {
    // Show placeholder while waiting to load
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "4/3", // Default aspect ratio for placeholder
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <div className="animate-pulse w-8 h-8 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "4/3",
          backgroundColor: "#fee2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          color: "#dc2626",
        }}
      >
        Failed to load
      </div>
    );
  }

  if (!imageLoaded) {
    // Show loading state
    return (
      <div
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
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.img
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      src={src}
      alt={alt}
      onClick={onClick}
      style={{ width: "100%", height: "auto" }}
    />
  );
};

// Translations for Collection page
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
  const [loadedImageIndex, setLoadedImageIndex] = useState(0); // Track which images should load
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get("id");
  const lang = queryParams.get("lang") || "en";

  const t = pageTranslations[lang];
  const isRTL = lang === "he";

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
  const handleImageLoad = () => {
    setLoadedImageIndex(prev => prev + 1);
  };

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
        ></motion.div>

        {/* Masonry Gallery with Sequential Loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {isRTL ? "גלריית תמונות" : "Photo Gallery"}
          </h3>
          
          {/* Loading Progress Indicator */}
          {loadedImageIndex < additionalImages.length && (
            <div className="mb-6 text-center">
              <div className="text-sm text-gray-600 mb-2">
                {isRTL ? "טוען תמונות" : "Loading images"} ({loadedImageIndex + 1}/{additionalImages.length})
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${((loadedImageIndex + 1) / additionalImages.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <StyledImageList variant="masonry" cols={3} gap={16}>
            {additionalImages.map((image, index) => (
              <ImageListItem
                key={index}
                onClick={loadedImageIndex > index ? () => setSelectedImage(image) : undefined}
                style={{
                  cursor: loadedImageIndex > index ? "pointer" : "default",
                }}
              >
                <SequentialImage
                  src={image}
                  alt={`${collectionTranslatedMeta.title} ${index + 1}`}
                  onClick={loadedImageIndex > index ? () => setSelectedImage(image) : undefined}
                  shouldLoad={loadedImageIndex >= index}
                  onLoad={handleImageLoad}
                />
                {loadedImageIndex > index && (
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
                className={`absolute top-4 text-white hover:text-primary transition-colors ${
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