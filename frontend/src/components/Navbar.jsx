import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useI18n();

  return (
    <header>
      <div className="logo-container">
        <img src="/image.png" alt="RiseIntern Logo" />
        <h1>RiseIntern</h1>
      </div>
      <nav>
        <Link to="/">{t("nav.home")}</Link>
        <Link to="/internships">{t("nav.internships")}</Link>
        <a href="/bot.html">🤖 Bot</a>

        {isAuthenticated ? (
          <>
            <NotificationBell />
            <LanguageSwitcher />
            <span>👋 {user?.name}</span>
            <button onClick={logout}>{t("nav.logout")}</button>
          </>
        ) : (
          <>
            <LanguageSwitcher />
            <Link to="/login">{t("nav.login")}</Link>
            <Link to="/register">{t("nav.register")}</Link>
          </>
        )}
      </nav>
    </header>
  );
}
