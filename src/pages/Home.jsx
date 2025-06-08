import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Quote, Camera, ChevronsRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import faceAboutImg from "../assets/images/face_about.jpg";
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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import AccessibilityMenu from "../components/AccessibilityMenu";

const baseCollectionsData = [
  { id: "wedding", imageKey: "wedding", images: [img0031] },
  { id: "bar-mitzvah", imageKey: "bar-mitzvah", images: [img0032] },
  { id: "bat-mitzvah", imageKey: "bat-mitzvah", images: [img0033] },
  { id: "circumcision", imageKey: "circumcision", images: [img0035] },
  { id: "tefilin", imageKey: "tefilin", images: [img0036] },
  { id: "designs", imageKey: "designs", images: [img0037] },
  { id: "business", imageKey: "business", images: [img0026] },
  { id: "haircut", imageKey: "haircut", images: [img0027] },
  { id: "porpusal", imageKey: "porpusal", images: [img0028] },
  { id: "engagement", imageKey: "engagement", images: [img0029] },
  { id: "torah", imageKey: "torah", images: [img0030] },
];

const pageTranslations = {
  en: {
    heroTitleLine1: "CAPTURING MOMENTS",
    heroTitleLine2: "THAT LAST FOREVER",
    heroTitleHighlight: "THAT LAST FOREVER",
    heroSubtitle:
      "Premium event photography that tells your story with artistic flair and technical excellence",
    exploreWork: "Explore Work",
    bioTitleLine1: "Capturing Life's",
    bioTitleHighlight: "Extraordinary Moments",
    bioParagraph1:
      "Hello! I'm Netanel, a professional photographer who lives and breathes the unique world of photography, with a deep passion for capturing rare moments and emotions that aren't always easy to put into words. I believe that photography is much more than a beautiful image – it's a whole story, a collection of experiences and emotions that turn into unforgettable moments.",
    bioParagraph2:
      "My journey into photography began from a love of exploration and discovery, driven by curiosity about the world around me and the small moments that make it up. Over the years, I've come to understand that every photo is a small dialogue between me and what I see through the lens – a dialogue based on trust, connection, and respect for the moment.",
    bioParagraph3:
      "For me, every photo session is unique and personally tailored to your dreams and wishes. My goal is to create images that tell your story – images you can look at and relive the feelings, colors, and scents of those magical moments.",
    bioParagraph4:
      "I'm here to accompany you and create meaningful experiences together – whether it's a big, emotional event, an intimate family shoot, a personal portrait that reflects your personality, or any moment you wish to capture and preserve. Together, we'll do it in a relaxed and pleasant atmosphere, with great sensitivity and attention to the small details that turn every photo into a piece of art.",
    bioParagraph5:
      "I invite you to join me on a journey where we'll build memories that will stay with you forever – let's capture your story, your moments, your life.",
    photographerName: "Netanel, Your Photographer",
    quotes: [
      "Photography is the story I fail to put into words.",
      "When words become unclear, I shall focus with photographs.",
      "What I like about photographs is that they capture a moment that's gone forever.",
      "A photograph is a secret about a secret. The more it tells you, the less you know.",
      "Photography is truth. And cinema is truth 24 times per second.",
    ],
    collectionsTitle: "Photography Collections",
    collectionsSubtitle:
      "Explore different genres and events through the lens of artistic expression",
    collectionItems: {
      wedding: { title: "Wedding" },
      "bar-mitzvah": { title: "Bar Mitzvah" },
      "bat-mitzvah": { title: "Bat Mitzvah" },
      circumcision: { title: "Circumcision" },
      tefilin: { title: "Tefilin" },
      business: { title: "Business" },
      haircut: { title: "First Haircut" },
      porpusal: { title: "Proposal" },
      engagement: { title: "Engagement" },
      torah: { title: "Torah" },
      designs: { title: "Designs" },
    },
    viewCollection: "View collection",
    viewFullCollectionButton: "View Full Collection", // New translation
    galleryTitleSuffix: "Gallery",
    ctaTitle: "Ready to Capture Your Next Event?",
    ctaSubtitle:
      "Let's create something extraordinary together. From intimate gatherings to grand celebrations, I'm here to document your special moments with style and creativity.",
    ctaButton: "Get in Touch",
    footerName: "NETANEL LEVINSTEIN",
    footerTagline: "Event Photography Specialist",
    footerCopyright: "© {year} All Rights Reserved",
    footerBuiltBy: "Built by MCD webs",
  },
  he: {
    heroTitleLine1: "לוכדים רגעים",
    heroTitleLine2: "שנשארים לנצח",
    heroTitleHighlight: "שנשארים לנצח",
    heroSubtitle:
      "צילום אירועים פרימיום המספר את סיפורכם בכישרון אמנותי ומצוינות טכנית",
    exploreWork: "גלה עוד",
    bioTitleLine1: "לוכדים את הרגעים",
    bioTitleHighlight: "הבלתי רגילים של החיים",
    bioParagraph1:
      "שלום! אני נתנאל, צלם מקצועי שחי ונושם את העולם הייחודי של הצילום, עם תשוקה עצומה לתפיסת רגעים נדירים ורגשות שלא תמיד קל לתאר במילים. אני מאמין שצילום הוא הרבה מעבר לתמונה יפה – זהו סיפור שלם, חוויות, ואוסף של רגשות שהופכים לרגעים בלתי נשכחים.",
    bioParagraph2:
      "הדרך שלי בעולם הצילום התחילה מתוך אהבה לחקר ולגילוי, מתוך סקרנות לעולם סביבי ולרגעים הקטנים שמרכיבים אותו. עם השנים, הבנתי שכל תמונה היא דיאלוג קטן ביני לבין מה שאני רואה דרך העדשה – דיאלוג שמבוסס על אמון, חיבור וכבוד לרגע.",
    bioParagraph3:
      "עבורי, כל מפגש צילומי הוא ייחודי ומותאם באופן אישי לחלומות ולרצונות שלך. המטרה שלי היא ליצור עבורך תמונות שמספרות את הסיפור שלך, שתוכל להביט בהן ולחוות מחדש את התחושות, הצבעים והריחות של אותם רגעים קסומים.",
    bioParagraph4:
      "אני כאן כדי ללוות אותך וליצור יחד חוויות משמעותיות – בין אם מדובר באירוע גדול ומרגש, צילומי משפחה אינטימיים, פורטרט אישי שמשקף את האישיות שלך, או כל רגע שתרצה לתפוס ולשמר. יחד, נעשה זאת באווירה נינוחה ונעימה, עם הרבה רגישות והקפדה על הפרטים הקטנים שהופכים כל צילום לאומנות.",
    bioParagraph5:
      "אני מזמין אותך לצאת איתי למסע שבו נבנה זיכרונות שישארו איתך לנצח – בואו נצלם את הסיפור שלך, את הרגעים שלך, את החיים שלך.",
    photographerName: "נתנאל, הצלם שלך",
    quotes: [
      "צילום הוא הסיפור שאני לא מצליח לבטא במילים.",
      "כשהמילים נעשות לא ברורות, אתמקד בצילומים.",
      "מה שאני אוהב בצילומים זה שהם לוכדים רגע שנעלם לנצח.",
      "צילום הוא סוד על סוד. ככל שהוא מספר לך יותר, אתה יודע פחות.",
      "צילום הוא אמת. וקולנוע הוא אמת 24 פעמים בשנייה.",
    ],
    collectionsTitle: "אוספי צילום",
    collectionsSubtitle: "חקרו ז'אנרים ואירועים שונים דרך עדשת הביטוי האמנותי",
    collectionItems: {
      wedding: { title: "חתונה" },
      "bar-mitzvah": { title: "בר מצווה" },
      "bat-mitzvah": { title: "בת מצווה" },
      circumcision: { title: "ברית מילה" },
      tefilin: { title: "תפילין" },
      business: { title: "אירועים עסקיים" },
      haircut: { title: "חלאקה" },
      porpusal: { title: "הצעות נישואין" },
      engagement: { title: "אירוסין" },
      torah: { title: "הכנסת ספר תורה" },
      designs: { title: "עיצובים" },
    },
    viewCollection: "צפה באוסף",
    viewFullCollectionButton: "צפה בכל האוסף", // New translation
    galleryTitleSuffix: "גלריה",
    ctaTitle: "מוכנים ללכוד את האירוע הבא שלכם?",
    ctaSubtitle:
      "בואו ניצור משהו יוצא דופן ביחד. ממפגשים אינטימיים ועד חגיגות מפוארות, אני כאן כדי לתעד את הרגעים המיוחדים שלכם בסטייל ויצירתיות.",
    ctaButton: "צור קשר",
    footerName: "נתנאל לוינשטיין",
    footerTagline: "מומחה צילום אירועים",
    footerCopyright: "© {year} כל הזכויות שמורות",
    footerBuiltBy: "נבנה על ידי MCD webs",
  },
};

