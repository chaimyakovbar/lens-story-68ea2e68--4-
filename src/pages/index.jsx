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

  return (
    <Layout
      currentPageName={currentPage}
      lang={lang}
      toggleLanguage={toggleLanguage}
    >
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home lang={lang} />} />

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
      return localStorage.getItem("appLanguage") || "en";
    }
    return "en";
  });

  const toggleLanguage = () => {
    setLang((prevLang) => (prevLang === "en" ? "he" : "en"));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("appLanguage", lang);
    }
  }, [lang]);

  return (
    <Router>
      <PagesContent lang={lang} toggleLanguage={toggleLanguage} />
    </Router>
  );
}
