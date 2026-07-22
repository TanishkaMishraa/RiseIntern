import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

const STUDENT_LINKS = [
  { to: "/internships", icon: "🔍", labelKey: "mobileNav.browse" },
  { to: "/saved", icon: "★", labelKey: "mobileNav.saved" },
  { to: "/applications", icon: "📄", labelKey: "mobileNav.applied" },
  { to: "/profile", icon: "👤", labelKey: "mobileNav.profile" },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  if (!isAuthenticated) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "space-around",
        background: "#fff",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        padding: "10px 0",
        zIndex: 1000,
      }}
      className="mobile-nav"
    >
      {STUDENT_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          style={{ fontWeight: pathname === link.to ? 700 : 400, textAlign: "center" }}
        >
          <div>{link.icon}</div>
          <div style={{ fontSize: "0.7rem" }}>{t(link.labelKey)}</div>
        </Link>
      ))}
    </nav>
  );
}
