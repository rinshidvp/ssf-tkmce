"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Download,
  Search,
  PlusCircle,
  PlayCircle,
  StopCircle,
  Monitor,
  Trash2,
  Lock,
  Unlock,
  Building2,
  Home,
  CheckCircle,
  Calendar,
  Eye,
  EyeOff,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import {
  DarsSession,
  AttendanceRecord,
  StudentProfile,
  Department,
  Semester,
  ResidenceType,
  TKMCE_DEPARTMENTS,
  TKMCE_SEMESTERS,
  RESIDENCE_TYPES,
  DEFAULT_COORDINATOR_PIN,
  STORAGE_KEYS,
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadAttendanceFromStorage,
  saveAttendanceToStorage,
  generateAttendanceCSV,
} from "@/data/attendance-data";

export default function CoordinatorDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const [sessions, setSessions] = useState<DarsSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Filtering & search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterDept, setFilterDept] = useState<string>("All");
  const [filterResidence, setFilterResidence] = useState<string>("All");

  // Modals
  const [showNewSessionModal, setShowNewSessionModal] = useState<boolean>(false);
  const [showManualAddModal, setShowManualAddModal] = useState<boolean>(false);

  // New Session form state
  const [newSessionForm, setNewSessionForm] = useState({
    sessionNumber: 43,
    title: "",
    speaker: "Campus Usthad",
    location: "TKMCE Prayer Hall / Campus Masjid",
    date: new Date().toISOString().split("T")[0],
    time: "Thursday after Maghrib (7:00 PM)",
    sessionPin: Math.floor(1000 + Math.random() * 9000).toString(),
  });

  // Manual Add student form state
  const [manualForm, setManualForm] = useState<StudentProfile>({
    fullName: "",
    whatsappNumber: "",
    department: "Computer Science",
    semester: "S6",
    residenceType: "Campus Hostel",
  });
  const [manualError, setManualError] = useState<string>("");

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = sessionStorage.getItem(STORAGE_KEYS.COORDINATOR_AUTH);
      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Load sessions and attendance
  const refreshData = () => {
    const loadedSessions = loadSessionsFromStorage();
    setSessions(loadedSessions);

    if (loadedSessions.length > 0) {
      if (!selectedSessionId || !loadedSessions.find((s) => s.id === selectedSessionId)) {
        const live = loadedSessions.find((s) => s.status === "live") || loadedSessions[0];
        setSelectedSessionId(live.id);
      }
    }

    const loadedRecords = loadAttendanceFromStorage();
    setRecords(loadedRecords);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === DEFAULT_COORDINATOR_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.COORDINATOR_AUTH, "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect coordinator passcode. Default is SSF@TKM2026");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.COORDINATOR_AUTH);
    setPasscodeInput("");
  };

  const currentSession = useMemo(() => {
    return sessions.find((s) => s.id === selectedSessionId) || sessions[0] || null;
  }, [sessions, selectedSessionId]);

  const sessionAttendees = useMemo(() => {
    if (!currentSession) return [];
    return records.filter((r) => r.sessionId === currentSession.id);
  }, [records, currentSession]);

  const filteredAttendees = useMemo(() => {
    return sessionAttendees.filter((rec) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        rec.student.fullName.toLowerCase().includes(q) ||
        rec.student.whatsappNumber.includes(q) ||
        rec.student.department.toLowerCase().includes(q);

      const matchesDept = filterDept === "All" || rec.student.department === filterDept;
      const matchesResidence =
        filterResidence === "All" || rec.student.residenceType === filterResidence;

      return matchesSearch && matchesDept && matchesResidence;
    });
  }, [sessionAttendees, searchQuery, filterDept, filterResidence]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const total = sessionAttendees.length;
    const campusHostel = sessionAttendees.filter(
      (r) => r.student.residenceType === "Campus Hostel"
    ).length;
    const privateHostel = sessionAttendees.filter(
      (r) => r.student.residenceType === "Private Hostel / PG"
    ).length;
    const dayScholar = sessionAttendees.filter(
      (r) => r.student.residenceType === "Day Scholar"
    ).length;

    // Department counts
    const deptMap: Record<string, number> = {};
    sessionAttendees.forEach((r) => {
      deptMap[r.student.department] = (deptMap[r.student.department] || 0) + 1;
    });
    let topDept = "None";
    let topDeptCount = 0;
    Object.entries(deptMap).forEach(([dept, count]) => {
      if (count > topDeptCount) {
        topDept = dept;
        topDeptCount = count;
      }
    });

    return { total, campusHostel, privateHostel, dayScholar, topDept, topDeptCount };
  }, [sessionAttendees]);

  // Toggle Session status (Live <-> Completed)
  const toggleSessionStatus = () => {
    if (!currentSession) return;
    const newStatus = currentSession.status === "live" ? "completed" : "live";
    const updated = sessions.map((s) =>
      s.id === currentSession.id ? { ...s, status: newStatus as "live" | "completed" } : s
    );
    setSessions(updated);
    saveSessionsToStorage(updated);
  };

  // Create New Session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionForm.title.trim()) return;

    const newId = `sess-${Date.now()}`;
    const newSession: DarsSession = {
      id: newId,
      sessionNumber: Number(newSessionForm.sessionNumber),
      title: newSessionForm.title,
      speaker: newSessionForm.speaker,
      location: newSessionForm.location,
      date: newSessionForm.date,
      time: newSessionForm.time,
      status: "live",
      sessionPin: newSessionForm.sessionPin,
      topicPoints: [],
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveSessionsToStorage(updated);
    setSelectedSessionId(newId);
    setShowNewSessionModal(false);
  };

  // Manual Add Student to Attendance
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;

    if (!manualForm.fullName.trim() || manualForm.whatsappNumber.length < 10) {
      setManualError("Please enter student name and a valid 10-digit number.");
      return;
    }

    // Check duplicate
    const exists = sessionAttendees.some(
      (r) => r.student.whatsappNumber === manualForm.whatsappNumber
    );
    if (exists) {
      setManualError("This student has already been recorded for this session.");
      return;
    }

    const newRec: AttendanceRecord = {
      id: `att-manual-${Date.now()}`,
      sessionId: currentSession.id,
      student: manualForm,
      checkinTime: new Date().toISOString(),
      checkinMethod: "manual_coordinator",
    };

    const updated = [newRec, ...records];
    setRecords(updated);
    saveAttendanceToStorage(updated);
    setShowManualAddModal(false);
    setManualForm({
      fullName: "",
      whatsappNumber: "",
      department: "Computer Science",
      semester: "S6",
      residenceType: "Campus Hostel",
    });
    setManualError("");
  };

  // Delete an attendance entry
  const handleDeleteEntry = (recordId: string) => {
    if (confirm("Are you sure you want to remove this attendance record?")) {
      const updated = records.filter((r) => r.id !== recordId);
      setRecords(updated);
      saveAttendanceToStorage(updated);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!currentSession) return;
    const csvContent = generateAttendanceCSV(currentSession, records);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `ssf-tkmce-darse-attendance-sess${currentSession.sessionNumber}-${currentSession.date}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Login Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[85vh] items-center justify-center bg-[#faf3e3] p-6">
        <div className="w-full max-w-md rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-8 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c49a45]/40 bg-[#f7f0df] text-[#c49a45]">
            <Lock className="h-7 w-7" />
          </div>

          <div className="mt-4 text-center">
            <h1 className="font-serif text-2xl font-bold text-[#382b20]">
              Coordinator Access
            </h1>
            <p className="mt-1 text-xs text-[#6f532f]">
              Enter the coordinator passcode to manage weekly Darse attendance sessions and export records.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5a4224]">
                Coordinator Passcode
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPasscode ? "text" : "password"}
                  placeholder="Enter passcode (e.g. SSF@TKM2026)"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-sm text-[#382b20] focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-500 hover:text-stone-700"
                >
                  {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {authError && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c49a45] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#b08734]"
            >
              <Unlock className="h-4 w-4" />
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 border-t border-[#eedebb] pt-4 text-center">
            <Link
              href="/darse"
              className="text-xs text-[#80613a] hover:text-[#5a4224] hover:underline"
            >
              ← Back to Darse Overview
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf3e3] text-[#382b20]">
      {/* Top Coordinator Header */}
      <header className="border-b border-[#e8d8b4] bg-[#fcf9f1] px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#c49a45] bg-[#f7f0df] font-serif text-sm font-bold text-[#382b20]">
              SSF
            </div>
            <div>
              <div className="font-serif text-lg font-bold text-[#382b20]">
                SSF TKMCE · Darse Attendance Coordinator
              </div>
              <div className="text-xs text-[#80613a]">
                Weekly Darse Management & Real-Time Roster
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/darse/attendance/live"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#c49a45] bg-[#f7f0df] px-3.5 py-2 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
            >
              <Monitor className="h-4 w-4 text-[#c49a45]" />
              Open Projector View
            </Link>

            <button
              onClick={() => setShowNewSessionModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#c49a45] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#b08734]"
            >
              <PlusCircle className="h-4 w-4" />
              Start New Session
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#d6c49f] px-3 py-2 text-xs text-[#80613a] hover:bg-[#f7f0df]"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 space-y-6">
        {/* Session Selector & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-5 shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-bold tracking-wider text-[#7a5725] uppercase">
              Select Session:
            </label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="rounded-xl border border-[#d6c49f] bg-white px-3 py-2 text-xs font-semibold text-[#382b20] focus:border-[#c49a45] focus:outline-hidden"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.sessionNumber} — {s.title} ({s.date})
                </option>
              ))}
            </select>

            {currentSession && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  currentSession.status === "live"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    currentSession.status === "live"
                      ? "bg-emerald-600 animate-pulse"
                      : "bg-amber-600"
                  }`}
                />
                {currentSession.status === "live" ? "Live for Check-ins" : "Completed / Locked"}
              </span>
            )}
          </div>

          {currentSession && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleSessionStatus}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  currentSession.status === "live"
                    ? "border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    : "border-emerald-400 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                }`}
              >
                {currentSession.status === "live" ? (
                  <>
                    <StopCircle className="h-4 w-4" /> End Session Check-ins
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" /> Re-open Live Session
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-[#eedebb] bg-[#f7f0df] px-3 py-1.5 text-xs">
                <span className="text-[#80613a]">Session PIN:</span>
                <span className="font-mono font-bold text-[#382b20]">
                  {currentSession.sessionPin || "None"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Analytics Summary Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#80613a]">
              <span>Total Attendees</span>
              <Users className="h-4 w-4 text-[#c49a45]" />
            </div>
            <div className="mt-2 font-serif text-3xl font-bold text-[#382b20]">
              {metrics.total}
            </div>
            <div className="mt-1 text-[11px] text-[#6f532f]">Recorded for this session</div>
          </div>

          <div className="rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#80613a]">
              <span>Campus Hostelers</span>
              <Building2 className="h-4 w-4 text-[#c49a45]" />
            </div>
            <div className="mt-2 font-serif text-3xl font-bold text-[#382b20]">
              {metrics.campusHostel}
            </div>
            <div className="mt-1 text-[11px] text-[#6f532f]">
              {metrics.total > 0
                ? `${Math.round((metrics.campusHostel / metrics.total) * 100)}% of attendance`
                : "0%"}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#80613a]">
              <span>Private PG / Hostels</span>
              <Home className="h-4 w-4 text-[#c49a45]" />
            </div>
            <div className="mt-2 font-serif text-3xl font-bold text-[#382b20]">
              {metrics.privateHostel}
            </div>
            <div className="mt-1 text-[11px] text-[#6f532f]">Off-campus hostelers</div>
          </div>

          <div className="rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#80613a]">
              <span>Day Scholars</span>
              <UserCheck className="h-4 w-4 text-[#c49a45]" />
            </div>
            <div className="mt-2 font-serif text-3xl font-bold text-[#382b20]">
              {metrics.dayScholar}
            </div>
            <div className="mt-1 text-[11px] text-[#6f532f]">Local college commuters</div>
          </div>
        </div>

        {/* Filter and Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 shadow-2xs">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="absolute inset-y-0 left-0 my-auto ml-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search student or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#d6c49f] bg-white pl-9 pr-3 py-1.5 text-xs text-[#382b20] focus:border-[#c49a45] focus:outline-hidden"
              />
            </div>

            {/* Department Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="rounded-xl border border-[#d6c49f] bg-white px-3 py-1.5 text-xs text-[#5a4224] focus:border-[#c49a45] focus:outline-hidden"
            >
              <option value="All">All Departments</option>
              {TKMCE_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Residence Filter */}
            <select
              value={filterResidence}
              onChange={(e) => setFilterResidence(e.target.value)}
              className="rounded-xl border border-[#d6c49f] bg-white px-3 py-1.5 text-xs text-[#5a4224] focus:border-[#c49a45] focus:outline-hidden"
            >
              <option value="All">All Residences</option>
              {RESIDENCE_TYPES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6c49f] bg-[#f7f0df] px-3.5 py-1.5 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Manual Add
            </button>

            <button
              onClick={handleExportCSV}
              disabled={sessionAttendees.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#c49a45] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#b08734] disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Attendance Roster Table */}
        <div className="overflow-hidden rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] shadow-2xs">
          <div className="border-b border-[#eedebb] px-6 py-4">
            <h2 className="font-serif text-lg font-bold text-[#382b20]">
              Attendee Roster ({filteredAttendees.length})
            </h2>
            <p className="text-xs text-[#80613a]">
              Chronological log of verified attendees for {currentSession?.title}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#eedebb] bg-[#f7f0df] text-[#5a4224] uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Student Name</th>
                  <th className="px-5 py-3 font-semibold">WhatsApp</th>
                  <th className="px-5 py-3 font-semibold">Dept & Batch</th>
                  <th className="px-5 py-3 font-semibold">Residence</th>
                  <th className="px-5 py-3 font-semibold">Check-in Time</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eedebb]/70">
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-[#80613a]">
                      No student attendance recorded matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map((rec, index) => {
                    const timeFormatted = new Date(rec.checkinTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                    return (
                      <tr key={rec.id} className="hover:bg-[#faefe0]/60 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-stone-500">{index + 1}</td>
                        <td className="px-5 py-3.5 font-semibold text-[#382b20]">
                          {rec.student.fullName}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-stone-700">
                          +91 {rec.student.whatsappNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#f7f0df] px-2 py-0.5 text-[11px] font-medium text-[#5a4224]">
                            {rec.student.department} · {rec.student.semester}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-stone-700">
                          {rec.student.residenceType}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-stone-600">
                          {timeFormatted}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              rec.checkinMethod === "qr_scan"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-sky-50 text-sky-800 border border-sky-200"
                            }`}
                          >
                            {rec.checkinMethod === "qr_scan" ? "QR Camera" : "Manual"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteEntry(rec.id)}
                            title="Delete this record"
                            className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Start New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-6 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#382b20]">
              Start New Darse Session
            </h3>
            <p className="mt-1 text-xs text-[#6f532f]">
              Configure session details and generate a weekly 4-digit PIN code.
            </p>

            <form onSubmit={handleCreateSession} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tazkiyat an-Nafs — Purification of the Heart"
                  value={newSessionForm.title}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2 text-xs text-[#382b20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5a4224]">
                    Session Number
                  </label>
                  <input
                    type="number"
                    value={newSessionForm.sessionNumber}
                    onChange={(e) =>
                      setNewSessionForm({
                        ...newSessionForm,
                        sessionNumber: Number(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2 text-xs text-[#382b20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5a4224]">
                    4-Digit Session PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newSessionForm.sessionPin}
                    onChange={(e) =>
                      setNewSessionForm({ ...newSessionForm, sessionPin: e.target.value })
                    }
                    className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2 text-center font-mono text-xs font-bold text-[#382b20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Speaker / Usthad
                </label>
                <input
                  type="text"
                  value={newSessionForm.speaker}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, speaker: e.target.value })
                  }
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2 text-xs text-[#382b20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Date
                </label>
                <input
                  type="date"
                  value={newSessionForm.date}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, date: e.target.value })
                  }
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2 text-xs text-[#382b20]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="rounded-xl border border-[#d6c49f] px-4 py-2 text-xs text-[#5a4224] hover:bg-[#f7f0df]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#c49a45] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b08734]"
                >
                  Create & Launch Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Add Student Modal */}
      {showManualAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-6 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#382b20]">
              Manual Student Check-In
            </h3>
            <p className="mt-1 text-xs text-[#6f532f]">
              For students attending without a smartphone or experiencing network issues.
            </p>

            <form onSubmit={handleManualAdd} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salman Faris"
                  value={manualForm.fullName}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, fullName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2 text-xs text-[#382b20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number"
                  value={manualForm.whatsappNumber}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      whatsappNumber: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2 text-xs text-[#382b20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5a4224]">
                    Department
                  </label>
                  <select
                    value={manualForm.department}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        department: e.target.value as Department,
                      })
                    }
                    className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3 py-2 text-xs text-[#382b20]"
                  >
                    {TKMCE_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5a4224]">
                    Semester
                  </label>
                  <select
                    value={manualForm.semester}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        semester: e.target.value as Semester,
                      })
                    }
                    className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3 py-2 text-xs text-[#382b20]"
                  >
                    {TKMCE_SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Residence
                </label>
                <select
                  value={manualForm.residenceType}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      residenceType: e.target.value as ResidenceType,
                    })
                  }
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3 py-2 text-xs text-[#382b20]"
                >
                  {RESIDENCE_TYPES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {manualError && (
                <p className="text-xs font-medium text-rose-600">{manualError}</p>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualAddModal(false)}
                  className="rounded-xl border border-[#d6c49f] px-4 py-2 text-xs text-[#5a4224] hover:bg-[#f7f0df]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#c49a45] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b08734]"
                >
                  Record Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
