"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  UserCheck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  BookOpen,
  Edit3,
} from "lucide-react";
import {
  DarsSession,
  StudentProfile,
  AttendanceRecord,
  TKMCE_DEPARTMENTS,
  TKMCE_SEMESTERS,
  RESIDENCE_TYPES,
  Department,
  Semester,
  ResidenceType,
  loadSessionsFromStorage,
  loadAttendanceFromStorage,
  saveAttendanceToStorage,
  loadStudentProfileFromStorage,
  saveStudentProfileToStorage,
} from "@/data/attendance-data";

function AttendanceCheckinContent() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("s");
  const urlPin = searchParams.get("pin");

  const [sessions, setSessions] = useState<DarsSession[]>([]);
  const [activeSession, setActiveSession] = useState<DarsSession | null>(null);
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: "",
    whatsappNumber: "",
    department: "Computer Science",
    semester: "S6",
    residenceType: "Campus Hostel",
  });
  const [isReturning, setIsReturning] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [enteredPin, setEnteredPin] = useState(urlPin || "");
  const [pinError, setPinError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkedInRecord, setCheckedInRecord] = useState<AttendanceRecord | null>(null);
  const [attendeeCount, setAttendeeCount] = useState(0);

  // Load session and profile data on mount
  useEffect(() => {
    const loadedSessions = loadSessionsFromStorage();
    setSessions(loadedSessions);

    // Pick specified session from URL, or the first 'live' session, or the most recent
    let target = loadedSessions.find((s) => s.id === urlSessionId);
    if (!target) {
      target = loadedSessions.find((s) => s.status === "live") || loadedSessions[0];
    }
    setActiveSession(target || null);

    // Update PIN if passed in URL
    if (urlPin) {
      setEnteredPin(urlPin);
    }

    // Load saved student profile
    const savedProfile = loadStudentProfileFromStorage();
    if (savedProfile && savedProfile.fullName && savedProfile.whatsappNumber) {
      setProfile(savedProfile);
      setIsReturning(true);
    }

    // Check if already checked into this session
    if (target) {
      const records = loadAttendanceFromStorage();
      const sessionRecords = records.filter((r) => r.sessionId === target.id);
      setAttendeeCount(sessionRecords.length);

      if (savedProfile) {
        const existing = sessionRecords.find(
          (r) => r.student.whatsappNumber === savedProfile.whatsappNumber
        );
        if (existing) {
          setCheckedInRecord(existing);
        }
      }
    }
  }, [urlSessionId, urlPin]);

  const validateForm = () => {
    let valid = true;
    setNameError("");
    setPhoneError("");
    setPinError("");

    if (!profile.fullName.trim() || profile.fullName.trim().length < 3) {
      setNameError("Please enter your full name.");
      valid = false;
    }

    const cleanPhone = profile.whatsappNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setPhoneError("Please enter a valid 10-digit WhatsApp number.");
      valid = false;
    }

    if (activeSession?.sessionPin && activeSession.sessionPin.trim() !== "") {
      if (enteredPin.trim() !== activeSession.sessionPin.trim()) {
        setPinError("Incorrect 4-digit session code. Ask the coordinator or check the display.");
        valid = false;
      }
    }

    return valid;
  };

  const handleCheckIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeSession) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Save profile for fast 1-tap return
      saveStudentProfileToStorage(profile);

      const records = loadAttendanceFromStorage();
      // Check for duplicate in session
      const existing = records.find(
        (r) =>
          r.sessionId === activeSession.id &&
          r.student.whatsappNumber.replace(/\D/g, "") ===
            profile.whatsappNumber.replace(/\D/g, "")
      );

      if (existing) {
        setCheckedInRecord(existing);
        setIsSubmitting(false);
        return;
      }

      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sessionId: activeSession.id,
        student: profile,
        checkinTime: new Date().toISOString(),
        checkinMethod: "qr_scan",
      };

      const updatedRecords = [newRecord, ...records];
      saveAttendanceToStorage(updatedRecords);
      setCheckedInRecord(newRecord);
      setAttendeeCount((prev) => prev + 1);
    } catch (err) {
      console.error("Check-in error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeSession) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-8 text-center shadow-xs">
        <ShieldAlert className="mx-auto h-12 w-12 text-[#b07e2a]" />
        <h2 className="mt-4 font-serif text-2xl font-bold text-[#382b20]">
          No Active Darse Session
        </h2>
        <p className="mt-2 text-sm text-[#6f532f]">
          There is no Darse session active for attendance right now. Please check back during the next weekly gathering.
        </p>
        <Link
          href="/darse"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c49a45] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#b08734]"
        >
          Explore Darse Schedule <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Session Header Card */}
      <div className="overflow-hidden rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] shadow-xs">
        <div className="border-b border-[#eedebb] bg-gradient-to-r from-[#f7f0df] via-[#faefe0] to-[#f4ebda] px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c49a45]/30 bg-[#f7f0df] px-3 py-1 text-xs font-semibold tracking-wider text-[#7a5725]">
              WEEKLY DARSE #{activeSession.sessionNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                activeSession.status === "live"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  activeSession.status === "live"
                    ? "bg-emerald-600 animate-pulse"
                    : "bg-amber-600"
                }`}
              />
              {activeSession.status === "live" ? "Live Session" : "Scheduled"}
            </span>
          </div>

          <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#382b20] sm:text-3xl">
            {activeSession.title}
          </h1>

          {activeSession.arabicQuote && (
            <p
              lang="ar"
              dir="rtl"
              className="mt-2 font-arabic text-xl leading-relaxed text-[#514334]"
            >
              {activeSession.arabicQuote}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#6f532f]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#b07e2a]" />
              {activeSession.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#b07e2a]" />
              {activeSession.location}
            </span>
          </div>
        </div>

        {/* Checked-In Success Card */}
        {checkedInRecord ? (
          <div className="p-6 sm:p-8">
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/80 p-6 text-center shadow-xs">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold text-emerald-950">
                Attendance Confirmed!
              </h2>
              <p className="mt-1 text-sm text-emerald-800">
                Alhamdulillah, your attendance has been recorded for today&apos;s session.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-900 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Attendee #{attendeeCount} Recorded Today
              </div>

              {/* Student Summary Pill */}
              <div className="mt-6 rounded-xl border border-emerald-200/60 bg-white/90 p-4 text-left text-xs text-stone-700">
                <div className="flex justify-between border-b border-emerald-100 pb-2">
                  <span className="text-stone-500">Student Name</span>
                  <span className="font-semibold text-stone-900">
                    {checkedInRecord.student.fullName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 py-2">
                  <span className="text-stone-500">Department & Semester</span>
                  <span className="font-semibold text-stone-900">
                    {checkedInRecord.student.department} ({checkedInRecord.student.semester})
                  </span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 py-2">
                  <span className="text-stone-500">Residence</span>
                  <span className="font-semibold text-stone-900">
                    {checkedInRecord.student.residenceType}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-500">Check-in Timestamp</span>
                  <span className="font-semibold text-stone-900">
                    {new Date(checkedInRecord.checkinTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Session Highlights / Notes */}
            {activeSession.topicPoints && activeSession.topicPoints.length > 0 && (
              <div className="mt-6 rounded-xl border border-[#eedebb] bg-[#f7f0df]/70 p-5">
                <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#5a4224] uppercase">
                  <BookOpen className="h-4 w-4 text-[#c49a45]" />
                  Today&apos;s Core Discussion Points
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-[#514334]">
                  {activeSession.topicPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c49a45]" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/darse"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#c49a45]/40 bg-[#f7f0df] px-4 py-2.5 text-center text-xs font-semibold text-[#514334] transition hover:bg-[#faefe0]"
              >
                View Full Darse Notes
              </Link>
              <Link
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c49a45] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-xs transition hover:bg-[#b08734]"
              >
                Return to Campus Home <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : isReturning && !editingProfile ? (
          /* Returning Student 1-Tap Check-In Card */
          <div className="p-6 sm:p-8">
            <div className="rounded-2xl border border-[#e8d8b4] bg-[#f7f0df]/60 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c49a45]/40 bg-[#fcf9f1] text-[#c49a45]">
                <UserCheck className="h-7 w-7" />
              </div>
              <p className="mt-3 text-xs tracking-wider text-[#80613a] uppercase">
                Welcome Back
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#382b20]">
                {profile.fullName}
              </h2>
              <p className="mt-1 text-xs text-[#6f532f]">
                {profile.department} · {profile.semester} · {profile.residenceType}
              </p>

              {/* 4-Digit Session PIN Input */}
              {activeSession.sessionPin && (
                <div className="mt-6 text-left">
                  <label className="block text-xs font-semibold text-[#5a4224]">
                    Today&apos;s 4-Digit Session Code
                  </label>
                  <p className="text-[11px] text-[#80613a]">
                    Announced on projector/by the coordinator.
                  </p>
                  <input
                    type="text"
                    maxLength={4}
                    inputMode="numeric"
                    placeholder="e.g. 4819"
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError("");
                    }}
                    className="mt-2 block w-full rounded-xl border border-[#d6c49f] bg-white px-4 py-3 text-center font-mono text-xl tracking-[0.25em] text-[#382b20] focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
                  />
                  {pinError && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">{pinError}</p>
                  )}
                </div>
              )}

              {/* 1-Tap Action Button */}
              <button
                type="button"
                onClick={() => handleCheckIn()}
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c49a45] px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#b08734] disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Recording Attendance..."
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Confirm Attendance (1-Tap)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setEditingProfile(true)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#80613a] hover:text-[#5a4224] hover:underline"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Not you, or need to change batch/hostel details?
              </button>
            </div>
          </div>
        ) : (
          /* Full Registration / Check-In Form */
          <form onSubmit={handleCheckIn} className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#eedebb] pb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#382b20]">
                  {isReturning ? "Update Your Details" : "Quick Student Check-In"}
                </h2>
                <p className="text-xs text-[#80613a]">
                  Takes only 15 seconds. Saved securely on your phone for future 1-tap check-in.
                </p>
              </div>
              {isReturning && (
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="rounded-lg border border-[#d6c49f] px-2.5 py-1 text-xs text-[#5a4224] hover:bg-[#f7f0df]"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#5a4224]">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mohammed Bilal K."
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-sm text-[#382b20] placeholder:text-stone-400 focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
              />
              {nameError && (
                <p className="mt-1 text-xs font-medium text-rose-600">{nameError}</p>
              )}
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-semibold text-[#5a4224]">
                WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-medium text-stone-500">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98471 23456"
                  maxLength={10}
                  value={profile.whatsappNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, whatsappNumber: e.target.value.replace(/\D/g, "") })
                  }
                  className="block w-full rounded-xl border border-[#d6c49f] bg-white pl-12 pr-3.5 py-2.5 text-sm text-[#382b20] placeholder:text-stone-400 focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
                />
              </div>
              {phoneError && (
                <p className="mt-1 text-xs font-medium text-rose-600">{phoneError}</p>
              )}
            </div>

            {/* Department & Semester Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.department}
                  onChange={(e) =>
                    setProfile({ ...profile, department: e.target.value as Department })
                  }
                  className="mt-1.5 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-sm text-[#382b20] focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
                >
                  {TKMCE_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Semester / Batch <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.semester}
                  onChange={(e) =>
                    setProfile({ ...profile, semester: e.target.value as Semester })
                  }
                  className="mt-1.5 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-sm text-[#382b20] focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
                >
                  {TKMCE_SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Residence Type */}
            <div>
              <label className="block text-xs font-semibold text-[#5a4224]">
                Campus Residence <span className="text-rose-500">*</span>
              </label>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {RESIDENCE_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs transition ${
                      profile.residenceType === type
                        ? "border-[#c49a45] bg-[#faefe0] font-semibold text-[#382b20]"
                        : "border-[#e8d8b4] bg-white text-[#514334] hover:bg-[#fcf9f1]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="residenceType"
                      value={type}
                      checked={profile.residenceType === type}
                      onChange={() =>
                        setProfile({ ...profile, residenceType: type as ResidenceType })
                      }
                      className="accent-[#c49a45]"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Session 4-Digit PIN */}
            {activeSession.sessionPin && (
              <div className="rounded-xl border border-[#eedebb] bg-[#f7f0df]/70 p-4">
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Today&apos;s 4-Digit Session Code <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-[#80613a]">
                  Enter the 4-digit code displayed on the screen or announced by the coordinator.
                </p>
                <input
                  type="text"
                  maxLength={4}
                  inputMode="numeric"
                  placeholder="e.g. 4819"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError("");
                  }}
                  className="mt-2 block w-full rounded-xl border border-[#d6c49f] bg-white px-4 py-2.5 text-center font-mono text-lg tracking-[0.25em] text-[#382b20] focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
                />
                {pinError && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{pinError}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c49a45] px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#b08734] disabled:opacity-50"
            >
              {isSubmitting ? (
                "Submitting Check-In..."
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Submit & Confirm Attendance
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer helper links */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-[#80613a]">
        <span className="flex items-center gap-1.5">
          <Smartphone className="h-4 w-4 text-[#c49a45]" />
          SSF TKMCE Digital Portal
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/darse/attendance/live"
            className="hover:text-[#5a4224] hover:underline"
          >
            Projector Screen Mode
          </Link>
          <span>·</span>
          <Link
            href="/darse/attendance/dashboard"
            className="hover:text-[#5a4224] hover:underline"
          >
            Coordinator Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <main className="min-h-[85vh] bg-[#faf3e3] px-4 py-10 sm:py-14">
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-12 text-center text-sm text-[#80613a]">
            Loading Darse Attendance...
          </div>
        }
      >
        <AttendanceCheckinContent />
      </Suspense>
    </main>
  );
}
