import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fa from "./locales/fa.json";

const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fa",
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Handle language change events
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.dir = lng === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
  }
});

// Set initial direction
if (typeof document !== "undefined") {
  document.dir = i18n.language === "fa" ? "rtl" : "ltr";
  document.documentElement.lang = i18n.language;
}

export default i18n;
