"use client";

import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import type { DarseSession } from "@/data/site-content";

const tracks = ["All", "Weekly Darse", "Kitab Circle", "Special Majlis"] as const;

export function DarseExplorer({ sessions }: { sessions: DarseSession[] }) {
  const [selectedTrack, setSelectedTrack] = useState<(typeof tracks)[number]>("All");

  const filtered =
    selectedTrack === "All"
      ? sessions
      : sessions.filter((s) => s.track === selectedTrack);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {tracks.map((track) => {
          const active = selectedTrack === track;
          return (
            <button
              key={track}
              type="button"
              onClick={() => setSelectedTrack(track)}
              className={`min-h-[44px] rounded-full px-5 py-2.5 text-xs font-semibold transition ${
                active
                  ? "bg-[#382b20] text-[#fcf9f1]"
                  : "border border-[#e5d7bd] bg-white text-[#514334] hover:border-[#c49a45]"
              }`}
            >
              {track}
            </button>
          );
        })}
      </div>

      <div className="space-y-8">
        {filtered.map((session) => (
          <article
            key={session.id}
            className="overflow-hidden rounded-2xl border border-[#e5d7bd] bg-white shadow-xs"
          >
            <div className="grid md:grid-cols-[1.15fr_0.85fr]">
              <div className="min-w-0 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.18em] text-[#80613a]">
                  <span>{session.track.toUpperCase()}</span>
                </div>

                <h2 className="mt-3 font-serif text-3xl text-[#382b20]">
                  {session.title}
                </h2>
                <p className="font-malayalam mt-1.5 text-sm text-[#80613a]">
                  {session.malayalamTitle}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-[#6f6253]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#c49a45]" />
                    {session.schedule}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#c49a45]" />
                    {session.venue}
                  </span>
                </div>

                <p className="mt-5 text-base leading-7 text-[#514334]">
                  {session.englishOverview}
                </p>

                <div className="mt-5 rounded-xl border border-[#efe5cf] bg-[#fcf9f1] p-4">
                  <p className="text-xs font-bold tracking-[0.16em] text-[#80613a]">
                    MALAYALAM TAKEAWAY · മലയാളം കുറിപ്പ്
                  </p>
                  <p className="font-malayalam mt-1.5 text-sm text-[#382b20]">
                    {session.malayalamNote}
                  </p>
                </div>
              </div>

              <div className="arch-pattern flex min-w-0 flex-col justify-between border-t border-[#e5d7bd] bg-[#f7f0df] p-6 text-[#382b20] md:border-t-0 md:border-l md:p-8">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-[#80613a]">
                    CLASSICAL TEXT FOCUS
                  </p>
                  <p
                    lang="ar"
                    dir="rtl"
                    className="font-arabic mt-2 text-2xl text-[#382b20]"
                  >
                    {session.arabicTitle}
                  </p>
                </div>

                <div className="my-6 border-y border-[#dfd1b7] py-5">
                  <p
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-3xl leading-relaxed text-[#382b20]"
                  >
                    {session.arabicQuote}
                  </p>
                  <p className="mt-2 text-sm italic text-[#80613a]">
                    {session.transliteration}
                  </p>
                </div>

                <p className="text-sm leading-6 text-[#514334]">
                  “{session.quoteMeaning}”
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
