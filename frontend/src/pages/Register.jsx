import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useToast } from "../hooks/useToast";
import { ROLES } from "../utils/constants";
import { useI18n } from "../context/I18nContext";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: ROLES.STUDENT });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form);
      toast.success(t("auth.accountCreatedToast"));
      navigate("/login");
    } catch (err) {
      toast.error(t("auth.registerErrorToast"));
    }
  }

  return (
    <section className="hero">
      <div className="popup-content">
        <h2>{t("auth.registerTitle")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder={t("auth.namePlaceholder")}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          <input
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />
          <select value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value={ROLES.STUDENT}>{t("auth.roleStudent")}</option>
            <option value={ROLES.RECRUITER}>{t("auth.roleRecruiter")}</option>
          </select>
          <button className="btn" type="submit">{t("auth.registerButton")}</button>
        </form>
      </div>
    </section>
  );
}
