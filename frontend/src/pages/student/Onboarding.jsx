import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SkillTagInput from "../../components/SkillTagInput";
import { updateProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { useI18n } from "../../context/I18nContext";

const STEPS = ["welcome", "skills", "match"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { token, updateUser } = useAuth();
  const toast = useToast();
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const current = STEPS[step];

  async function handleNext() {
    if (current === "skills") {
      setIsSaving(true);
      try {
        const updated = await updateProfile({ skills }, token);
        updateUser(updated);
      } catch (err) {
        toast.error(t("student.onboarding.saveSkillsErrorToast"));
      } finally {
        setIsSaving(false);
      }
    }
    setStep((s) => s + 1);
  }

  return (
    <section className="hero">
      <div className="popup-content" style={{ textAlign: "left" }}>
        {current === "welcome" && (
          <>
            <h2>{t("student.onboarding.welcomeTitle")}</h2>
            <p>{t("student.onboarding.welcomeDescription")}</p>
          </>
        )}

        {current === "skills" && (
          <>
            <h2>{t("student.onboarding.skillsTitle")}</h2>
            <SkillTagInput value={skills} onChange={setSkills} />
          </>
        )}

        {current === "match" && (
          <>
            <h2>{t("student.onboarding.doneTitle")}</h2>
            <p>{t("student.onboarding.doneDescription")}</p>
          </>
        )}

        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} disabled={isSaving}>
              {t("student.onboarding.backButton")}
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="btn" onClick={handleNext} disabled={isSaving}>
              {isSaving ? t("common.saving") : t("student.onboarding.nextButton")}
            </button>
          ) : (
            <button className="btn" onClick={() => navigate("/recommendations")}>
              {t("student.onboarding.seeMatchesButton")}
            </button>
          )}
        </div>

        {step === 0 && (
          <p style={{ marginTop: 12, fontSize: "0.85rem", textAlign: "center" }}>
            <Link to="/recommendations">{t("student.onboarding.skipLink")}</Link>
          </p>
        )}
      </div>
    </section>
  );
}
