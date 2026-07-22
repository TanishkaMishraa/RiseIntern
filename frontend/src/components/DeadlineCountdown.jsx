import { formatDeadlineCountdown } from "../utils/date";

export default function DeadlineCountdown({ deadline }) {
  if (!deadline) return null;
  const label = formatDeadlineCountdown(deadline);
  const urgent = label === "Closes today" || label.includes("1 day") || label.includes("2 days") || label.includes("3 days");
  const closed = label === "Closed";

  return (
    <span className={`deadline ${urgent ? "deadline--urgent" : ""} ${closed ? "deadline--closed" : ""}`}>
      {label}
    </span>
  );
}