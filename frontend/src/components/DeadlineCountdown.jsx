import { getDeadlineCountdownInfo } from "../utils/date";
import { useI18n } from "../context/I18nContext";

export default function DeadlineCountdown({ deadline }) {
  const { t } = useI18n();
  if (!deadline) return null;
  const info = getDeadlineCountdownInfo(deadline);

  const label = info.closed
    ? t("deadline.closed")
    : info.today
    ? t("deadline.closesToday")
    : t("deadline.closesInDays", { days: info.days });

  const urgent = !info.closed && (info.today || info.days <= 3);
  const closed = info.closed;

  return (
    <span className={`deadline ${urgent ? "deadline--urgent" : ""} ${closed ? "deadline--closed" : ""}`}>
      {label}
    </span>
  );
}
