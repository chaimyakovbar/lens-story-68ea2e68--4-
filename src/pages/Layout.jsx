import React, {
  useState,
  useEffect,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import logoBlack from "./logoBlack.png";
import logoWhite from "./logoWhite.png";
import { createPageUrl } from "@/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Camera,
  Image as ImageIcon,
  User,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import AccessibilityMenu from "../components/AccessibilityMenu";

const layoutTranslations = {
  he: {
    home: "בית",
    portfolio: "תיק עבודות",
    about: "אודות",
    contact: "צור קשר",
    languageToggle: "English",
  },
  en: {
    home: "Home",
    portfolio: "Portfolio",
    about: "About",
    contact: "Contact",
    languageToggle: "עברית",
  },
};

export default function Layout({
  children,
  currentPageName,
  lang,
  toggleLanguage,
}) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("appTheme") === "dark";
    }
    return true; // Default to dark if localStorage is not available (SSR)
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Effect for language (direction and HTML lang attribute)
  useEffect(() => {
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  // Effect for theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    if (typeof window !== "undefined") {
      localStorage.setItem("appTheme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prevIsDark) => !prevIsDark);
  };

  const currentLayoutT = layoutTranslations[lang];

  const menuItems = [
    { name: currentLayoutT.home, path: createPageUrl("Home"), icon: Camera },
    {
      name: currentLayoutT.portfolio,
      path: createPageUrl("Portfolio"),
      icon: ImageIcon,
    },
    {
      name: currentLayoutT.contact,
      path: createPageUrl("Contact"),
      icon: Mail,
    },
    { name: currentLayoutT.about, path: createPageUrl("About"), icon: User },
  ];

  const childrenWithLangProp = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { lang });
    }
    return child;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      } ${lang === "he" ? "font-assistant" : "font-inter"}`} // Using specific font names
      dir={lang === "he" ? "rtl" : "ltr"}
    >
      <AccessibilityMenu lang={lang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;700&display=swap');
        
        body {
          font-family: ${
            lang === "he" ? "'Assistant', sans-serif" : "'Inter', sans-serif"
          };
        }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-assistant { font-family: 'Assistant', sans-serif; }

        :root {
          --primary: ${isDark ? "#ff3366" : "#e31b54"};
          --background: ${isDark ? "#000000" : "#ffffff"};
          --text: ${isDark ? "#ffffff" : "#000000"};
          --accent: ${isDark ? "#2a2a2a" : "#f5f5f5"};
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--background);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 4px;
        }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Page Transitions */
        .page-transition-enter {
          opacity: 0;
          transform: translateY(20px);
        }

        .page-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 400ms, transform 400ms;
        }

        .page-transition-exit {
          opacity: 1;
          transform: translateY(0);
        }

        .page-transition-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 400ms, transform 400ms;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav
        className={`fixed w-full z-50 backdrop-blur-lg ${
          isDark ? "bg-black/80" : "bg-white/80"
        } border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to={createPageUrl("Home")}
              className="flex items-center space-x-2"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Camera className="h-8 w-8 text-primary" />
              </motion.div>
              <span className="font-bold text-xl">
                <img
                  src={isDark ? logoWhite : logoBlack}
                  alt="Logo"
                  className="h-12 inline"
                />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div
              className={`hidden md:flex items-center ${
                lang === "he" ? "space-x-reverse space-x-8" : "space-x-8"
              }`}
            >
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative group ${
                    location.pathname === item.path ? "text-primary" : ""
                  }`}
                >
                  <span
                    className={`flex items-center ${
                      lang === "he" ? "space-x-reverse space-x-1" : "space-x-1"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </span>
                  <motion.div
                    className={`absolute bottom-0 h-0.5 bg-primary ${
                      lang === "he" ? "right-0" : "left-0"
                    }`}
                    initial={{
                      width: location.pathname === item.path ? "100%" : "0%",
                    }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </div>

            {/* Theme and Language Controls */}
            <div
              className={`hidden md:flex items-center ${
                lang === "he" ? "space-x-reverse space-x-4" : "space-x-4"
              }`}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                }`}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className={`p-2 rounded-full ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                } flex items-center ${
                  lang === "he" ? "space-x-reverse space-x-1" : "space-x-1"
                }`}
                aria-label={`Switch language to ${
                  lang === "en" ? "Hebrew" : "English"
                }`}
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm">{currentLayoutT.languageToggle}</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: lang === "he" ? "-100%" : "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: lang === "he" ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-[100] ${
              // Increased z-index for mobile menu
              isDark ? "bg-black" : "bg-white"
            }`}
          >
            <div className="container mx-auto px-4 py-6">
              <div
                className={`flex ${
                  lang === "he" ? "justify-start" : "justify-end"
                }`}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div
                className={`flex flex-col mt-8 ${
                  lang === "he"
                    ? "space-y-reverse space-y-8 items-end"
                    : "space-y-8 items-start"
                }`}
              >
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setIsMenuOpen(false);
                      // Ensure page content re-renders if it depends on lang from URL for some reason
                      // This shouldn't be necessary if pages correctly use the lang prop
                    }}
                    className={`flex items-center text-xl ${
                      lang === "he" ? "space-x-reverse space-x-4" : "space-x-4"
                    } ${location.pathname === item.path ? "text-primary" : ""}`}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                <div
                  className={`flex pt-8 ${
                    lang === "he" ? "space-x-reverse space-x-4" : "space-x-4"
                  }`}
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className={`p-3 rounded-full ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    }`}
                    aria-label={
                      isDark ? "Switch to light mode" : "Switch to dark mode"
                    }
                  >
                    {isDark ? (
                      <Sun className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <Moon className="h-6 w-6 text-gray-600" />
                    )}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleLanguage();
                      setIsMenuOpen(false); // Close menu after language change
                    }}
                    className={`p-3 rounded-full ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    } flex items-center ${
                      lang === "he" ? "space-x-reverse space-x-1" : "space-x-1"
                    }`}
                    aria-label={`Switch language to ${
                      lang === "en" ? "Hebrew" : "English"
                    }`}
                  >
                    <Globe className="h-6 w-6" />
                    <span className="text-sm">
                      {currentLayoutT.languageToggle}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Page Transitions */}
      <motion.main
        key={`${location.pathname}-${lang}`} // Add lang to key to force re-render on lang change if needed
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="pt-16"
      >
        {childrenWithLangProp}
      </motion.main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  currentPageName: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  toggleLanguage: PropTypes.func.isRequired,
};
