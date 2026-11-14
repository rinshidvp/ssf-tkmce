// ============================================================================
// SSF TKMCE — Student Directory & Weekly Darse Attendance System
// ============================================================================

export type Department =
  | "Computer Science"
  | "Mechanical"
  | "Civil"
  | "Electrical & Electronics"
  | "Electronics & Comm"
  | "Chemical"
  | "Production"
  | "Architecture"
  | "MCA"
  | "Other";

export type StudentYear =
  | "1st Year"
  | "2nd Year"
  | "3rd Year"
  | "4th Year"
  | "M.Tech / PG"
  | "Alumni";

export interface StudentProfile {
  fullName: string;
  whatsappNumber: string; // 10-digit unique identifier
  department: Department;
  year: StudentYear;
  registeredAt?: string;
  residenceType?: string; // Optional legacy field
}

export interface DarsSession {
  id: string;
  sessionNumber: number;
  title: string;
  speaker: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "Every Thursday, after Maghrib (7:00 PM)"
  status: "live" | "completed" | "draft";
  sessionPin: string; // 4-digit PIN e.g. "4819"
  topicPoints: string[];
  arabicQuote?: string;
  transliteration?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  student: StudentProfile;
  checkinTime: string; // ISO string
  checkinMethod: "qr_scan" | "manual_coordinator";
}

export const TKMCE_DEPARTMENTS: Department[] = [
  "Computer Science",
  "Mechanical",
  "Civil",
  "Electrical & Electronics",
  "Electronics & Comm",
  "Chemical",
  "Production",
  "Architecture",
  "MCA",
  "Other",
];

export const TKMCE_YEARS: StudentYear[] = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "M.Tech / PG",
  "Alumni",
];

export const DEFAULT_COORDINATOR_PIN = "SSF@TKM2026";

// Initial seed sessions
export const initialSessions: DarsSession[] = [
  {
    id: "sess-2026-w42",
    sessionNumber: 42,
    title: "Tazkiyat an-Nafs — Purification of the Heart",
    speaker: "Usthad Hafiz Ahmad (Campus Guidance)",
    location: "TKMCE Campus Prayer Hall / Masjid",
    date: "2026-11-19",
    time: "Thursday after Maghrib (7:00 PM - 8:15 PM)",
    status: "live",
    sessionPin: "4819",
    topicPoints: [
      "Guardianship of thoughts and intention (Niyyah)",
      "Balancing rigorous engineering pressure with inner tranquility",
      "Brotherhood and mutual support among campus peers",
    ],
    arabicQuote: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    transliteration: "Alā bidhikri Allāhi tatma'innu al-qulūb",
  },
  {
    id: "sess-2026-w41",
    sessionNumber: 41,
    title: "Etiquettes of the Student of Knowledge (Adab al-Talib)",
    speaker: "Sayyid Ibrahim Thangal",
    location: "TKMCE Campus Prayer Hall",
    date: "2026-11-12",
    time: "Thursday after Maghrib (7:00 PM)",
    status: "completed",
    sessionPin: "3174",
    topicPoints: [
      "Sincerity in learning engineering and beneficial sciences",
      "Respect towards teachers, peers, and campus community",
      "Consistency in small daily spiritual habits",
    ],
    arabicQuote: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    transliteration: "Man salaka tareeqan yaltamisu feehi 'ilman sahhala Allahu lahu bihi tareeqan ila al-Jannah",
  },
];

// Initial pre-seeded students
export const initialStudents: StudentProfile[] = [
  {
    fullName: "Mohammed Bilal K.",
    whatsappNumber: "9847123456",
    department: "Mechanical",
    year: "3rd Year",
    registeredAt: "2026-11-10T10:00:00.000Z",
  },
  {
    fullName: "Ameer Suhail",
    whatsappNumber: "9745234567",
    department: "Computer Science",
    year: "2nd Year",
    registeredAt: "2026-11-11T12:30:00.000Z",
  },
  {
    fullName: "Faris Rahman",
    whatsappNumber: "9495345678",
    department: "Civil",
    year: "4th Year",
    registeredAt: "2026-11-11T14:15:00.000Z",
  },
  {
    fullName: "Rinshid V.P.",
    whatsappNumber: "9567456789",
    department: "Electrical & Electronics",
    year: "3rd Year",
    registeredAt: "2026-11-12T09:20:00.000Z",
  },
  {
    fullName: "Naseem Akhtar",
    whatsappNumber: "9895567890",
    department: "Electronics & Comm",
    year: "1st Year",
    registeredAt: "2026-11-12T16:45:00.000Z",
  },
];

