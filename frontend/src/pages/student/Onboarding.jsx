import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SkillTagInput from "../../components/SkillTagInput";
import { updateProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

const STEPS = ["welcome", "skills", "match"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { token, updateUser } = useAuth();
  const toast = useToast();
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
        toast.error("Could not save your skills — you can add them later from your profile");
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
            <h2>Welcome to RiseIntern 👋</h2>
            <p>Let's set up your profile so we can find the best internship matches for you.</p>
          </>
        )}

        {current === "skills" && (
          <>
            <h2>What are your skills?</h2>
            <SkillTagInput value={skills} onChange={setSkills} />
          </>
        )}

        {current === "match" && (
          <>
            <h2>You're all set! 🎉</h2>
            <p>Head over to your recommendations to see your first matches.</p>
          </>
        )}

        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} disabled={isSaving}>
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="btn" onClick={handleNext} disabled={isSaving}>
              {isSaving ? "Saving…" : "Next"}
            </button>
          ) : (
            <button className="btn" onClick={() => navigate("/recommendations")}>
              See my matches
            </button>
          )}
        </div>

        {step === 0 && (
          <p style={{ marginTop: 12, fontSize: "0.85rem", textAlign: "center" }}>
            <Link to="/recommendations">Skip for now</Link>
          </p>
        )}
      </div>
    </section>
  );
}
