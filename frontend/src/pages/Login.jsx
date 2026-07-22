import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useI18n } from "../context/I18nContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      if (user.role === "student") {
        navigate(user.skills?.length > 0 ? "/internships" : "/onboarding");
      } else {
        navigate(`/${user.role}`);
      }
    } catch (err) {
      toast.error(t("auth.invalidCredentialsToast"));
      setIsSubmitting(false);
    }
  }

  return (
    <section className="hero">
      <div className="auth-card">
        <h2>{t("auth.loginTitle")}</h2>
        <p className="auth-subtitle">{t("auth.loginSubtitle")}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>{t("auth.emailLabel")}</span>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            <span>{t("auth.passwordLabel")}</span>
            <input
              type="password"
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("auth.loggingInButton") : t("auth.loginButton")}
          </button>
        </form>

        <p className="auth-switch">
          {t("auth.noAccountPrompt")} <Link to="/register">{t("auth.registerLink")}</Link>
        </p>
      </div>
    </section>
  );
}
