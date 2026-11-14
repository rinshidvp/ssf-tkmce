import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  StudentProfile,
  AttendanceRecord,
  DarsSession,
  loadStudentsFromStorage,
  saveStudentsToStorage,
  loadAttendanceFromStorage,
  saveAttendanceToStorage,
  saveCurrentStudentToStorage,
  loadCurrentStudentFromStorage,
} from "@/data/attendance-data";

/**
 * 1. Register or Update a Student in the Master Directory
 */
export async function registerStudent(
  profile: StudentProfile
): Promise<{ success: boolean; error?: string }> {
  // Always cache locally on this device
  saveCurrentStudentToStorage(profile);

  const localStudents = loadStudentsFromStorage();
  const existingIdx = localStudents.findIndex(
    (s) => s.whatsappNumber === profile.whatsappNumber
  );
  if (existingIdx >= 0) {
    localStudents[existingIdx] = profile;
  } else {
    localStudents.unshift(profile);
  }
  saveStudentsToStorage(localStudents);

  // If Firebase Firestore is active, save to cloud
  if (isFirebaseConfigured && db) {
    try {
      const studentDocRef = doc(db, "students", profile.whatsappNumber);
      await setDoc(
        studentDocRef,
        {
          fullName: profile.fullName,
          whatsappNumber: profile.whatsappNumber,
          department: profile.department,
          year: profile.year,
          registeredAt: profile.registeredAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return { success: true };
    } catch (err: any) {
      console.error("Firestore register student error:", err);
      // Graceful fallback: local save already succeeded
      return { success: true };
    }
  }

  return { success: true };
}

/**
 * 2. Lookup student by WhatsApp phone number
 */
export async function getStudentByPhone(
  phone: string
): Promise<StudentProfile | null> {
  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return null;

  if (isFirebaseConfigured && db) {
    try {
      const studentDocRef = doc(db, "students", cleanPhone);
      const snap = await getDoc(studentDocRef);
      if (snap.exists()) {
        const d = snap.data();
        return {
          fullName: d.fullName,
          whatsappNumber: d.whatsappNumber,
          department: d.department,
          year: d.year,
          registeredAt: d.registeredAt,
        };
      }
    } catch (err) {
      console.warn("Firestore lookup failed, falling back to local:", err);
    }
  }

  // Check current device cached student first
  const current = loadCurrentStudentFromStorage();
  if (current && current.whatsappNumber === cleanPhone) {
    return current;
  }

  const localStudents = loadStudentsFromStorage();
  return localStudents.find((s) => s.whatsappNumber === cleanPhone) || null;
}

/**
 * 3. Fetch all registered students for Coordinator Directory
 */
export async function getAllStudents(): Promise<StudentProfile[]> {
  if (isFirebaseConfigured && db) {
    try {
      const studentsColl = collection(db, "students");
      const snap = await getDocs(studentsColl);
      if (!snap.empty) {
        const list: StudentProfile[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            fullName: data.fullName,
            whatsappNumber: data.whatsappNumber,
            department: data.department,
            year: data.year,
            registeredAt: data.registeredAt,
          });
        });
        saveStudentsToStorage(list); // sync to local
        return list;
      }
    } catch (err) {
      console.warn("Firestore fetch students error, falling back to local:", err);
    }
  }

  return loadStudentsFromStorage();
}

/**
 * 4. Record Dars Attendance for a student
 */
export async function recordAttendance(
  sessionId: string,
  student: StudentProfile,
  method: "qr_scan" | "manual_coordinator" = "qr_scan"
): Promise<{ success: boolean; recordId: string; alreadyRecorded?: boolean }> {
  // Save/update student profile
  await registerStudent(student);

  const docId = `${sessionId}_${student.whatsappNumber}`;
  const record: AttendanceRecord = {
    id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sessionId,
    student,
    checkinTime: new Date().toISOString(),
    checkinMethod: method,
  };

  // Local storage save
  const localRecords = loadAttendanceFromStorage();
  const existing = localRecords.find(
    (r) =>
      r.sessionId === sessionId &&
      r.student.whatsappNumber === student.whatsappNumber
  );

  if (existing) {
    return { success: true, recordId: existing.id, alreadyRecorded: true };
  }

  saveAttendanceToStorage([record, ...localRecords]);

  // Firestore cloud save
  if (isFirebaseConfigured && db) {
    try {
      const attDocRef = doc(db, "dars_attendances", docId);
      const existingSnap = await getDoc(attDocRef);
      if (existingSnap.exists()) {
        return { success: true, recordId: docId, alreadyRecorded: true };
      }

      await setDoc(attDocRef, {
        id: docId,
        sessionId,
        student: {
          fullName: student.fullName,
          whatsappNumber: student.whatsappNumber,
          department: student.department,
          year: student.year,
        },
        checkinTime: record.checkinTime,
        checkinMethod: method,
      });

      return { success: true, recordId: docId };
    } catch (err) {
      console.error("Firestore attendance write error:", err);
    }
  }

  return { success: true, recordId: record.id };
}

/**
 * 5. Fetch Session Attendance Records
 */
export async function getSessionAttendance(
  sessionId: string
): Promise<AttendanceRecord[]> {
  if (isFirebaseConfigured && db) {
    try {
      const attColl = collection(db, "dars_attendances");
      const q = query(attColl, where("sessionId", "==", sessionId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const records: AttendanceRecord[] = [];
        snap.forEach((d) => {
          const data = d.data();
          records.push({
            id: data.id || d.id,
            sessionId: data.sessionId,
            student: data.student,
            checkinTime: data.checkinTime,
            checkinMethod: data.checkinMethod || "qr_scan",
          });
        });
        // Sort newest first
        records.sort(
          (a, b) =>
            new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime()
        );
        return records;
      }
    } catch (err) {
      console.warn("Firestore attendance read error:", err);
    }
  }

  const local = loadAttendanceFromStorage();
  return local.filter((r) => r.sessionId === sessionId);
}

/**
 * 6. Real-Time Snapshot Listener for the Live Projector Screen
 */
export function subscribeToLiveAttendance(
  sessionId: string,
  onUpdate: (records: AttendanceRecord[]) => void
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const attColl = collection(db, "dars_attendances");
      const q = query(attColl, where("sessionId", "==", sessionId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const records: AttendanceRecord[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          records.push({
            id: data.id || d.id,
            sessionId: data.sessionId,
            student: data.student,
            checkinTime: data.checkinTime,
            checkinMethod: data.checkinMethod || "qr_scan",
          });
        });
        records.sort(
          (a, b) =>
            new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime()
        );
        onUpdate(records);
      });
      return unsubscribe;
    } catch (err) {
      console.warn("Firestore snapshot listener error:", err);
    }
  }

  // Fallback to local storage poller
  const interval = setInterval(() => {
    const local = loadAttendanceFromStorage().filter((r) => r.sessionId === sessionId);
    onUpdate(local);
  }, 2500);

  return () => clearInterval(interval);
}
