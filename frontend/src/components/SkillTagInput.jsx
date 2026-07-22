import { useEffect, useMemo, useState } from "react";
import { SKILLS } from "../utils/constants";
import { useI18n } from "../context/I18nContext";

function normalizeSkills(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value.split(",").map((skill) => skill.trim()).filter(Boolean);
}

export default function SkillTagInput({ value = [], onChange, placeholder }) {
  const { t } = useI18n();
  const skills = useMemo(() => normalizeSkills(value), [value]);
  const [input, setInput] = useState("");
  const effectivePlaceholder = placeholder ?? t("skillInput.addSkillPlaceholder");

  useEffect(() => {
    if (typeof value === "string") onChange?.(skills.join(", "));
  }, []);

  const suggestions = SKILLS.filter(
    (skill) =>
      input.trim() &&
      skill.toLowerCase().includes(input.toLowerCase()) &&
      !skills.some((selected) => selected.toLowerCase() === skill.toLowerCase())
  ).slice(0, 6);

  function emit(nextSkills) {
    onChange?.(Array.isArray(value) ? nextSkills : nextSkills.join(", "));
  }

  function addSkill(rawSkill) {
    const skill = rawSkill.trim();
    if (!skill || skills.some((selected) => selected.toLowerCase() === skill.toLowerCase())) return;
    emit([...skills, skill]);
    setInput("");
  }

  function removeSkill(skill) {
    emit(skills.filter((selected) => selected !== skill));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input.replace(",", ""));
    }
    if (e.key === "Backspace" && input === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  }

  return (
    <div className="skill-input">
      <div className="skill-input__box">
        {skills.map((skill) => (
          <span className="skill-chip" key={skill}>
            {skill}
            <button type="button" aria-label={t("skillInput.removeAriaLabel", { skill })} onClick={() => removeSkill(skill)}>
              x
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length ? "" : effectivePlaceholder}
        />
      </div>
      {suggestions.length > 0 && (
        <div className="skill-input__suggestions">
          {suggestions.map((skill) => (
            <button type="button" key={skill} onClick={() => addSkill(skill)}>
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}