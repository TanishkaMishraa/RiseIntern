import { formatDeadlineCountdown } from "../utils/date";

export default function DeadlineCountdown({ deadline }) {
  if (!deadline) return null;
  return <span style={{ fontSize: "0.85rem", color: "#ff5722", fontWeight: 600 }}>
    {formatDeadlineCountdown(deadline)}
  </span>;
}
