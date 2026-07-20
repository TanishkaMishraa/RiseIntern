import { createContext, useContext, useMemo, useState } from "react";
import en from "../locales/en.json";
import hi from "../locales/hi.json";

const LOCALES = { en, hi };

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const value = useMemo(() => {
    const strings = LOCALES[language] ?? LOCALES.en;
    const t = (key) => strings[key] ?? key;
    return { language, setLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
