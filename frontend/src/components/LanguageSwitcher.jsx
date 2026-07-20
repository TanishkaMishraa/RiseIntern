import { useI18n } from "../context/I18nContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language">
      <option value="en">EN</option>
      <option value="hi">हि</option>
    </select>
  );
}
