export function formatRelativeTime(isoDate) {
  const diffMs = new Date(isoDate).getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays > 0) return `in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  return `${Math.abs(diffDays)} day${diffDays === -1 ? "" : "s"} ago`;
}

export function formatDeadlineCountdown(isoDate) {
  const diffMs = new Date(isoDate).getTime() - Date.now();
  if (diffMs <= 0) return "Closed";
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "Closes today";
  return `Closes in ${diffDays} days`;
}