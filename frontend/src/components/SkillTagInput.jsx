import { useState } from "react";
import { SKILLS } from "../utils/constants";

export default function SkillTagInput({ value = [], onChange }) {
  const [input, setInput] = useState("");

  const suggestions = SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(input.toLowerCase()) && !value.includes(skill)
  ).slice(0, 5);

  function addSkill(skill) {
    if (!skill || value.includes(skill)) return;
    onChange([...value, skill]);
    setInput("");
  }

  function removeSkill(skill) {
    onChange(value.filter((s) => s !== skill));
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {value.map((skill) => (
          <span
            key={skill}
            onClick={() => removeSkill(skill)}
            style={{
              background: "#e0f7fa",
              borderRadius: 20,
              padding: "4px 12px",
              cursor: "pointer",
            }}
          >
            {skill} ✕
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addSkill(input.trim())}
        placeholder="Add a skill..."
      />
      {input && suggestions.length > 0 && (
        <ul>
          {suggestions.map((skill) => (
            <li key={skill} onClick={() => addSkill(skill)} style={{ cursor: "pointer" }}>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
