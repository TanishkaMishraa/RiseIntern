import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useToast } from "../hooks/useToast";
import { ROLES } from "../utils/constants";
import { useI18n } from "../context/I18nContext";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: ROLES.STUDENT });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(form);
      toast.success(t("auth.accountCreatedToast"));
      navigate("/login");
    } catch (err) {
      toast.error(t("auth.registerErrorToast"));
      setIsSubmitting(false);
    }
  }

  return (
    <section className="hero">
      <div className="auth-card">
        <h2>{t("auth.registerTitle")}</h2>
        <p className="auth-subtitle">{t("auth.registerSubtitle")}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>{t("auth.nameLabel")}</span>
            <input
              placeholder={t("auth.namePlaceholder")}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              required
            />
          </label>

          <label className="auth-field">
            <span>{t("auth.emailLabel")}</span>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            <span>{t("auth.passwordLabel")}</span>
            <input
              type="password"
              placeholder={t("auth.passwordPlaceholder")}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>

          <div className="auth-field">
            <span>{t("auth.roleLabel")}</span>
            <div className="auth-role-toggle" role="radiogroup" aria-label={t("auth.roleLabel")}>
              {[
                { value: ROLES.STUDENT, label: t("auth.roleStudent") },
                { value: ROLES.RECRUITER, label: t("auth.roleRecruiter") },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={form.role === option.value}
                  className={form.role === option.value ? "is-active" : ""}
                  onClick={() => update("role", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("auth.registeringButton") : t("auth.registerButton")}
          </button>
        </form>

        <p className="auth-switch">
          {t("auth.haveAccountPrompt")} <Link to="/login">{t("auth.loginLink")}</Link>
        </p>
      </div>
    </section>
  );
}
