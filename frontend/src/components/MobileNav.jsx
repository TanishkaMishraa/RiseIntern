import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STUDENT_LINKS = [
  { to: "/internships", icon: "🔍", label: "Browse" },
  { to: "/saved", icon: "★", label: "Saved" },
  { to: "/applications", icon: "📄", label: "Applied" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
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
          <div style={{ fontSize: "0.7rem" }}>{link.label}</div>
        </Link>
      ))}
    </nav>
  );
}
