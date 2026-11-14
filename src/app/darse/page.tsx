import type { Metadata } from "next";
import Link from "next/link";
import { QrCode, Monitor, Sliders, CheckCircle2, UserCheck } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { DarseExplorer } from "@/components/darse-explorer";
import { darseSessions } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Darse & Attendance",
  description: "Weekly campus Darse, classical Arabic kitab study circles, QR code attendance tracking, and Malayalam takeaway notes at TKMCE.",
};

export default function DarsePage() {
  return (
    <main>
      <PageBanner
        eyebrow="LEARN · REFLECT · GROW"
        title="Darse & Study Circles"
        description="Weekly gatherings combining classical Arabic text study with thoughtful English dialogue and Malayalam takeaway reflections."
        malayalamLine="അറിവ് ഒരു യാത്രയാണ് — പ്രതിവാര ദർസ് സെഷനുകളും പഠനക്കുറിപ്പുകളും."
        arabicLine="وَقُل رَّبِّ زِدْنِي عِلْمًا"
      />

      {/* QR Attendance Portal Hero Banner */}
      <section className="mx-auto max-w-7xl px-5 pt-10 pb-4">
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#c49a45]/40 bg-gradient-to-br from-[#fcf9f1] via-[#f7f0df] to-[#faefe0] p-6 shadow-xs sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c49a45]/40 bg-[#f7f0df] px-3 py-1 text-xs font-bold tracking-wider text-[#7a5725]">
                  <QrCode className="h-3.5 w-3.5 text-[#c49a45]" />
                  DIGITAL ATTENDANCE SYSTEM
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Fast 1-Tap Check-In
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold tracking-tight text-[#382b20] sm:text-3xl">
                Weekly Darse QR Check-In
              </h2>

              <p className="text-sm text-[#6f532f]">
                Scan the session QR code using your phone camera during the weekly gathering at TKMCE Prayer Hall. New students enroll in 10 seconds; returning students check in with 1 tap.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/darse/attendance"
                className="inline-flex items-center gap-2 rounded-xl bg-[#c49a45] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#b08734]"
              >
                <QrCode className="h-4 w-4" />
                Scan & Check In
              </Link>

              <Link
                href="/students/register"
                className="inline-flex items-center gap-2 rounded-xl border border-[#d6c49f] bg-[#fcf9f1] px-3.5 py-2.5 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
              >
                <UserCheck className="h-4 w-4 text-[#c49a45]" />
                Enroll Student
              </Link>

              <Link
                href="/darse/attendance/live"
                className="inline-flex items-center gap-2 rounded-xl border border-[#d6c49f] bg-[#fcf9f1] px-3.5 py-2.5 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
              >
                <Monitor className="h-4 w-4 text-[#c49a45]" />
                Projector Mode
              </Link>

              <Link
                href="/darse/attendance/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[#d6c49f] bg-[#fcf9f1] px-3.5 py-2.5 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0]"
              >
                <Sliders className="h-4 w-4 text-[#c49a45]" />
                Coordinator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <DarseExplorer sessions={darseSessions} />
      </section>
    </main>
  );
}
