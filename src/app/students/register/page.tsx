"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  QrCode,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import {
  StudentProfile,
  TKMCE_DEPARTMENTS,
  TKMCE_YEARS,
  Department,
  StudentYear,
  loadCurrentStudentFromStorage,
} from "@/data/attendance-data";
import { registerStudent } from "@/lib/firebase-service";

export default function StudentRegisterPage() {
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: "",
    whatsappNumber: "",
    department: "Computer Science",
    year: "1st Year",
  });

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const existing = loadCurrentStudentFromStorage();
    if (existing && existing.fullName && existing.whatsappNumber) {
      setProfile(existing);
      setIsRegistered(true);
    }
  }, []);

  const validate = () => {
    let valid = true;
    setNameError("");
    setPhoneError("");

    if (!profile.fullName.trim() || profile.fullName.trim().length < 3) {
      setNameError("Please enter your full name.");
      valid = false;
    }

    const cleanPhone = profile.whatsappNumber.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit WhatsApp phone number.");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const cleanPhone = profile.whatsappNumber.replace(/\D/g, "");
      const finalProfile: StudentProfile = {
        ...profile,
        whatsappNumber: cleanPhone,
        registeredAt: new Date().toISOString(),
      };

      await registerStudent(finalProfile);
      setProfile(finalProfile);
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-[#faf3e3] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-[#e8d8b4] bg-[#fcf9f1] shadow-xs">
          {/* Header */}
          <div className="border-b border-[#eedebb] bg-gradient-to-r from-[#f7f0df] via-[#faefe0] to-[#f4ebda] px-6 py-6 text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#c49a45] bg-[#f7f0df] font-serif text-base font-bold text-[#382b20] shadow-xs">
              SSF
            </div>
            <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#382b20] sm:text-3xl">
              Student Directory Registration
            </h1>
            <p className="mt-1 text-xs text-[#6f532f]">
              TKM College of Engineering · Karicode, Kollam
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#c49a45]/30 bg-[#f7f0df] px-3.5 py-1 text-xs font-semibold text-[#7a5725]">
              <Sparkles className="h-3.5 w-3.5 text-[#c49a45]" />
              Quick 10-Second Campus Enrollment
            </div>
          </div>

          {/* Body */}
          {isRegistered ? (
            <div className="p-6 sm:p-8">
              {/* Virtual Membership Card */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#c49a45] bg-gradient-to-br from-[#fcf9f1] via-[#f7f0df] to-[#faefe0] p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-[#eedebb] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49a45] bg-white font-serif text-sm font-bold text-[#382b20]">
                      SSF
                    </div>
                    <div>
                      <div className="font-serif text-sm font-bold text-[#382b20]">
                        SSF TKMCE Campus Unit
                      </div>
                      <div className="text-[10px] tracking-wider text-[#80613a] uppercase">
                        Verified Student Member
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="font-serif text-2xl font-bold text-[#382b20]">
                    {profile.fullName}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#6f532f]">
                    <span className="rounded-lg bg-white/80 px-2.5 py-1 text-[#382b20] shadow-2xs">
                      {profile.department}
                    </span>
                    <span className="rounded-lg bg-white/80 px-2.5 py-1 text-[#382b20] shadow-2xs">
                      {profile.year}
                    </span>
                    <span className="rounded-lg bg-white/80 px-2.5 py-1 font-mono text-[#382b20] shadow-2xs">
                      +91 {profile.whatsappNumber}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#eedebb] pt-4 text-[11px] text-[#7a5725]">
                  ✅ Details saved securely in the cloud & cached on your phone for instant 1-tap Darse attendance.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/darse/attendance"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c49a45] px-4 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-[#b08734]"
                >
                  <QrCode className="h-4 w-4" />
                  Attend Weekly Darse
                </Link>
                <button
                  type="button"
                  onClick={() => setIsRegistered(false)}
                  className="rounded-xl border border-[#d6c49f] px-4 py-3 text-xs font-semibold text-[#5a4224] hover:bg-[#f7f0df]"
                >
                  Edit Details
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
              <div className="rounded-xl border border-[#eedebb] bg-[#f7f0df]/60 p-4 text-xs text-[#6f532f]">
                Fill in your 4 details once. When you scan the weekly Darse QR code, your attendance will be recorded in 1 tap!
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammed Bilal K."
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="mt-1.5 block w-full rounded-xl border border-[#d6c49f] bg-white px-3.5 py-2.5 text-sm text-[#382b20] placeholder:text-stone-400 focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
                />
                {nameError && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{nameError}</p>
                )}
              </div>

              {/* WhatsApp Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  WhatsApp Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-medium text-stone-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98471 23456"
                    value={profile.whatsappNumber}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        whatsappNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="block w-full rounded-xl border border-[#d6c49f] bg-white pl-12 pr-3.5 py-2.5 text-sm text-[#382b20] placeholder:text-stone-400 focus:border-[#c49a45] focus:outline-hidden focus:ring-2 focus:ring-[#c49a45]/20"
                  />
                </div>
                {phoneError && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{phoneError}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Engineering Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.department}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      department: e.target.value as Department,
                    })
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

              {/* Year of Study */}
              <div>
                <label className="block text-xs font-semibold text-[#5a4224]">
                  Year of Study <span className="text-rose-500">*</span>
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TKMCE_YEARS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setProfile({ ...profile, year: y })}
                      className={`rounded-xl border p-2.5 text-center text-xs font-medium transition ${
                        profile.year === y
                          ? "border-[#c49a45] bg-[#faefe0] font-semibold text-[#382b20] shadow-2xs"
                          : "border-[#e8d8b4] bg-white text-[#514334] hover:bg-[#fcf9f1]"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c49a45] px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#b08734] disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Enrolling..."
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Complete Registration (10s)
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between px-2 text-xs text-[#80613a]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#c49a45]" />
            SSF TKMCE Digital Portal
          </span>
          <Link href="/" className="hover:text-[#5a4224] hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
