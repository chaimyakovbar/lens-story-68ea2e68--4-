import React from "react";
import { motion } from "framer-motion";
import { Camera, Award, Users, Globe } from "lucide-react";

const pageTranslations = {
  en: {
    pageTitle: "About Us",
    pageSubtitle: "Capturing life's precious moments through the lens of creativity",
    stats: [
      { value: "1000+", label: "Photo Sessions" },
      { value: "15+", label: "Years Experience" },
      { value: "500+", label: "Happy Clients" },
      { value: "25+", label: "Countries Visited" },
    ],
    storyTitle: "Our Story",
    storyParagraph1: "For over 15 years, we've been passionate about capturing the most meaningful moments in people's lives. Our journey began with a simple camera and a dream to tell stories through images.",
    storyParagraph2: "Today, we've grown into a team of dedicated professionals who bring creativity and technical excellence to every shoot. We believe that every moment has its own unique beauty, and we're here to capture it in its purest form.",
    storyParagraph3: "Our work has taken us across the globe, allowing us to document diverse cultures and traditions through our lens. Each project is an opportunity to create something truly special and timeless."
  },
  he: {
    pageTitle: "אודותינו",
    pageSubtitle: "לוכדים את רגעי החיים היקרים דרך עדשת היצירתיות",
    stats: [
      { value: "1000+", label: "סשנים של צילום" },
      { value: "15+", label: "שנות ניסיון" },
      { value: "500+", label: "לקוחות מרוצים" },
      { value: "25+", label: "מדינות בהן ביקרנו" },
    ],
    storyTitle: "הסיפור שלנו",
    storyParagraph1: "במשך למעלה מ-15 שנה, אנו נלהבים ללכוד את הרגעים המשמעותיים ביותר בחייהם של אנשים. המסע שלנו החל במצלמה פשוטה ובחלום לספר סיפורים באמצעות תמונות.",
    storyParagraph2: "כיום, גדלנו לצוות של אנשי מקצוע מסורים המביאים יצירתיות ומצוינות טכנית לכל צילום. אנו מאמינים שלכל רגע יש יופי ייחודי משלו, ואנחנו כאן כדי ללכוד אותו בצורתו הטהורה ביותר.",
    storyParagraph3: "עבודתנו לקחה אותנו לרחבי העולם, ואפשרה לנו לתעד תרבויות ומסורות מגוונות דרך העדשה שלנו. כל פרויקט הוא הזדמנות ליצור משהו מיוחד באמת ונצחי."
  }
};

export default function About({ lang = 'en' }) {
  const t = pageTranslations[lang];
  const isRTL = lang === 'he';

  const statIcons = [Camera, Award, Users, Globe]; // Keep icons separate

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {/* ... hero content ... */}
         <motion.div initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt={t.pageTitle} className="w-full h-full object-cover"/>
        </motion.div>
        <div className="relative z-20 h-full flex items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">{t.pageTitle}</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">{t.pageSubtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.stats.map((stat, index) => {
              const IconComponent = statIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="opacity-80">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${isRTL ? 'md:grid-flow-col-dense' : ''}`}>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={isRTL ? 'md:col-start-2' : ''}
            >
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt={t.storyTitle}
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={isRTL ? 'md:col-start-1' : ''}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.storyTitle}</h2>
              <div className="space-y-4 text-lg opacity-90">
                <p>{t.storyParagraph1}</p>
                <p>{t.storyParagraph2}</p>
                <p>{t.storyParagraph3}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}