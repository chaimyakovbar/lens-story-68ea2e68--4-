import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Contrast, Type, MousePointer, Zap } from "lucide-react";

const translations = {
  en: {
    fontSize: "Font Size",
    highContrast: "High Contrast",
    textSpacing: "Text Spacing",
    largeCursor: "Large Cursor",
    reduceMotion: "Reduce Motion",
    accessibilityMenu: "Accessibility menu",
    decreaseFontSize: "Decrease font size",
    increaseFontSize: "Increase font size",
    toggleHighContrast: "Toggle high contrast",
    toggleTextSpacing: "Toggle text spacing",
    toggleLargeCursor: "Toggle large cursor",
    toggleReducedMotion: "Toggle reduced motion",
  },
  he: {
    fontSize: "גודל טקסט",
    highContrast: "ניגודיות גבוהה",
    textSpacing: "מרווחי טקסט",
    largeCursor: "סמן גדול",
    reduceMotion: "הפחתת אנימציה",
    accessibilityMenu: "תפריט נגישות",
    decreaseFontSize: "הקטנת גודל טקסט",
    increaseFontSize: "הגדלת גודל טקסט",
    toggleHighContrast: "החלפת ניגודיות",
    toggleTextSpacing: "החלפת מרווחי טקסט",
    toggleLargeCursor: "החלפת גודל סמן",
    toggleReducedMotion: "החלפת אנימציה",
  },
};

const AccessibilityMenu = ({ lang = "en" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [textSpacing, setTextSpacing] = useState(false);
  const [largeCursor, setLargeCursor] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const menuRef = useRef(null);
  const t = translations[lang];
  const isRTL = lang === "he";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (textSpacing) {
      document.documentElement.classList.add("text-spacing");
    } else {
      document.documentElement.classList.remove("text-spacing");
    }
  }, [textSpacing]);

  useEffect(() => {
    if (largeCursor) {
      document.documentElement.classList.add("large-cursor");
    } else {
      document.documentElement.classList.remove("large-cursor");
    }
  }, [largeCursor]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }, [reducedMotion]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 80));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 bg-gray-900 rounded-lg shadow-xl p-4 w-64"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{t.fontSize}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseFontSize}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                    aria-label={t.decreaseFontSize}
                  >
                    <Minus className="w-4 h-4 text-gray-300" />
                  </button>
                  <span className="text-gray-300 text-sm">{fontSize}%</span>
                  <button
                    onClick={increaseFontSize}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                    aria-label={t.increaseFontSize}
                  >
                    <Plus className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{t.highContrast}</span>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`p-2 rounded-full transition-colors ${
                    highContrast
                      ? "bg-pink-500 hover:bg-pink-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  aria-label={t.toggleHighContrast}
                >
                  <Contrast className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{t.textSpacing}</span>
                <button
                  onClick={() => setTextSpacing(!textSpacing)}
                  className={`p-2 rounded-full transition-colors ${
                    textSpacing
                      ? "bg-pink-500 hover:bg-pink-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  aria-label={t.toggleTextSpacing}
                >
                  <Type className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{t.largeCursor}</span>
                <button
                  onClick={() => setLargeCursor(!largeCursor)}
                  className={`p-2 rounded-full transition-colors ${
                    largeCursor
                      ? "bg-pink-500 hover:bg-pink-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  aria-label={t.toggleLargeCursor}
                >
                  <MousePointer className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{t.reduceMotion}</span>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`p-2 rounded-full transition-colors ${
                    reducedMotion
                      ? "bg-pink-500 hover:bg-pink-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  aria-label={t.toggleReducedMotion}
                >
                  <Zap className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
        aria-label={t.accessibilityMenu}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>
    </div>
  );
};

export default AccessibilityMenu;
