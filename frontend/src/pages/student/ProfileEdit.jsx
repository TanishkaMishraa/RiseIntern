import { useState } from "react";
import SkillTagInput from "../../components/SkillTagInput";
import ProfileCompleteness from "../../components/ProfileCompleteness";
import Skeleton from "../../components/Skeleton";
import { uploadResume } from "../../api/resumes";
import { updateProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

export default function ProfileEdit() {
  const { user, token, updateUser } = useAuth();
  const toast = useToast();
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
          `Found ${newSkills.length} skill${newSkills.length === 1 ? "" : "s"} on your resume — review below and save.`
        );
      } else {
        toast.info("Resume parsed — no new skills found beyond what's already on your profile.");
      }
    } catch (err) {
      toast.error(err.message || "Resume upload failed");
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
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Could not save profile");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section style={{ padding: "40px 50px", maxWidth: 600 }}>
      <h2>Edit Profile</h2>
      <ProfileCompleteness user={{ ...user, ...form }} />

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, marginTop: 20 }}>
        <label>
          Name
          <input value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </label>

        <label>
          Education
          <input
            placeholder="e.g. B.Tech Computer Science, Class of 2026"
            value={form.education}
            onChange={(e) => update("education", e.target.value)}
          />
        </label>

        <label>
          Location
          <input
            placeholder="e.g. Bengaluru"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </label>

        <label>
          Skills
          {isParsingResume ? (
            <Skeleton height="44px" style={{ borderRadius: 10 }} />
          ) : (
            <SkillTagInput value={form.skills} onChange={(skills) => update("skills", skills)} />
          )}
        </label>

        <button className="btn" type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save Profile"}
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <label>Resume (PDF, under 5MB)</label>
        <input type="file" accept=".pdf" onChange={handleResumeChange} disabled={isParsingResume} />
        {isParsingResume && <p style={{ fontSize: "0.85rem", marginTop: 6 }}>Parsing your resume…</p>}
        <p style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: 6 }}>
          We'll scan it for skills and add them to the list above — nothing is saved to your profile
          until you click Save Profile.
        </p>
      </div>
    </section>
  );
}
