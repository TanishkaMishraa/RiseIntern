import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterInternshipApi } from "../../api/internships";
import SkillTagInput from "../../components/SkillTagInput";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { DOMAINS } from "../../utils/constants";
import { useI18n } from "../../context/I18nContext";

const INITIAL_FORM = {
  title: "",
  domain: DOMAINS[0],
  description: "",
  skills_required: [],
  stipend: "",
  location: "",
  deadline: "",
};

export default function PostInternship() {
  const { token } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [form, setForm] = useState(INITIAL_FORM);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await recruiterInternshipApi.create(
        {
          ...form,
          stipend: form.stipend === "" ? 0 : Number(form.stipend),
          location: form.location.trim() || "Remote",
        },
        token
      );
      toast.success(t("recruiter.postInternship.successToast"));
      navigate("/recruiter/listings");
    } catch (err) {
      toast.error(t("recruiter.postInternship.errorToast"));
    }
  }

  return (
    <section style={{ padding: "40px 50px", maxWidth: 600 }}>
      <h2>{t("recruiter.postInternship.title")}</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <input
          placeholder={t("recruiter.postInternship.titlePlaceholder")}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
        <select value={form.domain} onChange={(e) => update("domain", e.target.value)}>
          {DOMAINS.map((domain) => (
            <option key={domain} value={domain}>{domain}</option>
          ))}
        </select>
        <textarea
          placeholder={t("recruiter.postInternship.descriptionPlaceholder")}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          required
        />
        <label>
          {t("recruiter.postInternship.requiredSkillsLabel")}
          <SkillTagInput
            value={form.skills_required}
            onChange={(skills) => update("skills_required", skills)}
            placeholder={t("recruiter.postInternship.skillsPlaceholder")}
          />
        </label>
        <input
          placeholder={t("recruiter.postInternship.stipendPlaceholder")}
          type="number"
          value={form.stipend}
          onChange={(e) => update("stipend", e.target.value)}
        />
        <input
          placeholder={t("recruiter.postInternship.locationPlaceholder")}
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => update("deadline", e.target.value)}
          required
        />
        <button className="btn" type="submit">{t("recruiter.postInternship.submitButton")}</button>
      </form>
    </section>
  );
}
