import React from "react";
import { motion } from "framer-motion";
import { Camera, Award, Users, Globe } from "lucide-react";

const pageTranslations = {
  en: {
    pageTitle: "About Us",
    pageSubtitle:
      "Capturing life's precious moments through the lens of creativity",
    stats: [
      { value: "250+", label: "Photo Sessions" },
      { value: "5+", label: "Years Experience" },
      { value: "100+", label: "Happy Clients" },
    ],
    storyTitle: "Our Story",
    storyParagraph1:
      "Hello! I'm Netanel, a professional photographer who lives and breathes the unique world of photography, with a deep passion for capturing rare moments and emotions that aren't always easy to put into words. I believe that photography is much more than a beautiful image – it's a whole story, a collection of experiences and emotions that turn into unforgettable moments.",
    storyParagraph2:
      "My journey into photography began from a love of exploration and discovery, driven by curiosity about the world around me and the small moments that make it up. Over the years, I've come to understand that every photo is a small dialogue between me and what I see through the lens – a dialogue based on trust, connection, and respect for the moment.",
    storyParagraph3:
      "For me, every photo session is unique and personally tailored to your dreams and wishes. My goal is to create images that tell your story – images you can look at and relive the feelings, colors, and scents of those magical moments.",
    storyParagraph4:
      "I'm here to accompany you and create meaningful experiences together – whether it's a big, emotional event, an intimate family shoot, a personal portrait that reflects your personality, or any moment you wish to capture and preserve. Together, we'll do it in a relaxed and pleasant atmosphere, with great sensitivity and attention to the small details that turn every photo into a piece of art.",
    storyParagraph5:
      "I invite you to join me on a journey where we'll build memories that will stay with you forever – let's capture your story, your moments, your life.",
  },
  he: {
    pageTitle: "אודותינו",
    pageSubtitle: "לוכדים את רגעי החיים היקרים דרך עדשת היצירתיות",
    stats: [
      { value: "250+", label: "סשנים של צילום" },
      { value: "5+", label: "שנות ניסיון" },
      { value: "100+", label: "לקוחות מרוצים" },
    ],
    storyTitle: "הסיפור שלנו",
    storyParagraph1:
      "שלום! אני נתנאל, צלם מקצועי שחי ונושם את העולם הייחודי של הצילום, עם תשוקה עצומה לתפיסת רגעים נדירים ורגשות שלא תמיד קל לתאר במילים. אני מאמין שצילום הוא הרבה מעבר לתמונה יפה – זהו סיפור שלם, חוויות, ואוסף של רגשות שהופכים לרגעים בלתי נשכחים.",
    storyParagraph2:
      "הדרך שלי בעולם הצילום התחילה מתוך אהבה לחקר ולגילוי, מתוך סקרנות לעולם סביבי ולרגעים הקטנים שמרכיבים אותו. עם השנים, הבנתי שכל תמונה היא דיאלוג קטן ביני לבין מה שאני רואה דרך העדשה – דיאלוג שמבוסס על אמון, חיבור וכבוד לרגע.",
    storyParagraph3:
      "עבורי, כל מפגש צילומי הוא ייחודי ומותאם באופן אישי לחלומות ולרצונות שלך. המטרה שלי היא ליצור עבורך תמונות שמספרות את הסיפור שלך, שתוכל להביט בהן ולחוות מחדש את התחושות, הצבעים והריחות של אותם רגעים קסומים.",
    storyParagraph4:
      "אני כאן כדי ללוות אותך וליצור יחד חוויות משמעותיות – בין אם מדובר באירוע גדול ומרגש, צילומי משפחה אינטימיים, פורטרט אישי שמשקף את האישיות שלך, או כל רגע שתרצה לתפוס ולשמר. יחד, נעשה זאת באווירה נינוחה ונעימה, עם הרבה רגישות והקפדה על הפרטים הקטנים שהופכים כל צילום לאומנות.",
    storyParagraph5:
      "אני מזמין אותך לצאת איתי למסע שבו נבנה זיכרונות שישארו איתך לנצח – בואו נצלם את הסיפור שלך, את הרגעים שלך, את החיים שלך.",
  },
};

export default function About({ lang = "en" }) {
  const t = pageTranslations[lang];
  const isRTL = lang === "he";

  const statIcons = [Camera, Award, Users, Globe]; // Keep icons separate

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {/* ... hero content ... */}
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt={t.pageTitle}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="relative z-20 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              {t.pageTitle}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
              {t.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="w-full">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
            {t.stats.map((stat, index) => {
              const IconComponent = statIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center flex-1 mx-4"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-pink-600 to-red-600">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div
            className={`grid md:grid-cols-2 gap-12 items-center ${
              isRTL ? "md:grid-flow-col-dense" : ""
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={isRTL ? "md:col-start-2" : ""}
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
              className={isRTL ? "md:col-start-1" : ""}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                {t.storyTitle}
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed">{t.storyParagraph1}</p>
                <p className="leading-relaxed">{t.storyParagraph2}</p>
                <p className="leading-relaxed">{t.storyParagraph3}</p>
                <p className="leading-relaxed">{t.storyParagraph4}</p>
                <p className="leading-relaxed font-medium bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                  {t.storyParagraph5}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
