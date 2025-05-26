import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Quote,
  Camera,
  ChevronsRight,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom"; // Import Link
import { createPageUrl } from "@/utils"; // Import createPageUrl
import PropTypes from "prop-types";

const baseCollectionsData = [
  {
    id: "weddings",
    imageKey: "weddings_0",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // More images for full collection
    ],
  },
  {
    id: "corporate",
    imageKey: "corporate_0",
    images: [
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: "concerts",
    imageKey: "concerts_0",
    images: [
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505058707965-09a4469a87e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: "fashion",
    imageKey: "fashion_0",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
  },
];

const pageTranslations = {
  en: {
    heroTitleLine1: "CAPTURING MOMENTS",
    heroTitleLine2: "THAT LAST FOREVER",
    heroTitleHighlight: "THAT LAST FOREVER",
    heroSubtitle:
      "Premium event photography that tells your story with artistic flair and technical excellence",
    exploreWork: "Explore Work",
    bioSectionTag: "About The Artist",
    bioTitleLine1: "Capturing Life's",
    bioTitleHighlight: "Extraordinary Moments",
    bioParagraph1:
      "With over a decade of experience photographing events across the globe, I bring a unique perspective and artistic vision to every shoot. My passion lies in finding those fleeting moments that tell a powerful story.",
    bioParagraph2:
      "My approach blends photojournalistic candids with fine art composition, resulting in images that are both authentic and visually stunning. I believe that great event photography should transport you back to the emotions of that day.",
    bioParagraph3:
      "Whether it's the nervous anticipation before a wedding ceremony, the energy of a packed concert venue, or the sophisticated atmosphere of a corporate gala, I'm dedicated to creating visual narratives that stand the test of time.",
    photographerName: "Alex Morgan, Lead Photographer",
    quotes: [
      "Photography is the story I fail to put into words.",
      "When words become unclear, I shall focus with photographs.",
      "What I like about photographs is that they capture a moment that's gone forever.",
      "A photograph is a secret about a secret. The more it tells you, the less you know.",
      "Photography is truth. And cinema is truth 24 times per second.",
    ],
    quoteInstruction: "Click on a collection below to change the quote",
    collectionsTitle: "Photography Collections",
    collectionsSubtitle:
      "Explore different genres and events through the lens of artistic expression",
    collectionItems: {
      weddings: {
        title: "Weddings",
        description: "Capturing love stories in their purest form",
      },
      corporate: {
        title: "Corporate",
        description: "Professional imagery for business events",
      },
      concerts: {
        title: "Concerts",
        description: "Electrifying moments from live performances",
      },
      fashion: {
        title: "Fashion",
        description: "Editorial and runway photography",
      },
    },
    viewCollection: "View collection",
    viewFullCollectionButton: "View Full Collection", // New translation
    galleryTitleSuffix: "Gallery",
    ctaTitle: "Ready to Capture Your Next Event?",
    ctaSubtitle:
      "Let's create something extraordinary together. From intimate gatherings to grand celebrations, I'm here to document your special moments with style and creativity.",
    ctaButton: "Get in Touch",
    footerName: "ALEX MORGAN",
    footerTagline: "Event Photography Specialist",
    footerCopyright: "© {year} All Rights Reserved",
  },
  he: {
    heroTitleLine1: "לוכדים רגעים",
    heroTitleLine2: "שנשארים לנצח",
    heroTitleHighlight: "שנשארים לנצח",
    heroSubtitle:
      "צילום אירועים פרימיום המספר את סיפורכם בכישרון אמנותי ומצוינות טכנית",
    exploreWork: "גלה עוד",
    bioSectionTag: "על האמן",
    bioTitleLine1: "לוכדים את הרגעים",
    bioTitleHighlight: "הבלתי רגילים של החיים",
    bioParagraph1:
      "עם ניסיון של למעלה מעשור בצילום אירועים ברחבי העולם, אני מביא פרספקטיבה ייחודית וחזון אמנותי לכל צילום. התשוקה שלי היא למצוא את אותם רגעים חולפים המספרים סיפור עוצמתי.",
    bioParagraph2:
      "הגישה שלי משלבת צילום עיתונאי אותנטי עם קומפוזיציה אמנותית, מה שמביא לתמונות שהן גם אמיתיות וגם מרהיבות חזותית. אני מאמין שצילום אירועים נהדר צריך להחזיר אותך לרגשות של אותו יום.",
    bioParagraph3:
      "בין אם זו הציפייה המתוחה לפני טקס חתונה, האנרגיה של אולם קונצרטים מלא, או האווירה המתוחכמת של גאלה תאגידית, אני מחויב ליצירת נרטיבים ויזואליים העומדים במבחן הזמן.",
    photographerName: "אלכס מורגן, צלם ראשי",
    quotes: [
      "צילום הוא הסיפור שאני לא מצליח לבטא במילים.",
      "כשהמילים נעשות לא ברורות, אתמקד בצילומים.",
      "מה שאני אוהב בצילומים זה שהם לוכדים רגע שנעלם לנצח.",
      "צילום הוא סוד על סוד. ככל שהוא מספר לך יותר, אתה יודע פחות.",
      "צילום הוא אמת. וקולנוע הוא אמת 24 פעמים בשנייה.",
    ],
    quoteInstruction: "לחץ על אוסף למטה כדי לשנות את הציטוט",
    collectionsTitle: "אוספי צילום",
    collectionsSubtitle: "חקרו ז'אנרים ואירועים שונים דרך עדשת הביטוי האמנותי",
    collectionItems: {
      weddings: {
        title: "חתונות",
        description: "לוכדים סיפורי אהבה בצורתם הטהורה ביותר",
      },
      corporate: {
        title: "אירועים עסקיים",
        description: "דימויים מקצועיים לאירועים עסקיים",
      },
      concerts: { title: "הופעות", description: "רגעים מחשמלים מהופעות חיות" },
      fashion: { title: "אופנה", description: "צילומי אדיטוריאל ומסלול" },
    },
    viewCollection: "צפה באוסף",
    viewFullCollectionButton: "צפה בכל האוסף", // New translation
    galleryTitleSuffix: "גלריה",
    ctaTitle: "מוכנים ללכוד את האירוע הבא שלכם?",
    ctaSubtitle:
      "בואו ניצור משהו יוצא דופן ביחד. ממפגשים אינטימיים ועד חגיגות מפוארות, אני כאן כדי לתעד את הרגעים המיוחדים שלכם בסטייל ויצירתיות.",
    ctaButton: "צור קשר",
    footerName: "אלכס מורגן",
    footerTagline: "מומחה צילום אירועים",
    footerCopyright: "© {year} כל הזכויות שמורות",
  },
};

export default function Home({ lang }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allHeroImages, setAllHeroImages] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const [currentQuote, setCurrentQuote] = useState("");
  const [isQuoteChanging, setIsQuoteChanging] = useState(false);

  const collectionsSectionRef = useRef(null); // Ref for the collections section wrapper
  const expandedCollectionRef = useRef(null); // Ref for the expanded collection content

  const t = pageTranslations[lang];
  const isRTL = lang === "he";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  useEffect(() => {
    const images = baseCollectionsData.map(
      (collection) => collection.images[0]
    );
    setAllHeroImages(images);
  }, []);

  useEffect(() => {
    if (t && t.quotes && t.quotes.length > 0) {
      setCurrentQuote(t.quotes[0]);
    }
  }, [t]);

  useEffect(() => {
    if (allHeroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === allHeroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [allHeroImages]);

  const handleCollectionClick = (collectionData) => {
    const previouslyActive = activeCollection?.id === collectionData.id;
    setActiveCollection(previouslyActive ? null : collectionData);

    setIsQuoteChanging(true);
    setTimeout(() => {
      const randomQuote = t.quotes[Math.floor(Math.random() * t.quotes.length)];
      setCurrentQuote(randomQuote);
      setIsQuoteChanging(false);
    }, 300);

    // Smooth scroll to the expanded collection or top of collections section
    setTimeout(() => {
      if (!previouslyActive && expandedCollectionRef.current) {
        expandedCollectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (previouslyActive && collectionsSectionRef.current) {
        // Optionally scroll to top of collection list if one was closed
        // collectionsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Delay to allow layout to update
  };

  return (
    <div className="relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <div
              className="absolute inset-0 bg-black/30 z-10"
              style={{ backdropFilter: "blur(3px)" }}
            />
            {allHeroImages.length > 0 && (
              <img
                src={allHeroImages[currentImageIndex]}
                alt="Photography work" // Consider translating alt text if important
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight">
              {t.heroTitleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                {t.heroTitleHighlight}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-12"
          >
            <div className="flex flex-col items-center">
              <span className="text-sm uppercase tracking-widest mb-2">
                {t.exploreWork}
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronsRight className="h-6 w-6 rotate-90" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photographer Bio Section */}
      <section className="relative py-24 bg-white text-black dark:bg-gray-900 dark:text-white overflow-hidden">
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl dark:opacity-5" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-pink-500 rounded-full opacity-10 blur-3xl dark:opacity-5" />

        <div className="container mx-auto px-4">
          <div
            className={`flex flex-col md:items-center gap-12 ${
              isRTL ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-yellow-500/20 dark:from-pink-500/10 dark:to-yellow-500/10 rounded-2xl transform ${
                    isRTL ? "-rotate-3" : "rotate-3"
                  }`}
                />
                <img
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt={t.photographerName}
                  className="w-full h-[500px] object-cover rounded-2xl shadow-xl relative z-10"
                />
              </motion.div>
            </div>

            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={isRTL ? "text-right" : "text-left"}
              >
                <span className="block text-pink-600 font-medium tracking-widest uppercase text-sm mb-3">
                  {t.bioSectionTag}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-black dark:text-white">
                  {t.bioTitleLine1}
                  <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                    {t.bioTitleHighlight}
                  </span>
                </h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-4 text-lg leading-relaxed">
                  <p>{t.bioParagraph1}</p>
                  <p>{t.bioParagraph2}</p>
                  <p>{t.bioParagraph3}</p>
                </div>

                <div
                  className={`mt-8 flex items-center ${
                    isRTL
                      ? "justify-end space-x-reverse space-x-3"
                      : "justify-start space-x-3"
                  }`}
                >
                  <Camera className="h-5 w-5 text-pink-600" />
                  <span className="text-lg font-medium text-black dark:text-white">
                    {t.photographerName}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-yellow-500 to-red-500" />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Quote className="h-12 w-12 mx-auto mb-8 text-pink-500 opacity-50" />
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-4xl font-medium italic leading-relaxed max-w-4xl mx-auto mb-8 tracking-tight text-white"
              >
                {currentQuote}
              </motion.blockquote>
            </AnimatePresence>
            <p className="text-sm uppercase tracking-widest text-gray-400">
              {t.quoteInstruction}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Section */}
      <section
        ref={collectionsSectionRef}
        id="collections-section"
        className="py-24 bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
                {t.collectionsTitle}
              </span>
            </motion.h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              {t.collectionsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
            {baseCollectionsData.map((collection, index) => {
              const translatedCollection = t.collectionItems[collection.id] || {
                title: collection.id,
                description: "",
              };
              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => handleCollectionClick(collection)}
                  className={`relative overflow-hidden group rounded-xl cursor-pointer transition-all duration-300 h-64 md:h-80 transform ${
                    index % 2 === 0 ? "md:translate-y-12" : ""
                  } ${
                    activeCollection?.id === collection.id
                      ? "ring-2 ring-pink-500 scale-[1.02]"
                      : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
                  <img
                    src={collection.images[0]}
                    alt={translatedCollection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 z-20 flex flex-col p-6 ${
                      isRTL
                        ? "items-end text-right justify-end"
                        : "items-start text-left justify-end"
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {translatedCollection.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {translatedCollection.description}
                    </p>
                    <div
                      className={`flex items-center text-pink-400 font-medium ${
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
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Expanded Collection Gallery Preview */}
          <AnimatePresence>
            {activeCollection && (
              <motion.div
                ref={expandedCollectionRef}
                id={`collection-${activeCollection.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <div
                  className={`pt-6 pb-12 ${isRTL ? "text-right" : "text-left"}`}
                >
                  <h3 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                    {(t.collectionItems[activeCollection.id]?.title ||
                      activeCollection.id) +
                      " " +
                      t.galleryTitleSuffix}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {activeCollection.images.slice(0, 3).map(
                      (
                        image,
                        i // Show first 3 images as preview
                      ) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative h-64 md:h-80 overflow-hidden rounded-lg transform transition-all hover:scale-[1.02] duration-300"
                        >
                          <img
                            src={image}
                            alt={`${
                              t.collectionItems[activeCollection.id]?.title ||
                              activeCollection.id
                            } ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      )
                    )}
                  </div>
                  <div className={`mt-8 ${isRTL ? "text-left" : "text-right"}`}>
                    <Link
                      to={createPageUrl(
                        `Collection?id=${activeCollection.id}&lang=${lang}`
                      )}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 bg-primary text-white rounded-full flex items-center gap-2 ${
                          isRTL ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        <span>{t.viewFullCollectionButton}</span>
                        {isRTL ? (
                          <ArrowLeft className="h-4 w-4" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-white text-black dark:bg-gray-900 dark:text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Logic to split CTA title for styling */}
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-black dark:text-white">
              {t.ctaTitle.includes(
                pageTranslations.en.ctaTitle.split(" ")[2]
              ) ? (
                <>
                  {
                    t.ctaTitle.split(
                      pageTranslations[lang].ctaTitle.split(" ")[2]
                    )[0]
                  }
                  <span className="text-pink-600">
                    {pageTranslations[lang].ctaTitle.split(" ")[2]}
                  </span>
                  {
                    t.ctaTitle.split(
                      pageTranslations[lang].ctaTitle.split(" ")[2]
                    )[1]
                  }
                </>
              ) : (
                t.ctaTitle
              )}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              {t.ctaSubtitle}
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg">
              {t.ctaButton}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div
            className={`flex flex-col md:justify-between md:items-center ${
              isRTL ? "md:flex-row-reverse text-right" : "md:flex-row text-left"
            }`}
          >
            <div
              className={`mb-6 md:mb-0 ${
                isRTL ? "md:text-right" : "md:text-left"
              }`}
            >
              <h2 className="text-2xl font-bold text-white">{t.footerName}</h2>
              <p className="text-gray-400">{t.footerTagline}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t.footerCopyright.replace("{year}", new Date().getFullYear())}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

Home.propTypes = {
  lang: PropTypes.string.isRequired,
};
