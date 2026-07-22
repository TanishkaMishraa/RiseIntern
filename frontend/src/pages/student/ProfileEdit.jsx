import { useState } from "react";
import SkillTagInput from "../../components/SkillTagInput";
import ProfileCompleteness from "../../components/ProfileCompleteness";
import Skeleton from "../../components/Skeleton";
import { uploadResume } from "../../api/resumes";
import { updateProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { useI18n } from "../../context/I18nContext";

export default function ProfileEdit() {
  const { user, token, updateUser } = useAuth();
  const toast = useToast();
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    education: user?.education ?? "",
    location: user?.location ?? "",
    skills: user?.skills ?? [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleResumeChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsParsingResume(true);
    try {
      const resume = await uploadResume(file, token);
      const newSkills = resume.extracted_skills.filter((skill) => !form.skills.includes(skill));

      if (newSkills.length > 0) {
        update("skills", [...form.skills, ...newSkills]);
        toast.success(
          newSkills.length === 1
            ? t("student.profileEdit.resumeSkillsFoundOne")
            : t("student.profileEdit.resumeSkillsFoundMany", { count: newSkills.length })
        );
      } else {
        toast.info(t("student.profileEdit.resumeNoNewSkillsToast"));
      }
    } catch (err) {
      toast.error(err.message || t("student.profileEdit.resumeUploadErrorToast"));
    } finally {
      setIsParsingResume(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateProfile(form, token);
      updateUser(updated);
      toast.success(t("student.profileEdit.savedToast"));
    } catch (err) {
      toast.error(t("student.profileEdit.saveErrorToast"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section style={{ padding: "40px 50px", maxWidth: 600 }}>
      <h2>{t("student.profileEdit.title")}</h2>
      <ProfileCompleteness user={{ ...user, ...form }} />

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, marginTop: 20 }}>
        <label>
          {t("student.profileEdit.nameLabel")}
          <input value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </label>

        <label>
          {t("student.profileEdit.educationLabel")}
          <input
            placeholder={t("student.profileEdit.educationPlaceholder")}
            value={form.education}
            onChange={(e) => update("education", e.target.value)}
          />
        </label>

        <label>
          {t("student.profileEdit.locationLabel")}
          <input
            placeholder={t("student.profileEdit.locationPlaceholder")}
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </label>

        <label>
          {t("student.profileEdit.skillsLabel")}
          {isParsingResume ? (
            <Skeleton height="44px" style={{ borderRadius: 10 }} />
          ) : (
            <SkillTagInput value={form.skills} onChange={(skills) => update("skills", skills)} />
          )}
        </label>

        <button className="btn" type="submit" disabled={isSaving}>
          {isSaving ? t("common.saving") : t("student.profileEdit.saveButton")}
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <label>{t("student.profileEdit.resumeLabel")}</label>
        <input type="file" accept=".pdf" onChange={handleResumeChange} disabled={isParsingResume} />
        {isParsingResume && (
          <p style={{ fontSize: "0.85rem", marginTop: 6 }}>{t("student.profileEdit.parsingResumeText")}</p>
        )}
        <p style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: 6 }}>
          {t("student.profileEdit.resumeHelpText")}
        </p>
      </div>
    </section>
  );
}
