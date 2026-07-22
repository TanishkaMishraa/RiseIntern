// Returns a structured description of a relative time instead of a formatted
// string, so callers can translate it via t() rather than matching on
// hardcoded English text.
export function getRelativeTimeInfo(isoDate) {
  const diffMs = new Date(isoDate).getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { type: "today" };
  if (diffDays > 0) return { type: "future", days: diffDays };
  return { type: "past", days: Math.abs(diffDays) };
}

// Returns a structured description of a deadline countdown instead of a
// formatted string, so callers can translate it via t() rather than matching
// on hardcoded English text.
export function getDeadlineCountdownInfo(isoDate) {
  const diffMs = new Date(isoDate).getTime() - Date.now();
  if (diffMs <= 0) return { closed: true };
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return { closed: false, today: true, days: diffDays };
  return { closed: false, today: false, days: diffDays };
}