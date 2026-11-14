"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import QRCode from "qrcode";
import {
  Users,
  Clock,
  MapPin,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  DarsSession,
  AttendanceRecord,
  loadSessionsFromStorage,
} from "@/data/attendance-data";
import { subscribeToLiveAttendance } from "@/lib/firebase-service";

export default function LiveProjectorPage() {
  const [sessions, setSessions] = useState<DarsSession[]>([]);
  const [activeSession, setActiveSession] = useState<DarsSession | null>(null);
  const [attendanceCount, setAttendanceCount] = useState<number>(0);
  const [recentAttendees, setRecentAttendees] = useState<AttendanceRecord[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDynamic, setIsDynamic] = useState<boolean>(false);
  const [autoSecondsLeft, setAutoSecondsLeft] = useState<number>(45);
  const [, startTransition] = useTransition();

  // Load sessions on mount
  useEffect(() => {
    const loaded = loadSessionsFromStorage();
    setSessions(loaded);
    const live = loaded.find((s) => s.status === "live") || loaded[0];
    setActiveSession(live || null);
  }, []);

  // Real-time Firestore Live Subscription for Attendance
  useEffect(() => {
    if (!activeSession) return;

    const unsubscribe = subscribeToLiveAttendance(activeSession.id, (records) => {
      setAttendanceCount(records.length);
      setRecentAttendees(records.slice(0, 6));
    });

    return () => unsubscribe();
  }, [activeSession]);

  // Generate QR Code
  useEffect(() => {
    if (!activeSession) return;

    const origin = typeof window !== "undefined" ? window.location.origin : "https://ssf-tkmce.vercel.app";
    let targetUrl = `${origin}/darse/attendance?s=${encodeURIComponent(activeSession.id)}`;

    if (activeSession.sessionPin) {
      targetUrl += `&pin=${encodeURIComponent(activeSession.sessionPin)}`;
    }

    if (isDynamic) {
      targetUrl += `&t=${Date.now()}`;
    }

    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: "#2A1F17", // Rich deep espresso
        light: "#FAF3E3", // Warm ivory background
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      });
  }, [activeSession, isDynamic, autoSecondsLeft]);

  // Countdown timer for dynamic rotating QR
  useEffect(() => {
    if (!isDynamic) return;

    const timer = setInterval(() => {
      setAutoSecondsLeft((prev) => {
        if (prev <= 1) {
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDynamic]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const copyLink = () => {
    if (!activeSession) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://ssf-tkmce.vercel.app";
    const url = `${origin}/darse/attendance?s=${encodeURIComponent(activeSession.id)}&pin=${encodeURIComponent(activeSession.sessionPin || "")}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!activeSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf3e3] p-6 text-center">
        <div className="max-w-md rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-8">
          <h2 className="font-serif text-2xl font-bold text-[#382b20]">
            No Darse Session Selected
          </h2>
          <p className="mt-2 text-sm text-[#6f532f]">
            Please open the coordinator dashboard to start or select a session.
          </p>
          <Link
            href="/darse/attendance/dashboard"
            className="mt-6 inline-flex rounded-xl bg-[#c49a45] px-5 py-2.5 text-xs font-semibold text-white shadow-xs"
          >
            Go to Coordinator Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf3e3] text-[#382b20]">
      {/* Top Bar for Projector Navigation */}
      <header className="border-b border-[#e8d8b4] bg-[#fcf9f1]/90 px-6 py-3.5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#c49a45] bg-[#f7f0df] font-serif text-sm font-bold text-[#382b20]">
              SSF
            </div>
            <div>
              <div className="font-serif text-base font-bold text-[#382b20] sm:text-lg">
                SSF TKMCE · Weekly Darse Attendance Screen
              </div>
              <div className="text-xs text-[#80613a]">
                TKM College of Engineering · Karicode, Kollam
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Session Switcher if multiple */}
            {sessions.length > 1 && (
              <select
                value={activeSession.id}
                onChange={(e) => {
                  const found = sessions.find((s) => s.id === e.target.value);
                  if (found) startTransition(() => setActiveSession(found));
                }}
                className="hidden rounded-xl border border-[#d6c49f] bg-white px-3 py-1.5 text-xs text-[#5a4224] sm:block"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.sessionNumber} - {s.title.substring(0, 24)}...
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={copyLink}
              title="Copy attendance URL"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6c49f] bg-[#f7f0df] px-3 py-1.5 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy Link"}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen Projector"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6c49f] bg-[#f7f0df] px-3 py-1.5 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Projector</span>
            </button>

            <Link
              href="/darse/attendance/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#c49a45] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#b08734]"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Projector Canvas */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Left Column: Session Meta & Live Counter */}
          <div className="space-y-6 lg:col-span-7">
            {/* Status & Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#c49a45]/40 bg-[#f7f0df] px-4 py-1.5 text-xs font-bold tracking-wider text-[#7a5725]">
                DARSE SESSION #{activeSession.sessionNumber}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
                CHECK-IN OPEN
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#80613a]">
                <Sparkles className="h-3.5 w-3.5 text-[#c49a45]" />
                Google Firestore Live Sync
              </span>
            </div>

            {/* Arabic Motto Header */}
            <div lang="ar" dir="rtl" className="font-arabic text-2xl text-[#6f532f] sm:text-3xl">
              {activeSession.arabicQuote || "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"}
            </div>

            {/* Main Title */}
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#382b20] sm:text-4xl lg:text-5xl">
                {activeSession.title}
              </h1>
              <p className="mt-3 text-base text-[#6f532f] sm:text-lg">
                Speaker: <span className="font-semibold text-[#382b20]">{activeSession.speaker}</span>
              </p>
            </div>

            {/* Time & Venue */}
            <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-[#e8d8b4] bg-[#fcf9f1] p-5 text-sm text-[#514334] shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f0df] text-[#b07e2a]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#80613a] uppercase">Time</div>
                  <div className="font-medium text-[#382b20]">{activeSession.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f0df] text-[#b07e2a]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#80613a] uppercase">Venue</div>
                  <div className="font-medium text-[#382b20]">{activeSession.location}</div>
                </div>
              </div>
            </div>

            {/* Live Attendance Counter Card */}
            <div className="rounded-2xl border-2 border-[#c49a45] bg-gradient-to-br from-[#fcf9f1] via-[#f7f0df] to-[#faefe0] p-6 shadow-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c49a45] text-white shadow-xs">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-wider text-[#7a5725] uppercase">
                      Live Hall Headcount
                    </div>
                    <div className="font-serif text-4xl font-extrabold text-[#382b20] sm:text-5xl">
                      {attendanceCount}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                    Cloud Real-Time
                  </div>
                  <div className="mt-1 text-[11px] text-[#80613a]">
                    Updates instantly as phones scan
                  </div>
                </div>
              </div>

              {/* Recent Check-Ins ticker */}
              {recentAttendees.length > 0 && (
                <div className="mt-5 border-t border-[#eedebb] pt-4">
                  <div className="text-[11px] font-semibold tracking-wider text-[#80613a] uppercase">
                    Just Checked In
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {recentAttendees.map((att) => (
                      <span
                        key={att.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#d6c49f] bg-white px-3 py-1 text-xs font-medium text-[#382b20] shadow-2xs"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        {att.student.fullName} ({att.student.department} · {att.student.year})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Session PIN Code Banner for the Hall */}
            {activeSession.sessionPin && (
              <div className="flex items-center justify-between rounded-2xl border border-[#eedebb] bg-[#f7f0df] px-6 py-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-[#c49a45]" />
                  <div>
                    <div className="text-xs font-bold tracking-wider text-[#5a4224] uppercase">
                      Today&apos;s Session Passcode
                    </div>
                    <div className="text-xs text-[#80613a]">
                      Students verify this 4-digit code to submit attendance
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-[#c49a45] bg-white px-5 py-2 font-mono text-3xl font-extrabold tracking-[0.25em] text-[#382b20] shadow-xs">
                  {activeSession.sessionPin}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: High-Contrast QR Display */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <div className="w-full max-w-sm rounded-3xl border-4 border-[#c49a45] bg-[#fcf9f1] p-7 text-center shadow-md">
              <div className="mb-4">
                <span className="inline-block rounded-full bg-[#f7f0df] px-4 py-1 text-xs font-bold tracking-widest text-[#7a5725] uppercase">
                  Scan With Any Mobile Camera
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold text-[#382b20]">
                  Record Your Attendance
                </h3>
              </div>

              {/* QR Container */}
              <div className="relative mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center overflow-hidden rounded-2xl border-2 border-[#d6c49f] bg-[#faf3e3] p-2 shadow-inner">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="Darse Attendance QR Code"
                    className="h-full w-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-xs text-[#80613a]">Generating QR Code...</div>
                )}
              </div>

              {/* Instructions below QR */}
              <p className="mt-4 text-xs font-medium text-[#6f532f]">
                Point phone camera · Open link · 1-tap confirmation
              </p>

              {/* Dynamic QR Mode Toggle */}
              <div className="mt-5 border-t border-[#eedebb] pt-4">
                <div className="flex items-center justify-between text-xs text-[#6f532f]">
                  <span className="font-medium">Rotating QR (Anti-Proxy)</span>
                  <button
                    type="button"
                    onClick={() => setIsDynamic(!isDynamic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDynamic ? "bg-[#c49a45]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDynamic ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {isDynamic && (
                  <p className="mt-2 text-[11px] text-[#b07e2a]">
                    Refreshes in {autoSecondsLeft}s with expiring security token.
                  </p>
                )}
              </div>

              {/* Test Link Button */}
              <div className="mt-4">
                <Link
                  href={`/darse/attendance?s=${activeSession.id}&pin=${activeSession.sessionPin || ""}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs text-[#80613a] hover:text-[#382b20] hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Test Check-in in New Tab
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
