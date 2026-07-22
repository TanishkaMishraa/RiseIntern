import { useI18n } from "../context/I18nContext";

const FIELDS = [
  { key: "skills", labelKey: "profileCompleteness.field.skills", filled: (user) => (user?.skills?.length ?? 0) > 0 },
  { key: "education", labelKey: "profileCompleteness.field.education", filled: (user) => Boolean(user?.education) },
  { key: "location", labelKey: "profileCompleteness.field.location", filled: (user) => Boolean(user?.location) },
];

export default function ProfileCompleteness({ user }) {
  const { t } = useI18n();
  const missing = FIELDS.filter((field) => !field.filled(user));
  const percent = Math.round(((FIELDS.length - missing.length) / FIELDS.length) * 100);

  return (
    <div>
      <div style={{ background: "#eee", borderRadius: 20, height: 10, overflow: "hidden" }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "var(--color-accent, #c9a818)",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <p style={{ fontSize: "0.85rem", marginTop: 6 }}>
        {t("profileCompleteness.percentComplete", { percent })}
        {missing.length > 0 &&
          t("profileCompleteness.addFieldsSuffix", { fields: missing.map((f) => t(f.labelKey)).join(", ") })}
      </p>
    </div>
  );
}
