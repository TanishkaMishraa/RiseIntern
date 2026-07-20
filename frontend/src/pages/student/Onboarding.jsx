import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillTagInput from "../../components/SkillTagInput";

const STEPS = ["welcome", "skills", "match"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState([]);

  const current = STEPS[step];

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
          {step > 0 && <button onClick={() => setStep((s) => s - 1)}>Back</button>}
          {step < STEPS.length - 1 ? (
            <button className="btn" onClick={() => setStep((s) => s + 1)}>Next</button>
          ) : (
            <button className="btn" onClick={() => navigate("/recommendations")}>
              See my matches
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
