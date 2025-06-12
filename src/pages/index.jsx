import Layout from "./Layout.jsx";

import Home from "./Home";

import Portfolio from "./Portfolio";

import About from "./About";

import Contact from "./Contact";

import Collection from "./Collection";

import ScrollToTop from "../components/ScrollToTop";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

import { useState, useEffect } from "react";

const PAGES = {
  Home: Home,

  Portfolio: Portfolio,

  About: About,

  Contact: Contact,

  Collection: Collection,
};

function _getCurrentPage(url) {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split("/").pop();
  if (urlLastPart.includes("?")) {
    urlLastPart = urlLastPart.split("?")[0];
  }

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent({ lang, toggleLanguage }) {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  // Remove the force Hebrew redirect
  useEffect(() => {
    // Get language from URL or localStorage
    const urlParams = new URLSearchParams(location.search);
    const urlLang = urlParams.get("lang");
    const storedLang = localStorage.getItem("appLanguage");

    // If URL has a language parameter, use it and update localStorage
    if (urlLang) {
      localStorage.setItem("appLanguage", urlLang);
      if (urlLang !== lang) {
        toggleLanguage(); // This will update the language state
      }
    }
    // If no URL parameter but we have a stored language, update URL
    else if (storedLang) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("lang", storedLang);
      window.history.replaceState({}, "", newUrl);
    }
  }, [location.search, lang, toggleLanguage]);

  return (
    <Layout
      currentPageName={currentPage}
      lang={lang}
      toggleLanguage={toggleLanguage}
    >
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home lang={lang} />} />
        <Route path="/Portfolio" element={<Portfolio lang={lang} />} />
        <Route path="/About" element={<About lang={lang} />} />
        <Route path="/Contact" element={<Contact lang={lang} />} />
        <Route path="/Collection" element={<Collection lang={lang} />} />
      </Routes>
    </Layout>
  );
}

export default function Pages() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang");
      const storedLang = localStorage.getItem("appLanguage");

      // Use URL language if available, otherwise use stored language, default to Hebrew
      const initialLang = urlLang || storedLang || "he";
      localStorage.setItem("appLanguage", initialLang);
      return initialLang;
    }
    return "he";
  });

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "he" : "en";
    setLang(newLang);
    localStorage.setItem("appLanguage", newLang);

    // Update URL with new language
    const url = new URL(window.location.href);
    url.searchParams.set("lang", newLang);
    window.history.pushState({}, "", url);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    }
  }, [lang]);

  return (
    <Router>
      <PagesContent lang={lang} toggleLanguage={toggleLanguage} />
    </Router>
  );
}
