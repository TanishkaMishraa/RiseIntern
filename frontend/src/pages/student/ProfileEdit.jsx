import { useState } from "react";
import SkillTagInput from "../../components/SkillTagInput";
import ProfileCompleteness from "../../components/ProfileCompleteness";
import { uploadResume } from "../../api/resumes";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

export default function ProfileEdit() {
  const { token } = useAuth();
  const toast = useToast();
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState(null);

  const fieldsFilled = [skills.length > 0, Boolean(resume)].filter(Boolean).length;
  const completeness = Math.round((fieldsFilled / 2) * 100);

  async function handleResumeChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadResume(file, token);
      setResume(file);
      toast.success("Resume uploaded");
    } catch (err) {
      toast.error("Resume upload failed");
    }
  }

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Edit Profile</h2>
      <ProfileCompleteness percent={completeness} />

      <div style={{ marginTop: 20 }}>
        <label>Skills</label>
        <SkillTagInput value={skills} onChange={setSkills} />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Resume</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
      </div>
    </section>
  );
}
