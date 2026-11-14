import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  DarsSession,
  AttendanceRecord,
  StudentProfile,
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadAttendanceFromStorage,
  saveAttendanceToStorage,
} from "@/data/attendance-data";

/**
 * Fetch active sessions:
 * If Supabase is connected, queries the cloud PostgreSQL database.
 * Otherwise, falls back smoothly to localStorage/seed data.
 */
export async function getDarsSessions(): Promise<DarsSession[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("dars_sessions")
        .select("*")
        .order("session_number", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          sessionNumber: row.session_number,
          title: row.title,
          speaker: row.speaker,
          location: row.location,
          date: row.date,
          time: row.time || "Thursday after Maghrib (7:00 PM)",
          status: row.status,
          sessionPin: row.session_pin || "",
          topicPoints: row.topic_points || [],
          arabicQuote: row.arabic_quote,
        }));
      }
    } catch (err) {
      console.warn("Supabase query error, falling back to local storage:", err);
    }
  }

  return loadSessionsFromStorage();
}

/**
 * Record student attendance:
 * If Supabase is connected, persists student profile & attendance to PostgreSQL.
 * Also persists locally on the student's device for instant 1-tap re-use.
 */
export async function recordStudentAttendance(
  sessionId: string,
  profile: StudentProfile
): Promise<{ success: boolean; recordId?: string; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Upsert student master record by phone number
      const { data: studentData, error: studentError } = await supabase
        .from("dars_students")
        .upsert(
          {
            full_name: profile.fullName,
            whatsapp_number: profile.whatsappNumber,
            department: profile.department,
            semester: profile.year,
            residence_type: profile.residenceType || "Campus",
          },
          { onConflict: "whatsapp_number" }
        )
        .select()
        .single();

      if (studentError) {
        console.error("Failed to upsert student:", studentError);
        return { success: false, error: studentError.message };
      }

      // 2. Insert attendance record
      const { data: attData, error: attError } = await supabase
        .from("dars_attendances")
        .insert({
          session_id: sessionId,
          student_id: studentData.id,
          checkin_method: "qr_scan",
        })
        .select()
        .single();

      if (attError) {
        // If already checked in (unique constraint violation)
        if (attError.code === "23505") {
          return { success: true, recordId: "already_recorded" };
        }
        return { success: false, error: attError.message };
      }

      return { success: true, recordId: attData.id };
    } catch (err: any) {
      console.error("Cloud attendance record error:", err);
      return { success: false, error: err.message || "Failed to record" };
    }
  }

  // Local fallback
  const records = loadAttendanceFromStorage();
  const existing = records.find(
    (r) =>
      r.sessionId === sessionId &&
      r.student.whatsappNumber.replace(/\D/g, "") ===
        profile.whatsappNumber.replace(/\D/g, "")
  );

  if (existing) {
    return { success: true, recordId: existing.id };
  }

  const newRecord: AttendanceRecord = {
    id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sessionId,
    student: profile,
    checkinTime: new Date().toISOString(),
    checkinMethod: "qr_scan",
  };

  saveAttendanceToStorage([newRecord, ...records]);
  return { success: true, recordId: newRecord.id };
}

/**
 * Fetch all attendance records for a session
 */
export async function getSessionAttendance(
  sessionId: string
): Promise<AttendanceRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("dars_attendances")
        .select(`
          id,
          session_id,
          checkin_time,
          checkin_method,
          dars_students (
            full_name,
            whatsapp_number,
            department,
            semester,
            residence_type
          )
        `)
        .eq("session_id", sessionId)
        .order("checkin_time", { ascending: false });

      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          sessionId: row.session_id,
          student: {
            fullName: row.dars_students?.full_name || "Unknown",
            whatsappNumber: row.dars_students?.whatsapp_number || "",
            department: row.dars_students?.department || "Other",
            year: (row.dars_students?.semester as any) || "1st Year",
            residenceType: row.dars_students?.residence_type || "Day Scholar",
          },
          checkinTime: row.checkin_time,
          checkinMethod: row.checkin_method || "qr_scan",
        }));
      }
    } catch (err) {
      console.warn("Supabase fetch error, fallback to local:", err);
    }
  }

  const localRecords = loadAttendanceFromStorage();
  return localRecords.filter((r) => r.sessionId === sessionId);
}
