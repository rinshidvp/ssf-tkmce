// ============================================================================
// SSF TKMCE — Weekly Darse QR Attendance System Data & Helpers
// ============================================================================

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

export type Department =
  | "Civil"
  | "Mechanical"
  | "Electrical & Electronics"
  | "Electronics & Comm"
  | "Computer Science"
  | "Chemical"
  | "Production"
  | "Architecture"
  | "MCA"
  | "Other";

export type Semester =
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "S7"
  | "S8"
  | "M.Tech"
  | "PhD"
  | "Alumni";

export type ResidenceType = "Campus Hostel" | "Private Hostel / PG" | "Day Scholar";

export interface StudentProfile {
  fullName: string;
  whatsappNumber: string;
  department: Department;
  semester: Semester;
  residenceType: ResidenceType;
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

export const TKMCE_SEMESTERS: Semester[] = [
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
  "M.Tech",
  "PhD",
  "Alumni",
];

export const RESIDENCE_TYPES: ResidenceType[] = [
  "Campus Hostel",
  "Private Hostel / PG",
  "Day Scholar",
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
      "Balancing rigorous academic pressure with inner tranquility",
      "Brotherhood and mutual support among hostelers and day-scholars",
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
  {
    id: "sess-2026-w40",
    sessionNumber: 40,
    title: "Living the Sunnah in Contemporary Campus Life",
    speaker: "Usthad Rashid Hudawi",
    location: "TKMCE Campus Prayer Hall",
    date: "2026-11-05",
    time: "Thursday after Maghrib (7:00 PM)",
    status: "completed",
    sessionPin: "2950",
    topicPoints: [
      "Character in speech, digital conduct, and online spaces",
      "Punctuality and barakah in time management during semester exams",
    ],
    arabicQuote: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ",
    transliteration: "Innama bu'ithtu li-utammima makarim al-akhlaq",
  },
];

// Pre-seeded attendees for demonstration
export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: "att-101",
    sessionId: "sess-2026-w42",
    student: {
      fullName: "Mohammed Bilal K.",
      whatsappNumber: "9847123456",
      department: "Mechanical",
      semester: "S6",
      residenceType: "Campus Hostel",
    },
    checkinTime: "2026-11-14T19:05:22.000Z",
    checkinMethod: "qr_scan",
  },
  {
    id: "att-102",
    sessionId: "sess-2026-w42",
    student: {
      fullName: "Ameer Suhail",
      whatsappNumber: "9745234567",
      department: "Computer Science",
      semester: "S4",
      residenceType: "Private Hostel / PG",
    },
    checkinTime: "2026-11-14T19:08:14.000Z",
    checkinMethod: "qr_scan",
  },
  {
    id: "att-103",
    sessionId: "sess-2026-w42",
    student: {
      fullName: "Faris Rahman",
      whatsappNumber: "9495345678",
      department: "Civil",
      semester: "S8",
      residenceType: "Day Scholar",
    },
    checkinTime: "2026-11-14T19:12:45.000Z",
    checkinMethod: "qr_scan",
  },
  {
    id: "att-104",
    sessionId: "sess-2026-w42",
    student: {
      fullName: "Rinshid V.P.",
      whatsappNumber: "9567456789",
      department: "Electrical & Electronics",
      semester: "S6",
      residenceType: "Campus Hostel",
    },
    checkinTime: "2026-11-14T19:15:02.000Z",
    checkinMethod: "qr_scan",
  },
  {
    id: "att-105",
    sessionId: "sess-2026-w42",
    student: {
      fullName: "Naseem Akhtar",
      whatsappNumber: "9895567890",
      department: "Electronics & Comm",
      semester: "S2",
      residenceType: "Private Hostel / PG",
    },
    checkinTime: "2026-11-14T19:18:33.000Z",
    checkinMethod: "qr_scan",
  },
];

// Local storage key constants
export const STORAGE_KEYS = {
  SESSIONS: "ssf_tkmce_dars_sessions",
  ATTENDANCE: "ssf_tkmce_dars_attendance",
  STUDENT_PROFILE: "ssf_tkmce_student_profile",
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

export function loadStudentProfileFromStorage(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStudentProfileToStorage(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save profile to localStorage:", err);
  }
}

// Export attendance list to CSV format
export function generateAttendanceCSV(session: DarsSession, records: AttendanceRecord[]): string {
  const sessionRecords = records.filter((r) => r.sessionId === session.id);
  const headers = [
    "Sl No",
    "Student Name",
    "WhatsApp Number",
    "Department",
    "Semester",
    "Residence",
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
      `"${r.student.semester}"`,
      `"${r.student.residenceType}"`,
      `"${timeFormatted}"`,
      `"${r.checkinMethod}"`,
      `"${session.title.replace(/"/g, '""')}"`,
      `"${session.date}"`,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}
