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
  Lock,
  Unlock,
  Building2,
  Eye,
  EyeOff,
  UserCheck,
  GraduationCap,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  DarsSession,
  AttendanceRecord,
  StudentProfile,
  Department,
  StudentYear,
  TKMCE_DEPARTMENTS,
  TKMCE_YEARS,
  DEFAULT_COORDINATOR_PIN,
  STORAGE_KEYS,
  loadSessionsFromStorage,
  saveSessionsToStorage,
  generateAttendanceCSV,
  generateStudentDirectoryCSV,
} from "@/data/attendance-data";
import {
  getAllStudents,
  getSessionAttendance,
  recordAttendance,
} from "@/lib/firebase-service";

export default function CoordinatorDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"attendance" | "directory">("attendance");

  const [sessions, setSessions] = useState<DarsSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);

  // Filtering & search states for attendance
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterDept, setFilterDept] = useState<string>("All");
  const [filterYear, setFilterYear] = useState<string>("All");

  // Filtering for directory
  const [dirSearchQuery, setDirSearchQuery] = useState<string>("");
  const [dirFilterDept, setDirFilterDept] = useState<string>("All");
  const [dirFilterYear, setDirFilterYear] = useState<string>("All");

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
    year: "1st Year",
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

  // Load sessions, attendance, and student directory
  const refreshData = async () => {
    const loadedSessions = loadSessionsFromStorage();
    setSessions(loadedSessions);

    let currentSessId = selectedSessionId;
    if (loadedSessions.length > 0) {
      if (!currentSessId || !loadedSessions.find((s) => s.id === currentSessId)) {
        const live = loadedSessions.find((s) => s.status === "live") || loadedSessions[0];
        currentSessId = live.id;
        setSelectedSessionId(live.id);
      }
    }

    if (currentSessId) {
      const loadedRecords = await getSessionAttendance(currentSessId);
      setRecords(loadedRecords);
    }

    const students = await getAllStudents();
    setAllStudents(students);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, selectedSessionId]);

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
      const matchesYear = filterYear === "All" || rec.student.year === filterYear;

      return matchesSearch && matchesDept && matchesYear;
    });
  }, [sessionAttendees, searchQuery, filterDept, filterYear]);

  const filteredDirectory = useMemo(() => {
    return allStudents.filter((student) => {
      const q = dirSearchQuery.toLowerCase();
      const matchesSearch =
        student.fullName.toLowerCase().includes(q) ||
        student.whatsappNumber.includes(q) ||
        student.department.toLowerCase().includes(q);

      const matchesDept = dirFilterDept === "All" || student.department === dirFilterDept;
      const matchesYear = dirFilterYear === "All" || student.year === dirFilterYear;

      return matchesSearch && matchesDept && matchesYear;
    });
  }, [allStudents, dirSearchQuery, dirFilterDept, dirFilterYear]);

  // Attendance Analytics Metrics
  const metrics = useMemo(() => {
    const total = sessionAttendees.length;
    const firstYear = sessionAttendees.filter((r) => r.student.year === "1st Year").length;
    const secondYear = sessionAttendees.filter((r) => r.student.year === "2nd Year").length;
    const thirdYear = sessionAttendees.filter((r) => r.student.year === "3rd Year").length;
    const fourthYear = sessionAttendees.filter((r) => r.student.year === "4th Year").length;

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

    return { total, firstYear, secondYear, thirdYear, fourthYear, topDept, topDeptCount };
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
  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;

    if (!manualForm.fullName.trim() || manualForm.whatsappNumber.length !== 10) {
      setManualError("Please enter full name and a valid 10-digit mobile number.");
      return;
    }

    const cleanPhone = manualForm.whatsappNumber.replace(/\D/g, "");
    const cleanStudent: StudentProfile = {
      ...manualForm,
      whatsappNumber: cleanPhone,
    };

    const result = await recordAttendance(currentSession.id, cleanStudent, "manual_coordinator");

    if (result.alreadyRecorded) {
      setManualError("This student is already recorded for this session.");
      return;
    }

    setShowManualAddModal(false);
    setManualForm({
      fullName: "",
      whatsappNumber: "",
      department: "Computer Science",
      year: "1st Year",
    });
    setManualError("");
    refreshData();
  };

  // Export Attendance to CSV
  const handleExportAttendanceCSV = () => {
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

  // Export Student Directory to CSV
  const handleExportDirectoryCSV = () => {
    const csvContent = generateStudentDirectoryCSV(allStudents);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `ssf-tkmce-master-student-directory-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Login Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[85vh] items-center justify-center bg-[#faf3e3] p-4 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border border-[#e8d8b4] bg-[#fcf9f1] p-6 sm:p-8 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c49a45]/40 bg-[#f7f0df] text-[#c49a45]">
            <Lock className="h-7 w-7" />
          </div>

          <div className="mt-4 text-center">
            <h1 className="font-serif text-2xl font-bold text-[#382b20]">
              Coordinator Access
            </h1>
            <p className="mt-1 text-xs text-[#6f532f]">
              Enter coordinator passcode to manage weekly Darse attendance sessions and student directory.
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c49a45] px-4 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#b08734]"
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
      <header className="border-b border-[#e8d8b4] bg-[#fcf9f1] px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#c49a45] bg-[#f7f0df] font-serif text-xs font-bold text-[#382b20] sm:h-10 sm:w-10 sm:text-sm">
              SSF
            </div>
            <div>
              <div className="font-serif text-base font-bold text-[#382b20] sm:text-lg">
                SSF TKMCE Coordinator
              </div>
              <div className="text-[11px] text-[#80613a] sm:text-xs">
                Attendance & Student Directory
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/darse/attendance/live"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#c49a45] bg-[#f7f0df] px-3 py-1.5 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
            >
              <Monitor className="h-3.5 w-3.5 text-[#c49a45]" />
              <span className="hidden sm:inline">Projector View</span>
            </Link>

            <Link
              href="/students/register"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6c49f] bg-[#f7f0df] px-3 py-1.5 text-xs font-semibold text-[#5a4224] hover:bg-[#faefe0]"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Enroll</span>
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#d6c49f] px-3 py-1.5 text-xs text-[#80613a] hover:bg-[#f7f0df]"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-[#eedebb] bg-[#fcf9f1]/70 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl gap-6 sm:gap-8">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`border-b-2 py-3 text-xs font-bold tracking-wider uppercase transition ${
              activeTab === "attendance"
                ? "border-[#c49a45] text-[#382b20]"
                : "border-transparent text-[#80613a] hover:text-[#382b20]"
            }`}
          >
            Darse Attendance ({sessionAttendees.length})
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`border-b-2 py-3 text-xs font-bold tracking-wider uppercase transition ${
              activeTab === "directory"
                ? "border-[#c49a45] text-[#382b20]"
                : "border-transparent text-[#80613a] hover:text-[#382b20]"
            }`}
          >
            Student Directory ({allStudents.length})
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: WEEKLY DARSE ATTENDANCE */}
        {/* ========================================================================= */}
        {activeTab === "attendance" && (
          <>
            {/* Session Selector & Controls Bar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-2xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label className="text-xs font-bold tracking-wider text-[#7a5725] uppercase">
                  Session:
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
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
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
                    {currentSession.status === "live" ? "Live" : "Locked"}
                  </span>
                )}
              </div>

              {currentSession && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSessionStatus}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      currentSession.status === "live"
                        ? "border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100"
                        : "border-emerald-400 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                    }`}
                  >
                    {currentSession.status === "live" ? (
                      <>
                        <StopCircle className="h-4 w-4" /> End Session
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4" /> Re-open Live
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 rounded-xl border border-[#eedebb] bg-[#f7f0df] px-3 py-2 text-xs">
                    <span className="text-[#80613a]">PIN:</span>
                    <span className="font-mono font-bold text-[#382b20]">
                      {currentSession.sessionPin || "None"}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowNewSessionModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#c49a45] px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b08734]"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    New
                  </button>
                </div>
              )}
            </div>

            {/* Attendance Analytics Metric Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#80613a]">
                  <span>Total Present</span>
                  <Users className="h-4 w-4 text-[#c49a45]" />
                </div>
                <div className="mt-2 font-serif text-2xl font-bold text-[#382b20] sm:text-3xl">
                  {metrics.total}
                </div>
                <div className="mt-1 text-[10px] text-[#6f532f] sm:text-[11px]">
                  Checked in today
                </div>
              </div>

              <div className="rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#80613a]">
                  <span>1st & 2nd Years</span>
                  <GraduationCap className="h-4 w-4 text-[#c49a45]" />
                </div>
                <div className="mt-2 font-serif text-2xl font-bold text-[#382b20] sm:text-3xl">
                  {metrics.firstYear + metrics.secondYear}
                </div>
                <div className="mt-1 text-[10px] text-[#6f532f] sm:text-[11px]">
                  Junior engineers
                </div>
              </div>

              <div className="rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#80613a]">
                  <span>3rd & 4th Years</span>
                  <Building2 className="h-4 w-4 text-[#c49a45]" />
                </div>
                <div className="mt-2 font-serif text-2xl font-bold text-[#382b20] sm:text-3xl">
                  {metrics.thirdYear + metrics.fourthYear}
                </div>
                <div className="mt-1 text-[10px] text-[#6f532f] sm:text-[11px]">
                  Senior engineers
                </div>
              </div>

              <div className="rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#80613a]">
                  <span>Top Department</span>
                  <UserCheck className="h-4 w-4 text-[#c49a45]" />
                </div>
                <div className="mt-2 font-serif text-lg font-bold text-[#382b20] truncate sm:text-xl">
                  {metrics.topDept}
                </div>
                <div className="mt-1 text-[10px] text-[#6f532f] sm:text-[11px]">
                  {metrics.topDeptCount} students
                </div>
              </div>
            </div>

            {/* Attendance Filter & Action Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
              <div className="flex flex-1 flex-wrap items-center gap-2 sm:gap-3">
                <div className="relative w-full sm:w-auto sm:min-w-[200px]">
                  <Search className="absolute inset-y-0 left-0 my-auto ml-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[#d6c49f] bg-white pl-9 pr-3 py-2 text-xs text-[#382b20] focus:border-[#c49a45] focus:outline-hidden"
                  />
                </div>

                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full rounded-xl border border-[#d6c49f] bg-white px-3 py-2 text-xs text-[#5a4224] sm:w-auto"
                >
                  <option value="All">All Departments</option>
                  {TKMCE_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full rounded-xl border border-[#d6c49f] bg-white px-3 py-2 text-xs text-[#5a4224] sm:w-auto"
                >
                  <option value="All">All Years</option>
                  {TKMCE_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowManualAddModal(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#d6c49f] bg-[#f7f0df] px-3.5 py-2 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Manual Check-In
                </button>

                <button
                  onClick={handleExportAttendanceCSV}
                  disabled={sessionAttendees.length === 0}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#c49a45] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#b08734] disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {/* Attendance Roster — Responsive Mobile Card View + Desktop Table */}
            <div className="overflow-hidden rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] shadow-2xs">
              <div className="border-b border-[#eedebb] px-4 py-3.5 sm:px-6 sm:py-4">
                <h2 className="font-serif text-base font-bold text-[#382b20] sm:text-lg">
                  Attendee Roster ({filteredAttendees.length})
                </h2>
                <p className="text-[11px] text-[#80613a] sm:text-xs">
                  Verified attendees for {currentSession?.title}
                </p>
              </div>

              {/* Mobile Card List (sm:hidden) */}
              <div className="divide-y divide-[#eedebb]/70 sm:hidden">
                {filteredAttendees.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#80613a]">
                    No attendees match current filters.
                  </div>
                ) : (
                  filteredAttendees.map((rec, index) => {
                    const timeFormatted = new Date(rec.checkinTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                    return (
                      <div key={rec.id} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm text-[#382b20]">
                            #{index + 1}. {rec.student.fullName}
                          </span>
                          <span className="font-mono text-[11px] text-stone-500">
                            {timeFormatted}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="rounded-md bg-[#f7f0df] px-2 py-0.5 text-[11px] font-semibold text-[#5a4224]">
                            {rec.student.department}
                          </span>
                          <span className="rounded-md bg-[#faefe0] px-2 py-0.5 text-[11px] font-medium text-[#7a5725]">
                            {rec.student.year}
                          </span>
                          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                            {rec.checkinMethod === "qr_scan" ? "QR Camera" : "Manual"}
                          </span>
                        </div>
                        <div className="pt-1">
                          <a
                            href={`https://wa.me/91${rec.student.whatsappNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 hover:underline"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            +91 {rec.student.whatsappNumber}
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop Table (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#eedebb] bg-[#f7f0df] text-[#5a4224] uppercase">
                    <tr>
                      <th className="px-5 py-3 font-semibold">#</th>
                      <th className="px-5 py-3 font-semibold">Student Name</th>
                      <th className="px-5 py-3 font-semibold">WhatsApp</th>
                      <th className="px-5 py-3 font-semibold">Department</th>
                      <th className="px-5 py-3 font-semibold">Year of Study</th>
                      <th className="px-5 py-3 font-semibold">Check-in Time</th>
                      <th className="px-5 py-3 font-semibold">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eedebb]/70">
                    {filteredAttendees.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#80613a]">
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
                              <a
                                href={`https://wa.me/91${rec.student.whatsappNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-700 hover:underline"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                +91 {rec.student.whatsappNumber}
                              </a>
                            </td>
                            <td className="px-5 py-3.5 text-stone-800">
                              {rec.student.department}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#f7f0df] px-2 py-0.5 text-[11px] font-medium text-[#5a4224]">
                                {rec.student.year}
                              </span>
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
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MASTER STUDENT DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            {/* Directory Overview Bar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-2xs">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#382b20] sm:text-xl">
                  Student Master Directory ({allStudents.length})
                </h2>
                <p className="text-[11px] text-[#80613a] sm:text-xs">
                  Active in Google Firestore. Always accessible 24/7/365.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/students/register"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#c49a45] bg-[#f7f0df] px-3.5 py-2 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
                >
                  <PlusCircle className="h-4 w-4 text-[#c49a45]" />
                  Enroll Student
                </Link>

                <button
                  onClick={handleExportDirectoryCSV}
                  disabled={allStudents.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#c49a45] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#b08734] disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filter and Search Bar for Directory */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-4 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
              <div className="flex flex-1 flex-wrap items-center gap-2 sm:gap-3">
                <div className="relative w-full sm:w-auto sm:min-w-[200px]">
                  <Search className="absolute inset-y-0 left-0 my-auto ml-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search student or mobile..."
                    value={dirSearchQuery}
                    onChange={(e) => setDirSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[#d6c49f] bg-white pl-9 pr-3 py-2 text-xs text-[#382b20] focus:border-[#c49a45] focus:outline-hidden"
                  />
                </div>

                <select
                  value={dirFilterDept}
                  onChange={(e) => setDirFilterDept(e.target.value)}
                  className="w-full rounded-xl border border-[#d6c49f] bg-white px-3 py-2 text-xs text-[#5a4224] sm:w-auto"
                >
                  <option value="All">All Departments</option>
                  {TKMCE_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={dirFilterYear}
                  onChange={(e) => setDirFilterYear(e.target.value)}
                  className="w-full rounded-xl border border-[#d6c49f] bg-white px-3 py-2 text-xs text-[#5a4224] sm:w-auto"
                >
                  <option value="All">All Years</option>
                  {TKMCE_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Directory Table & Mobile Cards */}
            <div className="overflow-hidden rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] shadow-2xs">
              {/* Mobile Directory Card List (sm:hidden) */}
              <div className="divide-y divide-[#eedebb]/70 sm:hidden">
                {filteredDirectory.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#80613a]">
                    No students found matching current filters.
                  </div>
                ) : (
                  filteredDirectory.map((student, index) => (
                    <div key={student.whatsappNumber} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-[#382b20]">
                          #{index + 1}. {student.fullName}
                        </span>
                        <a
                          href={`https://wa.me/91${student.whatsappNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800"
                        >
                          <MessageCircle className="h-3 w-3" />
                          WhatsApp
                        </a>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="rounded-md bg-[#f7f0df] px-2 py-0.5 text-[11px] font-semibold text-[#5a4224]">
                          {student.department}
                        </span>
                        <span className="rounded-md bg-[#faefe0] px-2 py-0.5 text-[11px] font-medium text-[#7a5725]">
                          {student.year}
                        </span>
                        <span className="font-mono text-[11px] text-stone-600">
                          +91 {student.whatsappNumber}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#eedebb] bg-[#f7f0df] text-[#5a4224] uppercase">
                    <tr>
                      <th className="px-5 py-3 font-semibold">#</th>
                      <th className="px-5 py-3 font-semibold">Full Name</th>
                      <th className="px-5 py-3 font-semibold">WhatsApp Number</th>
                      <th className="px-5 py-3 font-semibold">Department</th>
                      <th className="px-5 py-3 font-semibold">Year of Study</th>
                      <th className="px-5 py-3 font-semibold">Registered Date</th>
                      <th className="px-5 py-3 font-semibold text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eedebb]/70">
                    {filteredDirectory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#80613a]">
                          No students found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredDirectory.map((student, index) => (
                        <tr key={student.whatsappNumber} className="hover:bg-[#faefe0]/60 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-stone-500">{index + 1}</td>
                          <td className="px-5 py-3.5 font-semibold text-[#382b20]">
                            {student.fullName}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-stone-700">
                            +91 {student.whatsappNumber}
                          </td>
                          <td className="px-5 py-3.5 text-stone-800">
                            {student.department}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#f7f0df] px-2.5 py-0.5 text-[11px] font-medium text-[#5a4224]">
                              {student.year}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-stone-500">
                            {student.registeredAt
                              ? new Date(student.registeredAt).toLocaleDateString("en-IN")
                              : "Earlier"}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <a
                              href={`https://wa.me/91${student.whatsappNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100"
                            >
                              <MessageCircle className="h-3 w-3" />
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Start New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-[#e8d8b4] bg-[#fcf9f1] p-6 shadow-xl">
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
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-xs text-[#382b20]"
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
                    className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-xs text-[#382b20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5a4224]">
                    4-Digit PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newSessionForm.sessionPin}
                    onChange={(e) =>
                      setNewSessionForm({ ...newSessionForm, sessionPin: e.target.value })
                    }
                    className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-center font-mono text-xs font-bold text-[#382b20]"
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
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-xs text-[#382b20]"
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
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-xs text-[#382b20]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="rounded-xl border border-[#d6c49f] px-4 py-2.5 text-xs text-[#5a4224] hover:bg-[#f7f0df]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#c49a45] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#b08734]"
                >
                  Create & Launch Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Add Student Modal (4 Clean Fields) */}
      {showManualAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-[#e8d8b4] bg-[#fcf9f1] p-6 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#382b20]">
              Manual Student Check-In
            </h3>
            <p className="mt-1 text-xs text-[#6f532f]">
              For students attending without a smartphone or experiencing battery issues.
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
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-xs text-[#382b20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  WhatsApp Mobile Number *
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
                  className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-xs text-[#382b20]"
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
                    className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-xs text-[#382b20]"
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
                    Year of Study
                  </label>
                  <select
                    value={manualForm.year}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        year: e.target.value as StudentYear,
                      })
                    }
                    className="mt-1 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-xs text-[#382b20]"
                  >
                    {TKMCE_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {manualError && (
                <p className="text-xs font-medium text-rose-600">{manualError}</p>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualAddModal(false)}
                  className="rounded-xl border border-[#d6c49f] px-4 py-2.5 text-xs text-[#5a4224] hover:bg-[#f7f0df]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#c49a45] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#b08734]"
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