export default function Home({ lang }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allHeroImages, setAllHeroImages] = useState([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  const collectionsSectionRef = useRef(null); // Ref for the collections section wrapper

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
      setQuoteIndex(0);
    }
  }, [t]);

  useEffect(() => {
    if (!t || !t.quotes || t.quotes.length === 0) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => {
        const next = (prev + 1) % t.quotes.length;
        setCurrentQuote(t.quotes[next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AccessibilityMenu lang={lang} />
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
                    src={faceAboutImg}
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
                    <p>{t.bioParagraph4}</p>
                    <p>{t.bioParagraph5}</p>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {baseCollectionsData.map((collection, index) => {
                const translatedCollection = t.collectionItems[
                  collection.imageKey
                ] || {
                  title: collection.imageKey,
                };
                return (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => {
                      navigate(`/collection?id=${collection.id}&lang=${lang}`);
                    }}
                    className={`relative overflow-hidden group rounded-xl cursor-pointer transition-all duration-300 h-64 md:h-80 transform ${
                      index % 2 === 0 ? "md:translate-y-12" : ""
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
              <button
                onClick={() => navigate(`/contact?lang=${lang}`)}
                className="px-10 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg"
              >
                {t.ctaButton}
              </button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div
              className={`flex flex-col md:justify-between md:items-center gap-8 ${
                isRTL
                  ? "md:flex-row-reverse text-right"
                  : "md:flex-row text-left"
              }`}
            >
              <div
                className={`space-y-4 ${
                  isRTL ? "md:text-right" : "md:text-left"
                }`}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  {t.footerName}
                </h2>
                <p className="text-gray-300 text-lg">{t.footerTagline}</p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-4">
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/myisraeliview?igsh=MTh1cHBkaGpnazRscg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <InstagramIcon className="w-5 h-5 text-gray-300" />
                  </a>
                  <a
                    href="https://api.whatsapp.com/send?phone=972548005704&text=אני+מעוניין+בצלם++"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-gray-300" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-sm">
                    {t.footerCopyright.replace(
                      "{year}",
                      new Date().getFullYear()
                    )}
                  </p>
                  <span className="text-gray-400 text-sm">•</span>
                  <p className="text-sm font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent hover:from-pink-600 hover:to-orange-600 transition-all duration-300">
                    {t.footerBuiltBy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

Home.propTypes = {
  lang: PropTypes.string.isRequired,
};
