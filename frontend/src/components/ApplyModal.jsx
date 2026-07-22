import { useEffect, useState } from "react";
import { applyToInternship } from "../api/applications";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useI18n } from "../context/I18nContext";

export default function ApplyModal({ internship, onClose, onApplied }) {
  const { token } = useAuth();
  const toast = useToast();
  const { t } = useI18n();
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await applyToInternship(internship.id, { cover_note: coverNote || null }, token);
      toast.success(t("internshipCard.appliedToast"));
      onApplied(internship.id);
      onClose();
    } catch (err) {
      if (err.status === 409) {
        toast.info(t("internshipCard.alreadyAppliedToast"));
        onApplied(internship.id);
        onClose();
      } else {
        toast.error(err.message || t("internshipCard.applyErrorToast"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-content" style={{ textAlign: "left" }} onClick={(e) => e.stopPropagation()}>
        <button className="close" aria-label={t("landing.popup.closeAriaLabel")} onClick={onClose}>
          &times;
        </button>
        <h2>{t("internshipCard.applyModalTitle", { title: internship.title })}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>{t("internshipCard.coverNoteLabel")}</span>
            <textarea
              rows={4}
              placeholder={t("internshipCard.coverNotePlaceholder")}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              style={{
                fontFamily: "inherit",
                fontSize: "1rem",
                padding: "12px 14px",
                border: "1px solid #d7e3ef",
                borderRadius: 10,
                resize: "vertical",
              }}
            />
          </label>

          <button className="btn auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("internshipCard.applyingButton") : t("internshipCard.confirmApplyButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