// Pre-seeded attendees
export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: "att-101",
    sessionId: "sess-2026-w42",
    student: initialStudents[0],
    checkinTime: "2026-11-14T19:05:22.000Z",
    checkinMethod: "qr_scan",
  },
  {
    id: "att-102",
    sessionId: "sess-2026-w42",
    student: initialStudents[1],
    checkinTime: "2026-11-14T19:08:14.000Z",
    checkinMethod: "qr_scan",
  },
  {
    id: "att-103",
    sessionId: "sess-2026-w42",
    student: initialStudents[2],
    checkinTime: "2026-11-14T19:12:45.000Z",
    checkinMethod: "qr_scan",
  },
  {
    id: "att-104",
    sessionId: "sess-2026-w42",
    student: initialStudents[3],
    checkinTime: "2026-11-14T19:15:02.000Z",
    checkinMethod: "qr_scan",
  },
  {
    id: "att-105",
    sessionId: "sess-2026-w42",
    student: initialStudents[4],
    checkinTime: "2026-11-14T19:18:33.000Z",
    checkinMethod: "qr_scan",
  },
];

export const STORAGE_KEYS = {
  SESSIONS: "ssf_tkmce_dars_sessions",
  STUDENTS: "ssf_tkmce_students_master",
  ATTENDANCE: "ssf_tkmce_dars_attendance",
  CURRENT_STUDENT: "ssf_tkmce_student_profile",
  COORDINATOR_AUTH: "ssf_tkmce_coordinator_auth",
};

// Client storage helper functions
export function loadSessionsFromStorage(): DarsSession[] {
  if (typeof window === "undefined") return initialSessions;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(initialSessions));
      return initialSessions;
    }
    return JSON.parse(raw);
  } catch {
    return initialSessions;
  }
}

export function saveSessionsToStorage(sessions: DarsSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error("Failed to save sessions to localStorage:", err);
  }
}

export function loadStudentsFromStorage(): StudentProfile[] {
  if (typeof window === "undefined") return initialStudents;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
      return initialStudents;
    }
    return JSON.parse(raw);
  } catch {
    return initialStudents;
  }
}

export function saveStudentsToStorage(students: StudentProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error("Failed to save students to localStorage:", err);
  }
}

export function loadAttendanceFromStorage(): AttendanceRecord[] {
  if (typeof window === "undefined") return initialAttendanceRecords;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendanceRecords));
      return initialAttendanceRecords;
    }
    return JSON.parse(raw);
  } catch {
    return initialAttendanceRecords;
  }
}

export function saveAttendanceToStorage(records: AttendanceRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to save attendance to localStorage:", err);
  }
}

export function loadCurrentStudentFromStorage(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCurrentStudentToStorage(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save student profile to localStorage:", err);
  }
}

// Generate CSV for Attendance
export function generateAttendanceCSV(session: DarsSession, records: AttendanceRecord[]): string {
  const sessionRecords = records.filter((r) => r.sessionId === session.id);
  const headers = [
    "Sl No",
    "Student Name",
    "WhatsApp Number",
    "Department",
    "Year of Study",
    "Check-in Time",
    "Method",
    "Session Title",
    "Session Date",
  ];

  const rows = sessionRecords.map((r, index) => {
    const timeFormatted = new Date(r.checkinTime).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return [
      index + 1,
      `"${r.student.fullName.replace(/"/g, '""')}"`,
      `"${r.student.whatsappNumber}"`,
      `"${r.student.department}"`,
      `"${r.student.year}"`,
      `"${timeFormatted}"`,
      `"${r.checkinMethod}"`,
      `"${session.title.replace(/"/g, '""')}"`,
      `"${session.date}"`,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

// Generate CSV for Master Student Directory
export function generateStudentDirectoryCSV(students: StudentProfile[]): string {
  const headers = [
    "Sl No",
    "Student Name",
    "WhatsApp Number",
    "Department",
    "Year of Study",
    "Registration Date",
  ];

  const rows = students.map((s, index) => {
    const dateFormatted = s.registeredAt
      ? new Date(s.registeredAt).toLocaleDateString("en-IN")
      : "Earlier";
    return [
      index + 1,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.whatsappNumber}"`,
      `"${s.department}"`,
      `"${s.year}"`,
      `"${dateFormatted}"`,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}
