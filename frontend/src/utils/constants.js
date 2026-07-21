export const ROLES = {
  STUDENT: "student",
  RECRUITER: "recruiter",
  ADMIN: "admin",
};

export const APPLICATION_STATUS = {
  APPLIED: "applied",
  SHORTLISTED: "shortlisted",
  INTERVIEW: "interview",
  OFFERED: "offered",
  REJECTED: "rejected",
};

export const APPLICATION_STATUSES = [
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.SHORTLISTED,
  APPLICATION_STATUS.INTERVIEW,
  APPLICATION_STATUS.OFFERED,
  APPLICATION_STATUS.REJECTED,
];

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.APPLIED]: "Applied",
  [APPLICATION_STATUS.SHORTLISTED]: "Shortlisted",
  [APPLICATION_STATUS.INTERVIEW]: "Interview",
  [APPLICATION_STATUS.OFFERED]: "Offered",
  [APPLICATION_STATUS.REJECTED]: "Rejected",
};

export const DOMAINS = [
  "Software Development",
  "Data Science",
  "Design",
  "Marketing",
  "Finance",
  "Human Resources",
];

export const SKILLS = [
  "JavaScript",
  "React",
  "Python",
  "SQL",
  "Figma",
  "SEO",
  "Excel",
  "Communication",
];
