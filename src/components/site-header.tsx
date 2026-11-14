"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, QrCode, UserCheck } from "lucide-react";
import { navItems, siteBrand } from "@/data/site-content";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-30 border-b border-[#e8d8b4] bg-[#fcf9f1]/95 backdrop-blur">
      <div className="hidden border-b border-[#efe5cf] bg-[#f7f0df]/75 px-5 py-1.5 text-xs text-[#6f532f] sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span className="font-medium tracking-[0.12em]">
            {siteBrand.campus.toUpperCase()} · {siteBrand.location.toUpperCase()}
          </span>
          <span lang="ar" dir="rtl" className="font-arabic text-base leading-none text-[#514334]">
            {siteBrand.arabicGreeting}
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#c49a45] bg-[#f7f0df] font-serif text-sm font-bold tracking-wider text-[#382b20] shadow-xs sm:h-11 sm:w-11">
            {siteBrand.shortName}
          </div>
          <div className="leading-tight">
            <div className="font-serif text-base font-semibold tracking-[0.08em] text-[#382b20] sm:text-lg sm:tracking-[0.1em]">
              {siteBrand.name}
            </div>
            <div className="text-[11px] tracking-[0.06em] text-[#80613a] sm:text-xs sm:tracking-[0.08em]">
              {siteBrand.taglineEnglish}
            </div>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[#382b20] font-semibold text-[#fcf9f1]"
                    : "font-medium text-[#514334] hover:bg-[#f7f0df] hover:text-[#382b20]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/darse/attendance"
            className="hidden items-center gap-1.5 rounded-full border border-[#c49a45]/50 bg-[#f7f0df] px-3.5 py-2 text-xs font-semibold text-[#5a4224] transition hover:bg-[#faefe0] md:inline-flex"
          >
            <QrCode className="h-3.5 w-3.5 text-[#c49a45]" />
            Darse Check-In
          </Link>

          <Link
            href="/join"
            className="hidden rounded-full bg-[#c49a45] px-4 py-2 text-xs font-semibold tracking-wide text-[#292723] transition hover:bg-[#b58b38] sm:inline-flex"
          >
            Join
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5d7bd] bg-[#f7f0df]/60 text-[#382b20] lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#e8d8b4] bg-[#fcf9f1] px-5 py-4 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    active
                      ? "bg-[#382b20] font-semibold text-[#fcf9f1]"
                      : "text-[#514334] hover:bg-[#f7f0df]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-[#eedebb]" />

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/darse/attendance"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#c49a45]/40 bg-[#f7f0df] px-3 py-2.5 text-xs font-semibold text-[#5a4224]"
              >
                <QrCode className="h-3.5 w-3.5 text-[#c49a45]" />
                Darse Check-In
              </Link>
              <Link
                href="/students/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#c49a45]/40 bg-[#f7f0df] px-3 py-2.5 text-xs font-semibold text-[#5a4224]"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#c49a45]" />
                Enroll Student
              </Link>
            </div>

            <Link
              href="/join"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl bg-[#c49a45] px-4 py-3 text-center text-sm font-semibold text-[#292723]"
            >
              Join SSF TKMCE
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
